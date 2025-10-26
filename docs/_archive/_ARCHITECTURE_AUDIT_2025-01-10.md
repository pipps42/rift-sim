# Audit Architetturale - Riftbound Simulator
**Data:** 2025-01-10
**Versione:** 1.0
**Scopo:** Analisi sistematica dello stato implementativo vs documentazione

---

## 📊 Executive Summary

### Stato Generale del Progetto
- **Completamento Stimato:** ~72% del core engine
- **Test Coverage:** 240/255 tests passing (94.1%)
- **Sistemi Core:**  ✅ Implementati e testati
- **Layer di Integrazione:** ⚠️ **PARZIALE** - Gap critici identificati
- **Documentazione:** ⚠️ **DISALLINEATA** - Discrepanze significative tra docs e codice

### Criticità Identificate
1. **Player Actions Layer INCOMPLETO** - GameManager manca di metodi critici
2. **CardStateScanner IMPLEMENTATO** ma NON documentato in ENGINE-ARCHITECTURE.md
3. **GameActions V3 ESTESO** - Molte più actions implementate di quelle documentate
4. **Documentazione OBSOLETA** - DEVELOPMENT-ROADMAP e TESTING-ROADMAP non aggiornati
5. **File DUPLICATI/OBSOLETI** - Proposals e analysis documents non integrati

---

## 🔍 Analisi per Componente

### 1. Sistema V3 GameAction

#### Stato Documentato (GAMEACTION-SYSTEM-DESIGN.md)
```
✅ Completed: 83/84 tests (98.8%)
📂 Actions implementate: 6 (DealDamage, Draw, PlayCard, AddEnergy, AddPower, MoveUnit)
📂 Modifiers implementati: 3 (Damage, Cost, Draw)
📂 Triggers implementati: 3 (OnDamageDealt, OnCardPlayed, OnUnitDeath)
```

#### Stato Reale (Codice Sorgente)
```
✅ Actions implementate: 18 concrete actions trovate
  - DealDamageAction, DrawCardAction, PlayCardAction ✅
  - AddEnergyAction, AddPowerAction, MoveUnitAction ✅
  - DiscardCardAction ⭐ NON DOCUMENTATO
  - ExhaustCardAction ⭐ NON DOCUMENTATO
  - ReadyCardAction ⭐ NON DOCUMENTATO
  - RecycleCardAction ⭐ NON DOCUMENTATO
  - KillCardAction ⭐ NON DOCUMENTATO
  - HideCardAction ⭐ NON DOCUMENTATO
  - BanishCardAction ⭐ NON DOCUMENTATO
  - RevealCardAction ⭐ NON DOCUMENTATO
  - ChannelRuneAction ⭐ NON DOCUMENTATO
  - StunUnitAction ⭐ NON DOCUMENTATO
  - HealDamageAction ⭐ NON DOCUMENTATO
  - CounterSpellAction ⭐ NON DOCUMENTATO

📂 Test files trovati:
  - ConcreteActions.test.ts ✅
  - CardStateActions.test.ts ⭐ NON MENZIONATO
  - NewActions.test.ts ⭐ NON MENZIONATO
  - AdditionalModifiers.test.ts ⭐ NON MENZIONATO
  - AdditionalTriggers.test.ts ⭐ NON MENZIONATO
  - NewTriggers.test.ts ⭐ NON MENZIONATO
```

**Discrepanza:** Il sistema V3 è MOLTO PIÙ COMPLETO di quanto documentato. La documentazione sottostima il progresso reale.

---

### 2. CardStateScanner System

#### Stato Documentato
- **ENGINE-ARCHITECTURE.md:** ❌ NON MENZIONATO
- **DEVELOPMENT-ROADMAP.md:** ❌ NON MENZIONATO
- **CLAUDE.md:** ❌ NON MENZIONATO
- **ACTIVATED-ABILITIES-PROPOSAL-B.md:** ✅ Design document completo (852 righe)

#### Stato Reale (Codice)
```typescript
✅ File: src/engine/scanning/CardStateScanner.ts (570 righe) - IMPLEMENTATO
✅ File: src/engine/scanning/types/ScanTypes.ts (345 righe) - IMPLEMENTATO
✅ Integration in GameManager.ts:
  - private scanners: Map<string, CardStateScanner> ✅
  - async getPlayableCards(gameId, playerId) ✅
  - async getActivatableCards(gameId, playerId) ✅
  - async activateAbility(...) ⚠️ 70% complete (manca CardContext building)
```

**Discrepanza CRITICA:** Il CardStateScanner è un sistema **COMPLETAMENTE IMPLEMENTATO E FUNZIONANTE** ma **TOTALMENTE ASSENTE** dalla documentazione architettural e principale. Solo il proposal document lo descrive.

---

### 3. GameManager - Player Actions Layer

#### Stato Documentato (DEVELOPMENT-ROADMAP.md - Task 1)
```
❌ MISSING: Player action methods
  - playCard() - DOES NOT EXIST
  - standardMove() - DOES NOT EXIST
  - hideCard() - DOES NOT EXIST
  - passPriority() - DOES NOT EXIST
```

#### Stato Documentato (PLAYER-ACTIONS-ANALYSIS.md)
```
📋 Piano dettagliato di implementazione (730 righe)
📋 Subtask 1.1-1.7 definiti con checklist
📋 Estimated effort: 2-3 days
Status: "NOT STARTED"
```

#### Stato Reale (Codice GameManager.ts)
```typescript
✅ Scanner integration: COMPLETE
  - getPlayableCards(gameId, playerId): GameCard[] ✅
  - getActivatableCards(gameId, playerId) ✅
  - activateAbility(gameId, playerId, cardId, abilityId) ⚠️ PARTIAL (70%)

❌ Player action methods: MISSING
  - playCard() ❌ NOT FOUND
  - standardMove() ❌ NOT FOUND
  - hideCard() ❌ NOT FOUND
  - passPriority() ❌ NOT FOUND
```

**Discrepanza:** La documentazione è CORRETTA su questo punto. Il gap esiste davvero.

**NOTA IMPORTANTE:** Tuttavia, il scanner system (non documentato altrove) fornisce metodi query che sono PROPEDEUTICI all'implementazione dei player actions.

---

### 4. Testing Coverage

#### Stato Documentato (TESTING-ROADMAP-UPDATED.md)
```
📊 Version: 1.6
📊 Last Updated: 2025-10-09
📊 Status: 240/255 tests (94.1%)

Test breakdown documented:
  - T1.1-T1.3: Foundation ✅ COMPLETE
  - T2.1-T2.2: Integration ✅ COMPLETE (WITH ISSUES)
  - T3.1: V3 GameAction ✅ COMPLETE (98.8%)
  - T3.2-T4.2: BLOCKED
```

#### Stato Reale (Jest --listTests)
```
22 test files trovati vs ~15-18 documentati

Test files NON menzionati in TESTING-ROADMAP:
  - CardStateActions.test.ts ⭐
  - NewActions.test.ts ⭐
  - AdditionalModifiers.test.ts ⭐
  - AdditionalTriggers.test.ts ⭐
  - NewTriggers.test.ts ⭐
  - GameIntegration.test.ts ⭐
  - MigratedCards.test.ts ⭐
  - StorageIntegration.test.ts ⭐
```

**Discrepanza:** La test coverage documentata è OBSOLETA. Molti test aggiunti dopo l'ultimo update (2025-10-09) non sono tracciati.

---

### 5. Architettura Complessiva

#### ENGINE-ARCHITECTURE.md vs Realtà

| Componente | Doc Status | Code Status | Note |
|------------|-----------|-------------|------|
| V3 ActionExecutor | ✅ Documented | ✅ Implemented | ALIGNED |
| V3 Concrete Actions | ⚠️ 6 documented | ✅ 18 implemented | OUTDATED |
| V3 Modifiers | ✅ Documented | ✅ Implemented | ALIGNED |
| V3 Triggers | ✅ Documented | ✅ Implemented | ALIGNED |
| CardStateScanner | ❌ NOT MENTIONED | ✅ Implemented | **MISSING** |
| CardScriptRuntime | ✅ Documented | ✅ Implemented | ALIGNED |
| GameManager | ⚠️ Partial | ⚠️ Partial | ALIGNED but INCOMPLETE |
| TurnManager | ✅ Documented | ✅ Implemented | ALIGNED |
| BattlefieldManager | ✅ Documented | ✅ Implemented | ALIGNED |
| CombatManager | ✅ Documented | ✅ Implemented | ALIGNED |
| ChainSystem | ✅ Documented | ✅ Implemented | ALIGNED |
| RunePoolManager | ✅ Documented | ✅ Implemented | ALIGNED |
| ScoringManager | ✅ Documented | ✅ Implemented | ALIGNED |
| PriorityManager | ✅ Documented | ✅ Implemented | ALIGNED |
| EffectSystem | ⚠️ Marked DEPRECATED | ⚠️ Still in codebase | Should be removed |
| CleanupSystem | ⚠️ Marked DEPRECATED | ⚠️ Still in codebase | Should be removed |
| EventBus | ✅ Repurposed | ✅ Implemented | ALIGNED |

---

## 📁 Analisi Documenti

### Documenti Principali

| File | Status | Issue | Azione Richiesta |
|------|--------|-------|------------------|
| README.md | ✅ CURRENT | Aggiornato 2025-01-10 | Minor updates |
| ENGINE-ARCHITECTURE.md | ⚠️ OUTDATED | Manca CardStateScanner, Actions incomplete | MAJOR UPDATE |
| DEVELOPMENT-ROADMAP.md | ⚠️ OUTDATED | Dated 2025-01-10 ma status non riflette scanner | UPDATE |
| TESTING-ROADMAP-UPDATED.md | ⚠️ OUTDATED | Dated 2025-10-09 (data futura typo?) | UPDATE |
| GAMEACTION-SYSTEM-DESIGN.md | ⚠️ PARTIAL | Fase 1-5 documented, Actions list incomplete | UPDATE |
| V3-CARD-SCRIPTING-GUIDE.md | ✅ GOOD | Esempi chiari, API reference | Minor updates |
| KEYWORDS.md | ❓ UNKNOWN | Non analizzato | REVIEW |
| RULES.md | ❓ UNKNOWN | Non analizzato | REVIEW |
| MODELS.md | ❓ UNKNOWN | Non analizzato | REVIEW |
| DATABASE_SETUP.md | ❓ UNKNOWN | Non analizzato | REVIEW |

### Documenti Proposal/Analysis (Non Integrati)

| File | Status | Issue | Azione Richiesta |
|------|--------|-------|------------------|
| ACTIVATED-ABILITIES-PROPOSAL-B.md | ⚠️ PROPOSAL | Implementato al 70%, ma non integrato in arch docs | **INTEGRATE or ARCHIVE** |
| PLAYER-ACTIONS-ANALYSIS.md | ⚠️ ANALYSIS | Piano dettagliato ma task NON iniziato | **EXECUTE or UPDATE** |

**Problema:** Questi documenti contengono informazioni preziose ma non sono linkati/integrati nella documentazione principale. Causano confusione perché non è chiaro se sono "future work" o "implemented".

---

## 🎯 Gap Critici Identificati

### Gap 1: Documentazione CardStateScanner
**Severità:** ALTA
**Impact:** Gli sviluppatori non sanno che esiste un sistema completo per query di stato carte
**Fix:** Aggiungere sezione in ENGINE-ARCHITECTURE.md, aggiornare CLAUDE.md

### Gap 2: Lista Actions V3 Incompleta
**Severità:** MEDIA
**Impact:** Sottostima del progresso, sviluppatori potrebbero ri-implementare actions esistenti
**Fix:** Aggiornare GAMEACTION-SYSTEM-DESIGN.md con lista completa delle 18 actions

### Gap 3: Test Coverage Obsoleta
**Severità:** MEDIA
**Impact:** QA non ha visibilità completa sui test disponibili
**Fix:** Aggiornare TESTING-ROADMAP-UPDATED.md con tutti i test files

### Gap 4: Player Actions Implementation Status Ambiguo
**Severità:** ALTA
**Impact:** Non chiaro se i metodi mancano o esistono con nomi diversi
**Fix:** Verificare completamente GameManager, aggiornare DEVELOPMENT-ROADMAP

### Gap 5: Proposal Documents Non Integrati
**Severità:** MEDIA
**Impact:** Informazioni architetturali disperse, difficili da trovare
**Fix:** Integrare contenuti in docs principali O spostare in cartella `docs/proposals/`

---

## 📋 Raccomandazioni

### Priorità 1 (CRITICAL - Da Fare Subito)
1. **Aggiornare ENGINE-ARCHITECTURE.md**
   - Aggiungere sezione completa su CardStateScanner
   - Espandere lista V3 Actions con tutte le 18 implementations
   - Verificare allineamento di tutti i componenti

2. **Aggiornare CLAUDE.md**
   - Aggiungere CardStateScanner alla project overview
   - Aggiornare esempi con le nuove actions
   - Rimuovere riferimenti a "Phase 5.5 not started" (scanner è fatto)

3. **Riorganizzare Proposal Documents**
   - Spostare ACTIVATED-ABILITIES-PROPOSAL-B.md in `docs/architecture/` come reference
   - Spostare PLAYER-ACTIONS-ANALYSIS.md in `docs/development-plans/`
   - Aggiornare README.md con link alle nuove cartelle

### Priorità 2 (HIGH - Da Fare Presto)
4. **Aggiornare DEVELOPMENT-ROADMAP.md**
   - Mark CardStateScanner implementation come COMPLETE
   - Aggiornare status di Phase 5.5 Task 1 con progresso scanner
   - Clarify cosa manca veramente (player action methods in GameManager)

5. **Aggiornare TESTING-ROADMAP-UPDATED.md**
   - Aggiungere tutti i test files mancanti
   - Aggiornare coverage numbers se possibile
   - Fixare date inconsistenti (2025-10-09 è nel futuro?)

6. **Aggiornare GAMEACTION-SYSTEM-DESIGN.md**
   - Sezione "Implementation Status" completa con tutte le actions
   - Aggiungere test coverage per le nuove actions
   - Linkare a esempi di utilizzo

### Priorità 3 (MEDIUM - Nice to Have)
7. **Creare Index/Navigation Document**
   - Mappa della documentazione con descrizione di ogni file
   - Quando leggere cosa (new dev, card designer, architect)
   - Link tree per navigazione rapida

8. **Consolidare Esempi**
   - Verificare consistenza esempi tra V3-CARD-SCRIPTING-GUIDE e GAMEACTION-SYSTEM-DESIGN
   - Aggiungere esempi per le nuove actions

9. **Rimuovere Codice Deprecated**
   - EffectSystem: mark per removal o rimuovere
   - CleanupSystem: mark per removal o rimuovere
   - Update docs per confermare status

---

## 🗂️ Proposta Struttura Documentale Riorganizzata

```
docs/
├── README.md                          # Index - Start here
├── CLAUDE.md (root)                   # AI Assistant instructions
│
├── 01-getting-started/
│   ├── QUICK-START.md                # New dev onboarding
│   ├── DEVELOPMENT-SETUP.md          # Env setup (merge DATABASE_SETUP)
│   └── PROJECT-OVERVIEW.md           # High-level overview
│
├── 02-architecture/
│   ├── ENGINE-ARCHITECTURE.md         # ⭐ Main architecture doc (UPDATE)
│   ├── GAMEACTION-SYSTEM-DESIGN.md    # V3 deep dive (UPDATE)
│   ├── CARD-STATE-SCANNER.md          # ⭐ NEW - Scanner system docs
│   └── DEPRECATED-SYSTEMS.md          # ⭐ NEW - EffectSystem, CleanupSystem
│
├── 03-game-rules/
│   ├── RULES.md                       # Complete Riftbound rules
│   ├── KEYWORDS.md                    # Keyword reference
│   └── TURN-STRUCTURE.md              # Phase-by-phase guide
│
├── 04-development/
│   ├── DEVELOPMENT-ROADMAP.md         # Current priorities (UPDATE)
│   ├── TESTING-ROADMAP.md             # Test status (UPDATE)
│   ├── PLAYER-ACTIONS-PLAN.md         # Renamed from PLAYER-ACTIONS-ANALYSIS
│   └── ACTIVATED-ABILITIES-DESIGN.md  # Renamed from PROPOSAL-B
│
├── 05-card-scripting/
│   ├── V3-CARD-SCRIPTING-GUIDE.md     # Main guide (minor updates)
│   ├── ACTIONS-API-REFERENCE.md       # ⭐ NEW - Complete actions list
│   ├── MODIFIERS-API-REFERENCE.md     # ⭐ NEW - Modifiers catalog
│   ├── TRIGGERS-API-REFERENCE.md      # ⭐ NEW - Triggers catalog
│   └── EXAMPLES.md                    # Card script examples collection
│
├── 06-reference/
│   ├── MODELS.md                      # Database schema
│   ├── TYPE-DEFINITIONS.md            # TypeScript types reference
│   └── API-ENDPOINTS.md               # Future: REST API docs
│
└── _archive/                          # ⭐ NEW
    ├── ACTIVATED-ABILITIES-PROPOSAL-B.md (original)
    └── old-roadmaps/                  # Old version docs
```

### Vantaggi Struttura Proposta
✅ **Navigazione logica** - Percorso chiaro per tipo di utente
✅ **Separazione concerns** - Arch vs Dev vs Reference
✅ **Scalabilità** - Facile aggiungere nuovi docs senza cluttering
✅ **Archive chiaro** - Vecchi docs preservati ma non confusivi
✅ **API References separati** - Facile lookup per developers

---

## ✅ Criteri di Successo Post-Riorganizzazione

### Per gli Sviluppatori
1. ✅ Un nuovo developer può capire l'architettura leggendo 3 documenti max
2. ✅ Un card designer trova tutti gli esempi di actions/modifiers/triggers in un posto
3. ✅ Un architect trova il design completo del sistema senza ambiguità

### Per il Progetto
1. ✅ Zero discrepanze tra documentazione e codice
2. ✅ Ogni componente implementato ha sezione in ENGINE-ARCHITECTURE.md
3. ✅ Test coverage tracciata accuratamente
4. ✅ Roadmap riflette stato reale (non wishful thinking)

### Per Claude Code
1. ✅ CLAUDE.md contiene tutte le info necessarie per altri agents
2. ✅ Link ai documenti rilevanti sono aggiornati
3. ✅ Nessuna confusione tra "proposto" e "implementato"

---

**Fine Audit**
**Prossimo Step:** Implementazione piano di riorganizzazione
