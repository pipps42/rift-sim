# Activated Abilities System - Proposal B: Push-Based State Scanner

**Status:** Under Evaluation
**Date:** 2025-10-11
**Effort Estimate:** 18-24h (~3-4 days)

---

## Overview

This proposal implements a centralized **State Scanner** that iterates through all cards on every game state change, checking for:
- Triggers that should fire
- Costs that can be paid
- Abilities that can be activated

Cards register themselves with simple metadata, and the scanner does the heavy lifting.

---

## Key Design Principles

1. **Engine scans, cards respond** - Centralized logic iterates all cards
2. **Push-based model** - State changes push updates to UI
3. **Minimal card script complexity** - Cards provide simple metadata
4. **Automatic discovery** - No need for cards to know about zones/timing

---

## Architecture Components

### 1. CardStateScanner (NEW)

**File:** `src/engine/scanning/CardStateScanner.ts`

```typescript
/**
 * Centralized system that scans all cards on state changes
 * to determine what triggers fire, what abilities are activatable, etc.
 */
export class CardStateScanner {
  private scanCache: Map<string, ScanResult> = new Map();
  private lastGameStateHash: string = '';

  constructor(
    private cardScriptRuntime: CardScriptRuntime,
    private modifierRegistry: ModifierRegistry,
  ) {}

  /**
   * ⭐ Main entry point - scan all cards after any state change
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
      const result = await this.scanCard(card, game);
      this.scanCache.set(card.instanceId, result);
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
    const script = this.cardScriptRuntime.getScript(card.cardId);
    if (!script) {
      return { card, playable: false, abilities: [] };
    }

    const ctx = this.buildContext(card, game);
    const owner = game.players.find(p => p.id === card.ownerId)!;

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
    if (currentPlayer.id !== owner.id && !card.keywords.includes('REACTION')) {
      return { canPlay: false, reason: 'Not your turn' };
    }

    if (game.phase !== GamePhase.ACTION && !card.keywords.includes('REACTION')) {
      return { canPlay: false, reason: 'Wrong phase' };
    }

    // Check costs
    const effectiveCost = this.calculateEffectiveCost(card, game, script, ctx);
    if (owner.runePool.energy < effectiveCost.energy) {
      return { canPlay: false, reason: `Need ${effectiveCost.energy} energy` };
    }

    for (const pc of effectiveCost.power) {
      const available = getPowerAmount(owner.runePool, pc.domain);
      if (available < pc.amount) {
        return { canPlay: false, reason: `Need ${pc.amount} ${pc.domain}` };
      }
    }

    // Check script-defined constraints
    if (script.metadata?.playConstraints) {
      for (const constraint of script.metadata.playConstraints) {
        const check = constraint.check(ctx);
        if (!check.satisfied) {
          return { canPlay: false, reason: check.reason };
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

    // Apply script metadata cost modifiers
    if (script.metadata?.costModifiers) {
      for (const modifier of script.metadata.costModifiers) {
        const mod = modifier.calculate(ctx);
        energy += mod.energyChange ?? 0;
        // TODO: Power modifications
      }
    }

    // Apply global modifiers
    const globalMods = this.modifierRegistry.getCostModifiersFor(card, game);
    for (const mod of globalMods) {
      energy += mod.energyChange ?? 0;
    }

    return {
      energy: Math.max(0, energy),
      power,
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

    return script.metadata.activatedAbilities
      .filter(ability => ability.availableFrom.includes(card.zone as Zone))
      .map(ability => {
        const canActivate = this.checkAbilityActivation(ability, ctx, owner);
        return {
          ...ability,
          canActivate: canActivate.can,
          reason: canActivate.reason,
        };
      });
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
      if (ability.costs.energy && owner.runePool.energy < ability.costs.energy) {
        return { can: false, reason: `Need ${ability.costs.energy} energy` };
      }

      if (ability.costs.power) {
        for (const pc of ability.costs.power) {
          const available = getPowerAmount(owner.runePool, pc.domain);
          if (available < pc.amount) {
            return { can: false, reason: `Need ${pc.amount} ${pc.domain}` };
          }
        }
      }
    }

    // Check constraints
    if (ability.constraints) {
      for (const constraint of ability.constraints) {
        const check = constraint.check(ctx);
        if (!check.satisfied) {
          return { can: false, reason: check.reason };
        }
      }
    }

    return { can: true };
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
          const shouldTrigger = triggerDef.condition(event, ctx);
          if (shouldTrigger) {
            pending.push({
              triggerId: triggerDef.id,
              event,
              card,
            });
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
      // Legend
      if (player.legendCard) cards.push(player.legendCard);

      // All zones
      for (const zoneName of ['hand', 'deck', 'trash', 'runeDeck', 'runePool']) {
        const zone = player.zones[zoneName];
        if (Array.isArray(zone)) {
          cards.push(...zone);
        }
      }
    }

    // Battlefields
    for (const bf of game.battlefields) {
      if (bf.sides) {
        for (const side of Object.values(bf.sides)) {
          cards.push(...side);
        }
      }

      // Facedown zones
      if (bf.facedownZones) {
        for (const fz of Object.values(bf.facedownZones)) {
          cards.push(...fz);
        }
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
    };
  }

  /**
   * Hash game state for change detection
   */
  private hashGameState(game: Game): string {
    // Simple hash based on critical state
    return JSON.stringify({
      phase: game.phase,
      turn: game.currentTurn,
      playerIndex: game.currentPlayerIndex,
      chainLength: game.chain.length,
      historyLength: game.history.length,
      players: game.players.map(p => ({
        id: p.id,
        energy: p.runePool.energy,
        power: p.runePool.power,
        handSize: p.zones.hand.length,
      })),
    });
  }

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
}
```

---

## Card Script Metadata Format

Cards define **static metadata** instead of implementing hooks:

```typescript
export interface CardScript {
  // Existing hooks
  onPlay?: (ctx: CardContext) => Promise<void>;
  onEntersPlay?: (ctx: CardContext) => Promise<void>;
  onDeath?: (ctx: CardContext) => Promise<void>;
  // ... etc

  // ⭐ NEW: Metadata for scanner
  metadata?: CardMetadata;
}

export interface CardMetadata {
  // Cost modifiers (e.g., "costs 1 less for each unit you control")
  costModifiers?: CostModifierMetadata[];

  // Play constraints (e.g., "can only play if you control a battlefield")
  playConstraints?: ConstraintMetadata[];

  // Activated abilities
  activatedAbilities?: ActivatedAbilityMetadata[];

  // Reactive triggers (for UI to show "this would trigger")
  reactiveTriggers?: ReactiveTriggerMetadata[];
}

export interface CostModifierMetadata {
  id: string;
  description: string; // Human-readable
  calculate: (ctx: CardContext) => { energyChange?: number; powerChange?: PowerCost[] };
}

export interface ConstraintMetadata {
  id: string;
  description: string;
  check: (ctx: CardContext) => { satisfied: boolean; reason?: string };
}

export interface ActivatedAbilityMetadata {
  id: string;
  name: string;
  description: string;
  availableFrom: Zone[];
  costs?: {
    energy?: number;
    power?: PowerCost[];
  };
  constraints?: ConstraintMetadata[];
  timing?: 'sorcery' | 'instant';
  // Execution still uses hook
  onActivate: (ctx: CardContext) => Promise<GameAction[]>;
}

export interface ReactiveTriggerMetadata {
  id: string;
  eventType: string; // 'unit_died', 'spell_played', etc.
  description: string;
  condition: (event: GameEvent, ctx: CardContext) => boolean;
}
```

---

## Example Card Scripts

### HIDDEN Keyword

```typescript
export const playfulPhantom: CardScript = {
  metadata: {
    activatedAbilities: [
      {
        id: 'hidden',
        name: 'Hide',
        description: 'Place this unit facedown on a battlefield you control',
        availableFrom: ['hand'],
        costs: { energy: 2 },
        constraints: [
          {
            id: 'control_battlefield',
            description: 'Must control a battlefield',
            check: (ctx) => {
              const controlled = ctx.game.battlefields.filter(
                bf => bf.controllerId === ctx.owner.id
              );
              return {
                satisfied: controlled.length > 0,
                reason: "You don't control any battlefield",
              };
            },
          },
        ],
        timing: 'sorcery',
        onActivate: async (ctx) => {
          const targetBf = await ctx.ui.promptSelectBattlefield(
            ctx.game.battlefields.filter(bf => bf.controllerId === ctx.owner.id)
          );
          return [
            new MoveCardAction(ctx.owner, {
              card: ctx.self,
              from: 'hand',
              to: 'facedown',
              battlefieldId: targetBf.id,
              facedown: true,
            }, ctx.self),
          ];
        },
      },
    ],
  },
};
```

### Phoenix Resurrection

```typescript
export const phoenix: CardScript = {
  metadata: {
    reactiveTriggers: [
      {
        id: 'spell_kill',
        eventType: 'unit_died',
        description: 'When you kill a unit with a spell',
        condition: (event, ctx) => {
          const deathEvent = event as UnitDiedEvent;
          return (
            deathEvent.killedBy?.damageType === 'spell' &&
            deathEvent.killedBy.controllerId === ctx.owner.id
          );
        },
      },
    ],

    activatedAbilities: [
      {
        id: 'resurrect',
        name: 'Rise from Ashes',
        description: 'Play this from trash when you kill a unit with a spell',
        availableFrom: ['trash'],
        costs: {
          energy: 1,
          power: [{ domain: 'fury', amount: 1 }],
        },
        constraints: [
          {
            id: 'recent_spell_kill',
            description: 'Must have recently killed a unit with a spell',
            check: (ctx) => {
              const lastEvent = ctx.game.history[ctx.game.history.length - 1];
              if (!lastEvent || lastEvent.type !== 'unit_died') {
                return { satisfied: false, reason: 'No recent unit death' };
              }
              const deathEvent = lastEvent as UnitDiedEvent;
              if (deathEvent.killedBy?.damageType !== 'spell') {
                return { satisfied: false, reason: 'Not killed by spell' };
              }
              return { satisfied: true };
            },
          },
        ],
        timing: 'instant',
        onActivate: async (ctx) => [
          new PlayCardFromTrashAction(ctx.owner, {
            card: ctx.self,
            targets: [],
          }, ctx.self),
        ],
      },
    ],
  },
};
```

### Dynamic Cost Reduction

```typescript
export const adaptiveSpell: CardScript = {
  metadata: {
    costModifiers: [
      {
        id: 'might_reduction',
        description: 'Costs 1 less for each point of highest Might you control',
        calculate: (ctx) => {
          const myUnits = getBattlefieldUnits(ctx.game, ctx.owner.id);
          const highestMight = Math.max(...myUnits.map(u => u.might ?? 0), 0);
          return { energyChange: -highestMight };
        },
      },
    ],
  },

  onPlay: async (ctx) => {
    // Cost already applied by scanner
    const myUnits = getBattlefieldUnits(ctx.game, ctx.owner.id);
    const highestMight = Math.max(...myUnits.map(u => u.might ?? 0), 0);

    const target = ctx.targets?.[0];
    if (!target) return;

    return [
      new DealDamageAction(ctx.owner, {
        target,
        amount: highestMight,
        damageType: 'spell',
      }, ctx.self),
    ];
  },
};
```

---

## Integration with Game Loop

### State Change Hook

```typescript
// In GameManager, after any state-mutating action
class GameManager {
  private stateScanner: CardStateScanner;

  private async onStateChanged(game: Game): Promise<void> {
    // Scan all cards
    const delta = await this.stateScanner.scanGameState(game);

    if (delta.changed) {
      // Push updates to UI
      this.notifyUI(game, delta);

      // Auto-execute pending triggers (if any)
      for (const change of delta.changes) {
        if (change.type === 'triggers_pending') {
          await this.executePendingTriggers(change.triggers);
        }
      }
    }
  }
}
```

### UI Query API

```typescript
// UI can query current state synchronously
class UIController {
  renderHand(player: Player) {
    const scanResults = stateScanner.getCurrentResults();

    const handCards = player.zones.hand.map(card => {
      const state = scanResults.get(card.instanceId);

      return {
        card,
        playable: state?.playable?.canPlay ?? false,
        tooltip: state?.playable?.reason,
        cost: state?.effectiveCost,
        abilities: state?.abilities.filter(a => a.canActivate) ?? [],
      };
    });

    // Render...
  }
}
```

---

## Pros

✅ **Simple card scripts** - Cards just define metadata, scanner does the work
✅ **Centralized logic** - All scanning logic in one place (easier to debug/optimize)
✅ **Automatic discovery** - No need for cards to know about timing/zones
✅ **Performance optimizations easier** - Can batch, parallelize, cache at scanner level
✅ **Consistency** - All cards checked the same way
✅ **Push-based UI** - UI gets notified only when something changes
✅ **Easier for card designers** - Less code, more declarative

---

## Cons

❌ **Performance concerns** - Iterating ALL cards on EVERY state change
❌ **Overhead** - Scanning 80+ cards (40 per deck × 2 players) repeatedly
❌ **Metadata complexity** - Need to design good metadata schema
❌ **Less flexible** - Complex conditions harder to express in metadata
❌ **State hashing fragility** - Easy to miss state changes, causing UI staleness
❌ **Scan timing** - When exactly do we scan? After every action?

---

## Performance Analysis

### Worst Case Scenario
- 80 cards in game (2 full decks)
- Each card has 3 activated abilities
- State changes 100 times per turn (actions, triggers, modifiers)

**Operations per turn:**
- 80 cards × 100 scans = 8,000 card scans
- Each scan: playability check + cost calculation + ability scan + trigger scan
- Estimate: ~5ms per full scan × 100 = **500ms per turn**

### Optimizations
1. **Delta scanning** - Only rescan cards in zones affected by change
2. **Lazy evaluation** - Only scan visible zones (e.g., current player's hand)
3. **Incremental updates** - Track dirty flags per card
4. **Zone indexing** - Quick lookup of cards by zone
5. **Caching** - Memoize constraint checks within same game state
6. **Parallel scanning** - Scan cards concurrently (worker threads)

**With optimizations:** ~50-100ms per turn

---

## Implementation Tasks

| Task | File | Status | Effort |
|------|------|--------|--------|
| 1. Scanner Core | CardStateScanner.ts | ✅ DONE | 8-10h |
| 2. Metadata Types | ScanTypes.ts, CardScriptTypes.ts | ✅ DONE | 3-4h |
| 3. Example Cards | scanner-cards/*.card.ts | ✅ DONE | 2-3h |
| 4. GameManager Integration | GameManager.ts | ✅ DONE | 3-4h |
| 5. UI Notification System | UINotifier.ts | ⏳ TODO | 2-3h |
| 6. Test Coverage | CardStateScanner.test.ts | ⏳ TODO | 4-6h |
| **TOTAL** | | **~70% Complete** | **22-30h** |

---

## ✅ Implementation Status (2025-10-11)

### Completed

1. **CardStateScanner** - Full implementation with all scanning logic
   - File: `src/engine/scanning/CardStateScanner.ts` (570 lines)
   - Features: State hashing, delta calculation, constraint checking, cost calculation

2. **Type System** - Complete type definitions
   - File: `src/engine/scanning/types/ScanTypes.ts` (345 lines)
   - All interfaces for metadata, constraints, abilities, triggers

3. **CardScript Extension** - Metadata field added
   - File: `src/engine/scripting/types/CardScriptTypes.ts`
   - Added `metadata?: CardMetadata` to CardScript interface

4. **Example Cards** - 4 demonstration cards
   - HIDDEN keyword (unit-with-hidden.card.ts)
   - Phoenix resurrection (phoenix-resurrection.card.ts)
   - Dynamic cost reduction (dynamic-cost-spell.card.ts)
   - Additional costs (additional-cost-spell.card.ts)

5. **GameManager Integration** - Complete integration
   - Scanner instance per game
   - `onStateChanged(game)` - Triggers scan after updates
   - `activateAbility()` - Execute activated abilities
   - `getPlayableCards()` - Query playable cards
   - `getActivatableCards()` - Query activatable abilities
   - `findCardInGame()` - Utility to find cards anywhere

### Integration Details

```typescript
// GameManager now has:
private scanners: Map<string, CardStateScanner> = new Map();

// Created when game is created
async createGame(...) {
  const scanner = new CardStateScanner(scriptRuntime, modifierRegistry);
  this.scanners.set(game.id, scanner);
}

// Called after any state mutation
private async onStateChanged(game: Game) {
  const delta = await scanner.scanGameState(game);
  if (delta.changed) {
    // Log changes (TODO: notify UI via WebSocket)
  }
}

// Public API
getPlayableCards(gameId, playerId): GameCard[]
getActivatableCards(gameId, playerId): { card, abilities }[]
activateAbility(gameId, playerId, cardId, abilityId): Promise<Result>
```

### TODO

1. **UI Notification System** - WebSocket/event-based notification
2. **Test Coverage** - Unit and integration tests
3. **Performance Optimization** - Delta scanning, zone filtering
4. **Ability Execution** - Complete `onActivate` execution with CardContext

---

## Resolved Questions

1. **Scan frequency** - ✅ After every `updateGame()` call
2. **Zone filtering** - ✅ Scan all zones for now (optimization later)
3. **Trigger execution** - ✅ Scanner only reports, doesn't execute
4. **Error handling** - ✅ Try-catch per card, continue scanning others
5. **Testing** - ⏳ Integration tests pending

---

## Related Documents

- [ACTIVATED-ABILITIES-PROPOSAL-A.md](ACTIVATED-ABILITIES-PROPOSAL-A.md) - Pull-based alternative
- [V3-CARD-SCRIPTING-GUIDE.md](V3-CARD-SCRIPTING-GUIDE.md) - Current scripting system
- [DEVELOPMENT-ROADMAP.md](DEVELOPMENT-ROADMAP.md) - Phase 5.5 Integration Layer
