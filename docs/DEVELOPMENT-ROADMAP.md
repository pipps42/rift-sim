# Riftbound Simulator - Development Roadmap

## 📊 Status Overview (Updated 2025-01-10)

**Project Completion:** ~70% of core engine implemented, **30% integration remaining**

### ✅ Completed & Tested
- **Phase 0**: V2 Card Scripting System (87% test coverage)
- **Phase 0.5**: V3 GameAction System ⭐ (98.8% test coverage)
- **Phase 1**: Core Engine Foundation (Managers, Types, Game State)
- **Phase 2**: Rule Engine & Validation (DeckValidator)
- **Phase 3**: Combat & Battlefield System (Managers implemented)
- **Phase 4**: Effect & Ability System (via V3 Modifiers/Triggers)
- **Phase 5.1**: Database Schema (Prisma + PostgreSQL)

### 🚧 Critical Gaps Identified
- **Player Actions Layer**: GameManager missing playCard(), activateAbility(), etc.
- **Runtime Integration**: CardScriptRuntime not called by managers
- **Chain Integration**: ChainSystem not populated with sourceCard
- **Combat Triggers**: CombatManager not triggering OnCombatStartTrigger
- **processDeaths Integration**: V3 cleanup not calling onDeath hooks

### ❌ Not Started
- Phase 5.2-5.4: WebSocket, State Persistence, Replay
- Phase 6: REST API & Controllers
- Phase 7: AI, Analytics, Meta
- Phase 8: Optimization & Polish

---

## 🎯 Current Priority: Integration Layer (Phase 5.5)

**Goal**: Connect all tested systems into a working game loop.

### What Works Today
- V3 GameAction System executes actions perfectly in isolation
- CardScriptRuntime executes card scripts perfectly in isolation
- Managers handle lifecycle and resources correctly
- Database stores/retrieves cards correctly

### What Doesn't Work
**The systems don't talk to each other!**

Example: When a player plays Yasuo:
1. ❌ GameManager has no `playCard()` method
2. ❌ Nobody calls CardScriptRuntime to execute Yasuo's script
3. ❌ Combat doesn't trigger Yasuo's "when I attack" ability
4. ❌ processDeaths doesn't call Yasuo's onDeath hook

---

## 📋 Phase 5.5: Integration Layer (NEW)

**Estimated Effort:** 5-6 days
**Priority:** CRITICAL
**Status:** Not Started

### Task 1: Player Actions Implementation (2 days)

Implement in `GameManager`:

```typescript
// Player input → Game state mutations
async playCard(gameId, playerId, cardId, targets?): Promise<ActionResult>
async standardMove(gameId, playerId, unitId, toBattlefield): Promise<ActionResult>
async hideCard(gameId, playerId, cardId, battlefieldId): Promise<ActionResult>
async activateAbility(gameId, playerId, abilityId, targets?): Promise<ActionResult>
async passPriority(gameId, playerId): Promise<ActionResult>
```

**Deliverables:**
- Validation (can player act? sufficient resources?)
- Cost payment via RunePoolManager
- Action execution via appropriate manager
- Integration with CardScriptRuntime for script execution
- Tests for each action type

**Blockers:** None

### Task 2: CardScriptRuntime Integration (1 day)

Connect CardScriptRuntime to game lifecycle:

**TurnManager Integration:**
- Call `scriptRuntime.executeHook('onPhaseChange')` during phase transitions
- Call `scriptRuntime.executeHook('onTurnStart')` at turn beginning
- Call `scriptRuntime.executeHook('onTurnEnd')` at turn end

**GameManager Integration:**
- Instantiate CardScriptRuntime in constructor
- Call `scriptRuntime.executeHook('onPlay')` when card is played
- Call `scriptRuntime.executeHook('onEntersPlay')` when permanent enters battlefield

**ActionExecutor Integration:**
- Call `scriptRuntime.executeHook('onDeath')` in processDeaths cleanup
- Integrate with V3 triggers for automatic hook calling

**Deliverables:**
- CardScriptRuntime instance in GameManager
- Hook calls in all appropriate places
- Integration tests proving cards execute

**Dependencies:** Task 1 (playCard must exist to test onPlay)

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

### CleanupSystem → REMOVED
**Reason**: V3 ActionExecutor Phase 7 handles all cleanup.
**Migration**: Any cleanup logic → move to V3 ActionExecutor hooks
**Status**: Mark for deletion after Task 5 complete

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
| V3 GameAction | ✅ 100% | ✅ 98.8% | ❌ 30% | Works in isolation |
| V2 Card Scripts | ✅ 100% | ✅ 87% | ❌ 10% | Never called by managers |
| GameManager | ✅ 60% | ⚠️ 40% | ❌ 0% | Missing playCard/actions |
| TurnManager | ✅ 80% | ⚠️ 50% | ❌ 20% | Doesn't call card hooks |
| BattlefieldManager | ✅ 70% | ⚠️ 40% | ❌ 30% | No script integration |
| CombatManager | ✅ 60% | ⚠️ 30% | ❌ 0% | Doesn't trigger V3 |
| ChainSystem | ✅ 40% | ❌ 10% | ❌ 0% | Not populating sourceCard |
| RunePoolManager | ✅ 100% | ✅ 80% | ✅ 90% | Works well |
| ScoringManager | ✅ 100% | ✅ 70% | ✅ 80% | Works well |

### Feature Completeness

| Feature | Status | Blocker |
|---------|--------|---------|
| Setup & Mulligan | ✅ Done | - |
| Channel Runes | ✅ Done | - |
| Play Card | ❌ Missing | Task 1 |
| Card Scripts Execute | ❌ Missing | Task 2 |
| Move Units | ⚠️ Partial | Task 1 |
| Combat | ⚠️ Partial | Task 4 |
| Spell Chain | ❌ Missing | Task 3 |
| Counter Spells | ❌ Missing | Task 3 |
| Death Triggers | ❌ Missing | Task 5 |
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

1. ✅ Player can play a card and its script executes
2. ✅ Unit enters battlefield and onEntersPlay triggers
3. ✅ Unit attacks and OnCombatStartTrigger fires (Yasuo works)
4. ✅ Unit dies and onDeath executes
5. ✅ Spell goes on chain with sourceCard
6. ✅ Counter spell (Defy) can target and counter chain spell
7. ✅ Full game can be played from setup to victory
8. ✅ All integration tests pass

**Ready for Phase 6 when all 8 criteria met.**

---

## 📚 Related Documentation

- [ENGINE-ARCHITECTURE.md](./ENGINE-ARCHITECTURE.md) - Complete architecture overview
- [GAMEACTION-SYSTEM-DESIGN.md](./GAMEACTION-SYSTEM-DESIGN.md) - V3 system deep dive
- [V3-CARD-SCRIPTING-GUIDE.md](./V3-CARD-SCRIPTING-GUIDE.md) - How to write V3 card scripts
- [TESTING-ROADMAP-UPDATED.md](./TESTING-ROADMAP-UPDATED.md) - Test coverage status
- [RULES.md](./RULES.md) - Complete game rules
- [KEYWORDS.md](./KEYWORDS.md) - Card keyword reference

---

**Last Updated:** 2025-01-10
**Next Review:** After Phase 5.5 Task 1 completion
