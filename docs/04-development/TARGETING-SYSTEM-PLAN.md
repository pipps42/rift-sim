# Targeting System - Piano di Sviluppo

**Data:** 2025-11-03
**Stato:** 🔴 Not Started (Planning Phase)
**Priorità:** 🔥 HIGH - Richiesto da molte carte

---

## Analisi dello Stato Attuale

### ✅ Cosa Esiste Già

**1. Type Definitions (già presenti in `src/types/game.ts`):**
```typescript
interface Target {
  type: TargetType;
  cardId?: string;
  playerId?: string;
  battlefieldId?: string;
  restrictions: TargetRestriction[];
}

enum TargetType {
  UNIT, GEAR, PLAYER, BATTLEFIELD, CARD_IN_HAND, CARD_IN_TRASH
}

interface TargetRequirement {
  targetType: TargetType;
  count: number;
  optional: boolean;
  restrictions?: TargetRestriction[];
}

interface TargetRestriction {
  property: TargetProperty;
  operator: ComparisonOperator;
  value: any;
}

enum TargetProperty {
  CARD_TYPE, MIGHT, ENERGY_COST, DOMAIN, KEYWORD, TAG
}
```

**2. Partial Implementation:**
- `CardContext.targets?: GameCard[]` - campo già presente
- `CardScriptRuntime.canTarget()` - metodo di validazione già esistente
- `GameManager.playCard(targets?)` - parametro già presente ma NON usato
- Alcune carte già usano `ctx.targets?.[0]` (esempi esistenti)

### ❌ Cosa Manca

1. **TargetingSystem Core**: Sistema centrale per validare e risolvere target
2. **Target Resolution**: Convertire `Target` (ID) → `GameCard` (istanza)
3. **Target Validation**: Verificare che target rispettino restrizioni
4. **GameManager Integration**: Passare target al CardContext quando si gioca una carta
5. **CardStateScanner Integration**: Mostrare quali carte possono essere targettate
6. **Multi-Target Support**: Target multipli
7. **Special Target Types**:
   - ChainItem (per counter spells come Defy)
   - Battlefield (per Standard Move)
8. **UI/API Layer**: Endpoint per richiedere/validare target

---

## Piano di Sviluppo

### Phase 1: Core TargetingSystem (1-2 giorni) 🎯

**Obiettivo:** Creare il sistema centrale di targeting con validazione base.

#### Task 1.1: Create TargetingSystem Class

**File:** `src/engine/systems/TargetingSystem.ts`

```typescript
/**
 * TargetingSystem - Manages target selection and validation
 *
 * Responsibilities:
 * - Validate targets against requirements
 * - Resolve target IDs to game objects
 * - Check target restrictions (domain, cost, keywords, etc.)
 * - Support multiple target types (cards, players, battlefields, chain items)
 */
export class TargetingSystem {
  /**
   * Find all valid targets for a card/ability
   */
  getValidTargets(
    game: Game,
    playerId: string,
    requirements: TargetRequirement[]
  ): ValidTarget[]

  /**
   * Validate selected targets against requirements
   */
  validateTargets(
    game: Game,
    playerId: string,
    requirements: TargetRequirement[],
    selectedTargets: Target[]
  ): TargetValidationResult

  /**
   * Resolve target IDs to actual game objects
   */
  resolveTargets(
    game: Game,
    targets: Target[]
  ): ResolvedTarget[]

  /**
   * Check if a specific card can be targeted
   */
  canTarget(
    game: Game,
    targetCard: GameCard,
    restrictions: TargetRestriction[]
  ): boolean

  /**
   * Check if a specific player can be targeted
   */
  canTargetPlayer(
    game: Game,
    targetPlayer: Player,
    restrictions: TargetRestriction[]
  ): boolean

  /**
   * Check if a specific battlefield can be targeted
   */
  canTargetBattlefield(
    game: Game,
    battlefield: Battlefield,
    restrictions: TargetRestriction[]
  ): boolean

  /**
   * Check if a specific chain item can be targeted
   */
  canTargetChainItem(
    game: Game,
    chainItem: ChainItem,
    restrictions: TargetRestriction[]
  ): boolean
}
```

**Types to add:**
```typescript
interface ValidTarget {
  type: TargetType;
  id: string;
  displayName: string;
  description?: string;
  object: GameCard | Player | Battlefield | ChainItem;
}

interface ResolvedTarget {
  original: Target;
  resolved: GameCard | Player | Battlefield | ChainItem;
}

interface TargetValidationResult {
  valid: boolean;
  errors?: TargetValidationError[];
}

interface TargetValidationError {
  type: 'missing_required' | 'invalid_type' | 'restriction_failed' | 'too_many';
  message: string;
  requirement?: TargetRequirement;
  target?: Target;
}
```

#### Task 1.2: Implement Restriction Checking

**File:** `src/engine/systems/TargetingSystem.ts`

Implementare la logica per ogni `TargetProperty`:
- `CARD_TYPE` - tipo di carta (unit, spell, etc.)
- `MIGHT` - valore might (per unità)
- `ENERGY_COST` - costo in energy
- `DOMAIN` - domain della carta
- `KEYWORD` - keyword presente
- `TAG` - tag presente

Operatori da supportare:
- `EQUALS` - uguaglianza
- `NOT_EQUALS` - diverso
- `GREATER_THAN` - maggiore di
- `LESS_THAN` - minore di
- `CONTAINS` - contiene (per array)

#### Task 1.3: Unit Tests

**File:** `src/engine/systems/__tests__/TargetingSystem.test.ts`

Test da implementare:
- ✅ Trova tutti i target validi per una spell di danno
- ✅ Valida target selezionati contro requirements
- ✅ Risolve target IDs a GameCard instances
- ✅ Verifica restrizioni (domain, cost, keywords)
- ✅ Gestisce target multipli (LEGION)
- ✅ Rifiuta target invalidi
- ✅ Gestisce target opzionali

---

### Phase 2: GameManager Integration (1 giorno) 🔌

**Obiettivo:** Integrare il TargetingSystem con GameManager per usarlo quando si giocano carte.

#### Task 2.1: Update GameManager.playCard()

**File:** `src/engine/managers/GameManager.ts`

```typescript
async playCard(
  gameId: string,
  playerId: string,
  cardInstanceId: string,
  targets?: Target[]  // ← Already exists, now USE it!
): Promise<ActionResult> {
  const game = this.getGame(gameId);
  // ...existing validation...

  // NEW: Validate targets if card requires them
  if (card.metadata?.targetRequirements) {
    const validation = this.targetingSystem.validateTargets(
      game,
      playerId,
      card.metadata.targetRequirements,
      targets || []
    );

    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors?.[0]?.message || 'Invalid targets'
      };
    }
  }

  // NEW: Resolve targets to game objects
  const resolvedTargets = targets
    ? this.targetingSystem.resolveTargets(game, targets)
    : [];

  // Pass resolved targets to PlayCardAction
  const action = new PlayCardAction(player, {
    card: gameCard,
    targets: resolvedTargets.map(t => t.resolved as GameCard),  // ← NEW
    energyCost: finalEnergyCost,
    powerCosts: finalPowerCosts,
  });

  // ...rest of execution...
}
```

#### Task 2.2: Update CardScriptRuntime Context Building

**File:** `src/engine/scripting/CardScriptRuntime.ts`

```typescript
private buildContext(
  card: Card,
  game: Game,
  additionalContext?: Partial<CardContext>
): CardContext {
  // ...existing code...

  return {
    self: tempSelf,
    owner,
    opponent,
    game,
    targets: additionalContext?.targets || [],  // ← Make sure targets are passed
    // ...rest of context...
  };
}
```

#### Task 2.3: Integration Tests

**File:** `src/engine/managers/__tests__/GameManager.targeting.test.ts`

Test da implementare:
- ✅ Play damage spell with valid target
- ✅ Reject damage spell without required target
- ✅ Reject damage spell with invalid target (wrong type)
- ✅ Reject damage spell with invalid target (restriction failed)
- ✅ Play spell with multiple targets
- ✅ Play spell with optional targets
- ✅ Card script receives correct targets in ctx.targets

---

### Phase 3: CardMetadata Target Requirements (1 giorno) 📋

**Obiettivo:** Aggiungere supporto per target requirements nella card metadata.

#### Task 3.1: Update CardMetadata Interface

**File:** `src/engine/scanning/types/ScanTypes.ts`

```typescript
export interface CardMetadata {
  costModifiers?: CostModifierMetadata[];
  playConstraints?: ConstraintMetadata[];
  activatedAbilities?: ActivatedAbilityMetadata[];
  reactiveTriggers?: ReactiveTriggerMetadata[];

  // NEW: Target requirements
  targetRequirements?: TargetRequirement[];
}
```

#### Task 3.2: Update CardStateScanner

**File:** `src/engine/scanning/CardStateScanner.ts`

```typescript
private scanCard(card: GameCard, player: Player): CardScanResult {
  // ...existing code...

  // NEW: Check if card has valid targets available
  let hasValidTargets = true;
  if (script.metadata?.targetRequirements && script.metadata.targetRequirements.length > 0) {
    const validTargets = this.targetingSystem.getValidTargets(
      this.game,
      player.id,
      script.metadata.targetRequirements
    );
    hasValidTargets = validTargets.length > 0;
  }

  const playable: PlayabilityInfo = {
    canPlay: hasValidTargets && /* ...other checks... */,
    reason: !hasValidTargets
      ? 'No valid targets'
      : /* ...other reasons... */
  };

  // ...rest of scan...
}
```

#### Task 3.3: Update Card Examples

**File:** `src/examples/cards/DamageSpell.ts` (esempio)

```typescript
export const fireball: CardScript = {
  metadata: {
    // NEW: Declare target requirements
    targetRequirements: [{
      targetType: TargetType.UNIT,
      count: 1,
      optional: false,
      restrictions: [{
        property: TargetProperty.CARD_TYPE,
        operator: ComparisonOperator.EQUALS,
        value: 'unit'
      }]
    }]
  },

  onPlay: async (ctx: CardContext) => {
    const target = ctx.targets?.[0];
    if (!target) {
      throw new Error('No target selected');
    }

    await ctx.actions.dealDamage(target, 3, 'effect');
  }
};
```

---

### Phase 4: Special Target Types (1 giorno) 🎯

**Obiettivo:** Supportare target speciali (ChainItem, Battlefield, Player).

#### Task 4.1: ChainItem Targeting (for Counter Spells)

**Update:** `TargetingSystem.getValidTargets()` e `TargetingSystem.resolveTargets()`

```typescript
// Allow targeting chain items
if (requirement.targetType === TargetType.CHAIN_ITEM) {
  validTargets.push(...game.chain
    .filter(item => !item.resolved)
    .map(item => ({
      type: TargetType.CHAIN_ITEM,
      id: item.id,
      displayName: item.sourceCard?.name || 'Spell',
      object: item
    }))
  );
}
```

**Update Defy card:**
```typescript
export const Defy: CardScript = {
  metadata: {
    targetRequirements: [{
      targetType: TargetType.CHAIN_ITEM,  // ← Use proper targeting!
      count: 1,
      optional: false,
      restrictions: [
        { property: TargetProperty.CARD_TYPE, operator: ComparisonOperator.EQUALS, value: 'spell' },
        { property: TargetProperty.ENERGY_COST, operator: ComparisonOperator.LESS_THAN, value: 5 },
        // Custom restriction for total power cost ≤1
      ]
    }]
  },

  onPlay: async (ctx: CardContext) => {
    const targetChainItem = ctx.targets?.[0] as ChainItem;  // ← Now properly typed!
    await ctx.actions.counterSpell(targetChainItem.id, false);
  }
};
```

#### Task 4.2: Battlefield Targeting (for Standard Move)

Similar approach for `TargetType.BATTLEFIELD`.

#### Task 4.4: Tests

**File:** `src/engine/systems/__tests__/TargetingSystem.special.test.ts`

- ✅ Counter spell targets ChainItem
- ✅ Standard Move targets Battlefield
- ✅ Direct damage targets Player

---

### Phase 5: Multi-Target Support (LEGION keyword) (1 giorno) 👥

**Obiettivo:** Supportare spell che targetano multiple carte (keyword LEGION).

#### Task 5.1: Update TargetRequirement

Already supports `count: number`, so multi-target works automatically:

```typescript
targetRequirements: [{
  targetType: TargetType.UNIT,
  count: 3,  // ← LEGION: target 3 units
  optional: false
}]
```

#### Task 5.2: Update CardContext

`targets: GameCard[]` already supports multiple targets!

#### Task 5.3: Example LEGION Card

```typescript
export const chainLightning: CardScript = {
  metadata: {
    targetRequirements: [{
      targetType: TargetType.UNIT,
      count: 3,
      optional: false,
      restrictions: [
        { property: TargetProperty.DOMAIN, operator: ComparisonOperator.NOT_EQUALS, value: 'calm' }
      ]
    }]
  },

  onPlay: async (ctx: CardContext) => {
    for (const target of ctx.targets || []) {
      await ctx.actions.dealDamage(target, 2, 'effect');
    }
  }
};
```

#### Task 5.4: Tests

- ✅ Reject if not enough valid targets
- ✅ Each target receives effect

---

### Phase 6: UI/API Layer Integration (2 giorni) 🖥️

**Obiettivo:** Esporre il targeting system tramite API per permettere ai client di selezionare target.

#### Task 6.1: Add GameManager Query Method

**File:** `src/engine/managers/GameManager.ts`

```typescript
/**
 * Get valid targets for a card the player wants to play
 */
getValidTargets(
  gameId: string,
  playerId: string,
  cardInstanceId: string
): ValidTarget[] {
  const game = this.getGame(gameId);
  const player = game.players.find(p => p.id === playerId);
  if (!player) throw new Error('Player not found');

  const card = this.findCardInPlayerZones(player, cardInstanceId);
  if (!card || !card.scriptPath) return [];

  // Load script metadata
  const script = this.scriptRuntime.getLoader().getScript(card.scriptPath);
  if (!script?.metadata?.targetRequirements) return [];

  // Get valid targets from TargetingSystem
  return this.targetingSystem.getValidTargets(
    game,
    playerId,
    script.metadata.targetRequirements
  );
}
```

#### Task 6.2: REST API Endpoint (Future Phase 6)

```typescript
// GET /api/games/:gameId/valid-targets
// Query params: playerId, cardInstanceId
// Response: ValidTarget[]
```

#### Task 6.3: WebSocket Message (Future Phase 5.2)

```typescript
// Client → Server
{
  type: 'REQUEST_VALID_TARGETS',
  gameId: 'game-123',
  playerId: 'player-1',
  cardInstanceId: 'card-456'
}

// Server → Client
{
  type: 'VALID_TARGETS',
  targets: [
    { type: 'UNIT', id: 'unit-1', displayName: 'Enemy Knight', ... },
    { type: 'UNIT', id: 'unit-2', displayName: 'Enemy Mage', ... }
  ]
}
```

---

## Testing Strategy

### Unit Tests (Phase 1)
- `TargetingSystem.test.ts` - Core targeting logic
- Test coverage target: **95%+**

### Integration Tests (Phase 2-3)
- `GameManager.targeting.test.ts` - playCard() with targets
- `CardStateScanner.targeting.test.ts` - Scanner shows valid targets
- Test coverage target: **90%+**

### End-to-End Tests (Phase 6)
- Play damage spell with target selection
- Play counter spell targeting chain item
- Play LEGION spell with multiple targets
- Test coverage target: **85%+**

---

## Card Examples Requiring Targeting

### High Priority (Many Cards Use This)
1. **Damage Spells** - "Deal 3 damage to target unit"
2. **Buff Spells** - "Give target unit +2/+2"
3. **Debuff Spells** - "Stun target unit"
4. **Counter Spells** - "Counter target spell" (Defy)
5. **Bounce Spells** - "Return target unit to hand"

### Medium Priority
6. **Activated Abilities** - "Tap: Deal 1 damage to target"
7. **Conditional Damage** - "Deal X damage to target unit where X is..."
8. **Multi-Target** - "Deal 2 damage to up to 3 targets" (LEGION)

### Low Priority (Complex)
9. **Player Targeting** - "Target player draws 2 cards"
10. **Battlefield Targeting** - Already handled by Standard Move

---

## Estimated Timeline

| Phase | Description | Effort | Priority |
|-------|-------------|--------|----------|
| Phase 1 | Core TargetingSystem | 1-2 giorni | 🔥 CRITICAL |
| Phase 2 | GameManager Integration | 1 giorno | 🔥 CRITICAL |
| Phase 3 | CardMetadata Integration | 1 giorno | 🔥 HIGH |
| Phase 4 | Special Target Types | 1 giorno | 🟡 MEDIUM |
| Phase 5 | Multi-Target (LEGION) | 1 giorno | 🟡 MEDIUM |
| Phase 6 | UI/API Layer | 2 giorni | 🔵 LOW (Future) |
| **TOTAL** | **Core System** | **4-5 giorni** | |

**Note:** Phase 6 può essere fatto later quando implementiamo l'API layer (Phase 6 della roadmap).

---

## Dependencies

**Requires:**
- ✅ Type definitions (already exist in `src/types/game.ts`)
- ✅ `CardContext.targets` field (already exists)
- ✅ `GameManager.playCard(targets?)` parameter (already exists)

**Enables:**
- ⭐ Defy card (counter spell) - can use proper targeting
- ⭐ Damage spells (Fireball, Lightning Bolt, etc.)
- ⭐ Buff/debuff spells
- ⭐ Yasuo ability ("deal damage to an enemy unit here")
- ⭐ Many other cards that require target selection

---

## Success Criteria

✅ **Phase 1-3 Complete When:**
1. TargetingSystem validates targets against requirements
2. GameManager passes targets to card scripts via CardContext
3. CardStateScanner shows cards as unplayable if no valid targets
4. At least 3 example cards use the targeting system
5. 90%+ test coverage

✅ **Phase 4-5 Complete When:**
1. Counter spells can target ChainItems
2. LEGION spells can target multiple cards
3. Defy card refactored to use proper targeting

✅ **Phase 6 Complete When:**
1. GameManager exposes `getValidTargets()` query method
2. UI can request valid targets before playing a card
3. WebSocket/REST API integrated (Future Phase 6)

---

## Notes

- **Backward Compatibility:** Existing cards without target requirements continue to work
- **Incremental Implementation:** Each phase is independently testable
- **V3 Integration:** TargetingSystem follows V3 patterns (validation → execution)
- **Future Proof:** Design supports complex targeting (e.g., "target up to 3 units with Might ≤2")
