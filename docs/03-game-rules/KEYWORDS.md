# Riftbound - Keywords Reference

## Introduzione

I Keywords sono termini specifici che appaiono sulle carte e rappresentano abilità o meccaniche standardizzate. Ogni keyword è evidenziato da uno sfondo colorato (il colore non ha effetti sul gameplay).

**Caratteristiche generali:**
- I keywords possono essere concessi da altri effetti
- I keywords possono essere rimossi da altri effetti
- La durata di keyword concessi/rimossi è specificata dall'effetto (se non specificata, dura finché l'oggetto rimane nella zona corrente)
- Una carta può avere qualsiasi numero di keywords
- I keywords sono caratteristiche referenziabili da altri effetti

## Keywords per Tipo di Carta

### Unit Keywords
- Accelerate
- Assault
- Deathknell
- Deflect
- Ganking
- Shield
- Tank
- Temporary
- Vision

### Spell Keywords
- Action
- Legion
- Reaction

### Ability Keywords (Rune/Legend/Permanent)
- Action
- Legion
- Reaction

### Keywords Speciali
- Hidden (Spell, Unit, Gear)

---

## Accelerate

**Tipo**: Passive Ability  
**Presente su**: Units  
**Formato**: `Accelerate`

### Funzionamento

Equivalente a: *"As you play me, you may pay [1][C] as an additional cost. If you do, I enter ready."*

- `[C]` rappresenta 1 Power del domain dell'unità
- È un Optional Additional Cost pagabile durante il processo di play
- Influenza lo stato iniziale dell'unità (non diventa ready dopo, entra già ready)
- NON interagisce con abilità che triggano quando unità diventano ready

### Regole

- **Quando si paga**: durante lo step di pagamento costi (rule 561)
- **Dove funziona**: solo durante il processo di play, non mentre l'unità è sul board
- **Sconti**: il costo di Accelerate può essere ridotto da effetti che riducono costi
- **Multiple instances**: ridondanti (pagare una volta basta)

### Note per Simulatore

```
if (unit.hasAccelerate && player.choosesToPayAccelerate) {
  additionalCost += 1 Energy + 1 Power (unit.domain);
  if (paid) {
    unit.entersReady = true; // non exhausted
  }
}
```

---

## Action

**Tipo**: Permissive Keyword  
**Presente su**: Spells, Units, Rune Abilities, Legend Abilities, Permanent Abilities  
**Formato**: `Action`

### Funzionamento

Concede il permesso di giocare/attivare durante **Showdowns** in qualsiasi turno.

**Equivalenti:**
- Su Spells/Units: *"This can be played during showdowns on any player's turn."*
- Su Abilities: *"This can be activated during showdowns on any player's turn."*

### Regole

- **Quando utilizzabile**: 
  - Durante Showdown State (sia Open che Closed)
  - Include anche tutti i timing normali (Neutral Open nel proprio turno)
- **NON modifica**: le restrizioni inherenti della carta
  - Example: Unit con Action può essere giocata solo alla propria Base o battlefield controllato, anche durante Showdown
- **Relazione con Reaction**: Reaction include Action + permessi aggiuntivi

### Stati Validi

- ✅ Showdown Open (proprio turno)
- ✅ Showdown Open (turno avversario)
- ✅ Showdown Closed (proprio turno)
- ✅ Showdown Closed (turno avversario)
- ✅ Neutral Open (proprio turno)
- ❌ Neutral Open (turno avversario)
- ❌ Neutral Closed (qualsiasi turno)

### Note per Simulatore

```
function canPlay(card, gameState) {
  if (gameState.isNeutralOpen && card.controller === currentTurnPlayer) {
    return true; // timing normale
  }
  if (gameState.isShowdown && card.hasAction) {
    return true; // Action permette play durante Showdown
  }
  return false;
}
```

---

## Assault

**Tipo**: Passive Ability  
**Presente su**: Units  
**Formato**: `Assault [X]` (se X omesso, è 1)

### Funzionamento

Equivalente a: *"While I am an attacker, I have +X [S]."*

- `[S]` = Might (simbolo di forza)
- Attivo solo durante Combat, quando l'unità ha status Attacker
- Il bonus si applica durante lo Showdown Step e persiste fino alla fine del Combat

### Regole

- **Quando si attiva**: quando l'unità ottiene status Attacker durante Combat
- **Durata**: finché mantiene status Attacker
- **Multiple instances**: i valori si sommano
  - Example: `Assault` + `Assault 3` = `Assault 4`
- **Timing**: il bonus viene applicato all'inizio dello Showdown Step, prima della creazione dell'Initial Chain

### Interazioni

- Si combina con altri modificatori di Might
- Viene considerato nel calcolo del danno totale durante Combat Damage Step
- Non influenza Assault di altre unità

### Note per Simulatore

```
function applyAssault(unit, combat) {
  if (unit.status === "Attacker" && unit.hasAssault) {
    let assaultValue = unit.getAssaultValue(); // somma tutte le instances
    unit.might += assaultValue;
  }
}

// Chiamato durante Showdown Step
// Rimosso alla fine del Combat quando si pulisce status Attacker
```

---

## Deathknell

**Tipo**: Triggered Ability  
**Presente su**: Permanents (Units, Gear)  
**Formato**: `Deathknell — [Effect]`

### Funzionamento

Equivalente a: *"When I die, [Effect]."*

- Trigger: quando il permanent viene killed e inviato al Trash
- L'effetto si aggiunge alla Chain come triggered ability

### Regole

- **Quando trigga**: solo quando il permanent va dal board al Trash tramite Kill action
- **NON trigga se**:
  - Il permanent viene banished
  - L'evento di kill viene sostituito (es. recall invece di kill)
  - Il permanent viene rimosso in altri modi
- **Multiple instances**: ogni Deathknell trigga separatamente
  - Il controller sceglie l'ordine in cui metterli sulla Chain

### Note Importanti

- Le abilities Deathknell possono triggerare anche se l'unità lascia il board prima che l'abilità si risolva
- L'abilità "guarda indietro" alle caratteristiche dell'unità com'era sul board

### Note per Simulatore

```
function onUnitKilled(unit) {
  if (unit.hasDeathknell && unit.destination === "Trash") {
    let triggers = unit.getAllDeathknellAbilities();
    // Controller sceglie ordine
    for (let ability of triggers) {
      addToChain(ability);
    }
  }
}

// NON triggerare se:
// - unit.destination === "Banishment"
// - killEvent.wasReplaced === true
```

---

## Deflect

**Tipo**: Passive Ability  
**Presente su**: Permanents  
**Formato**: `Deflect [X]` (se X omesso, è 1)

### Funzionamento

Equivalente a: *"Spells and abilities an opponent controls that choose me cost [X] more Power as an additional cost."*

- Impone un Mandatory Additional Cost
- Il Power può essere di qualsiasi Domain (non deve matchare domain dello spell o del target)

### Regole

- **Quando si applica**: durante il processo di pagamento costi (rule 560.2.a)
- **Cosa costa**: X Power di qualsiasi Domain
- **Multiple instances**: i valori si sommano
  - Example: `Deflect` + `Deflect 2` = `Deflect 3` (costa 3 Power extra)
- **Chi paga**: l'avversario che controlla lo spell/ability che sceglie (target) il permanent

### Interazioni

- Si applica a qualsiasi spell o ability che "choose" il permanent come target
- Non si applica a effetti che non targetano (es. "Kill all gear")
- Il costo è in aggiunta a tutti gli altri costi della carta

### Note per Simulatore

```
function calculateCost(spell, target) {
  let totalCost = spell.baseCost;
  
  if (target && target.hasDeflect && target.controller !== spell.controller) {
    let deflectValue = target.getDeflectValue();
    totalCost.power += deflectValue; // Power universale
  }
  
  return totalCost;
}
```

---

## Ganking

**Tipo**: Passive Ability  
**Presente su**: Units  
**Formato**: `Ganking`

### Funzionamento

Equivalente a: *"I may move to a battlefield from another battlefield."*

- Aggiunge opzioni al Standard Move dell'unità
- NON rimuove opzioni esistenti
- NON costa extra
- NON dà movimento aggiuntivo

### Regole

- **Cosa aggiunge**: permette Battlefield → Battlefield come destinazione valida
- **Standard Move normale**:
  - Base → Battlefield ✅
  - Battlefield → Base ✅
- **Con Ganking aggiunge**:
  - Battlefield → Battlefield ✅
- **Restrizioni**: valgono le normali restrizioni di movement
  - Non si può muovere a battlefield con unità di altri 2 giocatori
  - Costa exhaustare l'unità
  - Solo durante Action Phase, fuori da Closed State e Showdown

### Multiple Instances

Ridondanti (non serve più di uno).

### Note per Simulatore

```
function getValidMoveDestinations(unit) {
  let destinations = [];
  
  if (unit.location === "Base") {
    destinations.push(...getControlledBattlefields(unit.controller));
  }
  
  if (unit.location.type === "Battlefield") {
    destinations.push("Base");
    
    if (unit.hasGanking) {
      destinations.push(...getOtherBattlefields(unit.location));
    }
  }
  
  // Filtra battlefield con 2+ altri giocatori
  return filterValidDestinations(destinations);
}
```

---

## Hidden

**Tipo**: Prerequisite for Discretionary Action  
**Presente su**: Spells, Units, Gear  
**Formato**: `Hidden`

### Funzionamento

Complesso. Equivalente a: *"Rather than play this, you may pay [C] to hide this facedown at a battlefield you control that doesn't already have a facedown card hidden there. Beginning on the next player's turn, this gains [Reaction] and you may play this, ignoring its base cost. All choices must only be picked from among valid targets at the battlefield associated with this Facedown Zone."*

- `[C]` = 1 Power del Domain Identity del deck (non necessariamente del domain della carta)

### Processo Hidden

**1. Hide Action (Discretionary)**
```
Cost: [C] (1 Power del domain identity)
Requisiti:
- Carta in mano con Hidden
- Battlefield controllato
- Nessuna carta già hidden a quel battlefield
```

**2. Stato Facedown**
- La carta va nel Facedown Zone del battlefield
- È Private information (solo il controller può vederla)
- Max 1 carta per Facedown Zone

**3. Play from Hidden**
- Disponibile dal turno successivo
- La carta guadagna Reaction
- Costo base ignorato (ma costi aggiuntivi si applicano)
- **Restrizione targeting**: tutti i target devono essere al battlefield dove è hidden

### Regole

- **Hide NON è Play**: non apre Chain, non trigge "when you play"
- **Play from Hidden È Play**: apre Chain normale, trigge abilities
- **Timing normale**: la carta può ancora essere giocata normalmente dalla mano per il suo costo pieno
- **Rimozione**: se perdi controllo del battlefield, la carta viene rimossa durante Cleanup

### Interazioni Speciali

**Gear con Hidden:**
- Può essere hidden a battlefield
- Quando giocato da hidden, DEVE essere giocato a quel battlefield
- Viene immediatamente recalled alla Base durante la prossima Cleanup

**Targeting:**
- Example: spell che dice "Deal 2 to a unit at a battlefield"
  - Normale: può scegliere qualsiasi battlefield
  - From Hidden: può scegliere solo il battlefield dove è hidden

### Note per Simulatore

```
// Hide action
function hideCard(card, battlefield) {
  if (!card.hasHidden) return false;
  if (battlefield.facedownZone.hasCard) return false;
  if (!player.controls(battlefield)) return false;
  
  let cost = 1 Power (player.deckDomainIdentity);
  if (player.pay(cost)) {
    battlefield.facedownZone.card = card;
    card.state = "facedown";
    card.hiddenAtBattlefield = battlefield;
    card.availableFromNextTurn = true;
    return true;
  }
  return false;
}

// Play from Hidden
function canPlayFromHidden(card, currentTurn) {
  if (!card.state === "facedown") return false;
  if (currentTurn === card.hiddenTurn) return false; // next turn only
  return true;
}

function playFromHidden(card) {
  card.gainsReaction = true;
  card.ignoreBaseCost = true;
  card.targetingRestriction = card.hiddenAtBattlefield;
  // Procedi con normal play process
}
```

---

## Legion

**Tipo**: Conditional Keyword  
**Presente su**: Spells, Units, Rune Abilities, Legend Abilities, Permanent Abilities  
**Formato**: `Legion — [Text]`

### Funzionamento

Equivalente a: *"If you have played another Main Deck card before this one already this turn, apply [Text]."*

- Condition: almeno 1 altra Main Deck card giocata questo turno prima di questa
- Effect: varia da carta a carta (specificato nel [Text])

### Regole

- **Cosa conta**: Main Deck cards (Units, Gear, Spells)
- **Cosa NON conta**: Rune, channeling rune, abilities attivate
- **Timing check**: al momento della risoluzione
- **Multiple Legion**: tutte le Legion abilities sulla stessa carta sono soddisfatte dalla stessa condizione
- **Multiple carte**: giocare 1 carta attiva Legion per TUTTE le carte controllate dal giocatore

### Tipi di Legion Effect

Può applicarsi a:
- Static abilities
- Activated abilities
- Spell instructions
- Abilities in zone fuori dal board

### Examples

```
Unit: "Legion — I enter ready."
- Se hai giocato altra carta questo turno, entra ready invece di exhausted

Spell: "Deal 2. Legion — Deal 4 instead."
- Normalmente deal 2
- Se Legion attivo, deal 4

Ability: "[T]: Draw 1. Legion — Draw 2 instead."
- Normalmente draw 1
- Se Legion attivo, draw 2
```

### Note per Simulatore

```
function checkLegion(player) {
  return player.mainDeckCardsPlayedThisTurn >= 1;
}

function resolveLegionEffect(card) {
  if (checkLegion(card.controller)) {
    applyLegionText(card);
  } else {
    applyNormalEffect(card);
  }
}

// Tracciamento
function onCardPlayed(card) {
  if (card.isMainDeckCard) {
    player.mainDeckCardsPlayedThisTurn++;
  }
}

function onTurnEnd() {
  player.mainDeckCardsPlayedThisTurn = 0;
}
```

---

## Reaction

**Tipo**: Permissive Keyword  
**Presente su**: Spells, Units, Rune Abilities, Legend Abilities, Permanent Abilities  
**Formato**: `Reaction`

### Funzionamento

Include tutti i permessi di **Action** + permessi aggiuntivi per **Closed State**.

**Equivalenti:**
- Su Spells/Units: *"This can be played during Closed States on any player's turn."*
- Su Abilities: *"This can be activated during Closed States on any player's turn."*

### Regole

- **Quando utilizzabile**: SEMPRE
  - Tutti gli stati (Neutral/Showdown, Open/Closed)
  - Qualsiasi turno
- **Restrizioni inherenti**: ancora applicate
  - Unit Reaction può essere giocata solo a Base/battlefield controllato
- **Relation to Chain**: Reaction su Chain si risolve PRIMA degli item già presenti

### Stati Validi

- ✅ Showdown Open (qualsiasi turno) [da Action]
- ✅ Showdown Closed (qualsiasi turno)
- ✅ Neutral Open (proprio turno) [normale]
- ✅ Neutral Open (turno avversario)
- ✅ Neutral Closed (qualsiasi turno)

### Timing sulla Chain

Quando una Reaction viene giocata durante Closed State:
1. Si aggiunge alla Chain come ultimo item
2. Diventa il prossimo item da risolvere (LIFO)
3. Altri player possono rispondere con Reaction

### Note per Simulatore

```
function canPlay(card, gameState) {
  if (card.hasReaction) {
    return true; // può sempre giocare (rispettando restrizioni inherenti)
  }
  
  if (card.hasAction && gameState.isShowdown) {
    return true;
  }
  
  if (gameState.isNeutralOpen && card.controller === currentTurnPlayer) {
    return true;
  }
  
  return false;
}

function addToChain(card) {
  if (card.hasReaction && gameState.isClosedState) {
    chain.addAsLast(card); // diventa prossimo a risolvere
  } else {
    chain.addNormal(card);
  }
}
```

---

## Shield

**Tipo**: Static Ability  
**Presente su**: Units  
**Formato**: `Shield [X]` (se X omesso, è 1)

### Funzionamento

Equivalente a: *"While I am a defender, I have +X [S]."*

- `[S]` = Might
- Attivo solo durante Combat, quando l'unità ha status Defender
- Il bonus si applica durante lo Showdown Step e persiste fino alla fine del Combat

### Regole

- **Quando si attiva**: quando l'unità ottiene status Defender durante Combat
- **Durata**: finché mantiene status Defender
- **Multiple instances**: i valori si sommano
  - Example: `Shield` + `Shield 3` = `Shield 4`
- **Timing**: il bonus viene applicato all'inizio dello Showdown Step, prima della creazione dell'Initial Chain

### Confronto con Assault

- **Shield**: per Defenders (chi subisce l'attacco)
- **Assault**: per Attackers (chi attacca)
- Stessa meccanica, applicata a ruoli opposti

### Note per Simulatore

```
function applyShield(unit, combat) {
  if (unit.status === "Defender" && unit.hasShield) {
    let shieldValue = unit.getShieldValue(); // somma tutte le instances
    unit.might += shieldValue;
  }
}

// Chiamato durante Showdown Step
// Rimosso alla fine del Combat quando si pulisce status Defender
```

---

## Tank

**Tipo**: Passive Ability  
**Presente su**: Units  
**Formato**: `Tank`

### Funzionamento

Equivalente a: *"I must be assigned lethal damage before any other unit with the same controller as me that does not have [Tank] during combat resolution."*

- Modifica le regole di assegnazione danno durante Combat Damage Step
- Lethal Damage = danno ≥ Might dell'unità

### Regole di Assegnazione Danno

**Priorità normale:**
1. Assegnare danno letale a un'unità
2. Poi passare alla prossima

**Con Tank:**
1. Assegnare danno letale a TUTTE le unità con Tank
2. Solo dopo, assegnare alle unità senza Tank
3. Se ci sono più unità con Tank, scegliere liberamente tra loro

### Examples

```
Scenario 1: 1 Tank, 2 non-Tank (5 damage da assegnare)
- Tank (3 Might), Unit A (2 Might), Unit B (2 Might)
- DEVE assegnare 3 al Tank
- Poi può scegliere: 2 a Unit A, oppure 2 a Unit B, oppure 1+1

Scenario 2: 2 Tank (5 damage da assegnare)
- Tank A (3 Might), Tank B (3 Might), Unit C (2 Might)
- Può scegliere: 3 a Tank A e 2 a Tank B
- Oppure: 3 a Tank B e 2 a Tank A
- NON può assegnare nulla a Unit C finché almeno un Tank non ha lethal

Scenario 3: Tank + requirement conflict
- Tank (3 Might): "I must be assigned damage first"
- Unit (2 Might): "I must be assigned damage last"
- Other Unit (2 Might)
- Ordine: Tank → Other Unit → Last Unit
```

### Multiple Instances

Ridondanti (non serve più di uno).

### Note per Simulatore

```
function assignCombatDamage(attacker, defenders, totalDamage) {
  let tankUnits = defenders.filter(u => u.hasTank);
  let nonTankUnits = defenders.filter(u => !u.hasTank);
  let remaining = totalDamage;
  
  // Phase 1: assegnare a Tank units
  for (let tank of tankUnits) {
    if (remaining >= tank.might) {
      tank.assignDamage(tank.might); // lethal
      remaining -= tank.might;
    } else {
      tank.assignDamage(remaining);
      remaining = 0;
      break;
    }
  }
  
  // Phase 2: solo se tutti i Tank hanno lethal, assegnare a non-Tank
  let allTanksHaveLethal = tankUnits.every(t => t.assignedDamage >= t.might);
  
  if (allTanksHaveLethal && remaining > 0) {
    // Ora può assegnare a non-Tank units
    assignToNonTankUnits(nonTankUnits, remaining);
  }
}
```

---

## Temporary

**Tipo**: Triggered Ability  
**Presente su**: Permanents  
**Formato**: `Temporary`

### Funzionamento

Equivalente a: *"At the start of this permanent's controller's Beginning Phase, before scoring, kill this."*

- Auto-kill all'inizio del prossimo turno del controller
- Avviene PRIMA dello Scoring Step

### Regole

- **Trigger timing**: Beginning Phase → Beginning Step (prima di Scoring Step)
- **Chi trigga**: solo durante il turno del controller del permanent
- **Effect**: kill del permanent (va nel Trash)
- **Multiple instances**: ridondanti (kill una volta basta)

### Interazioni

- Deathknell trigge normalmente se presente
- Può essere prevenuto da effetti replacement ("instead")
- Non trigge se il permanent lascia il board prima del Beginning Phase

### Note per Simulatore

```
function onBeginningPhase(player) {
  // PRIMA del Scoring Step
  let temporaryPermanents = board.getPermanents()
    .filter(p => p.hasTemporary && p.controller === player);
  
  for (let permanent of temporaryPermanents) {
    kill(permanent);
  }
  
  // POI procedi con Scoring Step
}

// Token con Temporary molto comuni:
// "3[S] Sprite token with Temporary"
```

---

## Vision

**Tipo**: Triggered Ability  
**Presente su**: Permanents  
**Formato**: `Vision`

### Funzionamento

Equivalente a: *"When this is played, look at the top card of your Main Deck. You may recycle it."*

- Trigger: quando il permanent entra sul board
- Effect: scelta opzionale di mandare la top card in fondo al deck

### Regole

- **Trigger timing**: quando il permanent viene giocato ed entra sul board
- **Informazione**: solo il controller vede la carta
- **Scelta**: opzionale
  - Può scegliere di riciclarla (va in fondo al Main Deck)
  - Può scegliere di lasciarla in cima
- **Multiple instances**: triggano separatamente
  - Se non ricicli, ogni Vision vede la stessa carta
  - Se ricicli, la prossima Vision vede la carta successiva

### Examples

```
Scenario 1: Unit con Vision
- Play unit → entra sul board → Vision trigga
- Guardo top card: "Spell X"
- Scelgo di riciclarla
- "Spell X" va in fondo al Main Deck

Scenario 2: Unit con 2x Vision
- Vision 1 trigga: vedo "Card A"
  - Scelgo di NON riciclarla
- Vision 2 trigga: vedo ancora "Card A" 
  - Scelgo di riciclarla
- "Card A" va in fondo

Scenario 3: Unit con 2x Vision
- Vision 1 trigga: vedo "Card A"
  - Scelgo di riciclarla → va in fondo
- Vision 2 trigga: vedo "Card B" (era seconda carta)
  - Scelgo di lasciarla in cima
```

### Note per Simulatore

```
function onPermanentPlayed(permanent) {
  if (permanent.hasVision) {
    let visionCount = permanent.getVisionCount();
    
    for (let i = 0; i < visionCount; i++) {
      let topCard = player.mainDeck.peekTop();
      if (topCard) {
        let choice = player.chooseVisionAction(topCard);
        // choice: "recycle" o "keep"
        
        if (choice === "recycle") {
          player.mainDeck.recycleTop(); // va in fondo
        }
        // se "keep", non fa nulla e la carta resta in cima
      }
    }
  }
}
```

---

## Quick Reference Table

| Keyword | Type | Cards | Effect Summary | Multiple? |
|---------|------|-------|----------------|-----------|
| **Accelerate** | Passive | Units | Pay [1][C] to enter ready | Redundant |
| **Action** | Permissive | Spells, Units, Abilities | Can play during Showdowns | Redundant |
| **Assault X** | Passive | Units | +X Might while attacking | Sum values |
| **Deathknell** | Triggered | Permanents | Effect when killed | Separate triggers |
| **Deflect X** | Passive | Permanents | Opponent pays X Power to target | Sum values |
| **Ganking** | Passive | Units | Can move battlefield→battlefield | Redundant |
| **Hidden** | Prerequisite | Spells, Units, Gear | Pay [C] to hide facedown | Redundant |
| **Legion** | Conditional | Spells, Units, Abilities | Bonus if played 2nd+ card | Redundant |
| **Reaction** | Permissive | Spells, Units, Abilities | Can play during Closed State | Redundant |
| **Shield X** | Passive | Units | +X Might while defending | Sum values |
| **Tank** | Passive | Units | Must be damaged first in combat | Redundant |
| **Temporary** | Triggered | Permanents | Killed at next Beginning Phase | Redundant |
| **Vision** | Triggered | Permanents | Look at top card, may recycle | Separate triggers |

---

## Note Implementazione

### Timing Critico

```
Turn Structure:
├─ Beginning Phase
│  ├─ Beginning Step
│  │  └─ Temporary triggers HERE (before scoring)
│  ├─ Scoring Step
│  └─ ...
├─ Combat
│  └─ Showdown Step
│     └─ Assault/Shield apply HERE
└─ ...
```

### State Tracking

```javascript
// Per simulatore, tracciare:
unit.keywords = ["Accelerate", "Vision"];
unit.keywordValues = { "Assault": 2, "Shield": 1 };
unit.combatStatus = "Attacker" | "Defender" | null;
player.mainDeckCardsPlayedThisTurn = 0; // per Legion
battlefield.facedownZone = { card: null }; // per Hidden
```

### Priority Checking

```javascript
function canPlayCard(card, gameState) {
  // Check base timing
  let hasReaction = card.hasKeyword("Reaction");
  let hasAction = card.hasKeyword("Action");
  
  if (hasReaction) return true; // sempre giocabile
  
  if (hasAction && gameState.isShowdown) return true;
  
  if (gameState.isNeutralOpen && 
      gameState.currentPlayer === card.controller) {
    return true;
  }
  
  return false;
}
```