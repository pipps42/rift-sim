# Card Scripting Guide

This guide explains how to create custom card scripts for Riftbound using the Card Scripting System.

## Table of Contents

- [Getting Started](#getting-started)
- [Card Script Structure](#card-script-structure)
- [Available APIs](#available-apis)
- [Lifecycle Hooks](#lifecycle-hooks)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Testing](#testing)

## Getting Started

### Prerequisites

- TypeScript knowledge
- Understanding of Riftbound game rules
- Familiarity with the Card Scripting API

### Creating Your First Card

1. Create a new `.ts` file in `scripts/cards/`
2. Export a `cardScript` object with required fields
3. Implement desired hooks and abilities
4. The script will be automatically loaded on game start (with hot-reload in dev mode)

**Minimal Example:**

```typescript
export const cardScript = {
  id: 'MY_CARD_001',
  name: 'My First Card',
  type: 'unit',
  cost: 3,
  rarity: 'common',

  onPlay: (context) => {
    log.info('My card was played!');
  },
};
```

## Card Script Structure

### Required Fields

All cards must define these fields:

```typescript
{
  id: string;           // Unique identifier (e.g., "FIRE_WARRIOR_001")
  name: string;         // Display name
  type: 'unit' | 'spell' | 'artifact' | 'ritual';
  cost: number;         // Mana cost
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
```

### Optional Fields

#### For Units
```typescript
{
  stats: {
    attack: number;
    health: number;
  };
}
```

#### Metadata
```typescript
{
  description?: string;   // Card text
  keywords?: string[];    // ['flying', 'rush', 'taunt']
  tags?: string[];       // ['dragon', 'warrior', 'fire']
}
```

## Available APIs

Card scripts have access to these APIs through the execution context:

### Battlefield API

Interact with units and the battlefield:

```typescript
// Query entities
battlefield.getEntity(entityId: string)
battlefield.getEntities(filter?: EntityFilter)
battlefield.getEntitiesInArea(area: Area)

// Damage and healing
battlefield.dealDamage(target, amount, source?)
battlefield.heal(target, amount)

// Unit manipulation
battlefield.destroy(target)
battlefield.move(entity, position)
battlefield.summon(cardId, position, owner)
battlefield.transform(entity, newCardId)

// Status effects
battlefield.addStatus(target, status, duration?)
battlefield.removeStatus(target, status)

// Stat modifications
battlefield.modifyStats(target, { attack?, health?, maxHealth? })
```

### Chain API

Interact with the effect chain:

```typescript
// Add effects to chain
chain.addEffect(effect: Effect)

// Counter the last effect
chain.counter()

// Query chain state
chain.getChainLength()
chain.isEmpty()
```

### Random API

Deterministic random number generation:

```typescript
// Random integer in [min, max)
random.int(min: number, max: number)

// Random float in [0, 1)
random.float()

// Pick random element
random.pick(array: T[])

// Shuffle array
random.shuffle(array: T[])

// Random boolean with probability
random.chance(probability: number)
```

### Log API

Logging and debugging:

```typescript
log.info(message: string, data?: any)
log.warn(message: string, data?: any)
log.error(message: string, data?: any)
log.debug(message: string, data?: any)
```

### Context Variables

Scripts have access to these context variables:

```typescript
self      // The card being scripted (Card)
owner     // The player who owns this card (Player)
gameState // Read-only game state (SafeGameState)
targets   // Selected targets for this action (Entity[])
eventData // Additional event-specific data (any)
```

## Lifecycle Hooks

### onPlay

Called when the card is played/summoned.

```typescript
onPlay: (context) => {
  log.info(`${self.name} enters play!`);

  if (targets && targets.length > 0) {
    battlefield.dealDamage(targets[0].id, 3, self.id);
  }
}
```

### onDeath

Called when a unit dies (units only).

```typescript
onDeath: (context) => {
  log.info(`${self.name} has died`);

  // Draw a card when this unit dies
  chain.addEffect({
    type: 'DRAW_CARDS',
    value: 1,
    description: 'Draw a card',
  });
}
```

### onTurnStart / onTurnEnd

Called at the start/end of each turn.

```typescript
onTurnStart: (context) => {
  if (gameState.activePlayer === owner.id) {
    log.info('My turn!');
    battlefield.heal(self.id, 1);
  }
}
```

### onAttack / onDefend

Called when a unit attacks or defends.

```typescript
onAttack: (context, defender) => {
  log.info(`Attacking ${defender.name}`);
  battlefield.addStatus(defender.id, 'stunned', 1);
}

onDefend: (context, attacker) => {
  log.info(`Defending against ${attacker.name}`);
  battlefield.dealDamage(attacker.id, 2, self.id);
}
```

### onDamage / onDamaged

Called when dealing or taking damage.

```typescript
onDamage: (context, amount, target) => {
  log.info(`Dealt ${amount} damage to ${target.name}`);
}

onDamaged: (context, amount, source?) => {
  log.info(`Took ${amount} damage`);

  if (amount >= 5) {
    log.info('Enraged!');
    battlefield.modifyStats(self.id, { attack: 3 });
  }
}
```

### Validation Hooks

#### canPlay

Custom validation for whether the card can be played.

```typescript
canPlay: (context) => {
  // Can only play if there are enemy units
  const enemies = battlefield.getEntities({
    type: 'unit',
    owner: 'opponent',
  });

  return enemies.length > 0;
}
```

#### canTarget

Custom validation for target selection.

```typescript
canTarget: (context, target) => {
  // Can only target damaged units
  return target.health < target.maxHealth;
}
```

## Advanced Features

### Trigger System

Define custom event triggers:

```typescript
triggers: [
  {
    event: 'SPELL_CAST',
    condition: (context) => {
      return eventData?.spell?.tags?.includes('fire');
    },
    handler: (context) => {
      log.info('Fire spell cast!');
      battlefield.modifyStats(self.id, { attack: 1 });
    },
    once: false, // Trigger multiple times
  },
]
```

**Available Events:**
- `UNIT_SUMMONED`
- `UNIT_DIED`
- `SPELL_CAST`
- `DAMAGE_DEALT`
- `DAMAGE_TAKEN`
- `TURN_START`
- `TURN_END`
- `PHASE_CHANGE`
- `CARD_DRAWN`
- `CARD_DISCARDED`
- `ATTACK_DECLARED`
- `ENTITY_MOVED`

### Passive Effects

Define always-active effects:

```typescript
passiveEffects: [
  {
    description: 'Allied units get +1 attack',
    targets: {
      type: 'unit',
      owner: 'self',
    },
    statMods: {
      attack: 1,
    },
    condition: (context) => true,
  },
]
```

### Activated Abilities

Player-activated abilities:

```typescript
activatedAbilities: [
  {
    name: 'Power Strike',
    description: 'Deal 5 damage to target enemy',
    cost: 2, // Mana cost
    cooldown: 1, // Turns before can use again

    targetRequirement: {
      count: 1,
      filter: { type: 'unit', owner: 'opponent' },
    },

    canUse: (context) => {
      return owner.runePool.energy >= 2;
    },

    effect: (context) => {
      if (targets && targets.length > 0) {
        battlefield.dealDamage(targets[0].id, 5, self.id);
      }
    },
  },
]
```

## Examples

See the `/scripts/cards/examples/` directory for complete examples:

1. **[FireWarrior.ts](./examples/FireWarrior.ts)** - Basic unit with simple effects
2. **[LightningBolt.ts](./examples/LightningBolt.ts)** - Spell with random effects
3. **[Phoenix.ts](./examples/Phoenix.ts)** - Unit with triggers and resurrection
4. **[Archmage.ts](./examples/Archmage.ts)** - Complex card with multiple abilities

## Best Practices

### Performance

- **Keep hooks fast:** Scripts timeout after 1 second
- **Avoid infinite loops:** Always have exit conditions
- **Minimize entity queries:** Cache results when possible

```typescript
// ❌ Bad: Querying multiple times
onPlay: (context) => {
  battlefield.getEntities().forEach(e => {
    if (battlefield.getEntity(e.id).health < 5) {
      battlefield.heal(e.id, 1);
    }
  });
}

// ✅ Good: Single query
onPlay: (context) => {
  const entities = battlefield.getEntities();
  entities
    .filter(e => e.health < 5)
    .forEach(e => battlefield.heal(e.id, 1));
}
```

### Logging

- Use appropriate log levels
- Add context to log messages
- Use debug logs for verbose output

```typescript
log.info('Important event');
log.debug('Detailed state', { health: self.stats.health });
log.warn('Unusual situation');
log.error('Something went wrong', { error });
```

### Safety

- Always validate `targets` existence
- Check entity existence before operating
- Handle edge cases gracefully

```typescript
onPlay: (context) => {
  if (!targets || targets.length === 0) {
    log.warn('No targets provided');
    return;
  }

  const entity = battlefield.getEntity(targets[0].id);
  if (!entity) {
    log.error('Target entity not found');
    return;
  }

  // Safe to proceed
  battlefield.dealDamage(entity.id, 3, self.id);
}
```

### Code Organization

- Group related functionality
- Use comments to explain complex logic
- Keep scripts under 300 lines if possible

```typescript
export const cardScript = {
  // ============================================================================
  // Metadata
  // ============================================================================
  id: 'CARD_001',
  // ...

  // ============================================================================
  // Lifecycle Hooks
  // ============================================================================
  onPlay: (context) => { /* ... */ },

  // ============================================================================
  // Triggers
  // ============================================================================
  triggers: [ /* ... */ ],
};
```

## Testing

### Manual Testing

1. Place your script in `scripts/cards/`
2. Start the game in dev mode (hot-reload enabled)
3. Play the card and observe behavior
4. Check console logs for debug output

### Script Validation

The loader automatically validates:
- Required fields are present
- Types are correct (unit/spell/etc.)
- Cost is non-negative
- Rarity is valid

### Debugging

Enable debug mode in runtime config:

```typescript
const runtime = new CardScriptRuntime({
  debug: true,
});
```

This will log:
- Script loading events
- Hook execution
- API calls
- Errors and warnings

## Security

Scripts run in a sandboxed environment with:

- **No file system access**
- **No network access**
- **No Node.js globals** (process, require, etc.)
- **1 second execution timeout**
- **128 MB memory limit**

Only whitelisted APIs are available:
- `battlefield`, `chain`, `random`, `log`
- Safe globals: `JSON`, `Object`, `Array`, `console`

## Hot Reload

In development mode, scripts are automatically reloaded when changed:

1. Edit your card script
2. Save the file
3. Changes take effect immediately (no restart needed)

File watcher monitors: `scripts/cards/**/*.ts`

## Troubleshooting

### Script Not Loading

- Check file is in `scripts/cards/` directory
- Verify `export const cardScript = { ... }` syntax
- Check console for validation errors
- Ensure `id` field is unique

### Hook Not Executing

- Verify hook name is correct (e.g., `onPlay`, not `onPlayed`)
- Check if card script exists for card ID
- Enable debug logging to see hook calls
- Verify game event is actually occurring

### Type Errors

- Scripts are TypeScript but types are not enforced at runtime
- Use `log.debug()` to inspect data types
- Check context variables exist before using

### Timeout Errors

- Simplify complex logic
- Avoid infinite loops
- Break large operations into smaller chunks
- Consider using triggers instead of polling

## Support

For questions or issues:

1. Check examples in `scripts/cards/examples/`
2. Review API documentation in `src/engine/scripting/types/CardScriptTypes.ts`
3. Enable debug logging for more details
4. Report issues on GitHub

## Next Steps

- Study the example cards
- Experiment with simple effects
- Build up to complex interactions
- Share your cool cards with the community!

Happy scripting! 🎴✨
