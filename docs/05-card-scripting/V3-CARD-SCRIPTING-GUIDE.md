# V3 GameAction System - Card Scripting Guide

This guide explains how to write Riftbound card scripts using the new **V3 GameAction System**, which provides a declarative, type-safe approach to defining card behavior.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Card Context API](#card-context-api)
4. [Actions API](#actions-api)
5. [Modifiers API](#modifiers-api)
6. [Triggers API](#triggers-api)
7. [Complete Example](#complete-example)
8. [Migration from V2](#migration-from-v2)

---

## Overview

### What is the V3 System?

The V3 GameAction System is a **declarative action pipeline** that replaces imperative game state manipulation with composable, validated, and trackable actions.

**Benefits:**
- ✅ **Declarative** - Describe *what* to do, not *how*
- ✅ **Type-safe** - Full TypeScript support with IDE autocomplete
- ✅ **Validated** - Actions validate themselves automatically
- ✅ **Tracked** - Automatic history for replay/undo
- ✅ **Modifiable** - Modifiers can intercept and change actions
- ✅ **Triggerable** - Triggers respond to actions automatically
- ✅ **Atomic** - Actions succeed or fail completely (no partial states)
- ✅ **Composable** - Combine simple actions into complex behaviors

### V2 vs V3 Comparison

**V2 (Imperative):**
```typescript
onPlay: async (ctx) => {
  // Manually check state
  if (!ctx.self.ready) return;

  // Manually mutate state
  ctx.self.ready = false;
  ctx.owner.runePool.energy += 1;

  // Manually track history
  ctx.game.history.push({ type: 'exhaust', card: ctx.self.id });

  // Manually trigger side effects
  ctx.game.processEffects();
}
```

**V3 (Declarative):**
```typescript
onPlay: async (ctx) => {
  // Declarative - the system handles everything
  await ctx.actions.exhaustCard(ctx.self);
  await ctx.actions.addEnergy(1);
}
```

---

## Quick Start

### Basic Rune Example

```typescript
import type { CardScript, CardContext } from '@/engine/scripting/types/CardScriptTypes';

export const basicFuryRune: CardScript = {
  id: 'RUNE_FURY_BASIC',
  name: 'Basic Fury Rune',
  type: 'unit',
  cost: 0,
  rarity: 'common',
  description: '[T]: Add [1]\nRecycle this: Add [Fury]',

  activatedAbilities: [
    {
      name: 'Tap for Energy',
      description: 'Exhaust this rune to add 1 energy',
      cost: 0,
      canUse: (ctx: CardContext) => (ctx.self as any).ready === true,
      effect: async (ctx: CardContext) => {
        // V3 Actions - declarative and validated
        await ctx.actions.exhaustCard(ctx.self);
        await ctx.actions.addEnergy(1);
      },
    },
    {
      name: 'Recycle for Power',
      description: 'Recycle this rune to add 1 Fury power',
      cost: 0,
      canUse: () => true,
      effect: async (ctx: CardContext) => {
        await ctx.actions.addPower('fury', 1);
        await ctx.actions.recycle(ctx.self, 'runeDeck');
      },
    },
  ],
};
```

---

## Card Context API

Every card script handler receives a `CardContext` object with access to the V3 system:

```typescript
interface CardContext {
  self: Card;            // The card being scripted
  owner: Player;         // Owner of the card
  game: SafeGameState;   // Read-only game state

  // V2 APIs (legacy)
  battlefield: BattlefieldAPI;
  chain: ChainAPI;
  random: RandomAPI;
  log: LogAPI;

  // V3 APIs (new)
  actions: ActionsAPI;     // Execute game actions
  modifiers: ModifiersAPI; // Register action modifiers
  triggers: TriggersAPI;   // Register event triggers
}
```

---

## Actions API

The `ctx.actions` API provides convenience methods for common game actions.

### Available Actions

#### Card State Actions

```typescript
// Exhaust card (ready → exhausted)
await ctx.actions.exhaustCard(card: GameCard): Promise<void>

// Ready card (exhausted → ready)
await ctx.actions.readyCard(card: GameCard): Promise<void>
```

#### Card Movement Actions

```typescript
// Move card between zones
await ctx.actions.moveCard(card: GameCard, fromZone: string, toZone: string): Promise<void>

// Discard card from hand to trash
await ctx.actions.discard(card: GameCard): Promise<void>

// Recycle card to bottom of deck
await ctx.actions.recycle(card: GameCard, toDeck: 'mainDeck' | 'runeDeck'): Promise<void>

// Kill permanent (send to trash)
await ctx.actions.kill(card: GameCard): Promise<void>

// Hide card facedown at battlefield
await ctx.actions.hide(card: GameCard): Promise<void>
```

#### Resource Actions

```typescript
// Add energy to rune pool
await ctx.actions.addEnergy(amount: number): Promise<void>

// Add power to rune pool
await ctx.actions.addPower(domain: string, amount: number): Promise<void>

// Draw cards
await ctx.actions.draw(count: number): Promise<void>
```

#### Combat Actions

```typescript
// Deal damage to target
await ctx.actions.dealDamage(
  target: GameCard,
  amount: number,
  damageType?: 'combat' | 'effect'
): Promise<void>

// Heal target
await ctx.actions.heal(target: GameCard, amount: number): Promise<void>
```

### Example: Fury Spell

```typescript
export const furyBolt: CardScript = {
  id: 'SPELL_FURY_BOLT',
  name: 'Fury Bolt',
  type: 'spell',
  cost: 2,
  description: 'Deal 3 damage to target unit. Draw a card.',

  onPlay: async (ctx: CardContext) => {
    const target = ctx.targets?.[0];
    if (!target) return;

    // Compose multiple actions
    await ctx.actions.dealDamage(target, 3, 'effect');
    await ctx.actions.draw(1);

    ctx.log.info(`Fury Bolt dealt 3 damage to ${target.instanceId}`);
  },
};
```

---

## Modifiers API

The `ctx.modifiers` API lets you register modifiers that intercept and modify actions.

### Available Modifiers

#### Damage Modifiers

Modify damage amounts:

```typescript
ctx.modifiers.onDamage({
  modify: (amount: number) => amount + 1,  // +1 damage
  filter: (target: GameCard) => {
    // Only buff damage to enemy units
    return target.controllerId !== ctx.owner.id;
  },
  duration: 'turn',  // Lasts until end of turn
  maxUses: 3,        // Maximum 3 uses
});
```

#### Cost Modifiers

Modify card costs:

```typescript
ctx.modifiers.onCost({
  energyModification: -1,  // Reduce cost by 1
  filter: (card: GameCard) => {
    // Only affect Fury spells
    return (card as any).domains?.includes('fury');
  },
  duration: 'permanent',  // Lasts while this card is in play
});
```

#### Keyword Modifiers

Grant or remove keywords:

```typescript
ctx.modifiers.onKeyword({
  operation: 'grant',  // or 'remove'
  keyword: 'ASSAULT',
  filter: (card: GameCard) => {
    // Grant Assault to your units
    return card.controllerId === ctx.owner.id;
  },
  duration: 'turn',
});
```

#### Prevention Modifiers

Prevent specific actions:

```typescript
ctx.modifiers.onPrevent({
  actionType: 'deal_damage',
  filter: (action: any) => {
    // Prevent damage to your Champion
    return action.data.target.instanceId === ctx.owner.champion.instanceId;
  },
  maxPrevents: 1,  // Block once
});
```

### Example: Damage Amplifier Unit

```typescript
export const furyAmplifier: CardScript = {
  id: 'UNIT_FURY_AMPLIFIER',
  name: 'Fury Amplifier',
  type: 'unit',
  cost: 3,
  stats: { attack: 2, health: 3 },
  description: 'Your Fury spells and abilities deal +1 damage.',

  onPlay: async (ctx: CardContext) => {
    // Register damage modifier
    ctx.modifiers.onDamage({
      modify: (amount) => amount + 1,
      filter: (target) => {
        // Only amplify Fury sources
        const source = (target as any).source;
        return source?.domains?.includes('fury');
      },
      duration: 'permanent',  // Lasts while unit is in play
    });

    ctx.log.info('Fury Amplifier active - Fury damage +1');
  },
};
```

---

## Triggers API

The `ctx.triggers` API lets you register triggers that fire when specific events occur.

### Available Triggers

#### Unit Entered Play

```typescript
ctx.triggers.onUnitEntered({
  filter: (unit: GameCard) => {
    // Only trigger for Fury units
    return (unit as any).domains?.includes('fury');
  },
  effect: async (unit: GameCard) => {
    await ctx.actions.draw(1);
    ctx.log.info(`Fury unit entered - drew a card`);
  },
  maxTriggers: 3,  // Trigger at most 3 times
});
```

#### Player Scoring

```typescript
ctx.triggers.onScoring({
  filter: (playerId: string, method: 'hold' | 'conquer') => {
    // Only when you score via Conquer
    return playerId === ctx.owner.id && method === 'conquer';
  },
  effect: async (playerId: string, battlefield: any) => {
    await ctx.actions.addEnergy(2);
  },
});
```

#### Phase Changes

```typescript
ctx.triggers.onPhase({
  phase: 'AWAKEN',
  timing: 'start',
  effect: async () => {
    // Trigger at start of Awaken phase
    await ctx.actions.draw(1);
  },
  maxTriggers: undefined,  // Trigger every turn
});
```

#### Damage Dealt

```typescript
ctx.triggers.onDamageDealt({
  filter: (target: GameCard, amount: number) => {
    // Only when dealing 3+ damage
    return amount >= 3;
  },
  effect: async (target: GameCard, amount: number) => {
    await ctx.actions.addEnergy(1);
  },
});
```

#### Unit Death

```typescript
ctx.triggers.onUnitDeath({
  filter: (unit: GameCard) => {
    // Only when enemy units die
    return unit.controllerId !== ctx.owner.id;
  },
  effect: async (unit: GameCard) => {
    await ctx.actions.addEnergy(1);
    ctx.log.info('Enemy unit died - gained 1 energy');
  },
});
```

### Example: Card Draw Engine

```typescript
export const mysticScribe: CardScript = {
  id: 'UNIT_MYSTIC_SCRIBE',
  name: 'Mystic Scribe',
  type: 'unit',
  cost: 4,
  stats: { attack: 1, health: 4 },
  description: 'When you score, draw a card. At start of turn, gain 1 energy.',

  onPlay: async (ctx: CardContext) => {
    // Trigger 1: Draw when scoring
    ctx.triggers.onScoring({
      filter: (playerId) => playerId === ctx.owner.id,
      effect: async () => {
        await ctx.actions.draw(1);
        ctx.log.info('Mystic Scribe: Scored - drew a card');
      },
    });

    // Trigger 2: Gain energy at start of turn
    ctx.triggers.onPhase({
      phase: 'AWAKEN',
      timing: 'start',
      effect: async () => {
        await ctx.actions.addEnergy(1);
        ctx.log.info('Mystic Scribe: Gained 1 energy');
      },
    });
  },
};
```

---

## Complete Example

Here's a complete card with actions, modifiers, and triggers:

```typescript
export const furyChampion: CardScript = {
  id: 'UNIT_FURY_CHAMPION',
  name: 'Fury Champion',
  type: 'unit',
  cost: 5,
  stats: { attack: 4, health: 4 },
  keywords: ['ASSAULT'],
  description: `
    Assault 2
    When this enters play, deal 2 damage to target enemy unit.
    Your Fury units get +1 Might.
    When an enemy unit dies, gain 1 energy.
  `,

  // Action: Deal damage on play
  onPlay: async (ctx: CardContext) => {
    const target = ctx.targets?.[0];
    if (target) {
      await ctx.actions.dealDamage(target, 2, 'effect');
    }

    // Modifier: Grant +1 Might to Fury units
    ctx.modifiers.onDamage({
      modify: (amount) => amount + 1,
      filter: (target) => {
        const source = (target as any).source;
        return (
          source?.domains?.includes('fury') &&
          source?.controllerId === ctx.owner.id
        );
      },
      duration: 'permanent',
    });

    // Trigger: Gain energy when enemy units die
    ctx.triggers.onUnitDeath({
      filter: (unit) => unit.controllerId !== ctx.owner.id,
      effect: async (unit) => {
        await ctx.actions.addEnergy(1);
        ctx.log.info('Fury Champion: Enemy died - gained energy');
      },
    });
  },
};
```

---

## Migration from V2

### V2 Pattern (Imperative)

```typescript
onPlay: async (ctx) => {
  // Manual state manipulation
  ctx.self.ready = false;
  ctx.owner.runePool.energy += 1;
  ctx.game.history.push({ type: 'exhaust', card: ctx.self.id });

  // Manual trigger processing
  for (const trigger of ctx.game.triggers) {
    if (trigger.event === 'card_exhausted') {
      await trigger.handler(ctx);
    }
  }
}
```

### V3 Pattern (Declarative)

```typescript
onPlay: async (ctx) => {
  // Declarative actions
  await ctx.actions.exhaustCard(ctx.self);
  await ctx.actions.addEnergy(1);

  // Triggers fire automatically
}
```

### Migration Checklist

- [ ] Replace direct state mutations with `ctx.actions.*`
- [ ] Replace manual history tracking with V3 actions
- [ ] Convert cost/damage calculations to `ctx.modifiers.*`
- [ ] Convert event handlers to `ctx.triggers.*`
- [ ] Remove manual trigger processing code
- [ ] Test with V3 ActionExecutor

---

## Best Practices

1. **Always use V3 actions** instead of mutating state directly
2. **Register modifiers in `onPlay`** so they activate when the card enters play
3. **Use filters generously** to ensure modifiers/triggers only affect intended targets
4. **Set `maxTriggers`** for one-shot or limited-use effects
5. **Use `duration: 'turn'`** for temporary effects that expire at end of turn
6. **Log important events** using `ctx.log.info()` for debugging
7. **Compose simple actions** into complex behaviors
8. **Use type guards** when accessing card-specific properties (`(card as any).domains`)

---

## Further Reading

- **[V3 GameAction System Architecture](./V3-GAMEACTION-ARCHITECTURE.md)** - Technical deep dive
- **[RULES.md](./RULES.md)** - Official Riftbound game rules
- **[Card Script Types](../src/engine/scripting/types/CardScriptTypes.ts)** - Full TypeScript definitions
- **[Example Cards](../src/examples/cards/)** - More card examples

---

**Questions?** Check the source code or create an issue on GitHub.
