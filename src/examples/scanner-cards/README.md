# CardStateScanner Example Cards

This directory contains example card scripts demonstrating the **CardStateScanner** system (Proposal B).

## System Overview

The CardStateScanner is a centralized system that:
- **Scans all cards** on every game state change
- **Reports to UI** which cards are playable, which abilities are activatable
- **Validates constraints** before execution
- **Calculates effective costs** with modifiers applied

Cards define **metadata** instead of implementing complex hooks, making card scripts simpler and more consistent.

---

## Example Cards

### 1. unit-with-hidden.card.ts - **HIDDEN Keyword**

**Card:** Stealthy Scout
**Text:** "Unit with HIDDEN - Pay 2 [E]: Hide this unit on a battlefield you control"

**Demonstrates:**
- ✅ Activated ability available from `hand` zone
- ✅ Cost requirement (2 energy)
- ✅ Constraint checking (must control a battlefield)
- ✅ Sorcery timing (only on your turn)

**Scanner behavior:**
```typescript
// When card is in hand and you control a battlefield:
{
  canActivate: true,
  ability: "Hide (2E)",
}

// When you don't control a battlefield:
{
  canActivate: false,
  reason: "You don't control any battlefield",
}

// When card is not in hand:
{
  abilities: [], // Hidden ability not available
}
```

---

### 2. phoenix-resurrection.card.ts - **Triggered Activated Ability**

**Card:** Ashen Phoenix
**Text:** "When you kill a unit with a spell, you may pay 1 [E] + 1 fury to play me from your trash."

**Demonstrates:**
- ✅ Reactive trigger (UI hint when condition is met)
- ✅ Activated ability available from `trash` zone
- ✅ Complex constraint (check game history for recent spell kill)
- ✅ Instant timing (can respond immediately)
- ✅ Multiple cost types (energy + power)

**Scanner behavior:**
```typescript
// BEFORE spell kills unit: Phoenix in trash, not activatable
{
  canActivate: false,
  reason: "No recent unit death",
}

// AFTER your spell kills enemy unit: Phoenix glows!
{
  canActivate: true,
  ability: "Rise from Ashes (1E + 1 Fury)",
  tooltip: "⚡ Spell kill trigger active",
}

// State changes (e.g., another action): Window closes
{
  canActivate: false,
  reason: "No recent unit death",
}
```

---

### 3. dynamic-cost-spell.card.ts - **Dynamic Cost Reduction**

**Card:** Adaptive Lightning
**Text:** "This spell's Energy cost is reduced by the highest Might among units you control. Deal damage equal to the cost reduction to target unit."

**Demonstrates:**
- ✅ Cost modifier based on game state
- ✅ Dynamic calculation (scans battlefield)
- ✅ Play constraint (must have target)
- ✅ Effect scales with cost reduction

**Scanner behavior:**
```typescript
// You control units with Might 3, 2, 1:
{
  baseCost: 5,
  effectiveCost: 2, // 5 - 3 (highest might)
  modifiedBy: 'modified',
  canPlay: true, // If you have 2 energy
}

// You control no units:
{
  baseCost: 5,
  effectiveCost: 5,
  modifiedBy: 'base',
}

// No enemy units to target:
{
  canPlay: false,
  reason: "No enemy units to target",
}
```

---

### 4. additional-cost-spell.card.ts - **Additional Costs**

**Card:** Desperate Gambit
**Text:** "As an additional cost to play this, discard 1 card. Deal 5 damage to target unit."

**Demonstrates:**
- ✅ Additional cost constraint (must have card to discard)
- ✅ Multiple constraints (discard + target)
- ✅ `additionalCosts` hook (executed before onPlay)

**Scanner behavior:**
```typescript
// 3 cards in hand (including this):
{
  canPlay: true,
  tooltip: "Requires: Discard 1 card",
}

// Only this card in hand:
{
  canPlay: false,
  reason: "No cards to discard",
}

// Hand has cards but no units on battlefield:
{
  canPlay: false,
  reason: "No units to target",
}
```

---

## Metadata Structure

All examples use the `metadata` property on `CardScript`:

```typescript
export interface CardScript {
  metadata?: {
    // Cost modifiers
    costModifiers?: CostModifierMetadata[];

    // Play constraints
    playConstraints?: ConstraintMetadata[];

    // Activated abilities
    activatedAbilities?: ActivatedAbilityMetadata[];

    // Reactive triggers (for UI hints)
    reactiveTriggers?: ReactiveTriggerMetadata[];
  };

  // Standard hooks still work
  onPlay?: (ctx) => Promise<void>;
  additionalCosts?: (ctx) => Promise<GameAction[]>;
  // ... etc
}
```

---

## Integration with V3 System

The scanner complements the V3 GameAction system:

### Scanner Role (Read-Only)
- ✅ Query game state
- ✅ Check constraints
- ✅ Calculate costs with V3 ModifierRegistry
- ✅ Report to UI
- ❌ **Never mutates state**

### V3 System Role (Write Operations)
- ✅ Execute actions (DealDamageAction, etc.)
- ✅ Apply modifiers
- ✅ Fire triggers
- ✅ **Source of truth for game logic**

### Example Flow

```
1. STATE CHANGE (unit enters battlefield)
   └─> CardStateScanner.scanGameState(game)
       └─> For each card: check constraints, calculate costs
       └─> Returns delta (what changed)

2. UI UPDATE
   └─> Receives delta
   └─> Highlights playable cards
   └─> Shows "Adaptive Lightning - 2E (was 5E)" ⬇️

3. PLAYER CLICKS CARD
   └─> GameManager.playCard(cardId)
       └─> Verify scanner says playable ✅
       └─> Pay costs (reduced cost from scanner)
       └─> Execute additionalCosts hook → GameActions
       └─> Execute onPlay hook → GameActions
       └─> ActionExecutor.execute(each action)
           └─> V3 pipeline: Validation → Modifiers → Execute → Triggers ✅
```

---

## Testing

To test scanner behavior:

```typescript
import { CardStateScanner } from '../../engine/scanning/CardStateScanner';
import { adaptiveLightning } from './dynamic-cost-spell.card';

test('Adaptive Lightning cost reduces with units', async () => {
  const game = setupTestGame();
  const scanner = new CardStateScanner(scriptRuntime, modifierRegistry);

  // Add units to battlefield
  addUnitToBattlefield(game, player1, { might: 3 });

  // Scan
  const delta = await scanner.scanGameState(game);

  // Check card state
  const lightningState = scanner.getCardState(lightningCard.instanceId);
  expect(lightningState?.effectiveCost.energy).toBe(2); // 5 - 3
  expect(lightningState?.effectiveCost.modifiedBy).toBe('modified');
});
```

---

## Benefits

**For Card Designers:**
- ✅ Less code (metadata vs imperative hooks)
- ✅ Declarative (what, not how)
- ✅ Consistent (same schema for all cards)
- ✅ Type-safe (TypeScript enforces structure)

**For Engine:**
- ✅ Centralized scanning logic
- ✅ Easier to optimize (batch, cache, parallelize)
- ✅ UI automatically updated on state changes
- ✅ Validation before execution

**For UI:**
- ✅ Rich information (costs, reasons, tooltips)
- ✅ Push-based updates (notified only on changes)
- ✅ Consistent display (all cards use same metadata format)

---

## Next Steps

1. ✅ Core scanner implemented
2. ✅ Example cards created
3. 🔄 Integration with GameManager (in progress)
4. ⏳ UI notification system
5. ⏳ Full test coverage
6. ⏳ Performance optimizations (delta scanning, zone filtering)
