# Riftbound Simulator - Development Roadmap

## 📊 Status Overview (Updated 2025-01-24)

**Project Completion:** ~80% of core engine implemented, **20% integration remaining**

### ✅ Completed & Tested
- **Phase 0**: V2 Card Scripting System (87% test coverage)
- **Phase 0.5**: V3 GameAction System ⭐ (98.8% test coverage, **22 actions** implemented)
- **Phase 1**: Core Engine Foundation (Managers, Types, Game State)
- **Phase 2**: Rule Engine & Validation (DeckValidator)
- **Phase 3**: Combat & Battlefield System (Managers implemented)
- **Phase 4**: Effect & Ability System (via V3 Modifiers/Triggers)
- **Phase 5.1**: Database Schema (Prisma + PostgreSQL)
- **Phase 5.5 (Partial)**: CardStateScanner ⭐ (100% implemented, integrated in GameManager)
- **Task 1**: Player Actions ✅ **100% COMPLETE** (playCard, standardMove, hideCard, passPriority)
- **Task 2**: TurnManager V3 Integration ✅ (100% complete, CleanupSystem removed, all timers removed)

### ✅ Recent Completions (2025-01-24)
- **GameManager.playCard()**: Refactored to delegate to PlayCardAction (V3)
- **GameManager.standardMove()**: Refactored to delegate to MoveUnitAction (V3) ⭐ NEW
- **GameManager.hideCard()**: Refactored to delegate to HideCardAction (V3) ⭐ NEW
- **GameManager.passPriority()**: Integrated with TurnManager.executeActionPhaseAction() ⭐ NEW
- **TurnManager**: Complete V3 migration, removed all `setTimeout()`, made synchronous
- **New V3 Actions**: SpendEnergyAction, SpendPowerAction, ReadyAllCardsAction, RemoveAllDamageAction
- **MoveUnitAction**: Fixed to use correct Player structure (player.zones.base)
- **HideCardAction**: Enhanced validation per game rules (HIDDEN keyword, battlefield control, max 1 per battlefield)
- **CleanupSystem**: Completely removed, replaced with V3 ActionExecutor
- **System Architecture**: Now fully deterministic and multiplayer-ready (no timers)

### 🚧 Critical Gaps Remaining
- **Chain Integration**: ChainSystem not populating sourceCard when spells played
- **Combat Triggers**: CombatManager not using V3 DealDamageAction or triggering combat triggers
- **processDeaths Integration**: V3 cleanup not calling onDeath hooks via CardScriptRuntime

### ❌ Not Started
- Phase 5.2-5.4: WebSocket, State Persistence, Replay
- Phase 6: REST API & Controllers
- Phase 7: AI, Analytics, Meta
- Phase 8: Optimization & Polish

---

## 🎯 Current Priority: Integration Layer (Phase 5.5)

**Goal**: Connect all tested systems into a working game loop.

### What Works Today
- V3 GameAction System executes actions perfectly in isolation (18 actions)
- CardScriptRuntime executes card scripts perfectly in isolation
- Managers handle lifecycle and resources correctly
- Database stores/retrieves cards correctly
- **CardStateScanner** ⭐ provides UI with playable cards and activatable abilities
- GameManager query methods (`getPlayableCards`, `getActivatableCards`) work
- `activateAbility()` partially works (70% - missing CardContext building)

### What Doesn't Work
**The player action layer is missing!**

Example: When a player wants to play Yasuo:
1. ❌ GameManager has no `playCard()` method to handle the request
2. ❌ No integration calls CardScriptRuntime to execute Yasuo's onPlay script
3. ❌ CombatManager doesn't trigger Yasuo's "when I attack" ability
4. ❌ processDeaths doesn't call Yasuo's onDeath hook

---

## 📋 Phase 5.5: Integration Layer (NEW)

**Estimated Effort:** 5-6 days
**Priority:** CRITICAL
**Status:** In Progress (CardStateScanner DONE, Player Actions TODO)

### ✅ Completed
- **CardStateScanner System** (100%) - Provides UI with playable cards & activatable abilities
- **GameManager Query Methods** - `getPlayableCards()`, `getActivatableCards()`, `activateAbility()` (70%)

### ✅ Manager Integration Status

| Manager | V3 Actions | V2 Scripts | Status |
|---------|-----------|------------|--------|
| **GameManager** | ✅ Complete | ✅ Complete | ✅ All player actions (playCard, standardMove, hideCard, passPriority) delegate to V3 |
| **TurnManager** | ✅ Complete | ✅ Complete | ✅ 100% V3 integrated, CleanupSystem removed, synchronous, all hooks called |
| **CombatManager** | ❌ None | ❌ Partial | ❌ No V3 DealDamageAction, no combat triggers, damage mutations direct |
| **BattlefieldManager** | ✅ OK | ✅ OK | ✅ Delegates to GameManager (which uses V3 MoveUnitAction) |
| **ChainSystem** | ❌ None | ❌ None | ❌ sourceCard not populated, no spell script execution |
| **RunePoolManager** | ✅ OK | N/A | ✅ Direct state mutations - acceptable for resources |
| **ScoringManager** | ✅ OK | N/A | ✅ Direct state mutations - acceptable |
| **PriorityManager** | ✅ OK | N/A | ✅ Pure state management - acceptable |

### Task 1: Player Actions Implementation (✅ 100% COMPLETE)

**Status:** All player actions implemented and tested ✅

Implemented in `GameManager`:

```typescript
// ✅ ALL DONE
async playCard(gameId, playerId, cardId, targets?): Promise<ActionResult>
async standardMove(gameId, playerId, unitId, toBattlefield): Promise<ActionResult>
async hideCard(gameId, playerId, cardId, battlefieldId): Promise<ActionResult>
async passPriority(gameId, playerId): Promise<ActionResult>

// ⚠️ PARTIAL (70% done, needs CardContext building)
async activateAbility(gameId, playerId, abilityId, targets?): Promise<ActionResult>
```

**Completed:**
- ✅ `playCard()` fully functional with V3 PlayCardAction delegation
- ✅ `standardMove()` delegates to MoveUnitAction, validates turn & unit type, calls onMove hooks
- ✅ `hideCard()` delegates to HideCardAction, pays costs via V3, validates HIDDEN keyword & battlefield control
- ✅ `passPriority()` integrates with TurnManager.executeActionPhaseAction(), auto-assigns priority if needed
- ✅ Cost payment via V3 SpendEnergy/SpendPower actions
- ✅ Card script execution via CardScriptRuntime
- ✅ Zone movement via V3 actions
- ✅ TurnManager lifecycle integrated (instantiated in createGame, cleaned in endGame)
- ✅ Full test coverage for all actions (8/8 standardMove & passPriority tests passing)

**Blockers:** None - Task 1 Complete!

### Task 2: CardScriptRuntime Integration (✅ COMPLETE)

**Status:** 100% complete for TurnManager and GameManager

**TurnManager Integration:** ✅ Complete
- ✅ Calls `scriptRuntime.executeHook('onPhaseChange')` during phase transitions
- ✅ Calls `scriptRuntime.executeHook('onTurnStart')` at turn beginning
- ✅ Calls `scriptRuntime.executeHook('onTurnEnd')` at turn end
- ✅ Removed all `setTimeout()` - system now synchronous
- ✅ Removed CleanupSystem completely - uses V3 ActionExecutor
- ✅ All tests passing (15/15)

**GameManager Integration:** ✅ Complete
- ✅ CardScriptRuntime instantiated in constructor
- ✅ Calls `scriptRuntime.executeHook('onPlay')` when card is played
- ✅ Calls `scriptRuntime.executeHook('onEntersPlay')` for permanents
- ✅ Delegates to PlayCardAction for zone movement
- ✅ All tests passing (37/37)

**V3 Actions Created:**
- ✅ SpendEnergyAction - pays energy costs
- ✅ SpendPowerAction - pays power costs
- ✅ ReadyAllCardsAction - Awaken Phase
- ✅ RemoveAllDamageAction - Expiration Phase + post-combat

**ActionExecutor Integration:** ⚠️ Partial
- ✅ processDeaths called in TurnManager
- ❌ onDeath hooks not yet executed in processDeaths
- ❌ V3 triggers not yet auto-calling hooks

**Architecture Improvements:**
- ✅ **Deterministic**: No timers, fully synchronous
- ✅ **Multiplayer-ready**: External control of phase advancement
- ✅ **Testable**: No fake timers needed
- ✅ **Clean**: Zero backward compatibility code

**Next:** Finish processDeaths integration (Task 5)

### Task 3: Chain System Integration (1 day)

Make ChainSystem functional:

**When playing spells:**
- Create ChainItem with `sourceCard` reference (for counter spells like Defy)
- Add to `game.chain`
- Resolve LIFO with priority windows

**When resolving:**
- Pop from chain
- Execute spell's onResolve hook via CardScriptRuntime
- Handle counter spells (remove from chain without resolving)

**Priority System:**
- Implement basic priority passing
- REACTION spells can be played during priority windows
- ACTION spells only during own Action Phase

**Deliverables:**
- ChainItem.sourceCard populated
- Spell resolution via CardScriptRuntime
- Defy can counter spells on the chain
- Priority passing mechanism

**Dependencies:** Task 1 (playCard), Task 2 (CardScriptRuntime integration)

### Task 4: Combat Triggers Integration (1 day)

Connect CombatManager to V3 Triggers:

**In CombatManager.startShowdown():**
- Create CombatStartData for each attacking unit
- Call `triggerRegistry.trigger('combat_start', combatData)`
- V3 Triggers execute (Yasuo's "when I attack" fires)
- Apply Assault/Shield bonuses via DamageModifiers
- Calculate and apply combat damage via DealDamageAction

**Deliverables:**
- OnCombatStartTrigger fires for attacking/defending units
- Yasuo triggers correctly
- Combat damage uses V3 pipeline (modifiers apply)

**Dependencies:** Task 2 (CardScriptRuntime must register triggers)

### Task 5: processDeaths Integration (0.5 days)

Ensure dead units trigger onDeath hooks:

**In ActionExecutor Phase 7 Cleanup:**
- Identify units with damage >= might
- For each dead unit:
  - Call `scriptRuntime.executeHook(unit, 'onDeath')`
  - Move to trash zone
  - Emit UNIT_DIED event

**Deliverables:**
- Dead units execute onDeath scripts
- Cards that trigger on ally/enemy death work
- Death processing is atomic (all deaths resolve before triggers)

**Dependencies:** Task 2 (CardScriptRuntime integration)

### Task 6: End-to-End Testing (1 day)

Full game simulation from setup to victory:

**Test Scenarios:**
1. Setup game, mulligan, first turn
2. Channel runes, play unit (onPlay executes)
3. Move unit to battlefield (onEntersPlay executes)
4. Attack with Yasuo (onAttack trigger fires, deals damage)
5. Unit dies from combat (onDeath executes)
6. Play Defy to counter opponent's spell (chain integration)
7. Score points, win game

**Deliverables:**
- Integration test suite covering full game
- Documentation of any issues found
- Performance baseline (actions/second)

**Dependencies:** Tasks 1-5 complete

---

## 🗑️ Deprecated Systems

### EffectSystem → REMOVED
**Reason**: V3 ModifierRegistry does everything better.
**Migration**: Any remaining EffectSystem usage → use V3 Modifiers
**Status**: Mark for deletion after Task 2 complete

### CleanupSystem → ✅ DELETED
**Reason**: V3 ActionExecutor Phase 7 handles all cleanup.
**Migration**: All cleanup logic moved to V3 ActionExecutor
**Status**: ✅ Completely removed from TurnManager (2025-01-24)

### EventBus → KEEP (Redefined Role)
**Old Role**: Game logic events (damage dealt, unit died, etc.)
**New Role**: Cross-layer communication (UI notifications, analytics, logging)
**V3 Alternative**: V3 Triggers handle game logic reactions
**Status**: Keep but reduce scope - use for non-game-logic events only

---

## 📈 Progress Tracking

### Core Systems Status

| System | Implementation | Testing | Integration | Notes |
|--------|---------------|---------|-------------|-------|
| V3 GameAction | ✅ 100% | ✅ 98.8% | ✅ 85% | 22 actions, fully integrated in GM/TM |
| V2 Card Scripts | ✅ 100% | ✅ 87% | ✅ 80% | Called by GameManager & TurnManager |
| GameManager | ✅ 100% | ✅ 100% | ✅ 100% | ✅ All player actions complete |
| TurnManager | ✅ 100% | ✅ 100% | ✅ 100% | ✅ Fully V3 integrated, synchronous |
| BattlefieldManager | ✅ 100% | ⚠️ 40% | ✅ 100% | ✅ Delegates to GameManager (V3) |
| CombatManager | ✅ 60% | ⚠️ 30% | ❌ 0% | ❌ Doesn't use V3 DealDamageAction |
| ChainSystem | ✅ 40% | ❌ 10% | ❌ 0% | ❌ Not populating sourceCard |
| RunePoolManager | ✅ 100% | ✅ 80% | ✅ 90% | ✅ Works well |
| ScoringManager | ✅ 100% | ✅ 70% | ✅ 80% | ✅ Works well |

### Feature Completeness

| Feature | Status | Blocker |
|---------|--------|---------|
| Setup & Mulligan | ✅ Done | - |
| Channel Runes | ✅ Done | - |
| Play Card | ✅ Done | - |
| Card Scripts Execute | ✅ Done | - |
| Move Units | ✅ Done | - |
| Hide Cards | ✅ Done | - |
| Pass Priority | ✅ Done | - |
| Combat | ⚠️ Partial | CombatManager V3 integration needed |
| Spell Chain | ❌ Missing | ChainSystem sourceCard population needed |
| Counter Spells | ❌ Missing | ChainSystem integration needed |
| Death Triggers | ⚠️ Partial | processDeaths exists, onDeath hooks missing |
| Scoring & Victory | ✅ Done | - |

---

## 🚀 Next Steps After Phase 5.5

### Phase 6: API & Multiplayer (3-4 weeks)
- REST API controllers (Express + TypeScript)
- WebSocket for real-time game updates
- Authentication & authorization
- Game session management (Redis)
- Matchmaking system

### Phase 7: Advanced Features (4-6 weeks)
- AI opponents (basic rule-based AI)
- Replay system (use game history)
- Meta analytics (deck win rates, card usage)
- Admin panel for card management

### Phase 8: Polish & Optimization (2-3 weeks)
- Performance optimization
- Error handling & recovery
- Logging & monitoring
- Documentation completion

---

## 📝 Notes

### Architecture Decisions Made

1. **V3 is the future**: All new code uses V3 GameAction pipeline
2. **V2 Scripts are stable**: Keep V2 runtime, integrate with V3
3. **EventBus keeps narrow role**: Infrastructure events only, not game logic
4. **Modifiers > Effects**: V3 Modifiers replace old EffectSystem
5. **Triggers > Manual listeners**: V3 Triggers replace manual event listeners

### Known Technical Debt

1. **Type hierarchy**: GameCard.might optional - consider discriminated union in future
2. **CombatStartData.opposingPlayerId**: Potentially ambiguous, cards should use ctx.opponent
3. **Token generation**: EffectSystem.createToken needs migration to V3
4. **Keyword automation**: Keywords (Assault, Shield) should auto-register modifiers

### Performance Targets

- **Action execution**: < 10ms per action
- **Card script execution**: < 5ms per script
- **Full turn simulation**: < 100ms
- **Game setup**: < 500ms

---

## 🎯 Success Criteria

Phase 5.5 is complete when:

1. ✅ Player can play a card and its script executes ✅ DONE
2. ✅ Unit enters battlefield and onEntersPlay triggers ✅ DONE (via standardMove)
3. ❌ Unit attacks and OnCombatStartTrigger fires (Yasuo works) - CombatManager V3 needed
4. ❌ Unit dies and onDeath executes - processDeaths hooks needed
5. ❌ Spell goes on chain with sourceCard - ChainSystem integration needed
6. ❌ Counter spell (Defy) can target and counter chain spell - ChainSystem integration needed
7. ⚠️ Full game can be played from setup to victory - Partial (missing combat triggers & death hooks)
8. ⚠️ All integration tests pass - Partial (player actions ✅, combat/chain ❌)

**Progress: 2/8 complete, 2 in progress**

**Next Priority:** CombatManager V3 integration OR ChainSystem integration

---

## 📚 Related Documentation

- [ENGINE-ARCHITECTURE.md](./ENGINE-ARCHITECTURE.md) - Complete architecture overview
- [GAMEACTION-SYSTEM-DESIGN.md](./GAMEACTION-SYSTEM-DESIGN.md) - V3 system deep dive
- [V3-CARD-SCRIPTING-GUIDE.md](./V3-CARD-SCRIPTING-GUIDE.md) - How to write V3 card scripts
- [TESTING-ROADMAP-UPDATED.md](./TESTING-ROADMAP-UPDATED.md) - Test coverage status
- [RULES.md](./RULES.md) - Complete game rules
- [KEYWORDS.md](./KEYWORDS.md) - Card keyword reference

---

**Last Updated:** 2025-01-24
**Next Review:** After completing CombatManager or ChainSystem V3 integration

---

## 🎯 Current Priority: Combat or Chain System Integration

### Option A: CombatManager V3 Integration (Task 4)

**What it enables:**
- Combat damage uses V3 DealDamageAction (modifiers apply automatically)
- OnCombatStartTrigger fires for attacking/defending units
- Yasuo and other "when I attack" cards work correctly
- Success Criteria #3 ✅

**Estimated Time:** 1-2 days

**Files to modify:**
- `src/engine/systems/CombatManager.ts`
- Create combat-related V3 triggers if needed

### Option B: ChainSystem V3 Integration (Task 3)

**What it enables:**
- Spells create ChainItems with sourceCard reference
- Spell scripts execute via CardScriptRuntime
- Counter spells (Defy) can target and counter chain spells
- REACTION spells work during priority windows
- Success Criteria #5 & #6 ✅

**Estimated Time:** 1-2 days

**Files to modify:**
- `src/engine/systems/ChainSystem.ts`
- `src/engine/managers/GameManager.ts` (playCard for spells)
- Create spell resolution hooks

**Recommendation:** Choose CombatManager first for a more complete game loop (combat is core to TCG gameplay).
