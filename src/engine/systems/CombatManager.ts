import {
  Game,
  Battlefield,
  CombatState,
  CombatStep,
  CombatUnit,
  DamageDistribution,
  ShowdownState,
  GameCard,
  Keyword,
  TurnState,
  Player
} from '@/types/game';
import { eventBus, GameEventFactory } from '../events';
import { PriorityManager } from '../managers/PriorityManager';
import { CardScriptRuntime } from '../scripting/CardScriptRuntime';
import { ActionExecutor } from '../actions/ActionExecutor';
import { DealDamageAction } from '../actions/concrete/DealDamageAction';
import { StartCombatAction } from '../actions/concrete/StartCombatAction';
import type { CombatStartData } from '../actions/triggers/OnCombatStartTrigger';
import { logger } from '@/utils/logger';

/**
 * Manages combat resolution including Showdowns and damage calculation
 *
 * Combat Rules:
 * - Showdown: when units from different players meet at battlefield
 * - Focus: player who initiated the event has Focus during Showdown
 * - Combat Damage: total Might comparison between attacking/defending units
 * - Keywords: Assault (+X when attacking), Shield (+X when defending), Tank (must be killed first)
 * - Damage Distribution: attacking player chooses how to distribute damage to defenders
 */
export class CombatManager {
  private priorityManager: PriorityManager;
  private scriptRuntime: CardScriptRuntime;
  private executor: ActionExecutor;

  constructor(
    priorityManager: PriorityManager,
    executor: ActionExecutor,
    scriptRuntime?: CardScriptRuntime
  ) {
    this.priorityManager = priorityManager;
    this.executor = executor;
    this.scriptRuntime = scriptRuntime as CardScriptRuntime;
  }

  /**
   * Initiate a Showdown at a battlefield
   */
  async initiateShowdown(
    game: Game,
    battlefieldId: string,
    focusPlayerId: string
  ): Promise<void> {
    const battlefield = game.battlefields.find(b => b.id === battlefieldId);
    if (!battlefield) {
      throw new Error(`Battlefield ${battlefieldId} not found`);
    }

    if (!battlefield.contested) {
      throw new Error('Cannot initiate Showdown on non-contested battlefield');
    }

    logger.info(`CombatManager: Initiating Showdown at battlefield ${battlefieldId}`);

    // Determine relevant players (players with units at this battlefield)
    const relevantPlayers = this.getRelevantPlayersForBattlefield(game, battlefield);

    // Create Showdown state
    game.showdownState = {
      battlefield: battlefieldId,
      relevantPlayers,
      focusPlayer: focusPlayerId,
      initialChainCreated: false
    };

    // Change turn state to Showdown Open
    game.turnState = TurnState.SHOWDOWN_OPEN;

    // Reset priority for Showdown
    this.priorityManager.resetForShowdown(game, focusPlayerId, relevantPlayers);

    // Emit showdown start event
    await eventBus.emit(GameEventFactory.createShowdownStartEvent(
      game.id,
      battlefieldId,
      focusPlayerId,
      relevantPlayers
    ));

    logger.debug(`CombatManager: Showdown state set. Focus player: ${focusPlayerId}, Relevant players: ${relevantPlayers.join(', ')}`);
  }

  /**
   * Resolve a Showdown (after all players pass priority)
   */
  async resolveShowdown(game: Game): Promise<void> {
    if (!game.showdownState) {
      throw new Error('No active Showdown to resolve');
    }

    const battlefieldId = game.showdownState.battlefield;
    logger.info(`CombatManager: Resolving Showdown at battlefield ${battlefieldId}`);

    const battlefield = game.battlefields.find(b => b.id === battlefieldId);
    if (!battlefield) {
      throw new Error('Showdown battlefield not found');
    }

    // Determine if combat should occur
    if (this.shouldProceedToCombat(game, battlefield)) {
      await this.initiateCombat(game, battlefield);
    } else {
      logger.info('CombatManager: No combat necessary at this battlefield');
    }

    // End Showdown
    await this.endShowdown(game);
  }

  /**
   * End Showdown and return to normal state
   */
  private async endShowdown(game: Game): Promise<void> {
    if (!game.showdownState) return;

    const battlefieldId = game.showdownState.battlefield;

    // Clear Showdown state
    delete game.showdownState;

    // Return to neutral state
    game.turnState = TurnState.NEUTRAL_OPEN;

    // Emit showdown end event
    await eventBus.emit(GameEventFactory.createShowdownEndEvent(
      game.id,
      battlefieldId
    ));

    logger.info('CombatManager: Showdown ended, returned to Neutral Open');
  }

  /**
   * Initiate combat at a battlefield
   */
  private async initiateCombat(game: Game, battlefield: Battlefield): Promise<void> {
    logger.info(`CombatManager: Initiating combat at battlefield ${battlefield.id}`);

    // Determine attacking and defending players
    const { attackingPlayer, defendingPlayer } = this.determineAttackerDefender(game, battlefield);

    if (!attackingPlayer || !defendingPlayer) {
      logger.warn('CombatManager: Cannot determine attacker/defender for combat');
      return;
    }

    // Get units for each side
    const attackingUnits = this.prepareAttackingUnits(game, battlefield, attackingPlayer);
    const defendingUnits = this.prepareDefendingUnits(game, battlefield, defendingPlayer);

    // Get actual GameCard instances for trigger data
    const attackers = battlefield.units.filter(u => u.controllerId === attackingPlayer);
    const defenders = battlefield.units.filter(u => u.controllerId === defendingPlayer);

    // ⭐ Execute StartCombatAction for each attacking unit (fires "when I attack" triggers)
    for (const attacker of attackers) {
      const combatData: CombatStartData = {
        participant: attacker,
        isAttacker: true,
        battlefieldId: battlefield.id,
        attackers,
        defenders,
        opposingPlayerId: defendingPlayer
      };

      const attackingPlayerObj = game.players.find(p => p.id === attackingPlayer)!;
      const startCombatAction = new StartCombatAction(attackingPlayerObj, combatData);
      await this.executor.execute(startCombatAction);
    }

    // ⭐ Execute StartCombatAction for each defending unit (fires "when I defend" triggers)
    for (const defender of defenders) {
      const combatData: CombatStartData = {
        participant: defender,
        isAttacker: false,
        battlefieldId: battlefield.id,
        attackers,
        defenders,
        opposingPlayerId: attackingPlayer
      };

      const defendingPlayerObj = game.players.find(p => p.id === defendingPlayer)!;
      const startCombatAction = new StartCombatAction(defendingPlayerObj, combatData);
      await this.executor.execute(startCombatAction);
    }

    // Create combat state (after triggers have fired, so modifiers are applied)
    game.combatState = {
      battlefield: battlefield.id,
      attackingPlayer,
      defendingPlayer,
      attackingUnits,
      defendingUnits,
      step: CombatStep.SHOWDOWN,
      totalAttackingMight: this.calculateTotalMight(attackingUnits),
      totalDefendingMight: this.calculateTotalMight(defendingUnits)
    };

    // Emit combat start event
    await eventBus.emit(GameEventFactory.createCombatStartEvent(
      game.id,
      battlefield.id,
      attackingPlayer,
      defendingPlayer
    ));

    // Proceed to combat damage
    await this.resolveCombatDamage(game);
  }

  /**
   * Resolve combat damage
   */
  private async resolveCombatDamage(game: Game): Promise<void> {
    if (!game.combatState) return;

    logger.info('CombatManager: Resolving combat damage');

    game.combatState.step = CombatStep.COMBAT_DAMAGE;

    const attackTotal = game.combatState.totalAttackingMight;
    const defendTotal = game.combatState.totalDefendingMight;

    logger.debug(`CombatManager: Attack total: ${attackTotal}, Defense total: ${defendTotal}`);

    // Determine winner
    if (attackTotal > defendTotal) {
      // Attackers win
      const excessDamage = attackTotal - defendTotal;
      logger.info(`CombatManager: Attackers win with ${excessDamage} excess damage`);

      // Distribute damage to defending units
      await this.distributeDefenderDamage(game, attackTotal);
    } else if (defendTotal > attackTotal) {
      // Defenders win
      const excessDamage = defendTotal - attackTotal;
      logger.info(`CombatManager: Defenders win with ${excessDamage} excess damage`);

      // Distribute damage to attacking units
      await this.distributeAttackerDamage(game, defendTotal);
    } else {
      // Tie
      logger.info('CombatManager: Combat is a tie, all units take damage equal to opposing total');

      // Both sides take damage
      await this.distributeDefenderDamage(game, attackTotal);
      await this.distributeAttackerDamage(game, defendTotal);
    }

    // Move to resolution step
    game.combatState.step = CombatStep.RESOLUTION;

    // Emit combat damage event (simplified - would need proper damage tracking)
    await eventBus.emit(GameEventFactory.createCombatDamageEvent(
      game.id,
      game.combatState.battlefield,
      attackTotal,
      'target-placeholder' // Would be actual target ID
    ));

    // Apply damage to actual units
    await this.applyDamageToUnits(game);

    // End combat
    await this.endCombat(game);
  }

  /**
   * Distribute damage to defending units
   */
  private async distributeDefenderDamage(game: Game, totalDamage: number): Promise<void> {
    if (!game.combatState) return;

    const distribution = this.calculateDamageDistribution(
      game.combatState.defendingUnits,
      totalDamage
    );

    game.combatState.damageDistribution = distribution;

    logger.debug(`CombatManager: Distributed ${totalDamage} damage to ${distribution.length} defending units`);
  }

  /**
   * Distribute damage to attacking units
   */
  private async distributeAttackerDamage(game: Game, totalDamage: number): Promise<void> {
    if (!game.combatState) return;

    const distribution = this.calculateDamageDistribution(
      game.combatState.attackingUnits,
      totalDamage
    );

    // Append to damage distribution
    if (!game.combatState.damageDistribution) {
      game.combatState.damageDistribution = [];
    }
    game.combatState.damageDistribution.push(...distribution);

    logger.debug(`CombatManager: Distributed ${totalDamage} damage to ${distribution.length} attacking units`);
  }

  /**
   * Calculate damage distribution with Tank priority
   *
   * From RULES.md: "Ogni unità deve ricevere danno letale prima di passare alla successiva"
   * (Each unit must receive lethal damage before moving to the next)
   *
   * Overkill damage IS allowed - a unit can take more damage than its might.
   */
  private calculateDamageDistribution(
    units: CombatUnit[],
    totalDamage: number
  ): DamageDistribution[] {
    const distribution: DamageDistribution[] = [];

    // Sort units: Tank units must receive lethal damage first
    const tankUnits = units.filter(u => u.keywords.includes(Keyword.TANK));
    const nonTankUnits = units.filter(u => !u.keywords.includes(Keyword.TANK));

    let remainingDamage = totalDamage;

    // Damage Tank units first
    for (const unit of tankUnits) {
      if (remainingDamage <= 0) break;

      // Assign damage to this unit
      const damageToAssign = remainingDamage;
      distribution.push({
        targetCardId: unit.cardId,
        damage: damageToAssign,
        isLethalDamage: damageToAssign >= unit.might
      });

      // All remaining damage goes to this unit (overkill allowed)
      remainingDamage = 0;
      break; // Only one Tank unit takes damage per combat
    }

    // Then damage non-Tank units (if no Tank took all damage)
    if (remainingDamage > 0 && nonTankUnits.length > 0) {
      const unit = nonTankUnits[0]!; // First non-Tank unit (safe because length > 0)

      // Assign damage to this unit
      const damageToAssign = remainingDamage;
      distribution.push({
        targetCardId: unit.cardId,
        damage: damageToAssign,
        isLethalDamage: damageToAssign >= unit.might
      });

      remainingDamage = 0;
    }

    return distribution;
  }

  /**
   * Apply damage to actual game units using V3 DealDamageAction
   */
  private async applyDamageToUnits(game: Game): Promise<void> {
    if (!game.combatState?.damageDistribution) return;

    const battlefield = game.battlefields.find(b => b.id === game.combatState!.battlefield);
    if (!battlefield) return;

    // Find the attacking player to use as action controller
    const attackingPlayer = game.players.find(p => p.id === game.combatState!.attackingPlayer);
    if (!attackingPlayer) {
      logger.error('CombatManager: Attacking player not found');
      return;
    }

    // Apply damage using V3 DealDamageAction for each distribution
    for (const dmg of game.combatState.damageDistribution) {
      const unit = battlefield.units.find(u => u.cardId === dmg.targetCardId);
      if (unit) {
        // Use V3 DealDamageAction instead of direct mutation
        const damageAction = new DealDamageAction(
          attackingPlayer,
          {
            target: unit,
            amount: dmg.damage,
            damageType: 'combat'
            // source is optional - in combat, damage comes from multiple units
          }
        );

        const result = await this.executor.execute(damageAction);

        if (result.success) {
          logger.debug(`CombatManager: Applied ${dmg.damage} damage to unit ${unit.instanceId} via V3 (total: ${unit.damage}/${unit.might ?? 0})`);

          if (dmg.isLethalDamage) {
            logger.info(`CombatManager: Unit ${unit.instanceId} received lethal damage`);
          }
        } else {
          logger.error(`CombatManager: Failed to apply damage to ${unit.instanceId}:`, result.error);
        }
      }
    }
  }

  /**
   * End combat and clean up combat state
   */
  private async endCombat(game: Game): Promise<void> {
    if (!game.combatState) return;

    const battlefieldId = game.combatState.battlefield;

    // Emit combat end event
    await eventBus.emit(GameEventFactory.createCombatEndEvent(
      game.id,
      battlefieldId
    ));

    // Clear combat state
    delete game.combatState;

    logger.info('CombatManager: Combat ended');
  }

  /**
   * Prepare attacking units with combat bonuses
   * ⭐ V3: Triggers are now handled by StartCombatAction in initiateCombat()
   */
  private prepareAttackingUnits(game: Game, battlefield: Battlefield, attackingPlayer: string): CombatUnit[] {
    const units = battlefield.units.filter(u => u.controllerId === attackingPlayer);
    const combatUnits: CombatUnit[] = [];

    // Prepare combat stats for each attacking unit
    for (const unit of units) {
      const combatUnit: CombatUnit = {
        cardId: unit.cardId,
        might: this.getUnitMight(unit),
        keywords: this.getUnitKeywords(unit),
        damage: unit.damage,
        hasAssaultBonus: this.hasKeyword(unit, Keyword.ASSAULT),
        hasShieldBonus: false,
        isStunned: false
      };

      // Apply Assault bonus
      if (combatUnit.hasAssaultBonus) {
        const assaultBonus = this.getKeywordValue(unit, Keyword.ASSAULT);
        if (assaultBonus > 0) {
          combatUnit.might += assaultBonus;
          logger.debug(`CombatManager: Unit ${unit.instanceId} gains +${assaultBonus} from Assault`);
        }
      }

      combatUnits.push(combatUnit);
    }

    return combatUnits;
  }

  /**
   * Prepare defending units with combat bonuses
   */
  private prepareDefendingUnits(game: Game, battlefield: Battlefield, defendingPlayer: string): CombatUnit[] {
    const units = battlefield.units.filter(u => u.controllerId === defendingPlayer);

    return units.map(unit => {
      const combatUnit: CombatUnit = {
        cardId: unit.cardId,
        might: this.getUnitMight(unit),
        keywords: this.getUnitKeywords(unit),
        damage: unit.damage,
        hasAssaultBonus: false,
        hasShieldBonus: this.hasKeyword(unit, Keyword.SHIELD),
        isStunned: false
      };

      // Apply Shield bonus
      if (combatUnit.hasShieldBonus) {
        const shieldBonus = this.getKeywordValue(unit, Keyword.SHIELD);
        if (shieldBonus > 0) {
          combatUnit.might += shieldBonus;
          logger.debug(`CombatManager: Unit ${unit.instanceId} gains +${shieldBonus} from Shield`);
        }
      }

      return combatUnit;
    });
  }

  /**
   * Calculate total Might for a group of units
   */
  private calculateTotalMight(units: CombatUnit[]): number {
    return units
      .filter(u => !u.isStunned)
      .reduce((total, unit) => total + unit.might, 0);
  }

  /**
   * Determine attacker and defender for combat
   */
  private determineAttackerDefender(game: Game, battlefield: Battlefield): {
    attackingPlayer: string;
    defendingPlayer: string;
  } {
    // In Riftbound, the player who initiated the Showdown (Focus player) is typically the attacker
    const focusPlayer = game.showdownState?.focusPlayer;
    const relevantPlayers = game.showdownState?.relevantPlayers || [];

    const attackingPlayer = focusPlayer || relevantPlayers[0] || '';
    const defendingPlayer = relevantPlayers.find(p => p !== attackingPlayer) || '';

    return { attackingPlayer, defendingPlayer };
  }

  /**
   * Check if combat should proceed
   */
  private shouldProceedToCombat(game: Game, battlefield: Battlefield): boolean {
    // Combat occurs if there are still units from multiple players
    const playersWithUnits = new Set<string>();
    battlefield.units.forEach(u => playersWithUnits.add(u.controllerId));

    return playersWithUnits.size > 1;
  }

  /**
   * Get relevant players for a battlefield
   */
  private getRelevantPlayersForBattlefield(game: Game, battlefield: Battlefield): string[] {
    const playersWithUnits = new Set<string>();
    battlefield.units.forEach(u => playersWithUnits.add(u.controllerId));

    return Array.from(playersWithUnits);
  }

  /**
   * Get unit Might value
   */
  private getUnitMight(unit: GameCard): number {
    // Get actual Might from GameCard
    // Might is optional on GameCard, default to 0 if not present
    return unit.might ?? 0;
  }

  /**
   * Get unit keywords
   */
  private getUnitKeywords(unit: GameCard): Keyword[] {
    // Get actual keywords from GameCard
    return unit.keywords || [];
  }

  /**
   * Check if unit has a keyword
   */
  private hasKeyword(unit: GameCard, keyword: Keyword): boolean {
    const keywords = this.getUnitKeywords(unit);
    return keywords.includes(keyword);
  }

  /**
   * Get numeric value associated with a keyword (e.g., Assault 2, Shield 3)
   *
   * For now, returns 1 if keyword is present (default value).
   * TODO: Read actual values from card metadata when keyword values are implemented
   */
  private getKeywordValue(unit: GameCard, keyword: Keyword): number {
    if (!this.hasKeyword(unit, keyword)) {
      return 0;
    }

    // TODO: When keyword values are stored on cards, read from there
    // For now, return default value of 1
    return 1;
  }

  /**
   * Get combat statistics
   */
  getCombatStats(game: Game): {
    isInCombat: boolean;
    isInShowdown: boolean;
    battlefieldId: string | undefined;
    attackTotal: number | undefined;
    defendTotal: number | undefined;
    combatStep: CombatStep | undefined;
  } {
    return {
      isInCombat: !!game.combatState,
      isInShowdown: !!game.showdownState,
      battlefieldId: game.combatState?.battlefield || game.showdownState?.battlefield,
      attackTotal: game.combatState?.totalAttackingMight,
      defendTotal: game.combatState?.totalDefendingMight,
      combatStep: game.combatState?.step
    };
  }

}
