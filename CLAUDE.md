# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Riftbound Simulator** is a backend Node.js + TypeScript engine for a League of Legends-themed Trading Card Game (TCG) called "Riftbound". The project implements a complete game engine with:

- Custom card scripting system (V2 and V3 GameAction pipeline)
- Complex turn structure with 8 phases
- Battlefield control and scoring mechanics
- Chain/stack system for spell resolution
- Prisma ORM with PostgreSQL for persistence

**Language:** Italian is commonly used in documentation (e.g., roadmaps, some comments)

**Project Status:** ~70% complete - Core engine and scripting systems done, testing in progress

## Build & Development Commands

```bash
# Install dependencies
npm install

# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Run compiled code
npm start

# Format code
npm run format

# Testing
npm test                           # Run all tests (Jest)
npm test -- <file-pattern>         # Run specific test file
npm test -- --watch                # Watch mode

# Database (Prisma)
npm run db:generate                # Generate Prisma Client
npm run db:migrate                 # Run migrations
npm run db:seed                    # Seed database with sample data
npm run db:studio                  # Open Prisma Studio GUI
npm run db:reset                   # Reset database (destructive)
```

## Architecture Overview

### Core System Layers

The engine is organized into distinct layers:

```
┌─────────────────────────────────────────┐
│    Card Scripting Layer (V2 + V3)      │  ← Card behavior definitions
│  • CardScriptRuntime (V2)              │
│  • V3 GameAction Pipeline (18 actions) │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┴───────────────────────┐
│        Engine Core Systems              │
│  • GameManager, TurnManager             │
│  • BattlefieldManager, ScoringManager   │
│  • ChainSystem, CombatManager           │
│  • CardStateScanner ⭐ (UI queries)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┴───────────────────────┐
│         Game State & Events             │
│  • CardStorage (shared card data)       │
│  • HistoryQueryAPI (replay)             │
│  • Event Bus (infrastructure only)      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┴───────────────────────┐
│        Data Layer (Prisma)              │
│  • PostgreSQL (CardDefinition, Deck)    │
│  • Redis (future: game sessions)        │
└─────────────────────────────────────────┘
```

### Two Card Scripting Systems

**V2 System** (Legacy, 87% tested):
- Direct execution in Node.js process
- Cards implement hooks like `onPlay`, `onTap`, `onDeath`
- Scripts have full access to `Game` object via `CardContext`
- Located in: [src/engine/scripting/](src/engine/scripting/)

**V3 GameAction System** (NEW, 98.8% tested):
- Declarative action pipeline inspired by Legends of Runeterra
- 7-phase execution: Validation → Modifiers → Execute → History → Triggers → Side Effects → Cleanup
- Actions are immutable intentions, not mutations
- Modifiers intercept actions before execution
- Triggers respond to actions after execution
- Located in: [src/engine/actions/](src/engine/actions/)

**Migration:** V2 and V3 coexist. New cards should use V3 actions API (`ctx.actions.*`, `ctx.modifiers.*`, `ctx.triggers.*`) within V2 hooks.

### CardStateScanner System ⭐

The **CardStateScanner** is a centralized push-based system that determines UI state for all cards:

**Key Responsibilities:**
- Determine which cards are playable (in hand)
- Find available activated abilities (from any zone)
- Calculate effective costs (with modifiers)
- Check play constraints (timing, resources, custom conditions)
- Detect pending triggers

**How It Works:**
1. After any game state change, `GameManager.onStateChanged()` triggers a scan
2. Scanner iterates all cards in game (hand, battlefield, trash, etc.)
3. For each card, evaluates playability, abilities, costs using metadata
4. Calculates delta (what changed) to avoid redundant UI updates
5. Returns `ScanDelta` with only changed cards

**Integration:**
```typescript
// GameManager provides query methods
const playableCards = gameManager.getPlayableCards(gameId, playerId);
const activatable = gameManager.getActivatableCards(gameId, playerId);

// Each returns current scanner results (no async scan needed)
```

**Card Metadata Example:**
```typescript
export const hiddenUnit: CardScript = {
  metadata: {
    activatedAbilities: [{
      id: 'hide',
      name: 'Hide',
      availableFrom: ['hand'],  // Can activate from hand
      costs: { energy: 2 },
      constraints: [{
        id: 'control_battlefield',
        check: (ctx) => hasControlledBattlefield(ctx)
      }],
      onActivate: async (ctx) => [new HideCardAction(...)]
    }]
  }
}
```

**Files:**
- `src/engine/scanning/CardStateScanner.ts` (570 lines)
- `src/engine/scanning/types/ScanTypes.ts` (345 lines)

### Key Domain Concepts

**Game Structure:**
- 1v1 matches with exactly 2 players
- 8 game phases per turn: Awaken → Beginning → Channel → Draw → Action → Ending → Expiration → Cleanup
- Turn states: Neutral Open/Closed, Showdown Open/Closed (controls when cards can be played)

**Battlefield System:**
- 2 battlefields per game
- Units move between battlefields using Standard Moves or Ganking
- Battlefield control scoring: Hold (start of turn) or Conquer (during turn)
- Goal: 8 victory points

**Resource System:**
- **Energy:** Generic resource (channeled from Runes)
- **Power:** Domain-specific resources (Fury, Calm, Mind, Body, Chaos, Order, Universal)
- **Rune Pool:** Contains energy + power, cleared at end of turn

**Card Types:**
- Unit, Champion, Legend, Gear, Spell, Rune, Battlefield, Signature, Token
- Cards have `energyCost` + `powerCost[]` for domain identity

**Keywords:**
- Assault X (bonus might when attacking)
- Shield X (bonus might when defending)
- Ganking (can move between battlefields)
- Tank (must receive lethal damage first)
- Accelerate (enters ready instead of exhausted)
- And more... (see [src/types/game.ts](src/types/game.ts#L465-L485))

### Critical Code Patterns

**1. V3 Action Pattern (Preferred):**
```typescript
// In card script onPlay hook:
onPlay: async (ctx: CardContext) => {
  // Use declarative actions - they auto-validate, log to history, trigger side effects
  await ctx.actions.dealDamage(target, 3, 'effect');
  await ctx.actions.draw(1);
}
```

**2. V3 Modifier Pattern:**
```typescript
// Register a modifier that intercepts damage actions
onPlay: async (ctx: CardContext) => {
  ctx.modifiers.onDamage({
    modify: (amount) => amount + 2,  // +2 damage
    filter: (target) => target.controllerId !== ctx.owner.id,  // Only to enemies
    duration: 'permanent',  // Lasts while card is in play
  });
}
```

**3. V3 Trigger Pattern:**
```typescript
// Register a trigger that fires when units die
onPlay: async (ctx: CardContext) => {
  ctx.triggers.onUnitDeath({
    filter: (unit) => unit.controllerId !== ctx.owner.id,
    effect: async (unit) => {
      await ctx.actions.addEnergy(1);
      ctx.log.info('Enemy unit died - gained 1 energy');
    },
    maxTriggers: 3,  // Only trigger 3 times
  });
}
```

**4. GameCard vs Card:**
- `Card` = card definition (from database/factory)
- `GameCard` = card instance in a game (has `instanceId`, `controllerId`, `zone`, `ready`, `damage`)

**5. State-Based Actions:**
The game has a `processDeaths` function that must be called after any action that could kill units:
```typescript
// After dealing damage that might kill units
await ctx.actions.dealDamage(target, 5);
// processDeaths() is called automatically by V3 ActionExecutor in Phase 7 (Cleanup)
```

## Project Structure

```
src/
├── engine/
│   ├── actions/              # V3 GameAction System (18 actions implemented)
│   │   ├── base/             # GameAction, ActionModifier, ActionTrigger base classes
│   │   ├── concrete/         # Concrete actions (18 total - see ENGINE-ARCHITECTURE.md)
│   │   ├── modifiers/        # Concrete modifiers (DamageModifier, CostModifier, etc.)
│   │   ├── triggers/         # Concrete triggers (OnDamageDealtTrigger, etc.)
│   │   ├── ActionExecutor.ts # 7-phase action pipeline
│   │   ├── ModifierRegistry.ts
│   │   └── TriggerRegistry.ts
│   ├── scanning/             # ⭐ CardStateScanner System (NEW)
│   │   ├── CardStateScanner.ts  # Main scanner implementation
│   │   └── types/ScanTypes.ts   # Metadata types, constraint interfaces
│   ├── scripting/            # V2 Card Scripting System
│   │   ├── CardScriptLoader.ts  # Dynamic TypeScript loading
│   │   ├── CardScriptRuntime.ts # Script execution orchestrator
│   │   └── types/CardScriptTypes.ts  # CardContext, ActionsAPI, etc.
│   ├── managers/             # Core managers
│   │   ├── GameManager.ts
│   │   ├── TurnManager.ts
│   │   ├── BattlefieldManager.ts
│   │   ├── ScoringManager.ts
│   │   ├── RunePoolManager.ts
│   │   └── PriorityManager.ts
│   ├── systems/              # Subsystems
│   │   ├── ChainSystem.ts    # Spell/ability stack
│   │   ├── CombatManager.ts
│   │   ├── EffectSystem.ts   # ⚠️ DEPRECATED - use V3 Modifiers
│   │   ├── AbilitySystem.ts
│   │   ├── CleanupSystem.ts  # ⚠️ DEPRECATED - use V3 ActionExecutor Phase 7
│   │   └── KeywordSystem.ts
│   ├── events/               # Event bus & event definitions
│   ├── validators/           # Action & deck validation
│   ├── storage/              # CardStorage (inter-card data sharing)
│   └── history/              # HistoryQueryAPI (replay queries)
├── types/
│   ├── game.ts               # Core game types (Game, Player, Card, etc.)
│   ├── actions.ts            # V3 action types (GameAction, ActionModifier, etc.)
│   └── cardDefinitions.ts    # Card definition interfaces
├── data/
│   └── CardFactory.ts        # Convert Prisma models to game types
├── examples/
│   ├── cards/                # Example V3 card scripts
│   └── plain-cards/          # V2 card scripts
└── cards/                    # Production card implementations

scripts/
└── cards/                    # Test card scripts (*.card.ts)

prisma/
├── schema.prisma             # Database schema
└── seed.ts                   # Sample data seeder
```

## Common Development Tasks

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run specific test file:**
```bash
npm test -- TurnManager.test.ts
```

**Run tests with coverage:**
```bash
npm test -- --coverage
```

**Test patterns:**
- Unit tests: `src/engine/**/__tests__/*.test.ts`
- Integration tests: `src/engine/__tests__/integration.test.ts`
- V3 action tests: `src/engine/actions/__tests__/*.test.ts`

### Working with Cards

**Creating a new card:**

1. Create card definition in database or via CardFactory
2. Create card script in `scripts/cards/` or `src/examples/cards/`
3. Implement hooks using V2 + V3 APIs
4. Test the card

**Card script template (V3 style):**
```typescript
import type { CardScript, CardContext } from '@/engine/scripting/types/CardScriptTypes';

export const myCard: CardScript = {
  onPlay: async (ctx: CardContext) => {
    // Use V3 actions
    await ctx.actions.dealDamage(ctx.targets?.[0], 3, 'effect');

    // Register V3 modifiers
    ctx.modifiers.onDamage({
      modify: (amount) => amount + 1,
      duration: 'turn',
    });

    // Register V3 triggers
    ctx.triggers.onUnitDeath({
      effect: async (unit) => {
        await ctx.actions.draw(1);
      },
    });
  },
};
```

### Database Operations

**Create migration:**
```bash
npm run db:migrate
```

**Reset database:**
```bash
npm run db:reset  # Destructive! Drops all data and re-seeds
```

**Query database:**
```bash
npm run db:studio  # Opens Prisma Studio in browser
```

**Accessing Prisma Client:**
```typescript
import { PrismaClient } from '@/generated/prisma';
const prisma = new PrismaClient();

// Query cards
const cards = await prisma.cardDefinition.findMany({
  where: { cardType: 'UNIT' }
});
```

## Important Notes

### Path Aliases

The project uses TypeScript path aliases (configured in [tsconfig.json](tsconfig.json#L27-L35)):

```typescript
import { Game } from '@/types/game';           // → src/types/game.ts
import { GameManager } from '@/engine/managers/GameManager'; // → src/engine/managers/GameManager.ts
```

**Note:** At runtime, use `tsc-alias` to resolve paths:
```bash
npm run build  # Runs: tsc && tsc-alias
```

### Test Framework

Uses **Jest** (not Vitest) configured in [jest.config.cjs](jest.config.cjs)

### V3 Action System Integration

When writing card scripts, **always prefer V3 actions** over direct state mutation:

❌ **Bad (V1/V2 pattern):**
```typescript
ctx.owner.runePool.energy += 1;  // Direct mutation
ctx.game.history.push(...);      // Manual history
```

✅ **Good (V3 pattern):**
```typescript
await ctx.actions.addEnergy(1);  // Declarative action (auto-validates, logs history, triggers side effects)
```

### Stack Overflow Protection

V3 ActionExecutor has stack depth protection (default max: 100). If you get stack overflow errors, check for:
1. Infinite trigger loops (trigger A → trigger B → trigger A)
2. Modifiers creating new actions without base case

### processDeaths State-Based Action

The V3 system automatically calls `game.processDeaths()` in Phase 7 (Cleanup) of the action pipeline. This checks for units with `damage >= might` and moves them to trash, triggering `onDeath` hooks.

**When adding new damage sources:** No manual processDeaths needed - V3 handles it.

## Documentation

**Key docs:**
- [ENGINE-ARCHITECTURE.md](docs/ENGINE-ARCHITECTURE.md) - Complete engine design
- [V3-CARD-SCRIPTING-GUIDE.md](docs/V3-CARD-SCRIPTING-GUIDE.md) - V3 actions, modifiers, triggers guide
- [GAMEACTION-SYSTEM-DESIGN.md](docs/GAMEACTION-SYSTEM-DESIGN.md) - V3 technical deep dive
- [DEVELOPMENT-ROADMAP-UPDATED.md](docs/DEVELOPMENT-ROADMAP-UPDATED.md) - Project status & roadmap
- [TESTING-ROADMAP-UPDATED.md](docs/TESTING-ROADMAP-UPDATED.md) - Test coverage status

**Riftbound Rules:**
See `docs/RULES.md` for complete TCG rules

## TypeScript Configuration

- **Target:** ES2022
- **Module:** ES2022 (ESM)
- **Strict mode:** Enabled
- **Key compiler options:**
  - `noImplicitAny: true`
  - `noUncheckedIndexedAccess: true`
  - `exactOptionalPropertyTypes: true`

## Development Patterns

### Event-Driven Architecture (DEPRECATED! will not be part of the game engine. will be used for infrastructure only.)

The engine uses an event bus for decoupled communication:

```typescript
import { EventBus } from '@/engine/events/EventBus';

// Emit event
eventBus.emit({
  type: EventType.UNIT_PLAYED,
  cardId: unit.instanceId,
  timestamp: new Date(),
});

// Listen to event
eventBus.on(EventType.UNIT_PLAYED, async (event) => {
  // Handle event
});
```

### Card Storage System

Cards can share data between instances using CardStorage:

```typescript
// Store data
ctx.game.storage.set('myCard:combo', { count: 3 });

// Retrieve data
const combo = ctx.game.storage.get('myCard:combo');
```

### History Query API

Query game history for replays/card effects:

```typescript
// Get all damage dealt this turn
const damageEvents = ctx.game.historyQuery.getDamageDealtThisTurn(ctx.owner.id);

// Check if unit died this turn
const unitDied = ctx.game.historyQuery.didUnitDie(unitId);
```

## Testing Guidelines

**When adding new features:**
1. Write unit tests for managers/systems
2. Write integration tests for multi-component interactions
3. Update test coverage roadmap in [TESTING-ROADMAP-UPDATED.md](docs/TESTING-ROADMAP-UPDATED.md)

**Test naming:**
```typescript
describe('ActionExecutor', () => {
  it('should execute action through full pipeline', async () => {
    // Arrange
    const action = new DealDamageAction(...);

    // Act
    const result = await executor.execute(action);

    // Assert
    expect(result.success).toBe(true);
  });
});
```

## Troubleshooting

**Import errors:**
- Check path aliases in [tsconfig.json](tsconfig.json)
- Run `npm run build` to generate types

**Prisma errors:**
- Run `npm run db:generate` to regenerate client
- Check `.env` for `DATABASE_URL`

**Test failures:**
- Check `src/__mocks__/uuid.ts` for deterministic IDs
- Use `jest.clearAllMocks()` in `beforeEach`

**Stack overflow in actions:**
- Check trigger → trigger loops
- Verify modifier doesn't create infinite actions
- Increase `maxStackDepth` in ActionExecutorConfig if needed

## Future Work

**Not yet implemented:**
- Phase 5.2-5.4: State persistence (Redis), WebSocket multiplayer, Replay system
- Phase 6: REST API, Controllers, Authentication
- Phase 7: AI opponents, Analytics, Meta analysis
- Phase 8: Performance optimization, Anti-cheat

See [DEVELOPMENT-ROADMAP-UPDATED.md](docs/DEVELOPMENT-ROADMAP-UPDATED.md) for detailed roadmap.
