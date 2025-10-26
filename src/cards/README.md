# Card Implementations - Implementation Notes

## Overview

This directory contains card script implementations for Riftbound TCG using the V3 GameAction system.

## Implementation Status

### ✅ Fully Implemented (Basic functionality)

1. **Charm** (spell) - Move enemy unit
2. **Disintegrate** (spell) - Deal 3 damage, draw if kills
3. **Defy** (spell) - Counter spell with cost restrictions
4. **Yasuo, Remorseful** (unit) - Attack trigger for damage
5. **Seal of Rage** (gear) - Tap to add fury power
6. **Yasuo, Unforgiven** (legend) - Tap to move friendly unit
7. **Darius, Hand of Noxus** (legend) - LEGION tap for energy

### ⚠️ Partially Implemented (Requires Engine Extensions)

8. **Brazen Buccaneer** (unit) - Cost reduction on discard
   - **Limitation**: Requires cost modification system not yet in engine
   - **Note**: Script includes documentation for future implementation

9. **Darius, Trifarian** (unit) - Second card trigger
   - **Limitation**: Requires ModifyMightAction (not yet implemented)
   - **Workaround**: Can modify `card.might` directly but lacks history tracking

10. **Vi, Destructive** (unit) - Recycle for might buff
    - **Limitation**: Requires activated ability system
    - **Note**: Script provides metadata structure for UI integration

11. **Zhonya's Hourglass** (gear) - Death prevention
    - **Limitation**: Requires OnUnitWouldDieTrigger (replacement effects not yet in engine)
    - **Note**: Script shows intended behavior for future implementation

### 🟢 No Script Needed

12. **Playful Phantom** (unit) - Vanilla unit, no special abilities

## Known Type Issues

### CardContext Properties

The following properties are **not** available in `CardContext`:
- `battlefield` - Use `game.battlefields` instead
- `opponent` - Use `game.players.find(p => p.id !== owner.id)` instead

### GameCard Properties

The following properties may not exist on `GameCard`:
- `location` - Zone location tracking
- `cardType` - Type of card (unit/spell/gear/legend)
- `might` - Unit power stat

**Workaround**: Use type assertions with `as any` when accessing these properties until types are updated.

### Battlefield Type

The `Battlefield` type may be missing:
- `sides` - Player sides on battlefield

**Workaround**: Access with type assertions or update Game type definitions.

## Missing Engine Features

### 1. ModifyMightAction
**Needed for**: Temporary stat modifications (Vi, Darius Trifarian)

**Current Workaround**:
```typescript
// Direct modification (no history tracking)
(card as any).might += amount;
```

**Proper Implementation Needed**:
```typescript
export class ModifyMightAction extends GameAction<ModifyMightData> {
  // Provides:
  // - Duration tracking (turn/permanent)
  // - History recording
  // - Rollback support
  // - Trigger integration
}
```

### 2. OnUnitWouldDieTrigger (Replacement Effects)
**Needed for**: Zhonya's Hourglass, other death prevention effects

**Current Workaround**: Cannot implement properly without replacement effect system

**Proper Implementation Needed**:
```typescript
export class OnUnitWouldDieTrigger extends ActionTrigger {
  // Provides:
  // - Intercepts death actions BEFORE execution
  // - Returns replacement actions
  // - Cancels original death action
  // - isReplacementEffect: true flag
}
```

### 3. Cost Modification System
**Needed for**: Brazen Buccaneer, other cost-altering effects

**Current Workaround**: Cannot implement

**Proper Implementation Needed**:
- `beforePlay` or `modifyCost` hook in CardScript interface
- Integration with payment validation system
- Player choice system for optional costs

### 4. Activated Abilities System
**Needed for**: Vi Destructive, all tap abilities, HIDDEN gear

**Current Workaround**: Store metadata on cards as `activatedAbilities` array

**Proper Implementation Needed**:
- UI integration to display available abilities
- Priority/timing system for activation windows
- Cost payment system for ability costs
- REACTION timing support

### 5. HIDDEN Keyword Support
**Needed for**: Zhonya's Hourglass, other face-down gear

**Current Workaround**: Not implemented

**Proper Implementation Needed**:
- Hidden zone for face-down cards
- Reveal/activate mechanics
- Zero-cost activation after hiding

## Testing Requirements

Before running tests on these cards:

1. **Update type definitions** in `src/types/game.ts`:
   - Add `location`, `cardType`, `might` to GameCard
   - Add `sides` to Battlefield
   - Add `currentTurn` to Game

2. **Implement missing actions**:
   - ModifyMightAction
   - OnUnitWouldDieTrigger (or generic replacement effect system)

3. **Implement missing ActionsAPI methods**:
   - `drawCard()` - currently only `draw(count)` exists
   - `moveUnit()` - wrapper around MoveUnitAction with simpler API
   - `modifyMight()` - temporary stat modification

## Future Work

### Priority 1: Type Definitions
Update `src/types/game.ts` to include all properties used by card scripts.

### Priority 2: Missing Actions
Implement ModifyMightAction and replacement effect system.

### Priority 3: Player Input System
Implement target selection and choice modals for card effects.

### Priority 4: Activated Abilities
Full system for tap abilities, HIDDEN gear, and REACTION timing.

### Priority 5: Advanced Keywords
- LEGION tracking (cards played this turn)
- GANKING movement rules
- HIDDEN face-down mechanics
- ACTION timing restrictions

## Card-Specific Notes

### Charm
- Works with current system
- Needs target selection UI
- Simple movement logic

### Disintegrate
- Works with current system
- Needs target selection UI
- Draw logic needs `drawCard()` method added to ActionsAPI

### Defy
- Works with current system
- Needs Chain item selection UI
- Counter logic uses V3 CounterSpellAction

### Yasuo, Remorseful
- Uses OnCombatStartTrigger (implemented)
- Needs damage dealer logic
- Works with current trigger system

### Brazen Buccaneer
- **Cannot be fully implemented** without cost modification hooks
- Script contains detailed implementation notes
- Requires engine-level changes

### Darius, Trifarian
- Needs ModifyMightAction for proper implementation
- Can use direct property modification as temporary workaround
- LEGION tracking via game.cardsPlayedThisTurn

### Vi, Destructive
- GANKING keyword handled by engine (assumed)
- Activated ability needs UI integration
- Recycle + buff logic works

### Seal of Rage
- Tap ability via activated abilities system
- REACTION timing needs priority system
- ADD resource works (direct property modification)

### Zhonya's Hourglass
- **Cannot be fully implemented** without replacement effects
- Script shows intended behavior
- Requires OnUnitWouldDieTrigger

### Yasuo, Unforgiven
- Tap ability for unit movement
- Cost payment (2 energy) works
- Movement logic works with MoveUnitAction

### Darius, Hand of Noxus
- LEGION condition checking
- ADD energy works
- REACTION timing needs priority system

## Recommended Next Steps

1. Create integration tests for working cards (Charm, Disintegrate, Defy)
2. Document exact API needed for missing features
3. Implement ModifyMightAction as Priority 1
4. Update type definitions to match actual game state
5. Build player input/UI system for target selection
6. Implement activated ability framework
7. Build replacement effect system for death prevention

---

**Last Updated**: 2025-10-10
**V3 GameAction System**: Phase A Complete (new actions + triggers)
**Card Implementation Phase**: Initial implementation with known limitations
