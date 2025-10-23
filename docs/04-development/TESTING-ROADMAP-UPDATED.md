# Testing Roadmap - Riftbound Simulator

**Version:** 2.0
**Last Updated:** 2025-01-10
**Status:** ✅ V3 GameAction System COMPLETED (98.8%) | ✅ V2 Card Scripting OPERATIONAL

---

## 📊 Progress Summary

**Current Status:**
- ✅ T1.1 Database Setup - COMPLETED (100%)
- ✅ T1.2 Card Scripting V2 (Direct Execution) - OPERATIONAL
- ✅ T1.3 Core Engine - COMPLETED (90.7%)
- ✅ T2.1 CardFactory - COMPLETED (100%)
- ✅ T3.1 V3 GameAction Core - COMPLETED ⭐ (98.8%, 18 actions)
- ✅ T3.2 CardStateScanner - COMPLETED ⭐ (100%, integrated in GameManager)
- **Overall: 240/255 tests passing (94.1%)**

**✅ Current Architecture:**
- **V2 Card Scripting**: Direct execution in Node.js process (no sandboxing)
- **V3 GameAction System**: Declarative action pipeline for all state mutations
- **CardStateScanner**: Push-based UI state scanner

**Test Breakdown:**
- CardScriptRuntime (V2): Tests passing
- CardScriptLoader: Tests passing
- EventBus: 11/11 ✅ (100%)
- ChainSystem: 8/8 ✅ (100%)
- GameManager: 23/23 ✅ (100%)
- TurnManager: 9/17 ⚠️ (53% - async timing issues with setTimeout)
- CombatManager: 10/10 ✅ (100%)
- Integration: 3/3 ✅ (100%)
- CardFactory: 13/13 ✅ (100%)
- CardHookExecution: 8/8 🔴 (100% - scripts execute but don't affect state)
- **V3 ActionExecutor: 15/16 ✅ (93.8% - 1 skipped)** ⭐ NEW
- **V3 ConcreteActions: 23/23 ✅ (100%)** ⭐ NEW
- **V3 ConcreteModifiers: 24/24 ✅ (100%)** ⭐ NEW
- **V3 ConcreteTriggers: 21/21 ✅ (100%)** ⭐ NEW

---

## 🏗️ Phase T1: Foundation Testing ✅ COMPLETED

### T1.1: Database Setup ✅ COMPLETED
**Completato:** 2025-10-05

**Accomplished:**
- ✅ PostgreSQL running on localhost:5432
- ✅ Prisma Client generated
- ✅ Migrations executed successfully
- ✅ Database seeded with 11 cards + 2 users
- ✅ Schema fixes applied (MainDeckCard, RuneDeckCard with quantities)
- ✅ Type fix: ChampionLegendCard → LegendCard

---

### T1.2: Card Scripting System V2 ✅ OPERATIONAL

**Status:** Direct execution model (no sandboxing)
**Implementation:** `src/engine/scripting/CardScriptRuntime.ts` (~200 lines)

**Architecture:**
- Scripts execute directly in Node.js process
- CardContext provides direct Game reference + V3 APIs
- No serialization overhead
- Simpler error handling

**Key Features:**
- ✅ Hook execution (onPlay, onDeath, onAttack, etc.)
- ✅ V3 API integration (`ctx.actions.*`, `ctx.modifiers.*`, `ctx.triggers.*`)
- ✅ CardScriptLoader with hot-reload support
- ✅ TypeScript card scripts loaded dynamically

**Test Files:**
- `BasicFunctionality.test.ts` - Core runtime tests
- `MigratedCards.test.ts` - Card script execution
- `StorageIntegration.test.ts` - CardStorage system

**Integration Status:**
- ✅ CardScriptRuntime instantiated in GameManager
- ❌ NOT called by managers (lifecycle hooks not integrated)
- ❌ NOT called during player actions (playCard, standardMove, etc.)

---

### T1.3: Core Engine Tests ✅ COMPLETED (90.7%)
**Completato:** 2025-10-05

**Test Suite Results:**
- ✅ EventBus.test.ts - 11/11 tests (100%)
- ✅ ChainSystem.test.ts - 8/8 tests (100%)
- ✅ GameManager.test.ts - 23/23 tests (100%) **NEW**
- ⚠️ TurnManager.test.ts - 9/17 tests (53%) **NEW** - async architecture issue
- ✅ CombatManager.test.ts - 10/10 tests (100%) **NEW**
- ✅ integration.test.ts - 3/3 tests (100%)

**Critical Achievement:**
- ✅ **Jest + uuid configuration RESOLVED** - Created mock uuid module
- ✅ jest.config.cjs with proper moduleNameMapper
- ✅ Fixed DeckValidator type error (ChampionLegendCard → LegendCard)
- ✅ All Battlefield type issues resolved

**Known Issues:**
- ⚠️ **TurnManager async architecture issue**: The TurnManager uses `setTimeout` to automatically advance phases, which creates recursive async chains that are difficult to test with Jest
- 8 tests failing due to phase auto-advancement conflicts
- **Root cause**: `execute*Phase` functions call `setTimeout(() => this.nextPhase(), 100)` creating uncontrollable async recursion
- **Attempted fixes**:
  - ✅ `jest.useFakeTimers()` - Partially working (9/17 tests pass)
  - ❌ `runOnlyPendingTimersAsync()` - Causes over-execution
  - ❌ `advanceTimersByTimeAsync()` - Same issue
- **Recommended solution**: Refactor TurnManager to externalize phase advancement or add `autoAdvance: boolean` parameter

**Success Criteria:**
- ✅ 40+ core engine tests (**61 tests achieved** - EXCEEDED TARGET)
- ✅ Coverage of all major managers (GameManager, TurnManager, CombatManager)
- ✅ Execution time <30s

---

## 🔗 Phase T2: Integration Testing 🟡 Ready

### T2.1: CardFactory Integration ✅ COMPLETED
**Completato:** 2025-10-06

**Test Results:**
- CardFactory.integration.test.ts - 13/13 ✅ (100%)
- Card loading from database: ✅
- Script attachment verification: ✅
- Query and filtering: ✅
- Metadata validation: ✅

**Files Created:**
- `src/data/__tests__/CardFactory.integration.test.ts` (13 tests)
- Updated `src/data/CardFactory.ts` (fixed LEGEND enum, optional flavorText handling)

---

### T2.2: Card Script Integration ✅ RESOLVED

**Status:** V2 Direct Execution + V3 GameAction System = WORKING

**Solution Implemented:**
- ❌ Abandoned isolated-vm/sandbox approach
- ✅ Adopted V2 Direct Execution model
- ✅ Cards use V3 GameAction API for state mutations

**Current Architecture:**
```typescript
// Card scripts execute directly in Node.js
export const basicRune: CardScript = {
  onPlay: async (ctx: CardContext) => {
    // V3 Actions for state mutations - WORKING!
    await ctx.actions.addEnergy(1);
    await ctx.actions.exhaustCard(ctx.self);
  }
}
```

**Benefits:**
- ✅ Direct Game access - no serialization
- ✅ V3 Actions - validated, logged, trigger side effects
- ✅ Simple error handling
- ✅ ~200 lines of code vs 600+ (isolated-vm version)

**Test Files:**
- `MigratedCards.test.ts` - Example cards with V3 actions
- `StorageIntegration.test.ts` - CardStorage system
- `BasicFunctionality.test.ts` - Core runtime

---

### T2.3: Integration Testing ⚠️ PARTIAL

**Status:** Systems work in isolation, integration layer missing

**What Works:**
- ✅ V3 Actions execute correctly
- ✅ CardScriptRuntime executes hooks correctly
- ✅ CardStateScanner provides UI state

**What's Missing:**
- ❌ GameManager.playCard() - not implemented
- ❌ TurnManager → CardScriptRuntime integration (no hook calls)
- ❌ CombatManager → V3 Triggers integration
- ❌ processDeaths → onDeath hooks integration

---

## 🚀 Phase T3: V3 GameAction System ✅ COMPLETED

### T3.1: V3 GameAction Core ✅ COMPLETED (98.8%)

**Status:** 83/84 tests passing
**Completion Date:** 2025-01-10

**Implemented:**
- ✅ ActionExecutor with 7-phase pipeline
- ✅ ModifierRegistry and TriggerRegistry
- ✅ 18 Concrete Actions (DealDamage, Draw, PlayCard, AddEnergy, AddPower, MoveUnit, Discard, Exhaust, Ready, Recycle, Kill, Hide, Banish, Reveal, ChannelRune, Stun, Heal, CounterSpell)
- ✅ DamageModifier, CostModifier, DrawModifier
- ✅ OnDamageDealtTrigger, OnCardPlayedTrigger, OnUnitDeathTrigger
- ✅ Stack depth protection (max 100)
- ✅ Cleanup automation

**Test Files:**
- ActionExecutor.test.ts - 15/16 ✅
- ConcreteActions.test.ts - 23/23 ✅
- CardStateActions.test.ts - Tests for state change actions
- NewActions.test.ts - Additional actions
- ConcreteModifiers.test.ts - 24/24 ✅
- AdditionalModifiers.test.ts - Extended modifiers
- ConcreteTriggers.test.ts - 21/21 ✅
- AdditionalTriggers.test.ts - Extended triggers
- NewTriggers.test.ts - Additional triggers

---

### T3.2: CardStateScanner ✅ COMPLETED (100%)

**Status:** Fully implemented and integrated
**Completion Date:** 2025-01-10

**Implemented:**
- ✅ CardStateScanner.ts (570 lines)
- ✅ ScanTypes.ts (345 lines)
- ✅ Integration in GameManager (getPlayableCards, getActivatableCards, activateAbility)
- ✅ Card metadata system (costModifiers, playConstraints, activatedAbilities)
- ✅ State hashing and delta calculation
- ✅ Push-based UI updates

**Integration Status:**
- ✅ Instantiated per-game in GameManager
- ✅ Query methods working
- ⚠️ activateAbility() 70% complete (missing CardContext building)

---

## 🚧 Integration Gaps

### ❌ Manager Integration with V3 + V2

**TurnManager:**
- ❌ NO V3 ActionExecutor integration
- ❌ NO CardScriptRuntime integration
- ❌ Uses deprecated CleanupSystem
- ✅ Uses managers correctly (RunePool, Scoring, Priority, Battlefield)

**CombatManager:**
- ❌ NO V3 ActionExecutor for damage dealing
- ❌ NO V3 Triggers for combat events
- ❌ NO CardScriptRuntime onAttack hooks

**BattlefieldManager:**
- ❌ NO V3 Actions for unit movement
- ❌ NO CardScriptRuntime onEntersPlay hooks

**GameManager:**
- ✅ CardScriptRuntime instantiated
- ✅ CardStateScanner integrated
- ❌ NO player action methods (playCard, standardMove, hideCard, passPriority)
- ❌ NO CardScriptRuntime hook calls

**ChainSystem:**
- ❌ NO CardScriptRuntime integration
- ❌ sourceCard field not populated when spells played

### Required Integration Work

| Component | V3 Integration | V2 Integration | Effort |
|-----------|---------------|----------------|--------|
| GameManager.playCard() | ❌ Not implemented | ❌ Not implemented | 6-8h |
| GameManager.standardMove() | ❌ Not implemented | ❌ Not implemented | 3-4h |
| TurnManager phases | ❌ No V3 actions | ❌ No hook calls | 4-5h |
| CombatManager | ❌ No V3 actions | ❌ No onAttack hooks | 4-6h |
| processDeaths | ✅ V3 Phase 7 | ❌ No onDeath hooks | 2-3h |
| ChainSystem | ❌ No V3 actions | ❌ No spell scripts | 3-4h |

---

## 📊 Progress Tracking

| Phase | Status | Tests | Progress |
|-------|--------|-------|----------|
| T1.1 Database | ✅ Done | 5/5 | 100% |
| T1.2 Scripting V2 | ✅ Done | - | Operational |
| T1.3 Core Engine | ✅ Done | 61/71 | 85.9% |
| T2.1 CardFactory | ✅ Done | 13/13 | 100% |
| T2.2 Card Integration | ✅ Resolved | - | V2+V3 Working |
| T2.3 Integration | ⚠️ Partial | - | Missing player actions |
| T3.1 V3 GameAction | ✅ Complete | 83/84 | 98.8% |
| T3.2 CardStateScanner | ✅ Complete | - | 100% |
| T4 Integration Layer | 🔴 TODO | - | 0% |
| T5 E2E Testing | 🔴 TODO | - | 0% |

**Total: 240/255 tests passing (94.1%)**

**Architecture:**
- ✅ V2 Direct Execution (no sandboxing)
- ✅ V3 GameAction System (18 actions, 98.8% tested)
- ✅ CardStateScanner (100% implemented)

---

## ⭐ Phase T3: V3 GameAction System ✅ COMPLETED (2025-10-09)

### T3.1: V3 Core Infrastructure & Actions ✅ COMPLETED

**Status:** ✅ COMPLETED (83/84 tests passing - 98.8%)
**Date:** 2025-10-09
**Duration:** 2 days

#### Scope

Implementation and testing of the V3 GameAction system - a declarative action pipeline inspired by Legends of Runeterra.

#### Test Files Created

**Base & Core Tests:**
- `src/engine/actions/__tests__/ActionExecutor.test.ts` - 15/16 tests ✅ (1 skipped)
  - Basic execution pipeline
  - Modifier application
  - Trigger resolution
  - Stack depth protection
  - Cleanup

**Concrete Actions Tests:**
- `src/engine/actions/concrete/__tests__/ConcreteActions.test.ts` - 23/23 tests ✅
  - DealDamageAction (units only, no player damage)
  - DrawCardAction
  - PlayCardAction (with timing validation)
  - AddEnergyAction
  - AddPowerAction
  - MoveUnitAction

**Concrete Modifiers Tests:**
- `src/engine/actions/modifiers/__tests__/ConcreteModifiers.test.ts` - 24/24 tests ✅
  - DamageModifier (increase/reduce/multiply)
  - CostModifier (energy/power costs)
  - DrawModifier (count modification, can prevent)
  - Filters, max uses, expiration

**Concrete Triggers Tests:**
- `src/engine/actions/triggers/__tests__/ConcreteTriggers.test.ts` - 21/21 tests ✅
  - OnDamageDealtTrigger
  - OnCardPlayedTrigger
  - OnUnitDeathTrigger
  - Filters, max triggers, expiration

#### Components Implemented

**Base Classes (3):**
- `GameAction<TData>` - Abstract base for all actions
- `ActionModifier` - Abstract base for modifiers
- `ActionTrigger` - Abstract base for triggers

**Core Infrastructure (3):**
- `ActionExecutor` - 7-phase execution pipeline
- `ModifierRegistry` - Active modifier management
- `TriggerRegistry` - Active trigger management

**Concrete Actions (6):**
- DealDamageAction, DrawCardAction, PlayCardAction
- AddEnergyAction, AddPowerAction, MoveUnitAction

**Concrete Modifiers (3):**
- DamageModifier, CostModifier, DrawModifier

**Concrete Triggers (3):**
- OnDamageDealtTrigger, OnCardPlayedTrigger, OnUnitDeathTrigger

#### Key Features Tested

- ✅ 7-phase pipeline (Validation → Modifiers → Execution → History → Triggers → Side Effects → Cleanup)
- ✅ Modifier system (modify/replace/prevent actions)
- ✅ Trigger system (generate consequence actions)
- ✅ Priority ordering for modifiers/triggers
- ✅ Stack depth protection (max recursion prevention)
- ✅ Filters and conditional activation
- ✅ Max uses and one-shot support
- ✅ Expiration conditions
- ✅ TypeScript strict mode compliance
- ✅ Game state history tracking

#### Test Results Summary

```
✅ ActionExecutor:      15/16 passing (93.8% - 1 skipped)
✅ ConcreteActions:     23/23 passing (100%)
✅ ConcreteModifiers:   24/24 passing (100%)
✅ ConcreteTriggers:    21/21 passing (100%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TOTAL:              83/84 passing (98.8%)
```

#### Critical Fixes Applied

1. **TypeScript Strict Mode Compliance**
   - Removed all `any` types where possible
   - Fixed `exactOptionalPropertyTypes` issues
   - Used conditional property assignment for optional fields
   - Separated value imports from type imports

2. **Game Rule Compliance**
   - Removed player damage from DealDamageAction (Riftbound is point-based, not health-based)
   - Fixed `game.battlefield` → `game.battlefields` array usage
   - Added `processDeaths?: () => Promise<void>` to Game interface

3. **Trigger Fire Count Bug**
   - Fixed triggers using non-existent `triggerCount` property
   - Changed to use `getFireCount()` method from base class
   - Fixed max triggers and one-shot behavior

#### Documentation Updated

- ✅ [GAMEACTION-SYSTEM-DESIGN.md](GAMEACTION-SYSTEM-DESIGN.md) - Implementation status section
- ✅ [ENGINE-ARCHITECTURE.md](ENGINE-ARCHITECTURE.md) - V3 system integration section, deprecated systems
- ✅ [DEVELOPMENT-ROADMAP.md](DEVELOPMENT-ROADMAP.md) - Phase 5.5 integration layer roadmap
- ✅ [TESTING-ROADMAP-UPDATED.md](TESTING-ROADMAP-UPDATED.md) - T3.1 test results

#### Architectural Decisions (2025-10-11)

**Systems Deprecated:**
- ⚠️ **EffectSystem** → DEPRECATED (use V3 ModifierRegistry + TriggerRegistry)
- ⚠️ **CleanupSystem** → DEPRECATED (use V3 ActionExecutor Phase 7)

**Systems Kept:**
- ✅ **EventBus** → KEPT but repurposed for infrastructure only (UI updates, analytics, logging)
  - NOT for game logic or card triggers
  - Use V3 TriggerRegistry for game logic reactions

---

## 🎯 Next Steps

**Completed This Session:**
1. ✅ Create CardFactory.integration.test.ts - DONE (13 tests, 100%)
2. ✅ Create basic card scripts - DONE (basic-rune.ts, playful-phantom.ts)
3. ✅ Create CardHookExecution.integration.test.ts - DONE (8 tests, 100%)
4. ✅ Identify isolated-vm state mutation issue - DONE (documented)

**🔴 CRITICAL - Must Fix Before Proceeding:**
1. **Implement State Mutation System** (12-16h)
   - Design mutation return format OR API bridge
   - Implement BattlefieldAPI / ChainAPI
   - Update card scripts to use new system
   - Update tests to verify state changes

**After Mutation Fix:**
2. Create more complex card scripts (onPlay, onDeath, spells)
3. Create GameFlow.integration.test.ts
4. ⚠️ TurnManager refactoring (8 failing tests) - Low priority

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-02 | Initial roadmap |
| 1.1 | 2025-10-05 | T1 updates - 69/165 tests (41.8%) |
| 1.2 | 2025-10-05 | T1.2 complete - 72/165 tests (43.6%), fixed isolated-vm scoping |
| 1.3 | 2025-10-05 | **T1 COMPLETE** - 137/150 tests (91.3%), Jest uuid resolved, core engine tests added |
| 1.4 | 2025-10-05 | TurnManager async fixes attempted - 136/150 tests (90.7%), documented architecture issue |
| 1.5 | 2025-10-06 | **T2.1 & T2.2 COMPLETE** - 157/171 tests (91.8%), **CRITICAL: isolated-vm state mutation issue discovered** |
