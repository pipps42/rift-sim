/**
 * CardStateScanner - Centralized system for scanning card states
 *
 * On every game state change, the scanner iterates through all cards to determine:
 * - Which cards are playable
 * - Which activated abilities are available
 * - Which triggers are pending
 * - Effective costs with modifiers applied
 *
 * The scanner is read-only and does not mutate game state.
 * It provides information for the UI and validates player actions.
 */

import type { Game, GameCard, Player, PowerCost } from '../../types/game';
import { GamePhase, Keyword } from '../../types/game';
import type { CardScript, CardContext } from '../scripting/types/CardScriptTypes';
import type { CardScriptRuntime } from '../scripting/CardScriptRuntime';
import type { ModifierRegistry } from '../actions/ModifierRegistry';
import type { TargetingSystem } from '../systems/TargetingSystem';
import type {
  CardScanResult,
  ScanDelta,
  CardStateChange,
  PlayabilityInfo,
  EffectiveCost,
  ActivatedAbilityInfo,
  PendingTrigger,
  GameStateSnapshot,
  Zone,
  ConstraintMetadata,
  ActivatedAbilityMetadata,
} from './types/ScanTypes';

export class CardStateScanner {
  private scanCache: Map<string, CardScanResult> = new Map();
  private lastGameStateHash: string = '';

  constructor(
    private cardScriptRuntime: CardScriptRuntime,
    private modifierRegistry: ModifierRegistry,
    private targetingSystem: TargetingSystem,
  ) {}

  /**
   * Main entry point - scan all cards after any state change
   * Returns what changed since last scan
   */
  async scanGameState(game: Game): Promise<ScanDelta> {
    const currentHash = this.hashGameState(game);

    // Skip if state unchanged
    if (currentHash === this.lastGameStateHash) {
      return { changed: false };
    }

    const previousResults = new Map(this.scanCache);
    this.scanCache.clear();

    // Collect all cards from all zones
    const allCards = this.getAllCardsInGame(game);

    // Scan each card
    for (const card of allCards) {
      try {
        const result = await this.scanCard(card, game);
        this.scanCache.set(card.instanceId, result);
      } catch (error) {
        console.error(`Error scanning card ${card.instanceId}:`, error);
        // Continue scanning other cards
      }
    }

    // Calculate delta (what changed)
    const delta = this.calculateDelta(previousResults, this.scanCache);

    this.lastGameStateHash = currentHash;

    return delta;
  }

  /**
   * Scan a single card to determine its current state
   */
  private async scanCard(card: GameCard, game: Game): Promise<CardScanResult> {
    // Try to load script from loader
    let script: CardScript | null = null;
    try {
      const loaded = await this.cardScriptRuntime['loader'].loadScript(card.cardId);
      script = loaded ?? null;
    } catch {
      script = null;
    }

    if (!script) {
      // Card without script - return minimal info
      return {
        card,
        playable: null,
        effectiveCost: { energy: card.energyCost, power: card.powerCost },
        abilities: [],
        pendingTriggers: [],
      };
    }

    const owner = game.players.find(p => p.id === card.ownerId);
    if (!owner) {
      throw new Error(`Cannot find owner for card: ${card.instanceId}`);
    }

    const ctx = this.buildContext(card, game, owner);

    // 1. Check playability (if in hand)
    const playable = card.zone === 'hand'
      ? this.checkPlayability(card, game, owner, script, ctx)
      : null;

    // 2. Calculate effective cost
    const effectiveCost = this.calculateEffectiveCost(card, game, script, ctx);

    // 3. Scan for activated abilities
    const abilities = this.scanActivatedAbilities(card, game, owner, script, ctx);

    // 4. Check for pending triggers
    const pendingTriggers = this.scanPendingTriggers(card, game, script, ctx);

    return {
      card,
      playable,
      effectiveCost,
      abilities,
      pendingTriggers,
    };
  }

  /**
   * Check if card can be played right now
   */
  private checkPlayability(
    card: GameCard,
    game: Game,
    owner: Player,
    script: CardScript,
    ctx: CardContext,
  ): PlayabilityInfo {
    // Basic checks (zone, timing, phase)
    if (card.zone !== 'hand') {
      return { canPlay: false, reason: 'Not in hand' };
    }

    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) {
      return { canPlay: false, reason: 'Invalid game state' };
    }

    if (currentPlayer.id !== owner.id && !card.keywords.includes(Keyword.REACTION)) {
      return { canPlay: false, reason: 'Not your turn' };
    }

    if (game.phase !== GamePhase.ACTION && !card.keywords.includes(Keyword.REACTION)) {
      return { canPlay: false, reason: 'Wrong phase' };
    }

    // Check costs
    const effectiveCost = this.calculateEffectiveCost(card, game, script, ctx);
    if (owner.runePool.energy < effectiveCost.energy) {
      return { canPlay: false, reason: `Need ${effectiveCost.energy} energy` };
    }

    for (const pc of effectiveCost.power) {
      const available = this.getPowerAmount(owner.runePool, pc.domain);
      if (available < pc.amount) {
        return { canPlay: false, reason: `Need ${pc.amount} ${pc.domain}` };
      }
    }

    // Check script-defined constraints
    if (script.metadata?.playConstraints) {
      for (const constraint of script.metadata.playConstraints) {
        const check = this.checkConstraint(constraint, ctx);
        if (!check.satisfied) {
          return { canPlay: false, reason: check.reason ?? 'Constraint not satisfied' };
        }
      }
    }

    // Check target requirements - card must have valid targets available
    if (script.metadata?.targetRequirements && script.metadata.targetRequirements.length > 0) {
      // Check if there are any required (non-optional) target requirements
      const hasRequiredTargets = script.metadata.targetRequirements.some(req => !req.optional);

      if (hasRequiredTargets) {
        const validTargets = this.targetingSystem.getValidTargets(
          game,
          owner.id,
          script.metadata.targetRequirements
        );

        // Card is unplayable if it has required targets but no valid targets are available
        if (validTargets.length === 0) {
          return { canPlay: false, reason: 'No valid targets' };
        }
      }
    }

    return { canPlay: true };
  }

  /**
   * Calculate effective cost with all modifiers
   */
  private calculateEffectiveCost(
    card: GameCard,
    game: Game,
    script: CardScript,
    ctx: CardContext,
  ): EffectiveCost {
    let energy = card.energyCost;
    const power = [...card.powerCost];
    let modified = false;

    // Apply script metadata cost modifiers
    if (script.metadata?.costModifiers) {
      for (const modifier of script.metadata.costModifiers) {
        try {
          const mod = modifier.calculate(ctx);
          if (mod.energyChange) {
            energy += mod.energyChange;
            modified = true;
          }
          // TODO: Power modifications
        } catch (error) {
          console.error(`Error in cost modifier ${modifier.id}:`, error);
        }
      }
    }

    // Apply global V3 modifiers
    // TODO: Integrate with ModifierRegistry.getCostModifiersFor(card, game)
    // For now, skip global modifiers

    return {
      energy: Math.max(0, energy),
      power,
      modifiedBy: modified ? 'modified' : 'base',
    };
  }

  /**
   * Scan for activated abilities available in current zone
   */
  private scanActivatedAbilities(
    card: GameCard,
    game: Game,
    owner: Player,
    script: CardScript,
    ctx: CardContext,
  ): ActivatedAbilityInfo[] {
    if (!script.metadata?.activatedAbilities) return [];

    const results: ActivatedAbilityInfo[] = [];

    for (const ability of script.metadata.activatedAbilities) {
      // Check if ability is available from current zone
      if (!ability.availableFrom.includes(card.zone as Zone)) {
        continue;
      }

      const canActivate = this.checkAbilityActivation(ability, ctx, owner);

      const abilityInfo: ActivatedAbilityInfo = {
        ...ability,
        canActivate: canActivate.can,
      };
      if (canActivate.reason) {
        abilityInfo.reason = canActivate.reason;
      }
      results.push(abilityInfo);
    }

    return results;
  }

  /**
   * Check if an activated ability can be activated
   */
  private checkAbilityActivation(
    ability: ActivatedAbilityMetadata,
    ctx: CardContext,
    owner: Player,
  ): { can: boolean; reason?: string } {
    // Check costs
    if (ability.costs) {
      if (ability.costs.energy !== undefined && owner.runePool.energy < ability.costs.energy) {
        return { can: false, reason: `Need ${ability.costs.energy} energy` };
      }

      if (ability.costs.power) {
        for (const pc of ability.costs.power) {
          const available = this.getPowerAmount(owner.runePool, pc.domain);
          if (available < pc.amount) {
            return { can: false, reason: `Need ${pc.amount} ${pc.domain}` };
          }
        }
      }
    }

    // Check constraints
    if (ability.constraints) {
      for (const constraint of ability.constraints) {
        const check = this.checkConstraint(constraint, ctx);
        if (!check.satisfied) {
          return { can: false, reason: check.reason ?? 'Constraint not satisfied' };
        }
      }
    }

    return { can: true };
  }

  /**
   * Check a single constraint
   */
  private checkConstraint(
    constraint: ConstraintMetadata,
    ctx: CardContext,
  ): { satisfied: boolean; reason?: string } {
    try {
      return constraint.check(ctx);
    } catch (error) {
      console.error(`Error in constraint ${constraint.id}:`, error);
      return { satisfied: false, reason: `Error: ${error}` };
    }
  }

  /**
   * Scan for triggers that should fire based on recent events
   */
  private scanPendingTriggers(
    card: GameCard,
    game: Game,
    script: CardScript,
    ctx: CardContext,
  ): PendingTrigger[] {
    if (!script.metadata?.reactiveTriggers) return [];

    const recentEvents = this.getRecentEvents(game, 5); // Last 5 events
    const pending: PendingTrigger[] = [];

    for (const triggerDef of script.metadata.reactiveTriggers) {
      for (const event of recentEvents) {
        if (triggerDef.eventType === event.type) {
          try {
            const shouldTrigger = triggerDef.condition(event, ctx);
            if (shouldTrigger) {
              pending.push({
                triggerId: triggerDef.id,
                event,
                card,
              });
            }
          } catch (error) {
            console.error(`Error in trigger ${triggerDef.id}:`, error);
          }
        }
      }
    }

    return pending;
  }

  /**
   * Get all cards currently in the game (all zones, both players)
   */
  private getAllCardsInGame(game: Game): GameCard[] {
    const cards: GameCard[] = [];

    for (const player of game.players) {
      // Champion Legend (stored directly on player)
      if (player.championLegend) {
        cards.push(player.championLegend as unknown as GameCard);
      }

      // All player zones (using actual zone names from PlayerZones)
      if (player.zones.hand) cards.push(...player.zones.hand);
      if (player.zones.mainDeck) cards.push(...player.zones.mainDeck);
      if (player.zones.trash) cards.push(...player.zones.trash);
      if (player.zones.runeDeck) cards.push(...player.zones.runeDeck);
      if (player.zones.runes) cards.push(...player.zones.runes);
      if (player.zones.base) cards.push(...player.zones.base);
      if (player.zones.championZone) cards.push(...player.zones.championZone);
      if (player.zones.banishment) cards.push(...player.zones.banishment);
    }

    // Battlefields
    for (const bf of game.battlefields) {
      // Units on battlefield
      if (bf.units) {
        cards.push(...bf.units);
      }

      // Units organized by side
      if (bf.sides) {
        for (const side of Object.values(bf.sides)) {
          if (Array.isArray(side)) {
            cards.push(...side);
          }
        }
      }

      // Facedown cards at battlefield
      if (bf.facedownCards) {
        cards.push(...bf.facedownCards);
      }
    }

    // Chain
    for (const item of game.chain) {
      if (item.sourceCard) {
        cards.push(item.sourceCard);
      }
    }

    return cards;
  }

  /**
   * Calculate delta between scan results
   */
  private calculateDelta(
    previous: Map<string, CardScanResult>,
    current: Map<string, CardScanResult>,
  ): ScanDelta {
    const changes: CardStateChange[] = [];

    for (const [instanceId, currentResult] of current) {
      const previousResult = previous.get(instanceId);

      if (!previousResult) {
        // New card
        changes.push({
          type: 'new',
          card: currentResult.card,
          result: currentResult,
        });
        continue;
      }

      // Check what changed
      if (currentResult.playable?.canPlay !== previousResult.playable?.canPlay) {
        changes.push({
          type: 'playability_changed',
          card: currentResult.card,
          from: previousResult.playable?.canPlay ?? false,
          to: currentResult.playable?.canPlay ?? false,
        });
      }

      if (currentResult.effectiveCost.energy !== previousResult.effectiveCost.energy) {
        changes.push({
          type: 'cost_changed',
          card: currentResult.card,
          from: previousResult.effectiveCost,
          to: currentResult.effectiveCost,
        });
      }

      if (currentResult.abilities.length !== previousResult.abilities.length) {
        changes.push({
          type: 'abilities_changed',
          card: currentResult.card,
          abilities: currentResult.abilities,
        });
      }

      if (currentResult.pendingTriggers.length > 0) {
        changes.push({
          type: 'triggers_pending',
          card: currentResult.card,
          triggers: currentResult.pendingTriggers,
        });
      }
    }

    // Check for removed cards
    for (const [instanceId, previousResult] of previous) {
      if (!current.has(instanceId)) {
        changes.push({
          type: 'removed',
          card: previousResult.card,
        });
      }
    }

    return {
      changed: changes.length > 0,
      changes,
      timestamp: new Date(),
    };
  }

  /**
   * Hash game state for change detection
   */
  private hashGameState(game: Game): string {
    // Convert PowerPool[] to Record<string, number>
    const convertPowerPool = (powerPool: any[]): Record<string, number> => {
      const result: Record<string, number> = {};
      for (const pool of powerPool) {
        result[pool.domain] = pool.amount;
      }
      return result;
    };

    const snapshot: GameStateSnapshot = {
      phase: game.phase,
      turn: game.currentTurn,
      playerIndex: game.currentPlayerIndex,
      chainLength: game.chain.length,
      historyLength: game.history.length,
      players: game.players.map(p => ({
        id: p.id,
        energy: p.runePool.energy,
        power: convertPowerPool(p.runePool.power),
        handSize: p.zones.hand.length,
        battlefieldUnitCount: this.countBattlefieldUnits(game, p.id),
      })),
    };

    return JSON.stringify(snapshot);
  }

  /**
   * Count units on battlefield for a player
   */
  private countBattlefieldUnits(game: Game, playerId: string): number {
    let count = 0;
    for (const bf of game.battlefields) {
      if (bf.sides && bf.sides[playerId]) {
        count += bf.sides[playerId]!.length;
      }
    }
    return count;
  }

  /**
   * Get recent events from game history
   */
  private getRecentEvents(game: Game, count: number) {
    return game.history.slice(-count);
  }

  /**
   * Get amount of power for a domain
   */
  private getPowerAmount(runePool: Player['runePool'], domain: string): number {
    const pool = runePool.power.find(p => p.domain === domain);
    return pool?.amount ?? 0;
  }

  /**
   * Build card context for constraint/modifier checks
   */
  private buildContext(card: GameCard, game: Game, owner: Player): CardContext {
    const opponent = game.players.find(p => p.id !== owner.id);
    if (!opponent) {
      throw new Error(`Cannot find opponent for player: ${owner.id}`);
    }

    // Note: We don't provide full V3 APIs here since scanner is read-only
    // If constraints need to execute actions, they should just check conditions
    const context: CardContext = {
      self: card,
      owner,
      opponent,
      game,
      // Placeholder APIs (scanner shouldn't execute actions)
      actions: {} as any,
      modifiers: {} as any,
      triggers: {} as any,
    };

    return context;
  }

  // ============================================================================
  // PUBLIC QUERY API (for UI and GameManager)
  // ============================================================================

  /**
   * Get current scan results (for UI queries)
   */
  getCurrentResults(): Map<string, CardScanResult> {
    return new Map(this.scanCache);
  }

  /**
   * Get scan result for specific card
   */
  getCardState(cardInstanceId: string): CardScanResult | undefined {
    return this.scanCache.get(cardInstanceId);
  }

  /**
   * Get all playable cards for a player
   */
  getPlayableCards(playerId: string): CardScanResult[] {
    const results: CardScanResult[] = [];
    for (const result of this.scanCache.values()) {
      if (result.card.ownerId === playerId && result.playable?.canPlay) {
        results.push(result);
      }
    }
    return results;
  }

  /**
   * Get all cards with activatable abilities for a player
   */
  getActivatableCards(playerId: string): CardScanResult[] {
    const results: CardScanResult[] = [];
    for (const result of this.scanCache.values()) {
      if (result.card.ownerId === playerId && result.abilities.some(a => a.canActivate)) {
        results.push(result);
      }
    }
    return results;
  }

  /**
   * Force a rescan on next scanGameState call
   */
  invalidateCache(): void {
    this.lastGameStateHash = '';
  }
}
