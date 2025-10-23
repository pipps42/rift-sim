# GameAction System - Architettura e Piano di Implementazione

**Progetto:** Riftbound TCG
**Versione:** 1.1
**Data:** 2025-10-09 (Updated)
**Autore:** Sistema V3 - GameAction Architecture

---

## 🎯 Implementation Status (Updated 2025-10-09)

**Overall Progress:** ✅ **Phase 1-5 COMPLETED** (Core + Modifiers + Triggers)

### ✅ Completed (83/84 tests passing - 98.8%)

**Phase 1-3: Core Infrastructure & Actions**
- ✅ GameAction base class with TypeScript strict mode
- ✅ ActionExecutor with 7-phase pipeline
- ✅ ModifierRegistry and TriggerRegistry
- ✅ **18 Concrete Actions Implemented** (see complete list below)
- ✅ Test coverage: 83/84 tests passing across multiple test suites

**Phase 4: Modifier System** ⭐ NEW
- ✅ DamageModifier (increase/reduce/multiply damage)
- ✅ CostModifier (modify energy/power costs)
- ✅ DrawModifier (modify draw count, can prevent)
- ✅ Test coverage: 24/24 tests passing
- ✅ Features: filters, max uses, one-shot, expiration, priority

**Phase 5: Trigger System** ⭐ NEW
- ✅ OnDamageDealtTrigger (react to damage)
- ✅ OnCardPlayedTrigger (react to card plays)
- ✅ OnUnitDeathTrigger (react to unit deaths)
- ✅ Test coverage: 21/21 tests passing
- ✅ Features: filters, max triggers, one-shot, expiration, priority

**Total Test Coverage:** 83/84 passing (98.8%)

### 📂 Files Implemented

**Base Classes:**
- `src/engine/actions/base/GameAction.ts`
- `src/engine/actions/base/ActionModifier.ts`
- `src/engine/actions/base/ActionTrigger.ts`

**Core System:**
- `src/engine/actions/ActionExecutor.ts`
- `src/engine/actions/ModifierRegistry.ts`
- `src/engine/actions/TriggerRegistry.ts`

**Concrete Actions (18 total):**

*Core Actions:*
- `src/engine/actions/concrete/DealDamageAction.ts` - Deal damage to units
- `src/engine/actions/concrete/DrawCardAction.ts` - Draw cards from deck
- `src/engine/actions/concrete/PlayCardAction.ts` - Play card with timing validation
- `src/engine/actions/concrete/AddEnergyAction.ts` - Add energy to rune pool
- `src/engine/actions/concrete/AddPowerAction.ts` - Add power to rune pool
- `src/engine/actions/concrete/MoveUnitAction.ts` - Move unit between battlefields
- `src/engine/actions/concrete/HealDamageAction.ts` - Heal damage from units

*Card State Actions:*
- `src/engine/actions/concrete/DiscardCardAction.ts` - Discard from hand to trash
- `src/engine/actions/concrete/ExhaustCardAction.ts` - Exhaust card (ready → exhausted)
- `src/engine/actions/concrete/ReadyCardAction.ts` - Ready card (exhausted → ready)
- `src/engine/actions/concrete/RecycleCardAction.ts` - Return card to deck bottom
- `src/engine/actions/concrete/KillCardAction.ts` - Kill permanent (send to trash)
- `src/engine/actions/concrete/HideCardAction.ts` - Place card facedown
- `src/engine/actions/concrete/RevealCardAction.ts` - Reveal facedown card
- `src/engine/actions/concrete/BanishCardAction.ts` - Permanently remove from game

*Special Actions:*
- `src/engine/actions/concrete/ChannelRuneAction.ts` - Channel rune from deck
- `src/engine/actions/concrete/StunUnitAction.ts` - Apply stun status
- `src/engine/actions/concrete/CounterSpellAction.ts` - Counter spell on chain

**Concrete Modifiers:**
- `src/engine/actions/modifiers/DamageModifier.ts`
- `src/engine/actions/modifiers/CostModifier.ts`
- `src/engine/actions/modifiers/DrawModifier.ts`

**Concrete Triggers:**
- `src/engine/actions/triggers/OnDamageDealtTrigger.ts`
- `src/engine/actions/triggers/OnCardPlayedTrigger.ts`
- `src/engine/actions/triggers/OnUnitDeathTrigger.ts`

### 🚧 Next Steps

**Phase 6: Integration with V2 Card Scripting**
- Connect ActionExecutor to card scripts
- Provide modifierRegistry and triggerRegistry in CardScriptContext
- Migrate example cards to use V3 actions

**Future Enhancements:**
- More concrete actions (TapRuneAction, RecycleRuneAction, etc.)
- More modifiers (KeywordModifier, TargetModifier, etc.)
- More triggers (OnAttackTrigger, OnPlayTrigger, etc.)
- Integration with existing managers (GameManager, TurnManager, etc.)

---

## 📋 Indice

1. [Implementation Status](#implementation-status-updated-2025-10-09)
2. [Executive Summary](#executive-summary)
3. [Analisi del Sistema LoR](#analisi-del-sistema-lor)
4. [Problemi del Sistema V2 Attuale](#problemi-del-sistema-v2-attuale)
5. [Architettura del Sistema V3 - GameAction](#architettura-del-sistema-v3---gameaction)
6. [Componenti Core](#componenti-core)
7. [Sistema di Risoluzione](#sistema-di-risoluzione)
8. [Modifier System](#modifier-system)
9. [Trigger System](#trigger-system)
10. [Priority e Timing Rules](#priority-e-timing-rules)
11. [Integration con Card Scripts](#integration-con-card-scripts)
12. [Piano di Implementazione](#piano-di-implementazione)
13. [Esempi Pratici](#esempi-pratici)
14. [Testing Strategy](#testing-strategy)
15. [Performance Considerations](#performance-considerations)

---

## Executive Summary

### 🎯 Obiettivo

Implementare un sistema di **GameAction** completo, paragonabile a quello di Legends of Runeterra, che risolva i limiti critici del sistema V2 attuale:

- ❌ **Impossibilità di modificare effetti di altre carte**
- ❌ **Nessun replay deterministico**
- ❌ **Storia incompleta delle azioni**
- ❌ **Ordine di risoluzione indefinito**

### 🏆 Sistema Target: Legends of Runeterra

LoR utilizza un'architettura basata su **azioni dichiarative** che passano attraverso una **pipeline di modificatori** prima dell'esecuzione, permettendo:

- ✅ Carte che modificano gli effetti di altre carte
- ✅ Sistema di trigger per reazioni a eventi
- ✅ Risoluzione deterministica con priorità chiare
- ✅ Storia completa per replay e debug
- ✅ Network sync efficiente

### 📊 Scope del Progetto

**Durata stimata:** 4-6 settimane
**Complessità:** Alta
**Impatto:** Completa riscrittura del game engine core
**Backward compatibility:** Sistema V2 deprecato, migrazione necessaria

---

## Analisi del Sistema LoR

### 🔍 Come Funziona LoR

Legends of Runeterra utilizza un'architettura a **tre layer**:

```
┌─────────────────────────────────────────────────────────────┐
│                      CARD SCRIPTS                            │
│  Script dichiarano INTENZIONI, non eseguono mutazioni       │
│  es: "Voglio infliggere 3 danni a questa unità"            │
└───────────────────────┬─────────────────────────────────────┘
                        │ Crea GameAction
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   GAMEACTION PIPELINE                        │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ 1. PRE-     │→ │ 2. MODIFIERS │→ │ 3. EXECUTION    │   │
│  │ VALIDATION  │  │    APPLY      │  │    & TRIGGERS   │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │ Action modificata + log
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                      GAME STATE                              │
│  Lo state viene mutato SOLO qui, in modo controllato        │
└─────────────────────────────────────────────────────────────┘
```

### 🎮 Riftbound - Meccaniche Chiave

#### 1. **Card Timing System**

Riftbound ha 3 timing keywords che determinano quando le carte possono essere giocate:

| Timing Keyword | Quando si può giocare | Stati permessi | Esempio |
|----------------|----------------------|----------------|---------|
| **Default** | Solo nel proprio turno | Neutral Open | Maggioranza delle carte |
| **Action** | Anche durante Showdown | Neutral Open, Showdown Open/Closed | Spell di risposta |
| **Reaction** | Sempre, anche in Closed State | Tutti gli stati | Counter spell, instant effects |

```typescript
// Riftbound - Timing Check
export class PlayCardAction extends GameAction {
  validate(game: Game): ActionValidationResult {
    const card = this.data.card;
    const state = game.getTurnState();

    // Default: solo Neutral Open nel proprio turno
    if (!card.keywords.includes('Action') && !card.keywords.includes('Reaction')) {
      if (state !== TurnState.NEUTRAL_OPEN || !this.isActivePlayer()) {
        return this.validationFailure('Card can only be played during your Action Phase');
      }
    }

    // Action: anche durante Showdown
    if (card.keywords.includes('Action') && !card.keywords.includes('Reaction')) {
      if (!state.includes('SHOWDOWN') && state !== TurnState.NEUTRAL_OPEN) {
        return this.validationFailure('Action cards can only be played during Neutral Open or Showdowns');
      }
    }

    // Reaction: sempre
    // Nessuna restrizione per Reaction

    return this.validationSuccess();
  }
}
```

#### 2. **Chain Resolution**

La **Chain** di Riftbound funziona come uno stack LIFO per spell e abilità:

- Risoluzione **LIFO** (Last In, First Out)
- Dopo ogni risoluzione si esegue una **Cleanup**
- Permanents (Unit/Gear) non danno priority prima della risoluzione
- Tutti i Relevant Players devono passare in sequenza per risolvere

```typescript
// Riftbound - Chain Resolution
export class ChainResolver {
  private chain: ChainItem[] = [];

  async addToChain(item: SpellAction | ActivatedAbility): Promise<void> {
    this.chain.push(item);

    // Se il gioco era in Neutral Open, ora è in Neutral Closed (o Showdown Closed)
    this.game.enterClosedState();

    // Permanents non danno priority
    if (item.isPermanent) {
      await this.attemptResolution();
    }
  }

  async resolve(): Promise<void> {
    // LIFO: ultimo item risolve per primo
    const item = this.chain.pop();
    if (!item) return;

    // Esegui l'item
    await this.game.actions.execute(item.action);

    // Cleanup dopo ogni risoluzione
    await this.game.performCleanup();

    // Se chain vuota, torna a Open State
    if (this.chain.length === 0) {
      this.game.exitClosedState();
    }
  }
}
```

#### 3. **Combat Resolution**

Il combattimento di Riftbound segue una struttura rigida con Showdown:

```
Combat Structure:
1. Showdown Step (Initial Chain con trigger "When I attack"/"When I defend")
2. Combat Damage Step (distribuzione danno con Tank priority)
3. Resolution Step (rimuovi unità, verifica Conquer)
4. Cleanup

Distribuzione Danno:
- Attacker distribuisce per primo
- Unità con Tank devono ricevere danno letale prima
- Danno letale = danno ≥ Might dell'unità
```

```typescript
// Riftbound - Combat Resolution
export class ResolveCombatAction extends GameAction {
  async execute(game: Game): Promise<ActionExecutionResult> {
    const { attackers, defenders, battlefield } = this.data;

    // 1. Applica bonus Assault/Shield
    attackers.forEach(u => {
      if (u.keywords.includes('Assault')) u.temporaryMight += 1;
    });
    defenders.forEach(u => {
      if (u.keywords.includes('Shield')) u.temporaryMight += 1;
    });

    // 2. Calcola total Might
    const attackerMight = attackers.reduce((sum, u) => sum + u.getMight(), 0);
    const defenderMight = defenders.reduce((sum, u) => sum + u.getMight(), 0);

    // 3. Distribuisci danno (Attacker per primo)
    await this.distributeDamage(attackers, attackerMight, defenders);
    await this.distributeDamage(defenders, defenderMight, attackers);

    // 4. Rimuovi unità con danno letale
    await game.processDeaths();

    // 5. Verifica Conquer se solo attackers rimangono
    const remainingAttackers = attackers.filter(u => !u.isDead);
    const remainingDefenders = defenders.filter(u => !u.isDead);

    if (remainingAttackers.length > 0 && remainingDefenders.length === 0) {
      await this.processConquer(battlefield, this.controller);
    }

    return this.executionSuccess();
  }

  private async distributeDamage(
    sources: GameCard[],
    totalDamage: number,
    targets: GameCard[]
  ): Promise<void> {
    // Tank units devono ricevere danno letale prima
    const tanksFirst = [
      ...targets.filter(u => u.keywords.includes('Tank')),
      ...targets.filter(u => !u.keywords.includes('Tank'))
    ];

    let remainingDamage = totalDamage;

    for (const target of tanksFirst) {
      const lethalDamage = target.getMight();
      const damageToApply = Math.min(remainingDamage, lethalDamage);

      await game.actions.execute(new DealDamageAction(this.controller, {
        source: null, // Combat damage non ha singola source
        target,
        amount: damageToApply,
        damageType: 'combat'
      }));

      remainingDamage -= damageToApply;
      if (remainingDamage <= 0) break;
    }
  }
}
```

#### 4. **Priority & Focus System**

Riftbound usa **Priority** per azioni normali e **Focus** durante Showdown:

```typescript
export enum PriorityState {
  NONE = 'none',
  PRIORITY = 'priority',    // Può fare Discretionary Actions
  FOCUS = 'focus',          // Priority + controllo Showdown
}

export class PriorityManager {
  getCurrentPriorityPlayer(): Player | null {
    const state = this.game.getTurnState();

    // Neutral Open: Turn Player ha priority
    if (state === TurnState.NEUTRAL_OPEN) {
      return this.game.getTurnPlayer();
    }

    // Showdown Open: chi ha Focus ha priority
    if (state === TurnState.SHOWDOWN_OPEN) {
      return this.game.showdown.getFocusPlayer();
    }

    // Closed State: chi controlla il prossimo item sulla Chain
    if (state.includes('CLOSED')) {
      return this.getNextChainController();
    }

    return null;
  }

  passPriority(): void {
    const state = this.game.getTurnState();

    if (state.includes('SHOWDOWN')) {
      // Durante Showdown, passare priority mantiene Focus
      // Ma il prossimo Relevant Player riceve priority
      this.moveToNextRelevantPlayer();
    } else {
      // Durante Neutral, passare termina il turno/fase
      this.endCurrentPhase();
    }
  }
}
```

### 🧩 LoR - Pattern Architetturali

#### Pattern 1: **Aura System**

Le **aure** sono effetti persistenti che modificano le statistiche:

```csharp
// Es: "Le tue unità hanno +1|+1"
public class BuffAuraModifier : AuraModifier {
    public override void Apply(GameCard target) {
        if (target.Owner == this.Source.Owner) {
            target.Attack += 1;
            target.Health += 1;
        }
    }

    public override void Remove(GameCard target) {
        target.Attack -= 1;
        target.Health -= 1;
    }
}

// Le aure vengono ricalcolate a ogni cambio di board state
public class Game {
    public void UpdateAuras() {
        // 1. Rimuovi tutte le aure
        foreach (var unit in AllUnits) {
            unit.RemoveAllAuraEffects();
        }

        // 2. Riapplica aure attive
        foreach (var auraSource in GetActiveAuras()) {
            foreach (var target in auraSource.GetAffectedTargets()) {
                auraSource.Apply(target);
            }
        }
    }
}
```

#### Pattern 2: **Replacement Effects**

Effetti che **sostituiscono** un'azione con un'altra:

```csharp
// Es: "Barriera" - Previeni il prossimo danno
public class BarrierReplacementEffect : ReplacementEffect {
    public override GameAction Replace(GameAction action) {
        if (action is DealDamageAction dmg
            && dmg.Target == this.ProtectedUnit) {

            // Sostituisci con "no damage"
            this.Consume(); // Barriera si consuma
            return new NullAction();
        }
        return action;
    }
}
```

#### Pattern 3: **Triggered Abilities**

Abilità che si attivano in risposta a eventi:

```csharp
// Es: Yasuo - "Quando stordisci un nemico, infliggi 2 danni"
public class YasuoTrigger : TriggeredAbility {
    public override void OnActionExecuted(GameAction action) {
        if (action is StunUnitAction stun
            && stun.Source.Owner == this.Owner) {

            // Crea nuova action come conseguenza
            var damage = new DealDamageAction(
                source: this.Unit,
                target: stun.Target,
                amount: 2
            );

            game.QueueAction(damage); // In coda, non immediato
        }
    }
}
```

### 📊 LoR - Sequence Diagram

```
Player 1              GameEngine           ModifierSystem        TriggerSystem
   │                      │                      │                     │
   │  Play Spell (3 dmg)  │                      │                     │
   │─────────────────────>│                      │                     │
   │                      │                      │                     │
   │                      │ Create DealDamageAction(3)                │
   │                      │                      │                     │
   │                      │ Apply Modifiers      │                     │
   │                      │─────────────────────>│                     │
   │                      │                      │                     │
   │                      │                      │ +1 from SpellDamage │
   │                      │                      │ x2 from Modifier    │
   │                      │                      │                     │
   │                      │ Modified Action (8)  │                     │
   │                      │<─────────────────────│                     │
   │                      │                      │                     │
   │                      │ Execute(8 damage)    │                     │
   │                      │                      │                     │
   │                      │ Notify Triggers      │                     │
   │                      │──────────────────────────────────────────>│
   │                      │                      │                     │
   │                      │                      │   Yasuo: deal 2 dmg│
   │                      │<──────────────────────────────────────────│
   │                      │                      │                     │
   │                      │ Execute Yasuo dmg    │                     │
   │                      │                      │                     │
```

---

## Problemi del Sistema V2 Attuale

### ❌ Problema 1: Impossibile Modificare Effetti di Altre Carte

**Scenario:** "I tuoi spell infliggono +1 danno"

```typescript
// V2 ATTUALE - ❌ NON FUNZIONA
export default {
  onPlay: async (ctx: CardContext) => {
    // Script dello spell infligge 3 danni
    ctx.target.damage += 3;

    // ❌ Non sa del +1 da altra carta!
    // ❌ Ogni spell deve controllare TUTTE le carte in gioco
  }
};
```

**Workaround attuale (inaccettabile):**

```typescript
// ❌ Codice duplicato in OGNI spell
onPlay: async (ctx: CardContext) => {
  let damage = 3;

  // Controlla ogni carta per modifier
  for (const unit of ctx.game.battlefield.units) {
    if (unit.cardId === 'SPELL_DAMAGE_PLUS_ONE') damage += 1;
    if (unit.cardId === 'SPELL_DAMAGE_TIMES_TWO') damage *= 2;
    // ... devi aggiungere ogni possibile modifier!
  }

  ctx.target.damage += damage;
}
```

### ❌ Problema 2: Ordine di Risoluzione Indefinito

**Scenario:** +1 danno E x2 danno - Quale si applica prima?

```typescript
// V2 ATTUALE - ❌ ORDINE CASUALE
// Spell fa 3 danni base
// +1 poi x2 = (3+1)*2 = 8 ✅
// x2 poi +1 = (3*2)+1 = 7 ❌

// Non c'è modo di controllare l'ordine!
```

### ❌ Problema 3: Trigger Non Gestiti

**Scenario:** Yasuo "Quando stordisci, infliggi 2 danni"

```typescript
// V2 ATTUALE - ❌ POLLING MANUALE
export default {
  onTurnEnd: async (ctx: CardContext) => {
    // ❌ Devi controllare TUTTA la history per vedere se hai stordito
    const stunEvents = ctx.game.history.filter(e =>
      e.type === 'STUN' &&
      e.source === ctx.self.instanceId &&
      isCurrentTurn(e)
    );

    // ❌ Cosa succede se stordisci 3 volte nello stesso turno?
    // ❌ E se la history non è completa?
  }
};
```

### ❌ Problema 4: Effetti che Prevengono Azioni

**Scenario:** "Barriera" - Previeni il prossimo danno

```typescript
// V2 ATTUALE - ❌ IMPOSSIBILE
export default {
  onPlay: async (ctx: CardContext) => {
    // ❌ Come blocchi il danno di ALTRI script?
    // ❌ Gli script mutano direttamente ctx.target.damage
    // ❌ Non c'è modo di intercettare
  }
};
```

### ❌ Problema 5: Storia Incompleta

```typescript
// V2 ATTUALE - ❌ LOGGING MANUALE
onPlay: async (ctx: CardContext) => {
  ctx.target.damage += 3;

  // ❌ Se dimentichi questo, la history è incompleta
  ctx.game.history.push({
    type: EventType.DAMAGE_DEALT,
    // ...
  });
}
```

### 📊 Tabella Comparativa

| Feature | V2 Attuale | V3 GameAction | Necessario? |
|---------|------------|---------------|-------------|
| **Modifier su altri effetti** | ❌ Impossibile | ✅ Pipeline | ✅ CRITICO |
| **Ordine di risoluzione** | ❌ Indefinito | ✅ Priority-based | ✅ CRITICO |
| **Trigger automatici** | ❌ Polling | ✅ Event-driven | ✅ CRITICO |
| **Replacement effects** | ❌ Impossibile | ✅ Pre-execution | ✅ ALTO |
| **Storia completa** | ⚠️ Manuale | ✅ Auto-log | ✅ ALTO |
| **Replay** | ❌ No | ✅ Sì | ⚠️ MEDIO |
| **Rollback** | ❌ No | ✅ Sì | ⚠️ MEDIO |
| **Network sync** | ⚠️ State completo | ✅ Actions | ⚠️ MEDIO |

---

## Architettura del Sistema V3 - GameAction

### 🏗️ Overview Architetturale

```
┌─────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                            │
│                     (GameManager, TurnManager)                       │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ Requests Actions
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       CARD SCRIPT LAYER                              │
│  Scripts create GameActions (dichiarative, no mutations)             │
│                                                                       │
│  Example:                                                             │
│    const action = new DealDamageAction(source, target, 3, 'spell')  │
│    await ctx.game.actions.execute(action)                            │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ Submit Action
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      ACTION EXECUTOR                                 │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  1. VALIDATE │→ │  2. MODIFY   │→ │  3. EXECUTE & TRIGGER    │  │
│  │              │  │              │  │                          │  │
│  │  - Can play? │  │  - Modifiers │  │  - Mutate state          │  │
│  │  - Valid     │  │  - Priority  │  │  - Log to history        │  │
│  │    target?   │  │  - Replace   │  │  - Fire triggers         │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│                            │                    │                    │
│                            │                    │                    │
└────────────────────────────┼────────────────────┼────────────────────┘
                             │                    │
                             ▼                    ▼
              ┌──────────────────────┐  ┌──────────────────────┐
              │   MODIFIER REGISTRY  │  │   TRIGGER REGISTRY   │
              │                      │  │                      │
              │  - Auras             │  │  - When X, do Y      │
              │  - Buffs/Debuffs     │  │  - Priority queue    │
              │  - Cost reduction    │  │  - One-shot/Persist  │
              └──────────────────────┘  └──────────────────────┘
                             │                    │
                             └────────┬───────────┘
                                      ▼
                          ┌───────────────────────┐
                          │     GAME STATE        │
                          │                       │
                          │  - Mutated ONLY by    │
                          │    Action.execute()   │
                          │  - Immutable elsewhere│
                          └───────────────────────┘
```

### 🎯 Design Principles

1. **Actions are Declarative**
   - Actions describe WHAT you want to do, not HOW
   - Actions are immutable objects (modificati solo dalla pipeline)

2. **Single Mutation Point**
   - Solo `action.execute()` può mutare il game state
   - Tutto il resto è read-only

3. **Modifier Pipeline**
   - Ogni action passa attraverso modificatori registrati
   - Ordine garantito da priority system

4. **Event-Driven Triggers**
   - Trigger si registrano per eventi specifici
   - Attivati automaticamente dopo action execution

5. **Complete Audit Trail**
   - Ogni action è loggata automaticamente
   - History completa per replay/debug

---

## Componenti Core

### 1. GameAction (Abstract Base)

```typescript
/**
 * Base class for all game actions.
 * Actions are DECLARATIVE - they describe intent, not implementation.
 */
export abstract class GameAction<TData = any> {
  // Unique ID per questa action instance
  readonly id: string;

  // Tipo di action (per matching con modifier/trigger)
  abstract readonly type: GameActionType;

  // Chi ha iniziato questa action
  readonly source?: GameCard;

  // Player che controlla questa action
  readonly controller: Player;

  // Quando è stata creata
  readonly timestamp: Date;

  // Dati specifici dell'action (modificabile dalla pipeline)
  data: TData;

  // Metadata per debug/replay
  metadata: {
    originScript?: string;
    stackDepth: number;
    isTriggered: boolean; // True se generata da trigger
  };

  constructor(controller: Player, data: TData) {
    this.id = generateUniqueId();
    this.controller = controller;
    this.data = data;
    this.timestamp = new Date();
    this.metadata = {
      stackDepth: 0,
      isTriggered: false,
    };
  }

  /**
   * Validation: Can this action be executed?
   * Called BEFORE modifiers.
   */
  abstract validate(game: Game): ActionValidationResult;

  /**
   * Execution: Apply the action to game state.
   * Called AFTER modifiers have been applied.
   * This is the ONLY place where game state should be mutated.
   */
  abstract execute(game: Game): ActionExecutionResult;

  /**
   * Generate history entry for this action.
   * Called automatically after execution.
   */
  abstract toHistoryEntry(): GameEvent;

  /**
   * Clone this action (used by modifiers to create modified versions)
   */
  abstract clone(): GameAction<TData>;
}

export interface ActionValidationResult {
  valid: boolean;
  reason?: string;
}

export interface ActionExecutionResult {
  success: boolean;
  error?: Error;
  sideEffects?: GameAction[]; // Azioni generate come conseguenza
}
```

### 2. GameActionType Enum

```typescript
/**
 * Tutti i tipi di action nel gioco.
 * Usato per matching con modifier/trigger.
 */
export enum GameActionType {
  // ===== CARD ACTIONS =====
  PLAY_CARD = 'play_card',
  DRAW_CARD = 'draw_card',
  DISCARD_CARD = 'discard_card',
  MILL_CARD = 'mill_card',

  // ===== ZONE ACTIONS =====
  MOVE_CARD = 'move_card',
  SHUFFLE_DECK = 'shuffle_deck',
  REVEAL_CARD = 'reveal_card',

  // ===== COMBAT ACTIONS =====
  DECLARE_ATTACK = 'declare_attack',
  DECLARE_BLOCK = 'declare_block',
  DEAL_COMBAT_DAMAGE = 'deal_combat_damage',

  // ===== DAMAGE & HEALING =====
  DEAL_DAMAGE = 'deal_damage',
  HEAL_DAMAGE = 'heal_damage',
  PREVENT_DAMAGE = 'prevent_damage',

  // ===== STATUS EFFECTS =====
  APPLY_BUFF = 'apply_buff',
  APPLY_DEBUFF = 'apply_debuff',
  REMOVE_EFFECT = 'remove_effect',
  STUN_UNIT = 'stun_unit',
  SILENCE_UNIT = 'silence_unit',

  // ===== KEYWORD ACTIONS =====
  GRANT_KEYWORD = 'grant_keyword',
  REMOVE_KEYWORD = 'remove_keyword',

  // ===== RESOURCE ACTIONS =====
  ADD_ENERGY = 'add_energy',
  SPEND_ENERGY = 'spend_energy',
  ADD_POWER = 'add_power',
  SPEND_POWER = 'spend_power',
  TAP_RUNE = 'tap_rune',
  RECYCLE_RUNE = 'recycle_rune',

  // ===== SPECIAL ACTIONS =====
  CREATE_TOKEN = 'create_token',
  TRANSFORM_CARD = 'transform_card',
  COPY_CARD = 'copy_card',

  // ===== SPELL ACTIONS =====
  CAST_SPELL = 'cast_spell',
  COUNTER_SPELL = 'counter_spell',
  RESOLVE_SPELL = 'resolve_spell',

  // ===== TURN ACTIONS =====
  START_TURN = 'start_turn',
  END_TURN = 'end_turn',
  PASS_PRIORITY = 'pass_priority',
  PASS_FOCUS = 'pass_focus',

  // ===== SHOWDOWN ACTIONS =====
  ENTER_SHOWDOWN = 'enter_showdown',
  EXIT_SHOWDOWN = 'exit_showdown',
  START_COMBAT = 'start_combat',
  RESOLVE_COMBAT = 'resolve_combat',

  // ===== BATTLEFIELD ACTIONS =====
  MOVE_UNIT = 'move_unit',
  CONQUER_BATTLEFIELD = 'conquer_battlefield',
  GAIN_CONTROL = 'gain_control',
  LOSE_CONTROL = 'lose_control',

  // ===== SCORING ACTIONS =====
  SCORE_HOLD = 'score_hold',
  SCORE_CONQUER = 'score_conquer',
  GAIN_POINT = 'gain_point',

  // ===== CLEANUP ACTIONS =====
  PERFORM_CLEANUP = 'perform_cleanup',
  CHECK_DEATHS = 'check_deaths',

  // ===== META ACTIONS =====
  NULL_ACTION = 'null_action', // Action che non fa nulla (per replacement)
}
```

### 3. Action Executor

```typescript
/**
 * Core engine che esegue le action attraverso la pipeline.
 */
export class ActionExecutor {
  private game: Game;
  private modifierRegistry: ModifierRegistry;
  private triggerRegistry: TriggerRegistry;
  private actionHistory: GameAction[] = [];
  private executionStack: GameAction[] = [];

  constructor(game: Game) {
    this.game = game;
    this.modifierRegistry = new ModifierRegistry();
    this.triggerRegistry = new TriggerRegistry();
  }

  /**
   * Main entry point: Execute an action through the full pipeline.
   */
  async execute(action: GameAction): Promise<ActionExecutionResult> {
    // Verifica stack depth per prevenire infinite recursion
    if (this.executionStack.length > MAX_STACK_DEPTH) {
      throw new Error('Action stack overflow - infinite recursion detected');
    }

    this.executionStack.push(action);
    action.metadata.stackDepth = this.executionStack.length;

    try {
      // ===== PHASE 1: VALIDATION =====
      const validation = action.validate(this.game);
      if (!validation.valid) {
        return {
          success: false,
          error: new Error(`Action validation failed: ${validation.reason}`),
        };
      }

      // ===== PHASE 2: MODIFIER PIPELINE =====
      let modifiedAction = await this.applyModifiers(action);

      // Check per replacement effects (action potrebbe essere sostituita)
      if (modifiedAction.type === GameActionType.NULL_ACTION) {
        // Action è stata completamente prevenuta
        return { success: true };
      }

      // ===== PHASE 3: EXECUTION =====
      const result = modifiedAction.execute(this.game);

      if (!result.success) {
        return result;
      }

      // ===== PHASE 4: HISTORY LOGGING =====
      this.actionHistory.push(modifiedAction);
      const historyEntry = modifiedAction.toHistoryEntry();
      this.game.history.push(historyEntry);

      // ===== PHASE 5: TRIGGER RESOLUTION =====
      const triggeredActions = await this.resolveTriggers(modifiedAction);

      // ===== PHASE 6: EXECUTE SIDE EFFECTS =====
      const sideEffects = [
        ...(result.sideEffects || []),
        ...triggeredActions,
      ];

      for (const sideEffect of sideEffects) {
        sideEffect.metadata.isTriggered = true;
        await this.execute(sideEffect); // Ricorsivo
      }

      return { success: true };

    } finally {
      this.executionStack.pop();

      // Se siamo tornati a stack depth 0, esegui cleanup
      if (this.executionStack.length === 0) {
        await this.performPostResolutionCleanup();
      }
    }
  }

  /**
   * Apply all active modifiers to an action.
   */
  private async applyModifiers(action: GameAction): Promise<GameAction> {
    const modifiers = this.modifierRegistry.getModifiersFor(action.type);

    // Ordina per priorità
    modifiers.sort((a, b) => a.priority - b.priority);

    let currentAction = action;

    for (const modifier of modifiers) {
      if (!modifier.isActive(this.game)) {
        continue;
      }

      // Modifier può restituire una nuova action o null (previene)
      const modified = await modifier.modify(currentAction, this.game);

      if (modified === null) {
        // Modifier previene completamente l'action
        return new NullAction() as any;
      }

      currentAction = modified;
    }

    return currentAction;
  }

  /**
   * Resolve triggers that react to an action.
   */
  private async resolveTriggers(action: GameAction): Promise<GameAction[]> {
    const triggers = this.triggerRegistry.getTriggersFor(action.type);

    // Ordina per priorità
    triggers.sort((a, b) => a.priority - b.priority);

    const triggeredActions: GameAction[] = [];

    for (const trigger of triggers) {
      if (!trigger.isActive(this.game)) {
        continue;
      }

      const actions = await trigger.onAction(action, this.game);
      triggeredActions.push(...actions);

      // One-shot trigger si consuma
      if (trigger.isOneShot) {
        this.triggerRegistry.unregister(trigger);
      }
    }

    return triggeredActions;
  }

  /**
   * Cleanup eseguito quando stack torna a 0.
   */
  private async performPostResolutionCleanup(): Promise<void> {
    // 1. Update auras (ricalcola tutti i buff/debuff)
    await this.game.auraSystem.update();

    // 2. Process deaths (state-based action)
    await this.game.processDeaths();

    // 3. Cleanup expired modifiers
    this.modifierRegistry.cleanupExpired();

    // 4. Cleanup expired triggers
    this.triggerRegistry.cleanupExpired();
  }

  /**
   * Get complete action history (for replay)
   */
  getActionHistory(): ReadonlyArray<GameAction> {
    return this.actionHistory;
  }
}
```

### 4. Modifier Registry

```typescript
/**
 * Registry che tiene traccia di tutti i modifier attivi.
 */
export class ModifierRegistry {
  private modifiers: Map<GameActionType, ActionModifier[]> = new Map();

  /**
   * Register a modifier for a specific action type.
   */
  register(actionType: GameActionType, modifier: ActionModifier): void {
    if (!this.modifiers.has(actionType)) {
      this.modifiers.set(actionType, []);
    }

    this.modifiers.get(actionType)!.push(modifier);
  }

  /**
   * Register a modifier for multiple action types.
   */
  registerMultiple(actionTypes: GameActionType[], modifier: ActionModifier): void {
    for (const type of actionTypes) {
      this.register(type, modifier);
    }
  }

  /**
   * Unregister a specific modifier.
   */
  unregister(modifier: ActionModifier): void {
    for (const [type, modifiers] of this.modifiers.entries()) {
      const index = modifiers.indexOf(modifier);
      if (index !== -1) {
        modifiers.splice(index, 1);
      }
    }
  }

  /**
   * Unregister all modifiers from a specific source card.
   */
  unregisterBySource(sourceCardId: string): void {
    for (const modifiers of this.modifiers.values()) {
      for (let i = modifiers.length - 1; i >= 0; i--) {
        if (modifiers[i].sourceCard?.instanceId === sourceCardId) {
          modifiers.splice(i, 1);
        }
      }
    }
  }

  /**
   * Get all modifiers for a specific action type.
   */
  getModifiersFor(actionType: GameActionType): ActionModifier[] {
    return this.modifiers.get(actionType) || [];
  }

  /**
   * Cleanup expired modifiers.
   */
  cleanupExpired(): void {
    for (const [type, modifiers] of this.modifiers.entries()) {
      this.modifiers.set(
        type,
        modifiers.filter(m => !m.isExpired())
      );
    }
  }
}
```

### 5. Trigger Registry

```typescript
/**
 * Registry che tiene traccia di tutti i trigger attivi.
 */
export class TriggerRegistry {
  private triggers: Map<GameActionType, ActionTrigger[]> = new Map();

  /**
   * Register a trigger for a specific action type.
   */
  register(actionType: GameActionType, trigger: ActionTrigger): void {
    if (!this.triggers.has(actionType)) {
      this.triggers.set(actionType, []);
    }

    this.triggers.get(actionType)!.push(trigger);
  }

  /**
   * Register a trigger for multiple action types.
   */
  registerMultiple(actionTypes: GameActionType[], trigger: ActionTrigger): void {
    for (const type of actionTypes) {
      this.register(type, trigger);
    }
  }

  /**
   * Unregister a specific trigger.
   */
  unregister(trigger: ActionTrigger): void {
    for (const [type, triggers] of this.triggers.entries()) {
      const index = triggers.indexOf(trigger);
      if (index !== -1) {
        triggers.splice(index, 1);
      }
    }
  }

  /**
   * Unregister all triggers from a specific source card.
   */
  unregisterBySource(sourceCardId: string): void {
    for (const triggers of this.triggers.values()) {
      for (let i = triggers.length - 1; i >= 0; i--) {
        if (triggers[i].sourceCard?.instanceId === sourceCardId) {
          triggers.splice(i, 1);
        }
      }
    }
  }

  /**
   * Get all triggers for a specific action type.
   */
  getTriggersFor(actionType: GameActionType): ActionTrigger[] {
    return this.triggers.get(actionType) || [];
  }

  /**
   * Cleanup expired triggers.
   */
  cleanupExpired(): void {
    for (const [type, triggers] of this.triggers.entries()) {
      this.triggers.set(
        type,
        triggers.filter(t => !t.isExpired())
      );
    }
  }
}
```

---

## Sistema di Risoluzione

### Chain-Based Resolution

Implementeremo il sistema di Chain di Riftbound per la risoluzione di spell e abilità:

```typescript
/**
 * Chain per la risoluzione di spell e abilità secondo le regole Riftbound.
 * Segue la regola LIFO (Last In, First Out).
 */
export class GameChain {
  private chain: ChainEntry[] = [];
  private passCount: number = 0; // Contatore di pass consecutivi

  /**
   * Add spell/ability to the Chain.
   */
  async add(action: GameAction, timing: CardTiming): Promise<void> {
    const entry: ChainEntry = {
      action,
      timing,
      controller: action.controller,
      timestamp: Date.now(),
    };

    this.chain.push(entry);

    // Il gioco entra in Closed State
    this.game.enterClosedState();

    // Reset pass count
    this.passCount = 0;

    // Permanents (Unit/Gear) non danno priority prima di risoluzione
    if (action.data.isPermanent) {
      // Priority passa automaticamente
      await this.attemptResolution();
    }
  }

  /**
   * Player passa priority.
   */
  async passPriority(player: Player): Promise<void> {
    this.passCount++;

    const relevantPlayers = this.getRelevantPlayers();

    // Se tutti i Relevant Players hanno passato in sequenza → risolvi
    if (this.passCount >= relevantPlayers.length) {
      await this.resolveTop();
    } else {
      // Priority passa al prossimo Relevant Player
      this.moveToNextRelevantPlayer();
    }
  }

  /**
   * Risolvi il top item della Chain.
   */
  private async resolveTop(): Promise<void> {
    if (this.chain.length === 0) return;

    // LIFO: ultimo item risolve per primo
    const entry = this.chain.pop()!;

    // Esegui l'action
    await this.game.actions.execute(entry.action);

    // Reset pass count
    this.passCount = 0;

    // Cleanup DOPO ogni risoluzione (regole Riftbound)
    await this.game.performCleanup();

    // Se Chain vuota, torna a Open State
    if (this.chain.length === 0) {
      this.game.exitClosedState();

      // Se eravamo in Showdown, Focus passa
      if (this.game.isShowdown()) {
        this.game.showdown.passFocus();
      }
    } else {
      // Altrimenti, continua con il prossimo item
      // Priority al controller del prossimo item
      await this.attemptResolution();
    }
  }

  /**
   * Tentativo di risoluzione automatica (per permanents).
   */
  private async attemptResolution(): Promise<void> {
    // Se tutti passano subito → risolvi
    const relevantPlayers = this.getRelevantPlayers();

    // Dai priority ai Relevant Players in ordine
    // (simulato - in realtà il gioco chiederà input)
  }

  /**
   * Check if Chain is empty.
   */
  isEmpty(): boolean {
    return this.chain.length === 0;
  }

  /**
   * Get Chain size.
   */
  size(): number {
    return this.chain.length;
  }

  /**
   * Peek at top of Chain without removing.
   */
  peek(): ChainEntry | null {
    return this.chain.length > 0 ? this.chain[this.chain.length - 1] : null;
  }

  /**
   * Get Relevant Players per questa Chain.
   */
  private getRelevantPlayers(): Player[] {
    // Logic per determinare chi può rispondere
    // (dipende dal contesto - Combat, Showdown, etc.)
    return this.game.getRelevantPlayers();
  }
}

interface ChainEntry {
  action: GameAction;
  timing: CardTiming;
  controller: Player;
  timestamp: number;
}

/**
 * Card Timing (Riftbound keywords)
 */
export enum CardTiming {
  DEFAULT = 'default',     // Solo Neutral Open nel proprio turno
  ACTION = 'action',       // Anche durante Showdown
  REACTION = 'reaction',   // Sempre, anche in Closed State
}
```

### Priority System

```typescript
/**
 * Sistema di priorità per modifier e trigger.
 * Numeri più bassi = priorità più alta (eseguiti prima).
 */
export enum ModifierPriority {
  // Replacement effects (prevengono completamente un'action)
  REPLACEMENT = -100,

  // Cost reduction/increase
  COST_MODIFICATION = -50,

  // Damage prevention (Barriera, Shield)
  PREVENTION = -25,

  // Damage/healing modification
  DAMAGE_MODIFICATION = 0,

  // Stat buffs/debuffs
  STAT_MODIFICATION = 25,

  // Keyword grants
  KEYWORD_MODIFICATION = 50,

  // Post-effects (dopo tutto il resto)
  POST_EFFECT = 100,
}

export enum TriggerPriority {
  // Triggers che devono eseguire prima di tutto
  VERY_HIGH = -100,

  // Triggers normali (maggioranza)
  NORMAL = 0,

  // Triggers di cleanup (es: rimuovi effetto temporaneo)
  CLEANUP = 100,
}

/**
 * Base class for modifiers with priority support.
 */
export abstract class ActionModifier {
  abstract readonly type: string;
  abstract readonly priority: number;

  sourceCard?: GameCard;
  expiresAt?: Date;
  expiresAfterUses?: number;
  currentUses: number = 0;

  /**
   * Modify an action.
   * Return null to completely prevent the action.
   */
  abstract modify(
    action: GameAction,
    game: Game
  ): Promise<GameAction | null>;

  /**
   * Check if this modifier is currently active.
   */
  abstract isActive(game: Game): boolean;

  /**
   * Check if this modifier has expired.
   */
  isExpired(): boolean {
    if (this.expiresAt && Date.now() > this.expiresAt.getTime()) {
      return true;
    }

    if (this.expiresAfterUses !== undefined && this.currentUses >= this.expiresAfterUses) {
      return true;
    }

    return false;
  }
}

/**
 * Base class for triggers with priority support.
 */
export abstract class ActionTrigger {
  abstract readonly type: string;
  abstract readonly priority: number;

  sourceCard?: GameCard;
  isOneShot: boolean = false; // Se true, trigger si consuma dopo 1 uso
  expiresAt?: Date;

  /**
   * React to an action and optionally create new actions.
   */
  abstract onAction(
    action: GameAction,
    game: Game
  ): Promise<GameAction[]>;

  /**
   * Check if this trigger is currently active.
   */
  abstract isActive(game: Game): boolean;

  /**
   * Check if this trigger has expired.
   */
  isExpired(): boolean {
    if (this.expiresAt && Date.now() > this.expiresAt.getTime()) {
      return true;
    }

    return false;
  }
}
```

---

## Modifier System

### Concrete Modifier Examples

```typescript
/**
 * Example 1: Spell Damage +1
 * "I tuoi spell infliggono +1 danno"
 */
export class SpellDamagePlusOneModifier extends ActionModifier {
  readonly type = 'spell_damage_plus_one';
  readonly priority = ModifierPriority.DAMAGE_MODIFICATION;

  constructor(
    public sourceCard: GameCard,
    public owner: Player
  ) {
    super();
  }

  async modify(action: GameAction, game: Game): Promise<GameAction | null> {
    // Solo su DealDamage da spell del proprietario
    if (!(action instanceof DealDamageAction)) {
      return action;
    }

    if (action.data.damageType !== 'spell') {
      return action;
    }

    if (action.source?.ownerId !== this.owner.id) {
      return action;
    }

    // Crea versione modificata con +1 danno
    const modified = action.clone();
    modified.data.amount += 1;

    return modified;
  }

  isActive(game: Game): boolean {
    // Attivo finché la carta è in gioco
    return game.battlefield.units.some(
      u => u.instanceId === this.sourceCard.instanceId
    );
  }
}

/**
 * Example 2: Barrier (Barriera)
 * "Previeni il prossimo danno a questa unità"
 */
export class BarrierModifier extends ActionModifier {
  readonly type = 'barrier';
  readonly priority = ModifierPriority.PREVENTION; // Alta priorità

  constructor(
    public protectedUnit: GameCard
  ) {
    super();
    this.expiresAfterUses = 1; // Consuma dopo 1 uso
  }

  async modify(action: GameAction, game: Game): Promise<GameAction | null> {
    if (!(action instanceof DealDamageAction)) {
      return action;
    }

    // Solo se il target è l'unità protetta
    if (action.data.target.instanceId !== this.protectedUnit.instanceId) {
      return action;
    }

    // Previeni completamente il danno
    this.currentUses++;

    // Crea visual effect per barriera
    game.effects.createEffect('barrier_block', this.protectedUnit);

    // Return NULL = action completamente prevenuta
    return null;
  }

  isActive(game: Game): boolean {
    // Attivo finché l'unità è in gioco
    return game.battlefield.units.some(
      u => u.instanceId === this.protectedUnit.instanceId
    );
  }
}

/**
 * Example 3: Cost Reduction
 * "I tuoi spell costano 1 in meno"
 */
export class SpellCostReductionModifier extends ActionModifier {
  readonly type = 'spell_cost_reduction';
  readonly priority = ModifierPriority.COST_MODIFICATION;

  constructor(
    public owner: Player,
    public reduction: number = 1
  ) {
    super();
  }

  async modify(action: GameAction, game: Game): Promise<GameAction | null> {
    if (!(action instanceof PlayCardAction)) {
      return action;
    }

    // Solo spell del proprietario
    if (action.data.card.cardType !== 'spell') {
      return action;
    }

    if (action.controller.id !== this.owner.id) {
      return action;
    }

    // Riduci costo (minimo 0)
    const modified = action.clone();
    modified.data.energyCost = Math.max(0, modified.data.energyCost - this.reduction);

    return modified;
  }

  isActive(game: Game): boolean {
    return true; // Sempre attivo (gestito dall'esterno)
  }
}

/**
 * Example 4: Damage Doubling
 * "Il prossimo danno che infliggi viene raddoppiato"
 */
export class DoubleDamageModifier extends ActionModifier {
  readonly type = 'double_damage';
  readonly priority = ModifierPriority.DAMAGE_MODIFICATION + 1; // Dopo +X, prima *Y

  constructor(
    public owner: Player
  ) {
    super();
    this.expiresAfterUses = 1; // One-shot
  }

  async modify(action: GameAction, game: Game): Promise<GameAction | null> {
    if (!(action instanceof DealDamageAction)) {
      return action;
    }

    if (action.source?.ownerId !== this.owner.id) {
      return action;
    }

    // Raddoppia danno
    const modified = action.clone();
    modified.data.amount *= 2;

    this.currentUses++;

    return modified;
  }

  isActive(game: Game): boolean {
    return true;
  }
}

/**
 * Example 5: Silence (Silenzio)
 * "Rimuovi tutti gli effetti da un'unità"
 */
export class SilenceModifier extends ActionModifier {
  readonly type = 'silence';
  readonly priority = ModifierPriority.REPLACEMENT;

  constructor(
    public targetUnit: GameCard
  ) {
    super();
  }

  async modify(action: GameAction, game: Game): Promise<GameAction | null> {
    // Blocca QUALSIASI action triggerata dalla carta silenziata
    if (action.source?.instanceId === this.targetUnit.instanceId) {
      // Previeni abilità attivate
      return null;
    }

    return action;
  }

  isActive(game: Game): boolean {
    return game.battlefield.units.some(
      u => u.instanceId === this.targetUnit.instanceId
    );
  }
}
```

### Aura System

Le **aure** sono modifier persistenti che si applicano automaticamente:

```typescript
/**
 * Aura modifier - applies continuously to all valid targets.
 */
export abstract class AuraModifier extends ActionModifier {
  abstract getAffectedTargets(game: Game): GameCard[];
  abstract applyAuraEffect(target: GameCard): void;
  abstract removeAuraEffect(target: GameCard): void;

  /**
   * Update aura - called when board state changes.
   */
  update(game: Game): void {
    const currentTargets = this.getAffectedTargets(game);

    // Trova target che non sono più affetti
    for (const previousTarget of this.previousTargets) {
      if (!currentTargets.includes(previousTarget)) {
        this.removeAuraEffect(previousTarget);
      }
    }

    // Applica a nuovi target
    for (const target of currentTargets) {
      if (!this.previousTargets.includes(target)) {
        this.applyAuraEffect(target);
      }
    }

    this.previousTargets = currentTargets;
  }

  private previousTargets: GameCard[] = [];
}

/**
 * Example: "Le tue unità hanno +1|+1"
 */
export class GlobalBuffAura extends AuraModifier {
  readonly type = 'global_buff_aura';
  readonly priority = ModifierPriority.STAT_MODIFICATION;

  constructor(
    public sourceCard: GameCard,
    public owner: Player,
    public attackBonus: number,
    public healthBonus: number
  ) {
    super();
  }

  getAffectedTargets(game: Game): GameCard[] {
    return game.battlefield.units.filter(u => u.ownerId === this.owner.id);
  }

  applyAuraEffect(target: GameCard): void {
    target.temporaryModifiers.push({
      type: 'aura_buff',
      source: this.sourceCard.instanceId,
      attackDelta: this.attackBonus,
      healthDelta: this.healthBonus,
    });
  }

  removeAuraEffect(target: GameCard): void {
    target.temporaryModifiers = target.temporaryModifiers.filter(
      m => !(m.type === 'aura_buff' && m.source === this.sourceCard.instanceId)
    );
  }

  // Aura non modifica action, solo board state
  async modify(action: GameAction, game: Game): Promise<GameAction | null> {
    return action;
  }

  isActive(game: Game): boolean {
    return game.battlefield.units.some(
      u => u.instanceId === this.sourceCard.instanceId
    );
  }
}
```

---

## Trigger System

### Concrete Trigger Examples

```typescript
/**
 * Example 1: Yasuo
 * "Quando stordisci un nemico, infliggi 2 danni a quell'unità"
 */
export class YasuoStunTrigger extends ActionTrigger {
  readonly type = 'yasuo_stun_trigger';
  readonly priority = TriggerPriority.NORMAL;

  constructor(
    public sourceCard: GameCard
  ) {
    super();
  }

  async onAction(action: GameAction, game: Game): Promise<GameAction[]> {
    // Solo su stun da questa carta o dal suo proprietario
    if (!(action instanceof StunUnitAction)) {
      return [];
    }

    const owner = game.players.find(p => p.id === this.sourceCard.ownerId);
    if (!owner || action.controller.id !== owner.id) {
      return [];
    }

    // Crea action per infliggere 2 danni
    const damageAction = new DealDamageAction(owner, {
      source: this.sourceCard,
      target: action.data.target,
      amount: 2,
      damageType: 'effect',
    });

    return [damageAction];
  }

  isActive(game: Game): boolean {
    return game.battlefield.units.some(
      u => u.instanceId === this.sourceCard.instanceId
    );
  }
}

/**
 * Example 2: Draw When Unit Dies
 * "Quando un'unità muore, pesca una carta"
 */
export class DrawOnDeathTrigger extends ActionTrigger {
  readonly type = 'draw_on_death';
  readonly priority = TriggerPriority.NORMAL;

  constructor(
    public sourceCard: GameCard,
    public owner: Player
  ) {
    super();
  }

  async onAction(action: GameAction, game: Game): Promise<GameAction[]> {
    // Solo su morte di unità
    if (!(action instanceof UnitDiesAction)) {
      return [];
    }

    // Crea action per pescare
    const drawAction = new DrawCardAction(this.owner, {
      amount: 1,
    });

    return [drawAction];
  }

  isActive(game: Game): boolean {
    return game.battlefield.units.some(
      u => u.instanceId === this.sourceCard.instanceId
    );
  }
}

/**
 * Example 3: When Attacking
 * "Quando questa unità attacca, infliggi 1 danno al Nexus avversario"
 */
export class AttackTrigger extends ActionTrigger {
  readonly type = 'attack_trigger';
  readonly priority = TriggerPriority.NORMAL;

  constructor(
    public sourceCard: GameCard
  ) {
    super();
  }

  async onAction(action: GameAction, game: Game): Promise<GameAction[]> {
    if (!(action instanceof DeclareAttackAction)) {
      return [];
    }

    // Solo se questa carta sta attaccando
    if (action.data.attacker.instanceId !== this.sourceCard.instanceId) {
      return [];
    }

    const opponent = game.players.find(p => p.id !== this.sourceCard.ownerId);
    if (!opponent) return [];

    // Infliggi 1 danno al nexus
    const damageAction = new DealDamageAction(
      game.players.find(p => p.id === this.sourceCard.ownerId)!,
      {
        source: this.sourceCard,
        target: opponent.nexus, // Assumendo che Player abbia nexus
        amount: 1,
        damageType: 'effect',
      }
    );

    return [damageAction];
  }

  isActive(game: Game): boolean {
    return game.battlefield.units.some(
      u => u.instanceId === this.sourceCard.instanceId
    );
  }
}

/**
 * Example 4: Spell Cast Counter
 * "Quando l'avversario gioca uno spell, incrementa contatore"
 */
export class SpellCastCounterTrigger extends ActionTrigger {
  readonly type = 'spell_cast_counter';
  readonly priority = TriggerPriority.NORMAL;

  private counter: number = 0;

  constructor(
    public sourceCard: GameCard,
    public owner: Player
  ) {
    super();
  }

  async onAction(action: GameAction, game: Game): Promise<GameAction[]> {
    if (!(action instanceof CastSpellAction)) {
      return [];
    }

    // Solo spell avversari
    if (action.controller.id === this.owner.id) {
      return [];
    }

    // Incrementa contatore
    this.counter++;

    // Usa CardStorage per salvare il contatore
    const storage = game.storage.getCardStorage(this.sourceCard.instanceId);
    storage.set('spellsCast', this.counter);

    // Se raggiunge 3, triggera abilità speciale
    if (this.counter >= 3) {
      const abilityAction = new ActivateAbilityAction(this.owner, {
        source: this.sourceCard,
      });

      this.counter = 0; // Reset

      return [abilityAction];
    }

    return [];
  }

  isActive(game: Game): boolean {
    return game.battlefield.units.some(
      u => u.instanceId === this.sourceCard.instanceId
    );
  }
}

/**
 * Example 5: Deathrattle (Triggered on death)
 * "Quando muore, evoca un 1/1"
 */
export class DeathrattleSummonTrigger extends ActionTrigger {
  readonly type = 'deathrattle_summon';
  readonly priority = TriggerPriority.NORMAL;
  isOneShot = true; // Si consuma dopo la morte

  constructor(
    public sourceCard: GameCard,
    public owner: Player
  ) {
    super();
  }

  async onAction(action: GameAction, game: Game): Promise<GameAction[]> {
    // Solo quando QUESTA carta muore
    if (!(action instanceof UnitDiesAction)) {
      return [];
    }

    if (action.data.unit.instanceId !== this.sourceCard.instanceId) {
      return [];
    }

    // Crea token 1/1
    const summonAction = new CreateTokenAction(this.owner, {
      tokenId: 'BASIC_TOKEN_1_1',
      position: 'battlefield',
    });

    return [summonAction];
  }

  isActive(game: Game): boolean {
    // Deathrattle è sempre attivo finché la carta è viva
    return game.battlefield.units.some(
      u => u.instanceId === this.sourceCard.instanceId
    );
  }
}
```

---

## Priority e Timing Rules

### Timing Layers

Il sistema usa **timing layers** per garantire ordine di risoluzione corretto:

```typescript
/**
 * Timing layers per risoluzione azioni.
 */
export enum TimingLayer {
  // Layer 0: Replacement effects (prevengono azioni)
  REPLACEMENT = 0,

  // Layer 1: Cost modification
  COST_MODIFICATION = 1,

  // Layer 2: Prevention (Barriera, Shield)
  PREVENTION = 2,

  // Layer 3: Damage/Healing modification
  DAMAGE_MODIFICATION = 3,

  // Layer 4: Stat modification (Attack/Health)
  STAT_MODIFICATION = 4,

  // Layer 5: Keyword modification
  KEYWORD_MODIFICATION = 5,

  // Layer 6: Post-effects
  POST_EFFECT = 6,
}

/**
 * Modifier sorting con timing layers.
 */
export function sortModifiers(modifiers: ActionModifier[]): ActionModifier[] {
  return modifiers.sort((a, b) => {
    // Prima per layer
    const layerDiff = getTimingLayer(a) - getTimingLayer(b);
    if (layerDiff !== 0) return layerDiff;

    // Poi per priority interna al layer
    const priorityDiff = a.priority - b.priority;
    if (priorityDiff !== 0) return priorityDiff;

    // Infine per timestamp (ordine di registrazione)
    return a.timestamp - b.timestamp;
  });
}
```

### Simultaneità e Tie-Breaking

Quando più azioni devono risolversi simultaneamente:

```typescript
/**
 * Risolvi azioni simultanee con tie-breaking.
 */
export class SimultaneousActionResolver {
  /**
   * Resolve multiple actions that occur "at the same time"
   */
  async resolveSimultaneous(
    actions: GameAction[],
    executor: ActionExecutor
  ): Promise<void> {
    // 1. Ordina per tie-breaking rules
    const sorted = this.appleTieBreaking(actions);

    // 2. Esegui in ordine
    for (const action of sorted) {
      await executor.execute(action);
    }
  }

  /**
   * Tie-breaking rules (come LoR)
   */
  private appleTieBreaking(actions: GameAction[]): GameAction[] {
    return actions.sort((a, b) => {
      // Rule 1: Active player first
      if (a.controller.id === this.game.activePlayer.id) return -1;
      if (b.controller.id === this.game.activePlayer.id) return 1;

      // Rule 2: Timestamp (chi ha giocato prima)
      const timeDiff = a.timestamp.getTime() - b.timestamp.getTime();
      if (timeDiff !== 0) return timeDiff;

      // Rule 3: Board position (da sinistra a destra)
      const posA = this.getBoardPosition(a.source);
      const posB = this.getBoardPosition(b.source);

      return posA - posB;
    });
  }

  private getBoardPosition(card?: GameCard): number {
    if (!card) return Infinity;

    const units = this.game.battlefield.units;
    const index = units.findIndex(u => u.instanceId === card.instanceId);

    return index === -1 ? Infinity : index;
  }
}
```

---

## Integration con Card Scripts

### CardContext Extension

Estendiamo il `CardContext` per includere il sistema di azioni:

```typescript
export interface CardContext {
  self: GameCard;
  owner: Player;
  game: Game;
  targets?: GameCard[];
  eventData?: EventData;

  // ===== NEW: Action System Integration =====

  /**
   * Execute a game action through the pipeline.
   */
  execute(action: GameAction): Promise<ActionExecutionResult>;

  /**
   * Register a modifier for this card.
   */
  registerModifier(
    actionType: GameActionType | GameActionType[],
    modifier: ActionModifier
  ): void;

  /**
   * Register a trigger for this card.
   */
  registerTrigger(
    actionType: GameActionType | GameActionType[],
    trigger: ActionTrigger
  ): void;

  /**
   * Unregister all modifiers/triggers from this card.
   */
  cleanup(): void;
}
```

### Card Script Examples

#### Example 1: Basic Rune (Riftbound)

```typescript
// Rune: "[T]: Add [1] Energy" + "Recycle: Add [Domain] Power"
export default {
  // Tap ability
  onTap: async (ctx: CardContext) => {
    // ❌ V2 (OLD): Direct mutation
    // ctx.owner.runePool.energy += 1;

    // ✅ V3 (NEW): Create action
    const action = new AddEnergyAction(ctx.owner, {
      source: ctx.self,
      amount: 1,
    });

    await ctx.execute(action);
    // ^ Questo passa attraverso la pipeline:
    //   - Validation
    //   - Modifiers (es: "double next energy added")
    //   - Execution
    //   - Triggers
  },

  // Recycle ability
  onRecycle: async (ctx: CardContext) => {
    const domain = ctx.self.domains[0];

    // Create recycling action (move to rune deck bottom)
    const recycleAction = new RecycleRuneAction(ctx.owner, {
      rune: ctx.self,
    });

    await ctx.execute(recycleAction);

    // Add power action
    const addPowerAction = new AddPowerAction(ctx.owner, {
      domain,
      amount: 1,
    });

    await ctx.execute(addPowerAction);
  }
};
```

#### Example 2: Unit con Assault

```typescript
// Unit: "Assault +2" (Quando attacca, ottiene +2 Might)
export default {
  // Triggered when combat starts
  onAttack: async (ctx: CardContext) => {
    // Il bonus Assault viene applicato automaticamente dal ResolveCombatAction
    // Ma possiamo registrare un modifier per effetti addizionali

    const modifier = new AssaultBonusModifier(ctx.self, 2);

    // Registra per questa combat soltanto
    ctx.registerModifier(GameActionType.RESOLVE_COMBAT, modifier);
  },

  onCombatEnd: async (ctx: CardContext) => {
    // Cleanup automatico del modifier temporaneo
    ctx.cleanup();
  }
};
```

#### Example 3: Triggered Ability - "When I attack"

```typescript
// Unit: "When I attack: Deal 1 damage to defending player"
export default {
  onEntersPlay: async (ctx: CardContext) => {
    // Registra trigger per attack
    const trigger = new class extends ActionTrigger {
      readonly type = 'attack_burn_trigger';
      readonly priority = TriggerPriority.NORMAL;

      async onAction(action: GameAction, game: Game): Promise<GameAction[]> {
        // Triggera solo su START_COMBAT
        if (action.type !== GameActionType.START_COMBAT) {
          return [];
        }

        // Solo se questa unità sta attaccando
        const combatData = action.data as CombatData;
        if (!combatData.attackers.some(u => u.instanceId === ctx.self.instanceId)) {
          return [];
        }

        // Trova defending player
        const defendingPlayer = combatData.defender;

        // Crea damage action
        const damageAction = new DealDamageAction(ctx.owner, {
          source: ctx.self,
          target: defendingPlayer, // Danno al player!
          amount: 1,
          damageType: 'effect',
        });

        return [damageAction];
      }

      isActive(game: Game): boolean {
        return game.battlefield.units.some(
          u => u.instanceId === ctx.self.instanceId
        );
      }
    };

    ctx.registerTrigger(GameActionType.START_COMBAT, trigger);
  },

  onLeavesPlay: async (ctx: CardContext) => {
    ctx.cleanup();
  }
};
```

#### Example 4: Deflect Keyword (Prevent Damage)

```typescript
// Spell: "Target unit gains Deflect 1" (Previene 1 danno)
export default {
  onPlay: async (ctx: CardContext) => {
    const target = ctx.targets[0];

    // Crea modifier one-shot per prevenire danno
    const deflectModifier = new class extends ActionModifier {
      readonly type = 'deflect';
      readonly priority = ModifierPriority.PREVENTION;

      constructor() {
        super();
        this.expiresAfterUses = 1; // Previene 1 danno
      }

      async modify(action: GameAction, game: Game): Promise<GameAction | null> {
        if (action.type !== GameActionType.DEAL_DAMAGE) {
          return action;
        }

        const damageData = action.data as DamageData;
        if (damageData.target.instanceId !== target.instanceId) {
          return action;
        }

        // Riduci danno di 1
        const modified = action.clone();
        modified.data.amount = Math.max(0, modified.data.amount - 1);

        this.currentUses++;

        return modified;
      }

      isActive(game: Game): boolean {
        return game.battlefield.units.some(
          u => u.instanceId === target.instanceId
        );
      }
    };

    ctx.registerModifier(GameActionType.DEAL_DAMAGE, deflectModifier);
  }
};
```

#### Example 5: Ganking Keyword (Move Battlefield to Battlefield)

```typescript
// Unit: "Ganking" (Può muovere tra battlefield)
export default {
  // Il keyword Ganking modifica la MoveUnitAction validation
  canMove: async (ctx: CardContext, destination: Battlefield): Promise<boolean> => {
    // Standard move validation
    if (!ctx.self.ready) {
      return false;
    }

    // Ganking permette move tra battlefield
    if (ctx.self.keywords.includes('Ganking')) {
      return true; // Può muovere ovunque
    }

    // Senza Ganking, solo Base ↔ Battlefield
    const currentLocation = ctx.game.getUnitLocation(ctx.self);
    const isAtBase = currentLocation.type === 'base';
    const movingToBase = destination.type === 'base';

    return isAtBase || movingToBase;
  }
};
```

#### Example 6: Rune Pool Interaction

```typescript
// Spell: "Draw cards equal to your Energy" (Reaction timing)
export default {
  // Ha keyword Reaction → può giocare in Closed State
  timing: CardTiming.REACTION,

  onPlay: async (ctx: CardContext) => {
    // Conta Energy nel Rune Pool
    const energy = ctx.owner.runePool.energy;

    // Crea DrawCardAction per ogni Energy
    const drawActions: GameAction[] = [];

    for (let i = 0; i < energy; i++) {
      const drawAction = new DrawCardAction(ctx.owner, {
        amount: 1,
      });

      drawActions.push(drawAction);
    }

    // Esegui tutte le draw
    for (const action of drawActions) {
      await ctx.execute(action);
    }

    // Se il deck finisce → Burn Out!
    // (gestito automaticamente dalla DrawCardAction)
  }
};
```

---

## Piano di Implementazione

### Fase 0: Preparazione (Settimana 0)

**Durata:** 3-5 giorni

**Tasks:**
1. ✅ **Analisi e Design**
   - [x] Studio sistema LoR
   - [x] Identificazione gap V2
   - [x] Creazione documento architetturale

2. ⬜ **Setup Branch e Testing Framework**
   - [ ] Crea branch `feature/gameaction-system`
   - [ ] Setup testing infra per action system
   - [ ] Crea test utilities e mocks

3. ⬜ **Type Definitions**
   - [ ] Definisci tutti i tipi in `src/types/actions.ts`
   - [ ] Definisci enum GameActionType completo
   - [ ] Definisci interfacce Modifier/Trigger

**Deliverable:** Branch pronto, types definiti, test framework setup

---

### Fase 1: Core Infrastructure (Settimana 1-2)

**Durata:** 7-10 giorni

**Tasks:**

#### 1.1 GameAction Base Class
- [ ] Implementa `GameAction` abstract class
- [ ] Implementa `ActionValidationResult` e `ActionExecutionResult`
- [ ] Implementa metodi `validate()`, `execute()`, `toHistoryEntry()`, `clone()`
- [ ] Test unitari per base class

#### 1.2 Action Executor
- [ ] Implementa `ActionExecutor` class
- [ ] Implementa pipeline: validate → modify → execute → trigger
- [ ] Implementa stack depth protection (max recursion)
- [ ] Implementa post-resolution cleanup
- [ ] Test per pipeline completa

#### 1.3 Modifier Registry
- [ ] Implementa `ModifierRegistry` class
- [ ] Implementa `register()`, `unregister()`, `getModifiersFor()`
- [ ] Implementa cleanup expired modifiers
- [ ] Test per registration/retrieval

#### 1.4 Trigger Registry
- [ ] Implementa `TriggerRegistry` class
- [ ] Implementa `register()`, `unregister()`, `getTriggersFor()`
- [ ] Implementa cleanup expired triggers
- [ ] Test per registration/retrieval

#### 1.5 Priority System
- [ ] Implementa sorting con priority
- [ ] Implementa timing layers
- [ ] Test per ordine di risoluzione

**Deliverable:** Core infrastructure completo, 100% test coverage

**Test Coverage Target:** 95%+

---

### Fase 2: Concrete Actions - Basic (Settimana 3)

**Durata:** 5-7 giorni

Implementa le action più comuni e fondamentali:

#### 2.1 Damage & Healing
- [ ] `DealDamageAction`
  - Parametri: source, target, amount, damageType
  - Validation: target è in gioco, amount > 0
  - Execution: target.damage += amount, death check
  - Test: danno base, danno letale, danno a nexus

- [ ] `HealDamageAction`
  - Parametri: source, target, amount
  - Validation: target è danneggiato
  - Execution: target.damage -= amount, cap a 0
  - Test: heal parziale, heal completo, overheal

#### 2.2 Card Movement
- [ ] `DrawCardAction`
  - Parametri: player, amount
  - Validation: deck non vuoto
  - Execution: move card from deck to hand
  - Test: draw normale, draw con deck vuoto (mill), draw multiplo

- [ ] `MoveCardAction`
  - Parametri: card, fromZone, toZone
  - Validation: card è nella fromZone
  - Execution: rimuovi da fromZone, aggiungi a toZone
  - Test: move hand→battlefield, move battlefield→trash

- [ ] `DiscardCardAction`
  - Parametri: player, card
  - Validation: card è in hand
  - Execution: move hand→trash
  - Test: discard singolo, discard casuale

#### 2.3 Play Card
- [ ] `PlayCardAction`
  - Parametri: player, card, targets
  - Validation: costo, target validi
  - Execution: paga costo, move a zone appropriata, trigger onPlay
  - Test: play unit, play spell, insufficient resources

**Deliverable:** Action base funzionanti, test completi

**Test Coverage Target:** 90%+

---

### Fase 3: Concrete Actions - Advanced (Settimana 4)

**Durata:** 5-7 giorni

#### 3.1 Combat Actions
- [ ] `DeclareAttackAction`
  - Parametri: attacker, targetPlayer
  - Validation: can attack, non exhausted
  - Execution: mark attacking, trigger onAttack

- [ ] `DeclareBlockAction`
  - Parametri: blocker, attacker
  - Validation: can block, blocker ready
  - Execution: assign blocker

- [ ] `ResolveCombatAction`
  - Parametri: attackers, blockers
  - Execution: resolve combat left-to-right, simultaneous damage

#### 3.2 Status Effects
- [ ] `ApplyBuffAction`
  - Parametri: target, attack, health, duration

- [ ] `ApplyDebuffAction`
  - Parametri: target, attack, health, duration

- [ ] `StunUnitAction`
  - Parametri: target, duration

- [ ] `SilenceUnitAction`
  - Parametri: target

#### 3.3 Keyword Actions
- [ ] `GrantKeywordAction`
  - Parametri: target, keyword

- [ ] `RemoveKeywordAction`
  - Parametri: target, keyword

#### 3.4 Resource Actions
- [ ] `AddEnergyAction`
- [ ] `SpendEnergyAction`
- [ ] `AddPowerAction`
- [ ] `SpendPowerAction`
- [ ] `TapRuneAction`
- [ ] `RecycleRuneAction`

**Deliverable:** Sistema completo di action, copertura di tutti i casi d'uso principali

---

### Fase 4: Modifier System (Settimana 5)

**Durata:** 5-7 giorni

#### 4.1 Base Modifiers
- [ ] `ActionModifier` abstract class implementato
- [ ] Priority system funzionante
- [ ] Test per modifier application

#### 4.2 Concrete Modifiers
Implementa i modifier più comuni:

- [ ] `SpellDamagePlusOneModifier` (+1 danno spell)
- [ ] `BarrierModifier` (previeni danno)
- [ ] `SpellCostReductionModifier` (-X costo spell)
- [ ] `DoubleDamageModifier` (x2 danno)
- [ ] `DamageReductionModifier` (-X danno ricevuto)
- [ ] `SilenceModifier` (blocca abilità)

#### 4.3 Aura System
- [ ] `AuraModifier` abstract class
- [ ] `GlobalBuffAura` example
- [ ] Aura update system
- [ ] Test per aura application/removal

#### 4.4 Replacement Effects
- [ ] Implementa replacement effect pattern
- [ ] Test per prevention completa di action

**Deliverable:** Modifier system completo, esempi funzionanti

---

### Fase 5: Trigger System (Settimana 6)

**Durata:** 5-7 giorni

#### 5.1 Base Triggers
- [ ] `ActionTrigger` abstract class implementato
- [ ] Priority system per trigger
- [ ] One-shot vs persistent trigger

#### 5.2 Concrete Triggers
Implementa i trigger più comuni:

- [ ] `YasuoStunTrigger` (when stun, deal damage)
- [ ] `DrawOnDeathTrigger` (when dies, draw)
- [ ] `AttackTrigger` (when attacks, effect)
- [ ] `SpellCastCounterTrigger` (count spell cast)
- [ ] `DeathrattleSummonTrigger` (when dies, summon)

#### 5.3 Trigger Queue System
- [ ] Implementa queue per trigger simultanei
- [ ] Test per trigger ordering
- [ ] Test per trigger chain (trigger che genera trigger)

**Deliverable:** Trigger system completo, casi d'uso principali implementati

---

### Fase 6: Chain & Priority/Focus System (Settimana 7)

**Durata:** 5-7 giorni

#### 6.1 Game Chain
- [ ] `GameChain` class implementato
- [ ] LIFO resolution
- [ ] Pass priority tracking
- [ ] Cleanup dopo ogni risoluzione

#### 6.2 Card Timing System
- [ ] `CardTiming` enum (Default, Action, Reaction)
- [ ] Validation per timing rules
- [ ] Test per timing interaction (es: Reaction in Closed State)

#### 6.3 Priority & Focus
- [ ] `PriorityManager` class
- [ ] Priority durante Neutral Open (Turn Player)
- [ ] Focus durante Showdown
- [ ] Relevant Players determination
- [ ] Tie-breaking rules (Turn Order)

#### 6.4 Turn States
- [ ] `TurnState` enum (Neutral Open/Closed, Showdown Open/Closed)
- [ ] State transitions (Open ↔ Closed)
- [ ] Test per state-based restrictions

**Deliverable:** Chain system completo, Priority/Focus funzionante, risoluzione deterministica

---

### Fase 7: Card Script Integration (Settimana 8)

**Durata:** 5-7 giorni

#### 7.1 CardContext Extension
- [ ] Estendi `CardContext` con action methods
- [ ] Implementa `ctx.execute(action)`
- [ ] Implementa `ctx.registerModifier()`
- [ ] Implementa `ctx.registerTrigger()`
- [ ] Implementa `ctx.cleanup()`

#### 7.2 Script Migration
- [ ] Migra basic-rune.card.ts a V3
- [ ] Migra playful-phantom.card.ts a V3
- [ ] Crea esempi per ogni pattern (modifier, trigger, etc)

#### 7.3 Script Utilities
- [ ] Helper functions per creation comuni actions
- [ ] Factory per modifier comuni
- [ ] Factory per trigger comuni

**Deliverable:** Integration completa, script V2 migrati a V3

---

### Fase 8: Game Engine Integration (Settimana 9)

**Durata:** 7-10 giorni

#### 8.1 GameManager Refactor
- [ ] Refactor `GameManager.playCard()` per usare `PlayCardAction`
- [ ] Refactor combat system per usare combat actions
- [ ] Refactor turn system per usare turn actions

#### 8.2 TurnManager Integration
- [ ] Integra priority passing con action system
- [ ] Integra stack resolution con turn phases
- [ ] Test per integration completa

#### 8.3 CardScriptRuntime Integration
- [ ] Update `CardScriptRuntime` per usare action system
- [ ] Rimuovi mutazioni dirette, sostituisci con action
- [ ] Test per runtime V3

#### 8.4 Backward Compatibility
- [ ] Mantieni V2 come fallback opzionale
- [ ] Flag per enable/disable V3 system
- [ ] Migration path documentato

**Deliverable:** Game engine completamente integrato con V3

---

### Fase 9: Testing & Debugging (Settimana 10)

**Durata:** 5-7 giorni

#### 9.1 Integration Testing
- [ ] Test end-to-end per scenari completi
- [ ] Test per interaction complesse (modifier + trigger)
- [ ] Test per edge cases (stack overflow, infinite loops)

#### 9.2 Performance Testing
- [ ] Benchmark action execution
- [ ] Profiling per bottleneck
- [ ] Optimization se necessario

#### 9.3 Replay System
- [ ] Implementa replay da action history
- [ ] Test per determinismo
- [ ] Validation di replay correctness

#### 9.4 Debugging Tools
- [ ] Action history viewer
- [ ] Modifier/trigger inspector
- [ ] Stack visualizer

**Deliverable:** Sistema stabile, testato, performante

---

### Fase 10: Documentation & Polish (Settimana 11)

**Durata:** 3-5 giorni

#### 10.1 Documentation
- [ ] API documentation completa
- [ ] Tutorial per card script developers
- [ ] Migration guide V2 → V3
- [ ] Architecture documentation

#### 10.2 Examples
- [ ] 10+ card examples covering all patterns
- [ ] Complex interaction examples
- [ ] Best practices guide

#### 10.3 Polish
- [ ] Code cleanup
- [ ] Code review
- [ ] Final testing

**Deliverable:** Sistema production-ready, documentato

---

## Esempi Pratici

### Scenario 1: Combat con Tank e Modifier

**Setup:**
- Attacker ha 2 unità (3 Might, 2 Might) + "Combat Damage +1" buff
- Defender ha 1 Tank (4 Might) e 1 unità normale (2 Might)

**Flow:**

```typescript
// 1. Combat inizia → Crea ResolveCombatAction
const combatAction = new ResolveCombatAction(attacker, {
  attackers: [unit3Might, unit2Might],
  defenders: [tankUnit, normalUnit],
  battlefield: contestedBattlefield,
});

await game.actions.execute(combatAction);

// 2. PIPELINE:

// 2a. Validation ✅

// 2b. Modifiers
// CombatDamageModifier applica +1 a attacker
attackerTotalMight = (3 + 2) + 1 = 6

// 2c. Execution

// Attacker distribuisce 6 danno:
// Tank DEVE ricevere danno letale per primo
tankUnit.damage = 4 (lethal)
normalUnit.damage = 2 (lethal)

// Defender distribuisce 6 danno:
unit3Might.damage = 3 (lethal)
unit2Might.damage = 2 (lethal)

// 2d. Cleanup dopo combat
// TUTTE le unità muoiono (tutte hanno danno letale)

// 2e. Verifica Conquer
// Nessuna unità rimasta → no Conquer

// 2f. History
game.history.push({
  type: 'COMBAT_RESOLVED',
  battlefield: contestedBattlefield,
  attackerDamage: 6,
  defenderDamage: 6,
  casualties: [unit3Might, unit2Might, tankUnit, normalUnit],
});
```

**Risultato:** Tutte le unità muoiono, nessun Conquer

---

### Scenario 2: Triggered Ability durante Showdown

**Setup:**
- Player ha unità con "When I attack: deal 1 damage to defending player"
- Player muove unità su battlefield nemico (inizia Showdown)

**Flow:**

```typescript
// 1. Move completo → Cleanup → Combat inizia

// 2. Combat Showdown Step
// Si crea Initial Chain con trigger "When I attack"

const attackTrigger = new WhenAttackTrigger(attackingUnit);
const triggerAction = new DealDamageAction(player, {
  source: attackingUnit,
  target: defendingPlayer, // Danno al player, non unità
  amount: 1,
  damageType: 'effect',
});

// 3. Initial Chain viene popolata
game.chain.add(triggerAction, CardTiming.ACTION);

// 4. Showdown procede
// Priority al defender (può giocare spell con Action/Reaction)

// 5. Defender gioca "Shield Spell" (Reaction)
const shieldAction = new ApplyBuffAction(defender, {
  target: defendingUnit,
  modifier: { deflect: 1 }, // Keyword Deflect
});

game.chain.add(shieldAction, CardTiming.REACTION);

// 6. Passa priority → Chain risolve

// 6a. Shield Spell risolve per primo (LIFO)
defendingUnit.keywords.push('Deflect');

// 6b. Cleanup

// 6c. Trigger risolve
defendingPlayer.health -= 1;

// 6d. Cleanup

// 7. Chain vuota → Focus passa → Combat Damage Step
```

**Risultato:** Defender subisce 1 danno, unità difensiva ottiene Deflect, poi combat normale

---

### Scenario 3: Multiple Modifier con Priority

**Setup:**
- Player ha "Spell Damage +1"
- Player ha "Double Next Damage"
- Player gioca spell da 3 danni

**Flow:**

```typescript
const action = new DealDamageAction(player, {
  source: spell,
  target: enemy,
  amount: 3,
  damageType: 'spell',
});

// MODIFIERS (in priority order):

// 1. SpellDamagePlusOneModifier (priority: DAMAGE_MODIFICATION = 0)
action.data.amount = 3 + 1 = 4

// 2. DoubleDamageModifier (priority: DAMAGE_MODIFICATION + 1 = 1)
// Più alto = esegue DOPO +1
action.data.amount = 4 * 2 = 8

// EXECUTION:
enemy.damage += 8;

// Il DoubleDamageModifier si consuma (one-shot)
modifierRegistry.unregister(doubleDamageModifier);
```

**Risultato:** 3 → +1 → ×2 = 8 danni (ordine corretto per priority!)

---

### Scenario 4: Rune Pool e Add Reaction

**Setup:**
- Player ha 2 Energy in Rune Pool
- Player vuole giocare spell da 4 Energy
- Player ha runa ready con "[T]: Add [1] Energy"

**Flow:**

```typescript
// 1. Player dichiara PlayCardAction
const playAction = new PlayCardAction(player, {
  card: expensiveSpell, // Cost: 4 Energy
  targets: [enemy],
});

// 2. Validation → Check costo
// Available: 2 Energy
// Required: 4 Energy
// Shortfall: 2 Energy

// 3. Add Reaction window si apre
// Player può attivare abilità Add per colmare il gap

// Player tappa 2 rune
await game.actions.execute(new TapRuneAction(player, { rune: rune1 }));
await game.actions.execute(new TapRuneAction(player, { rune: rune2 }));

// Ogni TapRuneAction esegue:
player.runePool.energy += 1;

// 4. Ora Rune Pool ha 4 Energy → Validation passa

// 5. Paga costo
player.runePool.energy -= 4; // 4 → 0

// 6. Spell va sulla Chain
game.chain.add(playAction, CardTiming.DEFAULT);
```

**Risultato:** Player usa Add Reactions per pagare costo, spell giocato con successo

---

## Testing Strategy

### Unit Tests

Ogni componente ha test isolati:

```typescript
describe('DealDamageAction', () => {
  it('should deal damage to target', async () => {
    const target = createMockUnit({ damage: 0, health: 10 });
    const action = new DealDamageAction(player, {
      target,
      amount: 5,
      damageType: 'spell',
    });

    await executor.execute(action);

    expect(target.damage).toBe(5);
  });

  it('should trigger death if lethal', async () => {
    const target = createMockUnit({ damage: 8, health: 10 });
    const action = new DealDamageAction(player, {
      target,
      amount: 5,
      damageType: 'spell',
    });

    const deathSpy = jest.spyOn(game, 'processDeaths');

    await executor.execute(action);

    expect(target.damage).toBe(13);
    expect(deathSpy).toHaveBeenCalled();
  });

  it('should be modified by SpellDamagePlus1', async () => {
    const modifier = new SpellDamagePlusOneModifier(buffCard, player);
    game.actions.modifierRegistry.register(GameActionType.DEAL_DAMAGE, modifier);

    const action = new DealDamageAction(player, {
      target,
      amount: 3,
      damageType: 'spell',
    });

    await executor.execute(action);

    expect(target.damage).toBe(4); // 3 + 1
  });
});
```

### Integration Tests

Test per scenari complessi:

```typescript
describe('Yasuo + Stun Interaction', () => {
  it('should deal 2 damage when stunning enemy', async () => {
    // Setup
    const yasuo = createYasuo();
    const enemy = createMockUnit({ health: 10 });
    game.battlefield.units.push(yasuo, enemy);

    // Register Yasuo trigger
    const trigger = new YasuoStunTrigger(yasuo);
    game.actions.triggerRegistry.register(GameActionType.STUN_UNIT, trigger);

    // Execute stun
    const stunAction = new StunUnitAction(player, {
      target: enemy,
      duration: 1,
    });

    await game.actions.execute(stunAction);

    // Assert
    expect(enemy.stunned).toBe(true);
    expect(enemy.damage).toBe(2); // Yasuo triggered

    // Check history
    const damageEvents = game.history.filter(e => e.type === EventType.DAMAGE_DEALT);
    expect(damageEvents).toHaveLength(1);
    expect(damageEvents[0].data.source).toBe(yasuo.instanceId);
  });
});
```

### E2E Tests

Test per gameplay completo:

```typescript
describe('Complete Game Scenario', () => {
  it('should handle complex multi-turn interaction', async () => {
    // Turn 1: Play spell damage buff
    await playCard(player1, 'SPELL_DAMAGE_BUFF');

    // Turn 2: Opponent plays unit
    await playCard(player2, 'VANILLA_UNIT_5_5');

    // Turn 3: Kill with buffed spell
    const spell = await playCard(player1, 'FIREBALL'); // 4 dmg

    const enemy = player2.battlefield.units[0];
    expect(enemy.damage).toBe(5); // 4 + 1 from buff

    // Continue...
  });
});
```

---

## Performance Considerations

### Ottimizzazioni Critiche

#### 1. Modifier/Trigger Caching

```typescript
class ModifierRegistry {
  private cache: Map<string, ActionModifier[]> = new Map();

  getModifiersFor(actionType: GameActionType): ActionModifier[] {
    // Cache result per frame
    const cacheKey = `${actionType}-${this.game.frameId}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const modifiers = this._computeActiveModifiers(actionType);
    this.cache.set(cacheKey, modifiers);

    return modifiers;
  }
}
```

#### 2. Action Pooling

```typescript
class ActionPool {
  private pools: Map<string, GameAction[]> = new Map();

  acquire<T extends GameAction>(type: GameActionType): T {
    const pool = this.pools.get(type) || [];

    if (pool.length > 0) {
      return pool.pop() as T;
    }

    return this.createAction(type) as T;
  }

  release(action: GameAction): void {
    action.reset();
    const pool = this.pools.get(action.type) || [];
    pool.push(action);
  }
}
```

#### 3. Lazy Evaluation

```typescript
class DealDamageAction {
  private _modifiedAmount?: number;

  get finalAmount(): number {
    if (this._modifiedAmount !== undefined) {
      return this._modifiedAmount;
    }

    // Calcola solo quando necessario
    this._modifiedAmount = this.computeFinalAmount();
    return this._modifiedAmount;
  }
}
```

### Performance Targets

| Metric | Target | Measured |
|--------|--------|----------|
| Action execution | < 1ms | TBD |
| Modifier application | < 0.1ms | TBD |
| Trigger resolution | < 0.5ms | TBD |
| Stack resolution (10 items) | < 10ms | TBD |
| Full turn simulation | < 50ms | TBD |

### Profiling Tools

```typescript
class ActionProfiler {
  private metrics: Map<string, PerformanceMetric> = new Map();

  measure(actionType: GameActionType, fn: () => Promise<void>): Promise<void> {
    const start = performance.now();

    await fn();

    const duration = performance.now() - start;

    this.recordMetric(actionType, duration);
  }

  getReport(): ProfileReport {
    return {
      averageTime: this.computeAverage(),
      maxTime: this.computeMax(),
      p95: this.computePercentile(95),
      // ...
    };
  }
}
```

---

## Conclusioni

### Benefici del Sistema V3

1. **✅ Effetti che modificano altri effetti** - RISOLTO
   - Modifier pipeline permette carte come "Spell Damage +1"
   - Replacement effects per "Barriera"

2. **✅ Trigger automatici** - RISOLTO
   - Sistema event-driven per Yasuo-style cards
   - No più polling manuale

3. **✅ Ordine di risoluzione deterministic** - RISOLTO
   - Priority system garantisce ordine corretto
   - Tie-breaking rules per simultaneità

4. **✅ Storia completa** - RISOLTO
   - Ogni action loggata automaticamente
   - Replay possibile

5. **✅ Testing migliorato** - BONUS
   - Action isolate testabili
   - Mock più facili

### Effort vs Value

| Componente | Effort (giorni) | Valore | Priorità |
|------------|-----------------|--------|----------|
| Core Infrastructure | 7-10 | CRITICO | P0 |
| Basic Actions | 5-7 | CRITICO | P0 |
| Modifier System | 5-7 | CRITICO | P0 |
| Trigger System | 5-7 | CRITICO | P0 |
| Advanced Actions | 5-7 | ALTO | P1 |
| Stack System | 5-7 | ALTO | P1 |
| Aura System | 3-5 | MEDIO | P2 |
| Replay System | 3-5 | MEDIO | P2 |

**Totale stimato:** 38-55 giorni (8-11 settimane)

### Rischi

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Performance issues | Media | Alto | Profiling early, optimization |
| Infinite recursion | Alta | Critico | Stack depth limit, detection |
| Integration complexity | Alta | Alto | Phased rollout, V2 fallback |
| Testing overhead | Media | Medio | Test utilities, factories |
| Learning curve | Alta | Medio | Docs, examples, tutorials |

### Next Steps

1. **Decision Point:** Approvare o modificare il design
2. **Setup:** Creare branch, setup testing
3. **Start:** Fase 1 - Core Infrastructure
4. **Review:** Dopo ogni fase, review e adjust

---

**Fine Documento**

Vuoi procedere con l'implementazione? Possiamo iniziare dalla Fase 0 (setup) e poi Fase 1 (core infrastructure).
