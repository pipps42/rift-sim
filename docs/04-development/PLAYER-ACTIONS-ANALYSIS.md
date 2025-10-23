# Player Actions Implementation - System Analysis & Development Plan

**Date:** 2025-01-10
**Context:** Phase 5.5 Task 1 - Critical integration layer for connecting player input to game state mutations

---

## 📊 Executive Summary

### Current State
- ✅ **V3 GameAction System**: 98.8% test coverage, works perfectly in isolation
- ✅ **CardScriptRuntime**: Executes card scripts correctly in isolation
- ✅ **Managers**: Handle lifecycle and resources correctly
- ✅ **CardStateScanner**: Provides UI with playable cards and activatable abilities
- ❌ **Player Actions Layer**: **COMPLETELY MISSING** - No methods to translate player input into game mutations

### Critical Gap
**Players cannot interact with the game!** There are no methods like:
- `playCard()` - Play a card from hand
- `standardMove()` - Move unit to/from battlefield
- `hideCard()` - Place card facedown (HIDDEN keyword)
- `passPriority()` - Pass turn/priority

### Impact
Without these methods, the game engine cannot:
1. Execute card scripts when cards are played
2. Trigger onEntersPlay hooks
3. Execute combat triggers (Yasuo's "when I attack")
4. Process death triggers (onDeath hooks)
5. Resolve spell chains

---

## 🔍 System Analysis

### 1. GameManager (Current State)

**Location:** `src/engine/managers/GameManager.ts` (530 lines)

**What It Has:**
```typescript
class GameManager {
  // ✅ Lifecycle methods
  async createGame(players, decks): Promise<Game>
  async startGame(gameId): Promise<void>
  async endGame(gameId, reason, winnerId?): Promise<void>

  // ✅ Query methods
  getGame(gameId): Game | undefined
  getActiveGames(): Game[]
  getPlayerGames(playerId): Game[]

  // ✅ Scanner integration (NEW - 70% complete)
  getPlayableCards(gameId, playerId): GameCard[]
  getActivatableCards(gameId, playerId): Array<{card, abilities}>
  async activateAbility(gameId, playerId, cardInstanceId, abilityId) // PARTIAL

  // ❌ MISSING: Player action methods
  // async playCard(gameId, playerId, cardId, targets?) - DOES NOT EXIST
  // async standardMove(gameId, playerId, unitId, toBattlefield) - DOES NOT EXIST
  // async hideCard(gameId, playerId, cardId, battlefieldId) - DOES NOT EXIST
  // async passPriority(gameId, playerId) - DOES NOT EXIST
}
```

**What It Needs:**
- Player action methods that validate input → pay costs → execute action → trigger hooks
- Integration with CardScriptRuntime to execute card scripts
- Integration with V3 ActionExecutor for all state mutations
- Integration with ChainSystem for spell resolution

**Existing Strengths:**
- ✅ CardScriptRuntime instance initialized in constructor
- ✅ ModifierRegistry instance for V3 integration
- ✅ CardStateScanner per-game for UI queries
- ✅ Helper method `findCardInGame()` for card lookups
- ✅ State change notification via `onStateChanged()`

---

### 2. CardScriptRuntime (Integration Points)

**Location:** `src/engine/scripting/CardScriptRuntime.ts` (475 lines)

**Key Methods for Integration:**
```typescript
class CardScriptRuntime {
  // Execute specific hooks
  async executeHook(
    hookName: keyof CardScript,
    card: Card,
    game: Game,
    additionalContext?: Partial<CardContext>
  ): Promise<void>

  // Convenience methods
  async onPlay(card, game, targets?): Promise<void>
  async onDeath(card, game): Promise<void>
  async onTurnStart(card, game): Promise<void>
  async onTurnEnd(card, game): Promise<void>
  async onAttack(card, game, targets?): Promise<void>

  // Validation
  async canPlay(card, game): Promise<boolean>
  async canTarget(card, game, target): Promise<boolean>
}
```

**Integration Requirements:**
1. **onPlay Hook**: Must be called when `playCard()` executes
2. **onEntersPlay Hook**: Must be called when unit enters battlefield
3. **onDeath Hook**: Must be called in V3 ActionExecutor Phase 7 cleanup
4. **onAttack Hook**: Must be called by CombatManager when showdown starts
5. **Phase Hooks**: TurnManager must call onPhaseChange, onTurnStart, onTurnEnd

**Context Building:**
- Runtime builds `CardContext` with direct Game reference
- Provides V3 APIs (actions, modifiers, triggers) via `createV3APIs()`
- Finds opponent automatically for 1v1 games
- Creates temporary GameCard instances for cards not yet in game (for validation)

---

### 3. V3 ActionExecutor (Execution Pipeline)

**Location:** `src/engine/actions/ActionExecutor.ts` (389 lines)

**7-Phase Pipeline:**
```typescript
async execute(action: GameAction): Promise<ActionExecutionResult> {
  // Phase 1: Validation - Can this action be executed?
  // Phase 2: Modifier Pipeline - Apply all registered modifiers
  // Phase 3: Execution - Execute the (potentially modified) action
  // Phase 4: History Logging - Automatically log to game history
  // Phase 5: Trigger Resolution - Fire all triggered abilities
  // Phase 6: Side Effects - Execute any actions generated as side effects
  // Phase 7: Post-Resolution Cleanup - Cleanup when stack returns to 0
}
```

**Available Actions (need to verify which exist):**
```typescript
// TODO: Verify which of these are implemented in src/engine/actions/
- DealDamageAction
- HealAction
- DrawAction
- AddEnergyAction
- AddPowerAction
- MoveCardAction
- ExhaustCardAction
- ReadyCardAction
- DiscardAction
- RecycleAction
- KillAction
- HideAction
- ChannelRunesAction
- StunAction
- BanishAction
- RevealAction
- CounterSpellAction
```

**Integration Strategy:**
All state mutations MUST go through ActionExecutor, including:
- Card movement (hand → battlefield, battlefield → trash, etc.)
- Resource changes (energy, power)
- State changes (ready/exhausted)
- Damage/healing
- Death processing

---

### 4. RunePoolManager (Cost Payment)

**Location:** `src/engine/managers/RunePoolManager.ts` (288 lines)

**Cost Payment Methods:**
```typescript
class RunePoolManager {
  // Add resources
  async addEnergy(game, playerId, amount): Promise<void>
  async addPower(game, playerId, domain, amount): Promise<void>

  // Pay costs
  async payEnergyCost(game, playerId, amount): Promise<boolean>
  async payPowerCost(game, playerId, costs: PowerCost[]): Promise<boolean>

  // Query
  canAffordCard(game, playerId, card): boolean
  getAvailableEnergy(game, playerId): number
  getAvailablePower(game, playerId, domain): number

  // Rune abilities
  async channelRunes(game, playerId, count): Promise<void>
  async recycleRune(game, playerId, runeId): Promise<void>
  async tapRuneForEnergy(game, playerId, runeId): Promise<void>
}
```

**Integration Strategy:**
1. Check affordability via `canAffordCard()` or manual checks
2. Pay costs via `payEnergyCost()` and `payPowerCost()`
3. If payment fails, rollback and return error
4. All cost modifications must go through V3 ModifierRegistry first

**Important:**
- RunePoolManager mutates `player.runePool` directly (not via V3 actions)
- This is OK because rune pool is a player resource, not a game object
- Future: Consider creating V3 actions for cost payment for better history tracking

---

### 5. Zone Management & Card Movement

**Key Zones (PlayerZones):**
```typescript
interface PlayerZones {
  // Board Zones
  base: GameCard[]               // Personal location, always controlled
  runes: GameCard[]              // Runes channeled to the board

  // Non-Board Zones
  hand: GameCard[]               // Private zone
  mainDeck: GameCard[]           // Private zone (top hidden)
  runeDeck: GameCard[]           // Private zone (top hidden)
  championZone: GameCard[]       // Starts with Chosen Champion
  trash: GameCard[]              // Public zone
  banishment: GameCard[]         // Public zone, cards never return
}
```

**Global Zones:**
```typescript
interface Battlefield {
  id: string
  card: BattlefieldCard
  units: GameCard[]                        // All units (maintained for compatibility)
  sides: { [playerId: string]: GameCard[] } // Units organized by controller
  controller?: string                       // Player ID who controls
  contested: boolean                        // Multiple players present
  facedownCards: GameCard[]                // HIDDEN cards
}

game.chain: ChainItem[]                    // Spell/ability stack
```

**Zone Movement Patterns:**

1. **Play Card from Hand:**
   - Hand → Base (Rune, Gear)
   - Hand → Battlefield (Unit with correct placement rules)
   - Hand → Chain → Trash (Spell)
   - Hand → Champion Zone (Champion, if applicable)

2. **Standard Move:**
   - Base → Battlefield (exhaust unit)
   - Cannot move from battlefield back to base (Riftbound rule)

3. **Hide Card:**
   - Hand → Battlefield.facedownCards (must have HIDDEN keyword)
   - Costs specified in card script metadata

4. **Death:**
   - Battlefield → Trash
   - Any Zone → Trash (if killed)

5. **Banishment:**
   - Any Zone → Banishment (permanent removal)

**BattlefieldManager Integration:**
```typescript
class BattlefieldManager {
  async standardMove(game, playerId, unitId, toBattlefieldId): Promise<void>
  async gankingMove(game, playerId, unitId, toBattlefieldId): Promise<void> // GANKING keyword
  async hideCard(game, playerId, cardId, battlefieldId): Promise<void>
  async revealHiddenCard(game, battlefieldId, cardId): Promise<void>

  updateBattlefieldControl(game, battlefield): void
  shouldTriggerShowdown(game, battlefield): boolean
  getContestedBattlefields(game): Battlefield[]
}
```

**Important Rules:**
- Units exhaust when moving (set `unit.ready = false`)
- Moving to contested battlefield may trigger Showdown
- Cannot move to battlefield with units from 2+ other players
- Standard Move must be Base ↔ Battlefield (not Battlefield ↔ Battlefield without GANKING)

---

### 6. ChainSystem Integration

**Location:** `src/engine/systems/ChainSystem.ts` (308 lines)

**Current State:**
```typescript
class ChainSystem {
  push(game, item: ChainItem): boolean
  async resolve(game): Promise<void>
  peek(): ChainItem | undefined
  isEmpty(): boolean
  canAddToChain(game, item): boolean
}
```

**What's Missing:**
❌ `ChainItem.sourceCard` is NOT populated when spells are played
❌ Nobody calls `chainSystem.push()` when spells are cast
❌ Resolution doesn't call CardScriptRuntime.executeHook('onResolve')

**Integration Requirements:**
1. When playing spell, create `ChainItem` with:
   ```typescript
   {
     id: uuidv4(),
     type: ChainItemType.SPELL,
     controllerId: playerId,
     sourceCardId: card.cardId,
     sourceCard: card,  // ⭐ CRITICAL - needed for counter spells
     spellTiming: card.spellTiming,
     targets: selectedTargets,
     effects: [], // Populated by card script
     resolved: false
   }
   ```

2. Add to chain via `chainSystem.push(game, chainItem)`

3. When resolving, call `cardScriptRuntime.executeHook('onResolve', card, game)`

4. Counter spells (like Defy) must be able to target `ChainItem.sourceCard`

---

### 7. TurnManager & Phase Integration

**Location:** `src/engine/managers/TurnManager.ts` (629 lines)

**Current Methods (Stubs):**
```typescript
// These exist but delegate to placeholder implementations
private async handlePlayCard(game, context): Promise<void> {
  // TODO: Just emits event, doesn't execute card
}

private async handleStandardMove(game, context): Promise<void> {
  // Delegates to BattlefieldManager.standardMove() ✅
  // But doesn't call CardScriptRuntime.executeHook('onEntersPlay')
}

private async handleActivateAbility(game, context): Promise<void> {
  // TODO: Just emits event, doesn't execute ability
}

private async handleHideCard(game, context): Promise<void> {
  // Delegates to BattlefieldManager.hideCard() ✅
}

private async handlePassPriority(game): Promise<void> {
  // Delegates to PriorityManager.passPriority() ✅
}
```

**Integration Requirements:**
- `handlePlayCard()` must call `GameManager.playCard()`
- `handleStandardMove()` must call `CardScriptRuntime.executeHook('onEntersPlay')` after move
- `handleActivateAbility()` must call `GameManager.activateAbility()`
- Phase transitions must call CardScriptRuntime phase hooks

---

## 🎯 Development Plan: Task 1 - Player Actions Implementation

### Overview
Implement the missing player action layer in GameManager that bridges player input to game state mutations, integrating CardScriptRuntime, V3 ActionExecutor, RunePoolManager, and ChainSystem.

**Estimated Effort:** 2-3 days
**Priority:** CRITICAL (blocks all other Phase 5.5 tasks)

---

### Subtask 1.1: Implement `playCard()` Method (6-8 hours)

**Signature:**
```typescript
async playCard(
  gameId: string,
  playerId: string,
  cardInstanceId: string,
  targets?: string[], // Optional target instanceIds
  battlefieldId?: string // For units, which battlefield to enter
): Promise<ActionResult>
```

**Responsibilities:**
1. ✅ Validate game state (game exists, in progress, player's turn)
2. ✅ Validate card location (must be in hand)
3. ✅ Validate card ownership (player owns card)
4. ✅ Validate timing (phase, turn state)
5. ✅ Validate targets (if required)
6. ✅ Check affordability (via RunePoolManager or scanner)
7. ✅ Pay costs (via RunePoolManager)
8. ✅ Execute card script via CardScriptRuntime.onPlay()
9. ✅ Move card to appropriate zone based on type:
   - **Unit**: Hand → Battlefield (via BattlefieldManager)
   - **Spell**: Hand → Chain → Trash (after resolution)
   - **Rune**: Hand → Runes zone
   - **Gear**: Hand → Base
10. ✅ For spells: Create ChainItem with sourceCard and push to chain
11. ✅ For units entering battlefield: Execute onEntersPlay hook
12. ✅ Trigger state scan via `onStateChanged()`
13. ✅ Return success/error result

**Implementation Steps:**
1. Add method to GameManager.ts
2. Implement validation logic
3. Integrate with RunePoolManager for cost payment
4. Integrate with CardScriptRuntime for onPlay execution
5. Integrate with ChainSystem for spell handling
6. Integrate with BattlefieldManager for unit placement
7. Add error handling and rollback logic
8. Write unit tests

**Edge Cases:**
- Card has additional costs (discard, sacrifice, etc.) - handled by script constraints
- Card becomes unplayable mid-execution - validation should catch this
- Spell countered - handled by chain resolution
- Unit placement triggers showdown - BattlefieldManager handles this

---

### Subtask 1.2: Implement `standardMove()` Method (3-4 hours)

**Signature:**
```typescript
async standardMove(
  gameId: string,
  playerId: string,
  unitInstanceId: string,
  toBattlefieldId: string
): Promise<ActionResult>
```

**Responsibilities:**
1. ✅ Validate game state
2. ✅ Validate unit location (base or battlefield)
3. ✅ Validate unit ownership
4. ✅ Validate unit is ready (not exhausted)
5. ✅ Validate move is legal Standard Move (Base ↔ Battlefield)
6. ✅ Execute move via BattlefieldManager.standardMove()
7. ✅ Execute CardScriptRuntime.executeHook('onEntersPlay') if unit entered battlefield
8. ✅ Check if showdown triggered via BattlefieldManager.shouldTriggerShowdown()
9. ✅ Trigger state scan
10. ✅ Return success/error result

**Implementation Steps:**
1. Add method to GameManager.ts
2. Delegate to BattlefieldManager for movement logic
3. Execute onEntersPlay hook after successful move
4. Handle showdown initiation if needed
5. Write unit tests

**Edge Cases:**
- Move triggers showdown - let BattlefieldManager handle
- Unit dies immediately after entering (e.g., from battlefield ability) - cleanup handles this
- Multiple units move in sequence - each triggers separately

---

### Subtask 1.3: Implement `hideCard()` Method (2-3 hours)

**Signature:**
```typescript
async hideCard(
  gameId: string,
  playerId: string,
  cardInstanceId: string,
  battlefieldId: string
): Promise<ActionResult>
```

**Responsibilities:**
1. ✅ Validate game state
2. ✅ Validate card has HIDDEN keyword or hide ability
3. ✅ Validate player controls target battlefield
4. ✅ Check affordability (hide cost may differ from play cost)
5. ✅ Pay hide cost
6. ✅ Execute hide via BattlefieldManager.hideCard()
7. ✅ Trigger state scan
8. ✅ Return success/error result

**Implementation Steps:**
1. Add method to GameManager.ts
2. Query scanner for hide ability metadata
3. Pay hide cost via RunePoolManager
4. Delegate to BattlefieldManager for placement
5. Write unit tests

**Edge Cases:**
- Card has hide ability but player doesn't control any battlefield - validation catches this
- Hide cost modified by other cards - scanner already calculates this
- Revealing hidden cards later - separate method (revealCard)

---

### Subtask 1.4: Implement `passPriority()` Method (1-2 hours)

**Signature:**
```typescript
async passPriority(
  gameId: string,
  playerId: string
): Promise<ActionResult>
```

**Responsibilities:**
1. ✅ Validate game state
2. ✅ Validate player has priority
3. ✅ Delegate to PriorityManager.passPriority()
4. ✅ Check if chain should resolve (all players passed)
5. ✅ Resolve chain via ChainSystem.resolve() if needed
6. ✅ Check if phase should advance (no pending actions)
7. ✅ Trigger state scan
8. ✅ Return success/error result

**Implementation Steps:**
1. Add method to GameManager.ts
2. Delegate to PriorityManager
3. Integrate with ChainSystem for resolution
4. Integrate with TurnManager for phase advancement
5. Write unit tests

**Edge Cases:**
- Passing when chain has items - resolve chain first
- Passing when showdown pending - handle combat first
- Both players pass in Action Phase - advance to next phase

---

### Subtask 1.5: Complete `activateAbility()` Method (3-4 hours)

**Current State:** PARTIAL (70% done)
**Location:** GameManager.ts line 388-473

**What's Missing:**
```typescript
// Line 461: TODO: Build proper CardContext and execute ability.onActivate()
```

**Responsibilities:**
1. ✅ Find card and ability (DONE)
2. ✅ Validate activation conditions (DONE)
3. ✅ Pay costs (DONE)
4. ❌ Build CardContext with proper APIs
5. ❌ Execute ability.onActivate(ctx)
6. ❌ Execute returned GameActions via ActionExecutor
7. ❌ Handle special cases (Phoenix resurrection, etc.)
8. ✅ Trigger state scan (DONE)

**Implementation Steps:**
1. Build CardContext with V3 APIs (reuse CardScriptRuntime logic)
2. Execute ability.onActivate(ctx) → returns GameAction[]
3. Execute each action via ActionExecutor
4. Add error handling for action execution failures
5. Write integration tests

**Edge Cases:**
- Ability returns multiple actions - execute in sequence
- Action fails validation - rollback or handle gracefully
- Ability has side effects - V3 pipeline handles this

---

### Subtask 1.6: TurnManager Integration (4-5 hours)

**Responsibilities:**
1. Update `handlePlayCard()` to call `GameManager.playCard()`
2. Update `handleStandardMove()` to execute onEntersPlay hook
3. Update `handleActivateAbility()` to call `GameManager.activateAbility()`
4. Add phase hook calls to TurnManager:
   - `executeAwakenPhase()` → call onTurnStart for all in-play cards
   - `executeEndingPhase()` → call onTurnEnd for all in-play cards
   - `nextPhase()` → call onPhaseChange for all in-play cards

**Implementation Steps:**
1. Inject GameManager instance into TurnManager (or use singleton)
2. Update handlePlayCard, handleStandardMove, handleActivateAbility
3. Add phase hook execution in phase methods
4. Write integration tests

---

### Subtask 1.7: Unit Tests (4-6 hours)

**Test Coverage Required:**
```typescript
describe('GameManager - Player Actions', () => {
  describe('playCard()', () => {
    it('should play unit and trigger onPlay hook')
    it('should play spell and add to chain')
    it('should pay costs correctly')
    it('should validate timing restrictions')
    it('should validate affordability')
    it('should reject invalid targets')
    it('should reject playing out of turn')
    it('should trigger onEntersPlay for units')
    it('should handle REACTION spells during closed state')
  })

  describe('standardMove()', () => {
    it('should move unit from base to battlefield')
    it('should exhaust unit after move')
    it('should trigger onEntersPlay hook')
    it('should trigger showdown if contested')
    it('should reject moving exhausted unit')
    it('should reject invalid movements')
  })

  describe('hideCard()', () => {
    it('should hide card with HIDDEN keyword')
    it('should pay hide cost')
    it('should place card facedown on battlefield')
    it('should reject if no controlled battlefield')
  })

  describe('passPriority()', () => {
    it('should pass priority correctly')
    it('should resolve chain when all players pass')
    it('should advance phase when appropriate')
  })

  describe('activateAbility()', () => {
    it('should activate ability from hand')
    it('should activate ability from trash (Phoenix)')
    it('should pay ability costs')
    it('should execute returned actions')
    it('should validate constraints')
  })
})
```

---

## 📋 Implementation Checklist

### Pre-Implementation
- [x] System analysis complete
- [x] Development plan documented
- [ ] Review plan with team/user
- [ ] Set up integration test environment

### Implementation Phase
- [ ] **Subtask 1.1**: Implement `playCard()` (6-8h)
- [ ] **Subtask 1.2**: Implement `standardMove()` (3-4h)
- [ ] **Subtask 1.3**: Implement `hideCard()` (2-3h)
- [ ] **Subtask 1.4**: Implement `passPriority()` (1-2h)
- [ ] **Subtask 1.5**: Complete `activateAbility()` (3-4h)
- [ ] **Subtask 1.6**: TurnManager integration (4-5h)
- [ ] **Subtask 1.7**: Write unit tests (4-6h)

### Testing Phase
- [ ] Run all unit tests
- [ ] Run integration tests
- [ ] Manual testing with example cards
- [ ] Test with Yasuo (combat triggers)
- [ ] Test with Phoenix (trash activation)
- [ ] Test with Defy (counter spells)

### Documentation Phase
- [ ] Update DEVELOPMENT-ROADMAP.md
- [ ] Document new methods in GameManager
- [ ] Update ENGINE-ARCHITECTURE.md if needed

---

## 🚧 Known Risks & Mitigations

### Risk 1: V3 Actions Not Implemented
**Risk:** Some required GameActions may not exist yet (e.g., PlayCardAction, MoveCardAction)
**Mitigation:** Audit existing V3 actions first, implement missing ones as needed

### Risk 2: Rollback Complexity
**Risk:** If action fails mid-execution, need to rollback paid costs
**Mitigation:** Pay costs last, after all validation passes

### Risk 3: CardScriptRuntime Context Building
**Risk:** Building proper CardContext with V3 APIs may be complex
**Mitigation:** Reuse existing CardScriptRuntime.buildContext() logic

### Risk 4: ChainSystem Integration
**Risk:** ChainItem.sourceCard population may affect existing logic
**Mitigation:** Test chain resolution thoroughly after changes

### Risk 5: Timing Windows
**Risk:** Complex interaction between priority, chain, and phase advancement
**Mitigation:** Implement simple priority logic first, refine later

---

## 📊 Success Criteria

Task 1 is complete when:

1. ✅ Player can play a card and its script executes (playCard works)
2. ✅ Unit enters battlefield and onEntersPlay triggers (standardMove works)
3. ✅ Player can hide cards on controlled battlefields (hideCard works)
4. ✅ Player can pass priority and advance phases (passPriority works)
5. ✅ Player can activate abilities from any zone (activateAbility works)
6. ✅ All unit tests pass
7. ✅ Integration with TurnManager complete
8. ✅ Example cards (Yasuo, Phoenix, Defy) work correctly

**Ready for Task 2 (CardScriptRuntime Integration) when all criteria met.**

---

## 📚 Related Documentation

- [DEVELOPMENT-ROADMAP.md](./DEVELOPMENT-ROADMAP.md) - Phase 5.5 overview
- [ENGINE-ARCHITECTURE.md](./ENGINE-ARCHITECTURE.md) - Complete architecture
- [GAMEACTION-SYSTEM-DESIGN.md](./GAMEACTION-SYSTEM-DESIGN.md) - V3 system details
- [V3-CARD-SCRIPTING-GUIDE.md](./V3-CARD-SCRIPTING-GUIDE.md) - Card script patterns
- [ACTIVATED-ABILITIES-PROPOSAL-B.md](./ACTIVATED-ABILITIES-PROPOSAL-B.md) - Scanner system

---

**Last Updated:** 2025-01-10
**Next Review:** After Subtask 1.1 completion
