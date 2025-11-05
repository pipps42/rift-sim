# V3 Card Scripting Guide - Riftbound Simulator

**Last Updated:** 2025-10-26
**Version:** 2.0
**Status:** ✅ Complete - Source of Truth for Card Implementation

This is the **definitive guide** for implementing Riftbound card scripts using the V3 GameAction System.

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Card Script Structure](#card-script-structure)
4. [Lifecycle Hooks](#lifecycle-hooks)
5. [CardContext API](#cardcontext-api)
6. [V3 Actions API](#v3-actions-api)
7. [V3 Modifiers API](#v3-modifiers-api)
8. [V3 Triggers API](#v3-triggers-api)
9. [CardMetadata & Scanner Integration](#cardmetadata--scanner-integration)
10. [Complete Examples](#complete-examples)
11. [Critical Rules & Best Practices](#critical-rules--best-practices)
12. [Common Patterns](#common-patterns)
13. [Troubleshooting](#troubleshooting)

---

## Overview

### What is the V3 System?

The **V3 GameAction System** is a declarative action pipeline that replaces imperative state manipulation with composable, validated, and trackable actions.

**Key Benefits:**
- ✅ **Declarative** - Describe *what* to do, not *how*
- ✅ **Type-safe** - Full TypeScript support with IDE autocomplete
- ✅ **Validated** - Actions validate themselves automatically
- ✅ **Tracked** - Automatic history for replay/undo
- ✅ **Modifiable** - Modifiers intercept and change actions
- ✅ **Triggerable** - Triggers respond to actions automatically
- ✅ **Atomic** - Actions succeed or fail completely (no partial states)
- ✅ **Composable** - Combine simple actions into complex behaviors

### Architecture Overview

```
┌─────────────────────────────────────┐
│   Card Scripts (Your Code)         │
│   - onPlay, onDeath, onAttack, etc │
└─────────────┬───────────────────────┘
              │ Uses ctx.actions.*
              │ Uses ctx.modifiers.*
              │ Uses ctx.triggers.*
              ↓
┌─────────────────────────────────────┐
│   CardScriptRuntime                 │
│   - Executes hooks in safe context │
│   - Provides CardContext            │
└─────────────┬───────────────────────┘
              │
              ↓
┌─────────────────────────────────────┐
│   V3 ActionExecutor                 │
│   7-Phase Pipeline:                 │
│   1. Validation                     │
│   2. Modifiers                      │
│   3. Execution                      │
│   4. History                        │
│   5. Triggers                       │
│   6. Side Effects                   │
│   7. Cleanup (processDeaths)        │
└─────────────────────────────────────┘
```

### 🚫 Obsolete Systems (DO NOT USE)

These systems have been replaced by V3 and should **NOT** be used in new cards:

- ❌ **EffectSystem** → Use V3 Modifiers instead
- ❌ **CleanupSystem** → Handled automatically by V3 ActionExecutor Phase 7
- ❌ **EventBus for game logic** → Use V3 Triggers instead (EventBus is for infrastructure only)
- ❌ **Direct state mutation** → Always use `ctx.actions.*`

---

## Quick Start

### Minimal Unit Card

```typescript
import type { CardScript, CardContext } from '@/engine/scripting/types/CardScriptTypes';

export const simpleWarrior: CardScript = {
  // Triggered when played from hand
  onPlay: async (ctx: CardContext) => {
    // Draw a card when this enters play
    await ctx.actions.draw(1);

    ctx.log.info('Simple Warrior drew 1 card');
  }
};
```

### Minimal Spell Card

```typescript
export const fireballSpell: CardScript = {
  // Triggered when spell resolves from chain
  onPlay: async (ctx: CardContext) => {
    const target = ctx.targets?.[0];
    if (!target) return;

    // Deal 3 damage
    await ctx.actions.dealDamage(target, 3, 'effect');

    ctx.log.info(`Fireball dealt 3 damage to ${target.name}`);
  }
};
```

---

## Card Script Structure

### Basic Structure

```typescript
export const myCard: CardScript = {
  // ========== LIFECYCLE HOOKS ==========
  onPlay?: async (ctx: CardContext) => { /* ... */ },
  onDeath?: async (ctx: CardContext) => { /* ... */ },
  onAttack?: async (ctx: CardContext) => { /* ... */ },
  // ... more hooks

  // ========== VALIDATION HOOKS ==========
  canPlay?: async (ctx: CardContext) => boolean,
  canTarget?: async (ctx: CardContext, target: GameCard) => boolean,

  // ========== SCANNER METADATA ==========
  metadata?: {
    costModifiers: [ /* ... */ ],
    playConstraints: [ /* ... */ ],
    activatedAbilities: [ /* ... */ ]
  }
};
```

---

## Lifecycle Hooks

### Core Hooks

#### `onPlay` - When Card is Played
**Triggered:** When card is played from hand
- For **units/permanents**: After entering base zone
- For **spells**: When resolving from chain

```typescript
onPlay: async (ctx: CardContext) => {
  // Units: Do something when entering play
  await ctx.actions.dealDamage(ctx.opponent.zones.championZone[0]!, 2);

  // Register ongoing effects
  ctx.modifiers.onDamage({
    modify: (amount) => amount + 1,
    duration: 'permanent'
  });
}
```

#### `onEntersPlay` - When Card Enters Battlefield/Base
**Triggered:** Immediately after card enters a play zone (base/battlefield)

```typescript
onEntersPlay: async (ctx: CardContext) => {
  // Trigger when moving from any zone to play
  await ctx.actions.addEnergy(1);
}
```

#### `onDeath` - When Card Dies
**Triggered:** When unit/permanent dies (damage >= might)

```typescript
onDeath: async (ctx: CardContext) => {
  // Death rattle effect
  await ctx.actions.draw(2);
  ctx.log.info('Drew 2 cards from death trigger');
}
```

#### `onMove` - When Card Moves Between Zones
**Triggered:** When card changes zone

```typescript
onMove: async (ctx: CardContext) => {
  const { fromZone, toZone } = ctx.eventData || {};

  if (toZone === 'battlefield') {
    // Do something when arriving at battlefield
    await ctx.actions.dealDamage(/* ... */);
  }
}
```

### Combat Hooks

#### `onAttack` - When This Card Attacks
**Triggered:** When this unit is declared as attacker

```typescript
onAttack: async (ctx: CardContext) => {
  // Gain energy when attacking
  await ctx.actions.addEnergy(1);
}
```

**Note:** Assault/Shield bonuses are handled automatically by the CombatManager. You don't need to implement them in scripts.

#### `onDamage` - When This Card Deals Damage
**Triggered:** After this card deals damage

```typescript
onDamage: async (ctx: CardContext) => {
  const { amount, target } = ctx.eventData || {};

  if (amount && amount >= 3) {
    // Bonus for dealing 3+ damage
    await ctx.actions.draw(1);
  }
}
```

#### `onDamaged` - When This Card Takes Damage
**Triggered:** After this card receives damage

```typescript
onDamaged: async (ctx: CardContext) => {
  const { amount } = ctx.eventData || {};

  // Reflect damage back
  if (amount) {
    await ctx.actions.dealDamage(ctx.opponent.zones.championZone[0]!, amount);
  }
}
```

### Turn Hooks

#### `onTurnStart` / `onTurnEnd`
**Triggered:** At the start/end of **any** player's turn (if card is in play)

```typescript
onTurnStart: async (ctx: CardContext) => {
  // Triggers every turn (yours and opponent's)
  await ctx.actions.addEnergy(1);
}
```

#### `onYourTurnStart` / `onYourTurnEnd`
**Triggered:** At the start/end of **your** turn only

```typescript
onYourTurnStart: async (ctx: CardContext) => {
  // Only triggers on your turn
  await ctx.actions.draw(1);
}
```

#### `onPhaseChange`
**Triggered:** When game phase changes

```typescript
onPhaseChange: async (ctx: CardContext) => {
  const { from, to } = ctx.eventData || {};

  if (to === 'CHANNEL') {
    // Do something at start of Channel phase
    await ctx.actions.addPower('fury', 1);
  }
}
```

### Global Observer Hooks

#### `onUnitEntersPlay`
**Triggered:** When **any** unit enters play (yours or opponent's)

```typescript
onUnitEntersPlay: async (ctx: CardContext) => {
  const { unit } = ctx.eventData || {};

  if (unit?.controllerId === ctx.owner.id) {
    // One of your units entered
    await ctx.actions.addEnergy(1);
  }
}
```

#### `onUnitDies`
**Triggered:** When **any** unit dies

```typescript
onUnitDies: async (ctx: CardContext) => {
  const { unit } = ctx.eventData || {};

  if (unit?.controllerId !== ctx.owner.id) {
    // Enemy unit died
    await ctx.actions.draw(1);
  }
}
```

#### `onSpellCast`
**Triggered:** When **any** spell is cast

```typescript
onSpellCast: async (ctx: CardContext) => {
  // Triggered for all spells
  await ctx.actions.addEnergy(1);
}
```

---

## CardContext API

Every hook receives a `CardContext` with access to game state and V3 APIs:

```typescript
interface CardContext {
  // ===== CARD & PLAYER =====
  self: GameCard;           // The card being scripted
  owner: Player;            // Owner of the card
  opponent: Player;         // Opponent player

  // ===== GAME STATE =====
  game: Game;               // Direct game state access
  targets?: GameCard[];     // Selected targets (if any)
  eventData?: EventData;    // Hook-specific data

  // ===== V3 APIs =====
  actions: ActionsAPI;      // Execute game actions
  modifiers: ModifiersAPI;  // Register action modifiers
  triggers: TriggersAPI;    // Register event triggers

  // ===== UTILITY =====
  log: LogAPI;              // Logging for debugging
}
```

### Common Context Properties

```typescript
// Access the card itself
ctx.self.name              // Card name
ctx.self.might             // Might (attack/health)
ctx.self.damage            // Current damage
ctx.self.ready             // Ready state
ctx.self.zone              // Current zone
ctx.self.keywords          // Keywords array

// Access owner
ctx.owner.id               // Player ID
ctx.owner.runePool.energy  // Current energy
ctx.owner.zones.hand       // Hand zone
ctx.owner.zones.base       // Base zone
ctx.owner.zones.battlefield // Units on battlefield

// Access opponent
ctx.opponent.zones.hand.length  // Opponent's hand size
ctx.opponent.score              // Opponent's score

// Access game state
ctx.game.phase             // Current phase
ctx.game.turnState         // Turn state (NEUTRAL_OPEN, etc.)
ctx.game.chain             // Spell chain
ctx.game.battlefields      // All battlefields
```

---

## V3 Actions API

The `ctx.actions` API provides **all 24 V3 actions** for declarative state changes.

### 🎯 Complete Actions List

#### Resource Actions

```typescript
// Add energy to rune pool
await ctx.actions.addEnergy(amount: number): Promise<void>

// Add power to rune pool
await ctx.actions.addPower(domain: string, amount: number): Promise<void>

// Spend energy from rune pool
await ctx.actions.spendEnergy(amount: number): Promise<void>

// Spend power from rune pool
await ctx.actions.spendPower(domain: string, amount: number): Promise<void>

// Channel runes from Rune Deck to Base
await ctx.actions.channelRunes(amount: number): Promise<void>
```

#### Card State Actions

```typescript
// Exhaust card (ready → exhausted)
await ctx.actions.exhaustCard(card: GameCard): Promise<void>

// Ready card (exhausted → ready)
await ctx.actions.readyCard(card: GameCard): Promise<void>

// Ready all cards (used in Awaken phase)
await ctx.actions.readyAllCards(): Promise<void>
```

#### Card Movement Actions

```typescript
// Move card between zones (generic)
await ctx.actions.moveCard(card: GameCard, fromZone: string, toZone: string): Promise<void>

// Move unit to battlefield
await ctx.actions.moveUnit(unit: GameCard, battlefieldId: string): Promise<void>

// Discard card from hand to trash
await ctx.actions.discard(card: GameCard): Promise<void>

// Recycle card to bottom of deck
await ctx.actions.recycle(card: GameCard, toDeck: 'mainDeck' | 'runeDeck'): Promise<void>

// Kill permanent (send to trash, triggers onDeath)
await ctx.actions.kill(card: GameCard): Promise<void>

// Hide card facedown at battlefield
await ctx.actions.hide(card: GameCard): Promise<void>

// Banish card permanently
await ctx.actions.banish(card: GameCard, fromZone: Zone, permanent?: boolean): Promise<void>

// Reveal card from private zone
await ctx.actions.reveal(card: GameCard, fromZone: Zone, duration?: 'instant' | 'until_played' | 'permanent'): Promise<void>
```

#### Combat & Damage Actions

```typescript
// Deal damage to target
await ctx.actions.dealDamage(
  target: GameCard,
  amount: number,
  damageType?: 'combat' | 'effect'
): Promise<void>

// Heal target (remove damage)
await ctx.actions.heal(target: GameCard, amount: number): Promise<void>

// Remove all damage (used in Expiration phase)
await ctx.actions.removeAllDamage(): Promise<void>

// Stun unit for duration
await ctx.actions.stun(target: GameCard, duration?: number): Promise<void>
```

#### Draw & Play Actions

```typescript
// Draw cards from main deck
await ctx.actions.draw(count: number): Promise<void>

// Play card (for AI/automated plays)
await ctx.actions.playCard(card: GameCard, targets?: GameCard[]): Promise<void>

// Cast spell (puts on chain)
await ctx.actions.castSpell(spell: GameCard, targets?: GameCard[]): Promise<void>

// Counter spell on chain
await ctx.actions.counterSpell(targetChainItemId: string, canCounterAbilities?: boolean): Promise<void>

// Start combat (initiates showdown)
await ctx.actions.startCombat(battlefield: Battlefield, attackers: GameCard[], defenders: GameCard[]): Promise<void>
```

### Usage Example: Complex Card

```typescript
export const furyAssassin: CardScript = {
  onPlay: async (ctx: CardContext) => {
    // 1. Deal damage
    const target = ctx.targets?.[0];
    if (target) {
      await ctx.actions.dealDamage(target, 2, 'effect');
    }

    // 2. Draw a card
    await ctx.actions.draw(1);

    // 3. Add energy
    await ctx.actions.addEnergy(1);

    // All actions are validated, tracked, and trigger side effects automatically
  }
};
```

---

## V3 Modifiers API

The `ctx.modifiers` API registers modifiers that **intercept and modify actions** before execution.

### Damage Modifiers

Modify outgoing damage:

```typescript
ctx.modifiers.onDamage({
  modify: (amount: number) => amount + 2,  // +2 damage
  filter: (target: GameCard) => {
    // Only amplify damage to enemy units
    return target.controllerId !== ctx.owner.id;
  },
  duration: 'permanent',  // Lasts while card is in play
  maxUses: 3              // Maximum 3 uses
});
```

**Filter Function:**
- `target`: The card receiving damage
- Return `true` to apply modifier, `false` to skip

**Duration:**
- `'turn'`: Expires at end of turn
- `'permanent'`: Lasts while card is in play

### Cost Modifiers

Modify card costs:

```typescript
ctx.modifiers.onCost({
  energyModification: -1,  // Reduce cost by 1 energy
  filter: (card: GameCard) => {
    // Only affect Fury spells
    return card.cardType === 'spell' && card.domains?.includes('fury');
  },
  duration: 'permanent'
});
```

**Modifications:**
- `energyModification`: Positive = increase, negative = decrease
- `powerModification`: Modify power costs

### Keyword Modifiers

Grant or remove keywords:

```typescript
ctx.modifiers.onKeyword({
  operation: 'grant',      // or 'remove'
  keyword: 'ASSAULT',
  filter: (card: GameCard) => {
    // Grant Assault to your units
    return card.controllerId === ctx.owner.id && card.cardType === 'unit';
  },
  duration: 'turn'
});
```

**Keywords:**
- `ASSAULT` - +X might when attacking
- `SHIELD` - +X might when defending
- `GANKING` - Can move between battlefields
- `TANK` - Must receive lethal damage first
- `ACCELERATE` - Enters ready instead of exhausted
- `HIDDEN` - Can be played facedown at battlefield

### Prevention Modifiers

Prevent specific actions from occurring:

```typescript
ctx.modifiers.onPrevent({
  actionType: 'deal_damage',
  filter: (action: DealDamageAction) => {
    // Prevent damage to your Champion
    return (
      action.data.target.cardType === 'champion' &&
      action.data.target.controllerId === ctx.owner.id
    );
  },
  maxPrevents: 1  // Block once, then expire
});
```

---

## V3 Triggers API

The `ctx.triggers` API registers triggers that **fire when specific events occur**.

### Unit Entered Play Trigger

```typescript
ctx.triggers.onUnitEntered({
  filter: (unit: GameCard) => {
    // Only trigger for Fury units
    return unit.domains?.includes('fury');
  },
  effect: async (unit: GameCard) => {
    await ctx.actions.draw(1);
    ctx.log.info('Fury unit entered - drew 1 card');
  },
  maxTriggers: 3  // Trigger at most 3 times
});
```

### Damage Dealt Trigger

```typescript
ctx.triggers.onDamageDealt({
  filter: (target: GameCard, amount: number) => {
    // Only when dealing 3+ damage
    return amount >= 3;
  },
  effect: async (target: GameCard, amount: number) => {
    await ctx.actions.addEnergy(1);
    ctx.log.info(`Dealt ${amount} damage - gained energy`);
  }
});
```

### Unit Death Trigger

```typescript
ctx.triggers.onUnitDeath({
  filter: (unit: GameCard) => {
    // Only when enemy units die
    return unit.controllerId !== ctx.owner.id;
  },
  effect: async (unit: GameCard) => {
    await ctx.actions.addPower('fury', 1);
    ctx.log.info('Enemy died - gained Fury power');
  },
  maxTriggers: undefined  // Trigger unlimited times
});
```

### Scoring Trigger

```typescript
ctx.triggers.onScoring({
  filter: (playerId: string, method: 'hold' | 'conquer') => {
    // Only when YOU score via Conquer
    return playerId === ctx.owner.id && method === 'conquer';
  },
  effect: async (playerId: string, battlefield: any) => {
    await ctx.actions.draw(2);
  }
});
```

### Phase Change Trigger

```typescript
ctx.triggers.onPhase({
  phase: 'AWAKEN',
  timing: 'start',  // or 'end'
  effect: async () => {
    // Trigger at start of Awaken phase every turn
    await ctx.actions.addEnergy(1);
  }
});
```

---

## CardMetadata & Scanner Integration

The **CardStateScanner** uses metadata to determine UI state **without executing hooks**. This is critical for showing what actions are available to players.

### What is CardMetadata?

Metadata describes:
1. **Cost Modifiers** - Dynamic cost calculations
2. **Play Constraints** - Conditions for playing the card
3. **Activated Abilities** - Abilities usable from hand/battlefield/trash
4. **Reactive Triggers** - Pending triggers (for UI hints)

### When to Use Metadata vs Hooks

| Feature | Use Metadata | Use Hooks |
|---------|--------------|-----------|
| Cost reduction | ✅ metadata.costModifiers | ❌ |
| Play constraints | ✅ metadata.playConstraints | ❌ |
| Activated abilities | ✅ metadata.activatedAbilities | ❌ |
| Ongoing effects | ❌ | ✅ onPlay with modifiers/triggers |
| One-time effects | ❌ | ✅ onPlay with actions |

### Cost Modifiers Example

```typescript
export const resourcefulWarrior: CardScript = {
  metadata: {
    costModifiers: [{
      id: 'cost_reduction_per_unit',
      description: 'Costs 1 less for each unit you control',
      calculate: (ctx: CardContext) => {
        const units = ctx.owner.zones.base.filter(c => c.cardType === 'unit');
        return {
          energyChange: -units.length  // -1 per unit
        };
      }
    }]
  },

  onPlay: async (ctx: CardContext) => {
    await ctx.actions.draw(1);
  }
};
```

### Play Constraints Example

```typescript
export const battlefieldRequirer: CardScript = {
  metadata: {
    playConstraints: [{
      id: 'require_battlefield',
      description: 'Can only play if you control a battlefield',
      check: (ctx: CardContext) => {
        const controlledBattlefields = ctx.game.battlefields.filter(
          bf => bf.controller === ctx.owner.id
        );

        return {
          satisfied: controlledBattlefields.length > 0,
          reason: controlledBattlefields.length === 0
            ? 'You must control a battlefield'
            : undefined
        };
      }
    }]
  },

  onPlay: async (ctx: CardContext) => {
    // Effect only executes if constraint satisfied
    await ctx.actions.dealDamage(/* ... */);
  }
};
```

### Activated Abilities Example (HIDDEN Keyword)

```typescript
export const stealthAssassin: CardScript = {
  metadata: {
    activatedAbilities: [{
      id: 'hide_ability',
      name: 'Hide',
      description: 'Hide this card facedown at target battlefield',
      availableFrom: ['hand'],  // Can activate from hand
      costs: {
        energy: 2
      },
      constraints: [{
        id: 'control_battlefield',
        description: 'Must control a battlefield',
        check: (ctx: CardContext) => {
          const controlled = ctx.game.battlefields.filter(
            bf => bf.controller === ctx.owner.id
          );
          return {
            satisfied: controlled.length > 0,
            reason: 'Must control a battlefield'
          };
        }
      }],
      onActivate: async (ctx: CardContext) => {
        // Return actions to execute
        return [
          new HideCardAction(ctx.owner, {
            card: ctx.self,
            battlefieldId: ctx.targets![0]!.id
          })
        ];
      }
    }]
  }
};
```

---

## Complete Examples

### Example 1: Combat Unit with Triggers

```typescript
export const furyBerserker: CardScript = {
  // On play: Deal 2 damage, register triggers
  onPlay: async (ctx: CardContext) => {
    const target = ctx.targets?.[0];
    if (target) {
      await ctx.actions.dealDamage(target, 2, 'effect');
    }

    // Trigger: Gain energy when enemies die
    ctx.triggers.onUnitDeath({
      filter: (unit) => unit.controllerId !== ctx.owner.id,
      effect: async () => {
        await ctx.actions.addEnergy(1);
        ctx.log.info('Berserker: Enemy died - gained 1 energy');
      }
    });
  },

  // When attacking: Gain Fury power
  onAttack: async (ctx: CardContext) => {
    await ctx.actions.addPower('fury', 1);
    ctx.log.info('Berserker: Gained 1 Fury from attacking');
  }
};
```

### Example 2: Spell with Damage Modifier

```typescript
export const amplifySpell: CardScript = {
  onPlay: async (ctx: CardContext) => {
    // Register damage amplifier
    ctx.modifiers.onDamage({
      modify: (amount) => amount + 2,  // +2 damage
      filter: (target) => target.controllerId !== ctx.owner.id,
      duration: 'turn'  // Until end of turn
    });

    // Draw a card
    await ctx.actions.draw(1);

    ctx.log.info('Amplify: Your damage +2 this turn');
  }
};
```

### Example 3: Card with Cost Reduction & Constraints

```typescript
export const strategicStrike: CardScript = {
  metadata: {
    // Costs 1 less for each unit you control
    costModifiers: [{
      id: 'cost_per_unit',
      description: 'Costs 1 less for each unit you control',
      calculate: (ctx) => ({
        energyChange: -ctx.owner.zones.base.filter(c => c.cardType === 'unit').length
      })
    }],

    // Can only play if you control 2+ units
    playConstraints: [{
      id: 'require_2_units',
      description: 'Requires 2+ units',
      check: (ctx) => {
        const units = ctx.owner.zones.base.filter(c => c.cardType === 'unit');
        return {
          satisfied: units.length >= 2,
          reason: units.length < 2 ? 'Need at least 2 units' : undefined
        };
      }
    }]
  },

  onPlay: async (ctx: CardContext) => {
    const target = ctx.targets?.[0];
    if (target) {
      await ctx.actions.dealDamage(target, 5, 'effect');
    }
  }
};
```

### Example 4: Yasuo (League Champion)

```typescript
export const yasuoScript: CardScript = {
  // When Yasuo enters play
  onPlay: async (ctx: CardContext) => {
    // Register trigger: When I attack, deal 2 damage to all enemies
    ctx.triggers.onDamageDealt({
      filter: (target, amount) => {
        // Only when Yasuo deals damage
        return true;
      },
      effect: async (target) => {
        // Find all enemy units
        const enemies = ctx.opponent.zones.base.filter(c => c.cardType === 'unit');

        // Deal 1 damage to each
        for (const enemy of enemies) {
          await ctx.actions.dealDamage(enemy, 1, 'effect');
        }

        ctx.log.info('Yasuo: Steel Tempest hit all enemies');
      }
    });
  },

  // When Yasuo attacks
  onAttack: async (ctx: CardContext) => {
    // Gain 1 energy
    await ctx.actions.addEnergy(1);
    ctx.log.info('Yasuo: Way of the Wanderer - gained 1 energy');
  },

  // When Yasuo dies
  onDeath: async (ctx: CardContext) => {
    // Draw 2 cards
    await ctx.actions.draw(2);
    ctx.log.info('Yasuo: Last Breath - drew 2 cards');
  }
};
```

---

## Critical Rules & Best Practices

### 🔴 CRITICAL RULES (MUST FOLLOW)

#### 1. ALWAYS Use V3 Actions - NEVER Mutate State Directly

❌ **WRONG:**
```typescript
ctx.owner.runePool.energy += 1;  // Direct mutation
ctx.self.damage = 0;             // Direct mutation
```

✅ **CORRECT:**
```typescript
await ctx.actions.addEnergy(1);  // V3 action
await ctx.actions.heal(ctx.self, ctx.self.damage);  // V3 action
```

#### 2. NEVER Call processDeaths Manually
**processDeaths is automatic** - called by V3 ActionExecutor Phase 7 after every action.

❌ **WRONG:**
```typescript
await ctx.actions.dealDamage(target, 5);
await ctx.game.processDeaths();  // Don't do this!
```

✅ **CORRECT:**
```typescript
await ctx.actions.dealDamage(target, 5);
// processDeaths called automatically
```

#### 3. NEVER Put Spells in Trash Manually
**Spells automatically go to chain, then trash** after resolution.

❌ **WRONG:**
```typescript
onPlay: async (ctx) => {
  await ctx.actions.moveCard(ctx.self, 'chain', 'trash');
}
```

✅ **CORRECT:**
```typescript
onPlay: async (ctx) => {
  // Just do the spell effect - ChainSystem handles trash movement
  await ctx.actions.dealDamage(target, 3);
}
```

#### 4. Don't Implement Keyword Mechanics Manually
**Assault, Shield, Tank, Accelerate** are handled by the engine.

❌ **WRONG:**
```typescript
onAttack: async (ctx) => {
  // Don't manually implement Assault
  if (ctx.self.keywords.includes('ASSAULT')) {
    ctx.self.might! += 2;  // Wrong!
  }
}
```

✅ **CORRECT:**
```typescript
// Just declare the keyword in card definition
// CombatManager handles bonuses automatically
```

#### 5. Use Metadata for UI-Facing Features
**Cost reduction, constraints, activated abilities** should use metadata, not hooks.

❌ **WRONG:**
```typescript
onPlay: async (ctx) => {
  // Can't show reduced cost in UI before playing
  if (someCondition) {
    // Reduce cost somehow?
  }
}
```

✅ **CORRECT:**
```typescript
metadata: {
  costModifiers: [{
    id: 'dynamic_cost',
    calculate: (ctx) => ({
      energyChange: someCondition ? -1 : 0
    })
  }]
}
```

### 📋 Best Practices

#### 1. Register Modifiers/Triggers in onPlay

```typescript
onPlay: async (ctx) => {
  // Register ongoing effects
  ctx.modifiers.onDamage({ /* ... */ });
  ctx.triggers.onUnitDeath({ /* ... */ });

  // Do immediate effects
  await ctx.actions.draw(1);
}
```

**Why:** Modifiers/triggers persist while card is in play. Register them in onPlay so they activate immediately.

#### 2. Use Filters Generously

```typescript
ctx.triggers.onUnitDeath({
  filter: (unit) => {
    // Be specific about what triggers this
    return (
      unit.controllerId !== ctx.owner.id &&
      unit.cardType === 'unit' &&
      unit.domains?.includes('fury')
    );
  },
  effect: async (unit) => { /* ... */ }
});
```

**Why:** Prevents triggers from firing on unintended cards.

#### 3. Set maxTriggers for Limited Effects

```typescript
ctx.triggers.onDamageDealt({
  filter: (target, amount) => amount >= 3,
  effect: async () => {
    await ctx.actions.draw(1);
  },
  maxTriggers: 3  // Only trigger 3 times
});
```

**Why:** Prevents infinite value generation.

#### 4. Log Important Events

```typescript
await ctx.actions.dealDamage(target, 5);
ctx.log.info(`${ctx.self.name} dealt 5 damage to ${target.name}`);
```

**Why:** Makes debugging much easier.

#### 5. Check for null/undefined

```typescript
const target = ctx.targets?.[0];
if (!target) {
  ctx.log.warn('No target selected');
  return;
}

await ctx.actions.dealDamage(target, 3);
```

**Why:** Prevents runtime errors.

#### 6. Use Appropriate Duration

```typescript
// Temporary effect (end of turn)
ctx.modifiers.onDamage({
  modify: (amount) => amount + 2,
  duration: 'turn'
});

// Permanent effect (while in play)
ctx.modifiers.onDamage({
  modify: (amount) => amount + 1,
  duration: 'permanent'
});
```

**Why:** `'turn'` expires at end of turn, `'permanent'` lasts while card is in play.

#### 7. Compose Actions for Complex Effects

```typescript
onPlay: async (ctx) => {
  // Multiple actions in sequence
  await ctx.actions.dealDamage(target1, 2);
  await ctx.actions.dealDamage(target2, 2);
  await ctx.actions.draw(1);
  await ctx.actions.addEnergy(1);

  // All validated, tracked, and trigger side effects
}
```

---

## Common Patterns

### Pattern 1: "When I Attack" Ability

```typescript
onAttack: async (ctx: CardContext) => {
  // Gain resources
  await ctx.actions.addEnergy(1);
  await ctx.actions.addPower('fury', 1);
}
```

### Pattern 2: Death Rattle

```typescript
onDeath: async (ctx: CardContext) => {
  // Draw cards when dying
  await ctx.actions.draw(2);

  // Deal damage to opponent
  const champion = ctx.opponent.zones.championZone[0];
  if (champion) {
    await ctx.actions.dealDamage(champion, 3, 'effect');
  }
}
```

### Pattern 3: Aura Effect (Buff Allies)

```typescript
onPlay: async (ctx: CardContext) => {
  // Grant +1 damage to all your units
  ctx.modifiers.onDamage({
    modify: (amount) => amount + 1,
    filter: (target) => {
      // Only your units
      const source = (target as any).source;
      return source?.controllerId === ctx.owner.id;
    },
    duration: 'permanent'  // Lasts while unit is in play
  });
}
```

### Pattern 4: Conditional Effect

```typescript
onPlay: async (ctx: CardContext) => {
  // Count your units
  const units = ctx.owner.zones.base.filter(c => c.cardType === 'unit');

  // Bonus if 3+ units
  if (units.length >= 3) {
    await ctx.actions.draw(2);
    ctx.log.info('Bonus: Drew 2 cards');
  } else {
    await ctx.actions.draw(1);
  }
}
```

### Pattern 5: Resource Generation Engine

```typescript
onPlay: async (ctx: CardContext) => {
  // Trigger every turn
  ctx.triggers.onPhase({
    phase: 'AWAKEN',
    timing: 'start',
    effect: async () => {
      await ctx.actions.addEnergy(1);
      await ctx.actions.addPower('calm', 1);
    }
  });
}
```

### Pattern 6: Damage Threshold Trigger

```typescript
onPlay: async (ctx: CardContext) => {
  ctx.triggers.onDamageDealt({
    filter: (target, amount) => amount >= 4,
    effect: async () => {
      // Reward for dealing big damage
      await ctx.actions.draw(1);
    },
    maxTriggers: 5
  });
}
```

---

## Troubleshooting

### Problem: Card Not Showing as Playable

**Cause:** Missing or failing metadata.playConstraints

**Solution:**
```typescript
metadata: {
  playConstraints: [{
    id: 'my_constraint',
    description: 'Clear description',
    check: (ctx) => {
      const satisfied = /* your check */;
      return {
        satisfied,
        reason: satisfied ? undefined : 'Why it failed'
      };
    }
  }]
}
```

### Problem: Cost Not Reducing

**Cause:** Missing metadata.costModifiers

**Solution:**
```typescript
metadata: {
  costModifiers: [{
    id: 'cost_reduction',
    description: 'What reduces the cost',
    calculate: (ctx) => ({
      energyChange: -1  // Negative = reduction
    })
  }]
}
```

### Problem: Modifier Not Applying

**Cause:** Filter returning false

**Solution:**
```typescript
ctx.modifiers.onDamage({
  modify: (amount) => amount + 1,
  filter: (target) => {
    console.log('Filter checking:', target.name);  // Debug
    return true;  // Temporarily return true to test
  },
  duration: 'permanent'
});
```

### Problem: Trigger Not Firing

**Cause:**
1. maxTriggers reached
2. Filter rejecting events
3. Card not in play

**Solution:**
```typescript
ctx.triggers.onUnitDeath({
  filter: (unit) => {
    console.log('Checking unit:', unit.name);  // Debug
    return true;  // Temporarily return true
  },
  effect: async (unit) => {
    console.log('Trigger fired!', unit.name);  // Debug
    await ctx.actions.draw(1);
  },
  maxTriggers: undefined  // Remove limit for testing
});
```

### Problem: Action Failing Silently

**Cause:** Action validation failed

**Solution:**
```typescript
try {
  const result = await ctx.actions.dealDamage(target, 5);
  ctx.log.info('Damage dealt successfully');
} catch (error) {
  ctx.log.error('Damage failed:', error);
}
```

---

## File Structure

### Where to Put Card Scripts

```
src/cards/                    # Production card scripts
  fury/
    fury-warrior.card.ts
    fury-spell.card.ts
  calm/
    calm-healer.card.ts

scripts/cards/                # Test/example card scripts
  test-warrior.card.ts

src/examples/cards/           # Example cards for documentation
  basic-unit.ts
  complex-spell.ts
```

### Card Script File Naming

- Use `.card.ts` extension: `yasuo.card.ts`
- Use kebab-case: `fury-berserker.card.ts`
- Export named constant: `export const yasuoScript: CardScript = { /* ... */ }`

---

## Further Reading

- **[ENGINE-ARCHITECTURE.md](../../docs/04-development/ENGINE-ARCHITECTURE.md)** - Complete engine design
- **[GAMEACTION-SYSTEM-DESIGN.md](../../docs/04-development/GAMEACTION-SYSTEM-DESIGN.md)** - V3 technical deep dive
- **[CardScriptTypes.ts](../../src/engine/scripting/types/CardScriptTypes.ts)** - Full TypeScript definitions
- **[ScanTypes.ts](../../src/engine/scanning/types/ScanTypes.ts)** - CardMetadata types
- **[RULES.md](../../docs/01-design/RULES.md)** - Official Riftbound game rules
- **[Example Cards](../../src/examples/cards/)** - More card examples

---

**Questions?** Check the source code or create an issue on GitHub.

**Last Updated:** 2025-10-26 - All systems V3 integrated ✅
