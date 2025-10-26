# Testing Roadmap - Riftbound Simulator

**Version:** 3.0
**Last Updated:** 2025-01-26
**Status:** ✅ V3 GameAction System COMPLETED (98.8%) | ✅ CombatManager V3 Integration (100%) | ✅ ChainSystem V3 Integration (100%)

---

## 📊 Progress Summary

**Current Status:**
- ✅ T1.1 Database Setup - COMPLETED (100%)
- ✅ T1.2 Card Scripting V2 (Direct Execution) - OPERATIONAL & INTEGRATED
- ✅ T1.3 Core Engine - COMPLETED (100%)
- ✅ T2.1 CardFactory - COMPLETED (100%)
- ✅ T3.1 V3 GameAction Core - COMPLETED ⭐ (98.8%, 22 actions)
- ✅ T3.2 CardStateScanner - COMPLETED ⭐ (100%, integrated in GameManager)
- ✅ T3.3 CombatManager V3 Integration - COMPLETED ⭐ (100%, 4/4 tests)
- ✅ T3.4 ChainSystem V3 Integration - COMPLETED ⭐ (100%, 7/7 tests)
- **Overall: 280+ tests passing (~96%)**

**✅ Current Architecture:**
- **V2 Card Scripting**: Direct execution in Node.js process, integrated with all managers
- **V3 GameAction System**: Declarative action pipeline for all state mutations
- **CardStateScanner**: Push-based UI state scanner
- **CombatManager**: V3 integrated with DealDamageAction, StartCombatAction, OnCombatStartTrigger
- **ChainSystem**: V3 integrated with CardScriptRuntime for spell resolution

**Test Breakdown:**
- CardScriptRuntime (V2): Tests passing
- CardScriptLoader: Tests passing
- EventBus: 11/11 ✅ (100%)
- GameManager: 37/37 ✅ (100%) - Updated with player actions
- TurnManager: 15/15 ✅ (100%) - V3 integrated, synchronous
- CombatManager (Legacy): 10/10 ✅ (100%)
- **CombatIntegration (V3)**: 4/4 ✅ (100%)** ⭐ NEW
- **ChainIntegration (V3)**: 7/7 ✅ (100%)** ⭐ NEW
- Integration: 3/3 ✅ (100%)
- CardFactory: 13/13 ✅ (100%)
- CardHookExecution: 8/8 ✅ (100%) - scripts execute and affect state
- **V3 ActionExecutor: 15/16 ✅ (93.8% - 1 skipped)** ⭐
- **V3 ConcreteActions: 23/23 ✅ (100%)** ⭐
- **V3 ConcreteModifiers: 24/24 ✅ (100%)** ⭐
- **V3 ConcreteTriggers: 21/21 ✅ (100%)** ⭐

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

### T1.2: Card Scripting System V2 ✅ OPERATIONAL & INTEGRATED

**Status:** ✅ Fully integrated with all managers
**Implementation:** `src/engine/scripting/CardScriptRuntime.ts`

**Architecture:**
- Scripts execute directly in Node.js process
- CardContext provides direct Game reference + V3 APIs
- No serialization overhead
- Simpler error handling

**Key Features:**
- ✅ Hook execution (onPlay, onDeath, onAttack, onMove, etc.)
- ✅ V3 API integration (`ctx.actions.*`, `ctx.modifiers.*`, `ctx.triggers.*`)
- ✅ CardScriptLoader with hot-reload support
- ✅ TypeScript card scripts loaded dynamically

**Test Files:**
- `BasicFunctionality.test.ts` - Core runtime tests
- `MigratedCards.test.ts` - Card script execution
- `StorageIntegration.test.ts` - CardStorage system

**Integration Status:**
- ✅ CardScriptRuntime instantiated in GameManager & TurnManager
- ✅ Called by GameManager (onPlay, onEntersPlay, onMove, onDeath)
- ✅ Called by TurnManager (onPhaseChange, onTurnStart, onTurnEnd)
- ✅ Called by ChainSystem (onPlay for spells)
- ✅ Called by CombatManager (onAttack via StartCombatAction → OnCombatStartTrigger)

---

### T1.3: Core Engine Tests ✅ COMPLETED (100%)
**Completato:** 2025-01-26

**Test Suite Results:**
- ✅ EventBus.test.ts - 11/11 tests (100%)
- ✅ ChainSystem.test.ts - 8/8 tests (100%)
- ✅ GameManager.test.ts - 37/37 tests (100%) - Includes player actions
- ✅ TurnManager.test.ts - 15/15 tests (100%) - V3 integrated, synchronous
- ✅ CombatManager.test.ts - 10/10 tests (100%)
- ✅ **CombatIntegration.test.ts** - 4/4 tests (100%) ⭐ NEW
- ✅ **ChainIntegration.test.ts** - 7/7 tests (100%) ⭐ NEW
- ✅ integration.test.ts - 3/3 tests (100%)

**Critical Achievements:**
- ✅ **Jest + uuid configuration RESOLVED** - Created mock uuid module
- ✅ jest.config.cjs with proper moduleNameMapper
- ✅ **TurnManager async issues RESOLVED** - Removed setTimeout, fully synchronous
- ✅ **CombatManager V3 Integration** - DealDamageAction, StartCombatAction
- ✅ **ChainSystem V3 Integration** - Spell resolution via CardScriptRuntime
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

### T3.3: CombatManager V3 Integration ✅ COMPLETED (100%)

**Status:** 4/4 tests passing
**Completion Date:** 2025-01-26

**Implemented:**
- ✅ DealDamageAction for combat damage (replaces direct mutations)
- ✅ StartCombatAction to announce combat start
- ✅ OnCombatStartTrigger fires for attacking/defending units
- ✅ Assault/Shield keyword bonuses calculated via getKeywordValue()
- ✅ Overkill damage supported (units can take > might damage)
- ✅ Tank keyword priority implemented
- ✅ processDeaths called automatically after combat

**Test File:**
- `CombatIntegration.test.ts` - 4/4 ✅
  - Combat damage via V3 action pipeline
  - processDeaths integration
  - Assault bonus when attacking
  - Shield bonus when defending

**Files Modified:**
- `src/engine/systems/CombatManager.ts` - V3 integration
- `src/engine/actions/concrete/StartCombatAction.ts` - NEW
- `src/engine/managers/TurnManager.ts` - Pass ActionExecutor to CombatManager

---

### T3.4: ChainSystem V3 Integration ✅ COMPLETED (100%)

**Status:** 7/7 tests passing
**Completion Date:** 2025-01-26

**Implemented:**
- ✅ PlayCardAction creates ChainItem with sourceCard reference
- ✅ ChainItem added to game.chain (not internal array)
- ✅ LIFO resolution (last in, first out)
- ✅ Spell scripts executed via CardScriptRuntime.executeHook('onPlay')
- ✅ Spells moved to trash after resolution (even if script fails)
- ✅ Cleanup (processDeaths) called after each resolution
- ✅ Turn state management (NEUTRAL_OPEN ↔ NEUTRAL_CLOSED)
- ✅ Normal/Action/Reaction spell timing validated

**Test File:**
- `ChainIntegration.test.ts` - 7/7 ✅
  - Spell casting with PlayCardAction
  - Spell cost deduction and removal from hand
  - Chain resolution via CardScriptRuntime
  - processDeaths during cleanup
  - Error handling (spell without script)
  - LIFO resolution order

**Files Modified:**
- `src/engine/actions/concrete/PlayCardAction.ts` - Puts spells on chain
- `src/engine/systems/ChainSystem.ts` - Operates on game.chain, executes scripts
- `src/engine/managers/TurnManager.ts` - Passes CardScriptRuntime to ChainSystem
- `src/engine/managers/GameManager.ts` - Uses hasPendingChainItems(game)

---

## ✅ Integration Status - All Systems V3 Integrated!

### Manager Integration with V3 + V2

**GameManager:** ✅ COMPLETE
- ✅ V3 ActionExecutor integration
- ✅ CardScriptRuntime integration
- ✅ CardStateScanner integrated
- ✅ All player actions implemented (playCard, standardMove, hideCard, passPriority)
- ✅ processDeaths executes onDeath hooks

**TurnManager:** ✅ COMPLETE
- ✅ V3 ActionExecutor integration
- ✅ CardScriptRuntime integration (onPhaseChange, onTurnStart, onTurnEnd)
- ✅ CleanupSystem REMOVED
- ✅ Fully synchronous (no setTimeout)

**CombatManager:** ✅ COMPLETE
- ✅ V3 DealDamageAction for combat damage
- ✅ V3 StartCombatAction for combat start
- ✅ OnCombatStartTrigger for "when I attack" abilities
- ✅ CardScriptRuntime integration via triggers

**ChainSystem:** ✅ COMPLETE
- ✅ sourceCard populated when spells played
- ✅ CardScriptRuntime integration for spell resolution
- ✅ LIFO resolution with cleanup

**BattlefieldManager:** ✅ COMPLETE
- ✅ Delegates to GameManager (which uses V3 MoveUnitAction)
- ✅ CardScriptRuntime onMove hooks called by GameManager

---

## 📊 Progress Tracking

| Phase | Status | Tests | Progress |
|-------|--------|-------|----------|
| T1.1 Database | ✅ Done | 5/5 | 100% |
| T1.2 Scripting V2 | ✅ Done | - | Operational & Integrated |
| T1.3 Core Engine | ✅ Done | 95/95 | 100% |
| T2.1 CardFactory | ✅ Done | 13/13 | 100% |
| T2.2 Card Integration | ✅ Done | - | V2+V3 Working |
| T2.3 Integration | ✅ Done | - | All managers V3 integrated |
| T3.1 V3 GameAction | ✅ Done | 83/84 | 98.8% |
| T3.2 CardStateScanner | ✅ Done | - | 100% |
| T3.3 CombatManager V3 | ✅ Done | 4/4 | 100% |
| T3.4 ChainSystem V3 | ✅ Done | 7/7 | 100% |
| T4 Integration Layer | ✅ Done | - | 87.5% (7/8 success criteria) |
| T5 E2E Testing | ⚠️ Partial | - | 0% (next priority) |

**Total: 280+ tests passing (~96%)**

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
