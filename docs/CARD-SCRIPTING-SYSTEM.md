# Card Scripting System - Architecture & Design

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture Decision](#architecture-decision)
- [System Design](#system-design)
- [Script Examples](#script-examples)
- [Implementation Plan](#implementation-plan)
- [Integration with Existing Systems](#integration-with-existing-systems)

---

## Overview

### The Card Definition Problem

Riftbound cards have complex, unique abilities that present an architectural challenge:

**The Challenge:**
- Each card has static data (name, image, cost, might, keywords)
- Each card has dynamic abilities with unique logic
- Static data can live in a database
- **But complex ability logic is hard to configure via pure data**

**Example - Yasuo:**
> "When this unit attacks, deal damage equal to the number of spells cast this turn by the controller to all enemy units on this battlefield"

This requires:
1. Listening to attack trigger
2. Counting specific game events (spells cast)
3. Filtering units by battlefield and controller
4. Dynamic damage calculation
5. Area-of-effect execution

**Question:** How do we implement 500+ cards with unique abilities without creating unmaintainable code?

---

## Architecture Decision

### Approaches Considered

#### ❌ Approach 1: Hardcoded Card Classes
```typescript
class YasuoCard extends UnitCard {
  onAttacks() { /* custom logic */ }
}
```
**Rejected:** Scales poorly, requires engine rebuild for new cards, tight coupling

#### ❌ Approach 2: Pure Data-Driven (JSON configs)
```json
{
  "effect": "damage_all_enemies",
  "value": "spells_cast_this_turn"
}
```
**Rejected:** Limited flexibility, complex cards need dozens of config options, becomes unreadable

#### ⚠️ Approach 3: Hybrid (Data + Custom Handlers)
- 80% of cards use parametric handlers from database
- 20% of complex cards have dedicated TypeScript files
- **Pros:** Works, flexible
- **Cons:** Two systems to maintain, unclear boundary, handlers proliferate

#### ✅ Approach 4: Card Scripting System (SELECTED)
- **Every card has a script file** (simple or complex, same pattern)
- Scripts written in TypeScript with safe API
- Executed in sandboxed environment
- Hot reload support for rapid iteration

**Why Selected:**
- ✅ **Industry Proven:** Same approach as Legends of Runeterra (Riot Games)
- ✅ **Designer-Friendly:** Non-engineers can create cards
- ✅ **Type-Safe:** TypeScript with autocomplete
- ✅ **Uniform:** All cards follow same pattern
- ✅ **Hot Reload:** Modify scripts without server restart
- ✅ **Sandboxed:** Scripts can't crash engine
- ✅ **Scalable:** Proven to 500+ cards in production games

---

## System Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│           Card Script (TypeScript)              │
│  ┌───────────────────────────────────────────┐ │
│  │ // RB_001_Yasuo.card.ts                   │ │
│  │ export default {                          │ │
│  │   onAttacks: async (ctx) => {             │ │
│  │     const enemies = ctx.battlefield       │ │
│  │       .getEnemyUnits(ctx.source);         │ │
│  │     for (const enemy of enemies) {        │ │
│  │       await ctx.damage(enemy, 2);         │ │
│  │     }                                      │ │
│  │   }                                        │ │
│  │ }                                          │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│        Script Context API (Sandbox)             │
│  - ctx.source (current card)                    │
│  - ctx.game (safe game state)                   │
│  - ctx.damage(target, amount)                   │
│  - ctx.draw(player, count)                      │
│  - ctx.battlefield.* (battlefield queries)      │
│  - ctx.chain.* (chain manipulation)             │
│  ... (50+ safe APIs)                            │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Script Engine (isolated-vm)             │
│  - Load & compile scripts                       │
│  - Execute in isolated V8 context               │
│  - Timeout protection (5s max per script)       │
│  - Memory limits (128MB per isolate)            │
│  - Hot reload with file watching                │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Game Engine (Existing Systems)          │
│  - EffectSystem, ChainSystem, etc.              │
│  - Called via Script Context API delegation     │
└─────────────────────────────────────────────────┘
```

### Core Components

#### 1. CardScript Interface
Defines the contract for card scripts:

```typescript
// src/engine/scripting/types/CardScriptTypes.ts
export interface CardScript {
  // Triggered abilities
  onEntersPlay?: (ctx: CardContext) => Promise<void>;
  onAttacks?: (ctx: CardContext) => Promise<void>;
  onDefends?: (ctx: CardContext) => Promise<void>;
  onDies?: (ctx: CardContext) => Promise<void>;
  onDealsDamage?: (ctx: CardContext, amount: number) => Promise<void>;
  onTakesDamage?: (ctx: CardContext, amount: number) => Promise<void>;
  onTurnStart?: (ctx: CardContext) => Promise<void>;
  onTurnEnd?: (ctx: CardContext) => Promise<void>;
  onSpellCast?: (ctx: CardContext) => Promise<void>;

  // Activated abilities
  onActivate?: (ctx: CardContext) => Promise<void>;

  // Replacement effects
  onBeforeDraw?: (ctx: CardContext, event: DrawEvent) => Promise<DrawEvent>;
  onBeforeDamage?: (ctx: CardContext, event: DamageEvent) => Promise<DamageEvent>;

  // Static data (optional override from DB)
  keywords?: string[];
}
```

#### 2. CardContext API
Safe, sandboxed API exposed to scripts:

```typescript
export interface CardContext {
  // Card references
  source: GameCard;           // The card running this script
  controller: Player;         // Player who controls this card
  targets: GameCard[];        // Selected targets (if any)

  // Game state (read-only safe views)
  game: SafeGameState;
  battlefield: BattlefieldAPI;
  chain: ChainAPI;

  // Action methods (delegate to game engine)
  damage(target: GameCard, amount: number, source?: GameCard): Promise<void>;
  heal(target: GameCard, amount: number): Promise<void>;
  draw(player: Player, count: number): Promise<void>;
  discard(player: Player, count: number): Promise<void>;
  destroy(target: GameCard): Promise<void>;
  move(unit: GameCard, toBattlefield: string): Promise<void>;
  buff(target: GameCard, might: number, duration: EffectDuration): Promise<void>;
  debuff(target: GameCard, might: number, duration: EffectDuration): Promise<void>;
  stun(target: GameCard): Promise<void>;
  exhaust(target: GameCard): Promise<void>;
  ready(target: GameCard): Promise<void>;
  addKeyword(target: GameCard, keyword: string, duration: EffectDuration): Promise<void>;
  removeKeyword(target: GameCard, keyword: string): Promise<void>;
  createToken(cardId: string, zone: string, player: Player): Promise<GameCard>;

  // Utility methods
  log(message: string): void;
  random(min: number, max: number): number;
  choice(player: Player, options: any[], prompt: string): Promise<any>;
}

export interface BattlefieldAPI {
  findByUnit(unit: GameCard): Battlefield | null;
  getEnemyUnits(player: Player): GameCard[];
  getAlliedUnits(player: Player): GameCard[];
  getControlledBattlefields(player: Player): Battlefield[];
  getAllUnits(): GameCard[];
}

export interface ChainAPI {
  push(item: ChainItem): Promise<void>;
  peek(): ChainItem | null;
  isEmpty(): boolean;
  getSize(): number;
}

export interface SafeGameState {
  currentTurn: number;
  currentPhase: GamePhase;
  turnState: TurnState;
  activePlayer: Player;
  history: GameEvent[];  // Read-only event history
}
```

#### 3. ScriptEngine
Manages script loading, compilation, and execution:

```typescript
// src/engine/scripting/ScriptEngine.ts
export class ScriptEngine {
  private isolate: ivm.Isolate;
  private scriptCache = new Map<string, CardScript>();

  constructor() {
    // Create isolated V8 instance with memory limit
    this.isolate = new ivm.Isolate({ memoryLimit: 128 });
  }

  async loadScript(cardId: string, scriptPath: string): Promise<CardScript>;
  async executeMethod(script: CardScript, method: string, context: CardContext, timeout?: number): Promise<void>;
  invalidateCache(cardId: string): void;
}
```

#### 4. ScriptLoader
Hot reload and file watching:

```typescript
// src/engine/scripting/ScriptLoader.ts
export class ScriptLoader {
  private watcher: FSWatcher;

  async initialize(scriptsDir: string): Promise<void>;
  async reload(cardId: string): Promise<void>;
  onScriptChange(callback: (cardId: string) => void): void;
}
```

#### 5. CardContext Implementation
Bridges scripts to game engine:

```typescript
// src/engine/scripting/CardContext.ts
export class CardContextImpl implements CardContext {
  constructor(
    public source: GameCard,
    public controller: Player,
    public targets: GameCard[],
    private game: Game,
    private effectSystem: EffectSystem,
    private battlefieldManager: BattlefieldManager,
    private chainSystem: ChainSystem
  ) {}

  // All methods delegate to existing systems
  async damage(target: GameCard, amount: number, source?: GameCard): Promise<void> {
    const effect: Effect = {
      type: EffectType.DAMAGE,
      value: amount,
      targets: [{ type: TargetType.UNIT, value: target.instanceId }]
    };
    await this.effectSystem.executeEffect(
      this.game,
      effect,
      source?.instanceId || this.source.instanceId,
      this.controller.id
    );
  }

  // ... similar delegation for all other methods
}
```

---

## Script Examples

### Simple Card: "Draw 2 Cards"

```typescript
// scripts/cards/RB_050_ArcaneInsight.card.ts
export default {
  onCast: async (ctx: CardContext) => {
    await ctx.draw(ctx.controller, 2);
  }
}
```

### Medium Card: "Deal damage equal to cards in hand"

```typescript
// scripts/cards/RB_075_HandOfJustice.card.ts
export default {
  onCast: async (ctx: CardContext) => {
    const target = ctx.targets[0];
    const handSize = ctx.controller.hand.length;
    await ctx.damage(target, handSize);
  }
}
```

### Complex Card: Yasuo

```typescript
// scripts/cards/RB_001_Yasuo.card.ts
export default {
  onAttacks: async (ctx: CardContext) => {
    // Get battlefield where this unit is
    const battlefield = ctx.battlefield.findByUnit(ctx.source);
    if (!battlefield) return;

    // Count spells cast this turn by controller
    const spellsCast = ctx.game.history
      .filter(e =>
        e.type === 'SPELL_CAST' &&
        e.turn === ctx.game.currentTurn &&
        e.playerId === ctx.controller.id
      ).length;

    // Deal damage to all enemies on this battlefield
    const enemies = battlefield.getEnemyUnits(ctx.controller);
    for (const enemy of enemies) {
      await ctx.damage(enemy, spellsCast, ctx.source);
    }
  },

  keywords: ['Accelerate:1']
}
```

### Advanced Card: Replacement Effect

```typescript
// scripts/cards/RB_120_TimeWarp.card.ts
export default {
  // "Players draw 2 cards instead of 1 during their draw phase"
  onBeforeDraw: async (ctx: CardContext, event: DrawEvent) => {
    if (event.amount === 1 && event.reason === 'DRAW_PHASE') {
      event.amount = 2;
      ctx.log(`${ctx.source.name}: Extra card drawn!`);
    }
    return event;
  }
}
```

### Interactive Card: Player Choice

```typescript
// scripts/cards/RB_200_ForkInTheRoad.card.ts
export default {
  onCast: async (ctx: CardContext) => {
    const choice = await ctx.choice(ctx.controller, [
      { id: 'draw', label: 'Draw 3 cards' },
      { id: 'damage', label: 'Deal 5 damage to target unit' }
    ], 'Choose one:');

    if (choice.id === 'draw') {
      await ctx.draw(ctx.controller, 3);
    } else {
      const target = ctx.targets[0];
      await ctx.damage(target, 5);
    }
  }
}
```

---

## Implementation Plan

### Phase 0: Card Scripting System (3 days)

#### Step 0.1: Setup Infrastructure (Day 1 Morning)
**Files to create:**
- `src/engine/scripting/types/CardScriptTypes.ts` - Type definitions
- `package.json` - Add dependencies

**Tasks:**
```bash
npm install isolated-vm chokidar
npm install -D @types/isolated-vm
```

**Deliverables:**
- ✅ CardScript interface defined
- ✅ CardContext interface defined
- ✅ Helper types (SafeGameState, BattlefieldAPI, ChainAPI)
- ✅ Dependencies installed

---

#### Step 0.2: Implement CardContext (Day 1 Afternoon)
**Files to create:**
- `src/engine/scripting/CardContext.ts` - Context implementation

**Tasks:**
- Implement all action methods (damage, heal, draw, etc.)
- Delegate to existing systems (EffectSystem, BattlefieldManager, ChainSystem)
- Create safe game state views
- Implement BattlefieldAPI and ChainAPI

**Deliverables:**
- ✅ CardContextImpl class complete (~400 lines)
- ✅ All 20+ action methods implemented
- ✅ Safe delegation to existing engine
- ✅ Unit tests for context methods

---

#### Step 0.3: Implement ScriptEngine (Day 2 Morning)
**Files to create:**
- `src/engine/scripting/ScriptEngine.ts` - Script execution engine

**Tasks:**
- Setup isolated-vm isolate
- Implement script loading and compilation
- Add caching mechanism
- Implement executeMethod with timeout protection
- Error handling and logging

**Deliverables:**
- ✅ ScriptEngine class complete (~250 lines)
- ✅ Script caching working
- ✅ Timeout protection (5s limit)
- ✅ Memory limits enforced (128MB)
- ✅ Error handling robust

---

#### Step 0.4: Implement ScriptLoader (Day 2 Afternoon)
**Files to create:**
- `src/engine/scripting/ScriptLoader.ts` - Hot reload system

**Tasks:**
- File watching with chokidar
- Auto-reload on script changes
- TypeScript validation before load
- Cache invalidation on reload

**Deliverables:**
- ✅ ScriptLoader class complete (~200 lines)
- ✅ Hot reload working
- ✅ TypeScript errors detected pre-runtime
- ✅ File watcher active in dev mode

---

#### Step 0.5: Integrate with AbilitySystem (Day 2 Evening)
**Files to modify:**
- `src/engine/systems/AbilitySystem.ts` - Add script execution
- `src/engine/managers/GameManager.ts` - Initialize scripting

**Tasks:**
- Modify `checkTriggeredAbilities()` to load and execute scripts
- Map AbilityTrigger to script method names
- Create CardContext for each execution
- Backward compatibility (if no script, use existing logic)

**Deliverables:**
- ✅ AbilitySystem extended (~100 lines added)
- ✅ Script execution integrated
- ✅ Trigger → method mapping complete
- ✅ Existing abilities still work

---

#### Step 0.6: Create Example Scripts (Day 3)
**Files to create:**
- `scripts/cards/RB_BASIC_UNIT.card.ts` - Basic unit (no abilities)
- `scripts/cards/RB_DRAW_SPELL.card.ts` - Simple "Draw 2 cards"
- `scripts/cards/RB_DAMAGE_SPELL.card.ts` - Targeted damage
- `scripts/cards/RB_BUFF_UNIT.card.ts` - Temporary buff
- `scripts/cards/RB_CONDITIONAL.card.ts` - Conditional trigger
- `scripts/cards/RB_001_Yasuo.card.ts` - Complex (Yasuo)
- `scripts/cards/RB_STATIC_EFFECT.card.ts` - Static continuous effect
- `scripts/cards/RB_REPLACEMENT.card.ts` - Replacement effect
- `scripts/cards/RB_MULTI_TRIGGER.card.ts` - Multiple triggers
- `scripts/cards/RB_INTERACTIVE.card.ts` - Player choice

**Tasks:**
- Implement 10 example cards covering all patterns
- Test each card in isolation
- Test complex interactions
- Document patterns in comments

**Deliverables:**
- ✅ 10 working card scripts
- ✅ All patterns covered (simple → complex)
- ✅ Integration tests passing
- ✅ Performance benchmarks recorded

---

#### Step 0.7: Testing & Validation (Day 3 Afternoon)
**Tasks:**
- Execute all 10 cards in test game
- Verify sandboxing (timeout, memory limits)
- Test hot reload (modify script while running)
- Performance benchmarking (script overhead < 1ms)
- Error scenarios (infinite loop, crashes)

**Deliverables:**
- ✅ All cards working correctly
- ✅ Sandboxing verified (no engine crashes)
- ✅ Hot reload confirmed working
- ✅ Performance acceptable
- ✅ Error handling robust

---

### Directory Structure

```
src/
├── engine/
│   ├── scripting/
│   │   ├── ScriptEngine.ts              ⭐ Core execution engine
│   │   ├── CardContext.ts               ⭐ API implementation
│   │   ├── ScriptLoader.ts              ⭐ Hot reload system
│   │   └── types/
│   │       └── CardScriptTypes.ts       ⭐ TypeScript interfaces
│   ├── systems/
│   │   └── AbilitySystem.ts             (modified for scripts)
│   └── managers/
│       └── GameManager.ts               (modified for scripting init)
│
scripts/
└── cards/
    ├── RB_001_Yasuo.card.ts             ⭐ Card scripts
    ├── RB_002_Ahri.card.ts
    ├── RB_050_ArcaneInsight.card.ts
    └── ... (500-1000 cards)

data/
└── cards/
    └── definitions.json                  ⭐ Static metadata only
```

---

## Integration with Existing Systems

### Database Schema (Simplified)

With scripting, the database only stores **visual metadata**:

```prisma
// prisma/schema.prisma
model CardDefinition {
  id          String   @id         // "RB_001_Yasuo"
  name        String
  energyCost  Int
  might       Int?
  cardType    String
  rarity      String
  imageUrl    String?
  description String
  flavorText  String?
  scriptPath  String              // ⭐ Path to script file

  domains     String[]
  keywords    String[]
  tags        String[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**No more:**
- ❌ `abilities` table
- ❌ `effects` table
- ❌ `handler_key` fields
- ❌ Complex JSON configs

**Just:**
- ✅ Visual/metadata fields
- ✅ `scriptPath` link to TypeScript file

### CardFactory Integration

```typescript
// src/engine/cards/CardFactory.ts
export class CardFactory {
  constructor(
    private db: PrismaClient,
    private scriptEngine: ScriptEngine
  ) {}

  async createInstance(
    definitionId: string,
    controllerId: string,
    game: Game
  ): Promise<GameCard> {
    // 1. Load metadata from DB
    const definition = await this.db.cardDefinition.findUnique({
      where: { id: definitionId }
    });

    // 2. Load script
    const script = await this.scriptEngine.loadScript(
      definition.id,
      definition.scriptPath
    );

    // 3. Create instance
    const instance: GameCard = {
      instanceId: uuid(),
      definitionId: definition.id,
      controllerId,
      name: definition.name,
      energyCost: definition.energyCost,
      might: definition.might,
      // ... other fields
      _script: script,           // ⭐ Attached script
      _definition: definition
    };

    return instance;
  }
}
```

### Runtime Execution Flow

```
1. Player plays card "RB_001_Yasuo"
   ↓
2. CardFactory.createInstance("RB_001_Yasuo", playerId, game)
   ↓
3. Load definition from DB
   ↓
4. ScriptEngine.loadScript("RB_001_Yasuo", "scripts/cards/RB_001_Yasuo.card.ts")
   ↓
5. Script compiled and cached
   ↓
6. Instance created with ._script attached
   ↓
7. Card enters play
   ↓
8. Player declares attack with Yasuo
   ↓
9. AbilitySystem.checkTriggeredAbilities(game, ATTACKS)
   ↓
10. Found Yasuo has ._script.onAttacks
   ↓
11. Create CardContext(yasuo, player, targets, game, systems...)
   ↓
12. ScriptEngine.executeMethod(script, 'onAttacks', context)
   ↓
13. Script executes in isolated-vm:
    - Counts spells in game.history
    - Gets enemy units from battlefield API
    - Calls ctx.damage() for each enemy
   ↓
14. CardContext.damage() delegates to EffectSystem
   ↓
15. Damage dealt, events emitted
```

---

## Comparison: Scripting vs Other Approaches

| Criterion | Scripting System | Hybrid (DB+Code) | Pure Data-Driven |
|-----------|------------------|------------------|------------------|
| **Setup Time** | 3 days | 2 days | 1 day |
| **Designer UX** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Flexibility** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Type Safety** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Scalability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Maintainability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Hot Reload** | ✅ Yes | ❌ No | ⚠️ Partial |
| **Uniformity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Debug UX** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |

### Key Advantages of Scripting

1. **Industry Proven**
   - Legends of Runeterra uses Python scripts (500+ cards)
   - Hearthstone uses internal scripting DSL
   - MTG Arena uses similar approach

2. **Developer Velocity**
   - Designer creates card → writes script → tests → done
   - No engine changes needed
   - No rebuild required (hot reload)
   - Iteration time: seconds instead of minutes

3. **Scalability**
   - 1 file per card = easy to find/modify
   - Git-friendly (one card = one file = one commit)
   - No "handler proliferation" problem
   - Clear ownership (each card self-contained)

4. **Type Safety (with TypeScript)**
   - VSCode autocomplete for CardContext API
   - Compile-time errors before runtime
   - Refactor API → all scripts show errors
   - Better than Python/JS scripting

5. **Sandboxing**
   - Scripts can't crash engine
   - Memory limits prevent leaks
   - Timeout prevents infinite loops
   - Isolated failures (one bad card doesn't break game)

---

## Technical Stack

### Dependencies

```json
{
  "dependencies": {
    "isolated-vm": "^5.0.0",    // V8 isolate for sandboxing
    "chokidar": "^4.0.0"        // File watching for hot reload
  },
  "devDependencies": {
    "@types/isolated-vm": "^5.0.0"
  }
}
```

### Why isolated-vm?

- ✅ True sandboxing (separate V8 isolate)
- ✅ Memory limits enforced
- ✅ TypeScript support
- ✅ Near-native performance
- ✅ Direct object passing (no serialization)
- ✅ Active maintenance

**Alternatives considered:**
- `vm2`: Less secure, deprecated
- `IronPython`: Different language, binding overhead
- `QuickJS`: Good but C++ binding complexity

---

## Security & Safety

### Script Sandbox Restrictions

**What scripts CAN do:**
- ✅ Read game state (via safe views)
- ✅ Call CardContext API methods
- ✅ Perform calculations
- ✅ Use standard JS features (map, filter, etc.)

**What scripts CANNOT do:**
- ❌ Access Node.js APIs (fs, http, etc.)
- ❌ Mutate game state directly
- ❌ Access other cards' scripts
- ❌ Run forever (timeout enforced)
- ❌ Use infinite memory (limit enforced)
- ❌ Crash the game engine

### Timeout Protection

```typescript
await Promise.race([
  script.onAttacks(context),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Script timeout')), 5000)
  )
]);
```

**Default timeout:** 5 seconds per script method

### Memory Limits

```typescript
new ivm.Isolate({ memoryLimit: 128 }); // 128MB per isolate
```

**Each script gets:** 128MB max (shared across all methods)

---

## Migration Path

### Phase 1: Implement Scripting (Phase 0)
- Build scripting infrastructure
- Create 10 example cards
- Test and validate

### Phase 2: Convert Existing Abilities (Optional)
- Migrate hardcoded abilities to scripts
- One system at a time (can run in parallel)
- Keep existing code as fallback

### Phase 3: New Cards (All Future Development)
- All new cards use scripts
- Designer-led card creation
- Engineer review for complex cards

### Phase 4: Full Migration (Long-term)
- All cards in script format
- Remove old ability code
- Simplified engine

---

## Performance Considerations

### Overhead Analysis

**Script Execution Overhead:**
- Load from cache: < 0.1ms
- Context creation: ~ 0.2ms
- Script execution: ~ 0.5ms (simple card)
- Script execution: ~ 2-3ms (complex card like Yasuo)
- **Total:** < 5ms per card ability trigger

**For 10 cards triggering simultaneously:**
- Total: < 50ms
- Acceptable for turn-based game (no real-time combat)

### Optimization Strategies

1. **Script Caching**
   - Compile once, execute many times
   - Cache invalidation only on file change

2. **Context Pooling**
   - Reuse CardContext objects
   - Reduce GC pressure

3. **Lazy Loading**
   - Load scripts on first use
   - Not all 500 cards loaded at startup

4. **Precompilation** (Production)
   - Compile all scripts at build time
   - Zero compilation overhead at runtime

---

## Future Enhancements

### Phase 0.5: Visual Script Editor (Future)
- Web UI for creating simple scripts
- Drag-drop for common patterns
- Generates TypeScript code
- Targets non-technical designers

### Phase 0.6: Script Testing Framework (Future)
- Unit test each card script in isolation
- Mock game states for testing
- Regression test suite for all cards
- CI/CD integration

### Phase 0.7: Script Analytics (Future)
- Track which cards/abilities trigger most
- Performance profiling per script
- Balance data collection
- Meta analysis from script execution

---

## Conclusion

**The Card Scripting System provides:**

✅ **Flexibility** - Simple and complex cards use same approach
✅ **Scalability** - Proven to 500+ cards in production games
✅ **Type Safety** - TypeScript with autocomplete and compile-time checks
✅ **Hot Reload** - Instant iteration without server restart
✅ **Uniformity** - One pattern for all cards
✅ **Security** - Sandboxed execution can't crash engine
✅ **Performance** - < 5ms overhead acceptable for TCG

**Industry validation:**
- Legends of Runeterra (Riot) - Python scripts
- Hearthstone (Blizzard) - Internal DSL
- MTG Arena (Wizards) - Similar approach

**Recommended Next Steps:**
1. Implement Phase 0 (3 days)
2. Create 10 example cards
3. Validate with integration tests
4. Proceed to Phase 5 (Persistence) with simplified DB schema

---

*Last Updated: 2025-10-01*
*Status: Architecture Approved - Ready for Implementation*
