# Riftbound Simulator - Documentazione

**Versione:** 2.0
**Ultima revisione:** 2025-01-10
**Completamento progetto:** ~72% core engine

---

## 🎯 Inizia Qui

### Per Nuovi Sviluppatori
1. **[CLAUDE.md](../CLAUDE.md)** - Istruzioni per AI assistants e overview del progetto
2. **[02-architecture/ENGINE-ARCHITECTURE.md](02-architecture/ENGINE-ARCHITECTURE.md)** - Architettura completa del sistema
3. **[04-development/DEVELOPMENT-ROADMAP.md](04-development/DEVELOPMENT-ROADMAP.md)** - Stato attuale e priorità

### Per Card Designers
1. **[05-card-scripting/V3-CARD-SCRIPTING-GUIDE.md](05-card-scripting/V3-CARD-SCRIPTING-GUIDE.md)** - Come scrivere card scripts
2. **[03-game-rules/KEYWORDS.md](03-game-rules/KEYWORDS.md)** - Reference delle keyword
3. **[03-game-rules/RULES.md](03-game-rules/RULES.md)** - Regole complete del gioco

### Per Architect
1. **[02-architecture/ENGINE-ARCHITECTURE.md](02-architecture/ENGINE-ARCHITECTURE.md)** - Sistema completo
2. **[02-architecture/GAMEACTION-SYSTEM-DESIGN.md](02-architecture/GAMEACTION-SYSTEM-DESIGN.md)** - Deep dive V3 pipeline
3. **[04-development/TESTING-ROADMAP-UPDATED.md](04-development/TESTING-ROADMAP-UPDATED.md)** - Coverage tests

---

## 📂 Struttura Documentale

### [01-getting-started/](01-getting-started/)
*Onboarding per nuovi sviluppatori*
- Quick start guide
- Development environment setup
- Project overview

### [02-architecture/](02-architecture/)
*Design e architettura del sistema*
- **[ENGINE-ARCHITECTURE.md](02-architecture/ENGINE-ARCHITECTURE.md)** - Architettura completa ⭐
- **[GAMEACTION-SYSTEM-DESIGN.md](02-architecture/GAMEACTION-SYSTEM-DESIGN.md)** - Sistema V3 GameAction ⭐
- Documentazione CardStateScanner (integrato in ENGINE-ARCHITECTURE)

**Sistemi Principali:**
- V3 GameAction System (18 actions implementate, 98.8% test coverage)
- CardStateScanner (scanner push-based per UI state)
- CardScriptRuntime (V2 scripting system, 87% test coverage)
- Managers (Game, Turn, Battlefield, Combat, Scoring, RunePool, Priority)
- ChainSystem (spell/ability stack)

### [03-game-rules/](03-game-rules/)
*Regole del gioco Riftbound TCG*
- **[RULES.md](03-game-rules/RULES.md)** - Regole complete
- **[KEYWORDS.md](03-game-rules/KEYWORDS.md)** - Reference keyword (Assault, Shield, Ganking, etc.)

### [04-development/](04-development/)
*Roadmap, planning e task tracking*
- **[DEVELOPMENT-ROADMAP.md](04-development/DEVELOPMENT-ROADMAP.md)** - Stato progetto e priorità ⭐
- **[TESTING-ROADMAP-UPDATED.md](04-development/TESTING-ROADMAP-UPDATED.md)** - Test coverage e strategie
- **[PLAYER-ACTIONS-ANALYSIS.md](04-development/PLAYER-ACTIONS-ANALYSIS.md)** - Piano implementazione player actions
- **[ACTIVATED-ABILITIES-PROPOSAL-B.md](04-development/ACTIVATED-ABILITIES-PROPOSAL-B.md)** - Design CardStateScanner (implementato)

### [05-card-scripting/](05-card-scripting/)
*Guide per scrivere card scripts*
- **[V3-CARD-SCRIPTING-GUIDE.md](05-card-scripting/V3-CARD-SCRIPTING-GUIDE.md)** - Guida completa V3 ⭐
- API Reference per Actions, Modifiers, Triggers (vedere GAMEACTION-SYSTEM-DESIGN.md)

### [06-reference/](06-reference/)
*Reference tecnici*
- **[MODELS.md](06-reference/MODELS.md)** - Schema database Prisma
- **[DATABASE_SETUP.md](06-reference/DATABASE_SETUP.md)** - Setup database locale

### [_archive/](_archive/)
*Documenti storici e audit*
- Audit architetturali
- Vecchie versioni roadmap
- Proposals archiviate

---

## 📊 Stato del Progetto (Snapshot)

### ✅ Sistemi Completati
| Sistema | Coverage | Status |
|---------|----------|--------|
| V3 GameAction (18 actions) | 98.8% | ✅ Production Ready |
| CardStateScanner | 100% impl | ✅ Integrated in GameManager |
| CardScriptRuntime (V2) | 87% | ✅ Functional |
| Database & Prisma ORM | 100% | ✅ Working |
| Core Managers | 80-100% | ✅ Functional |

### 🚧 In Progress (Phase 5.5 - Integration Layer)
- **Player Actions Implementation** (playCard, standardMove, hideCard, passPriority)
- CardScriptRuntime integration con lifecycle managers
- ChainSystem integration per spell resolution
- Combat triggers integration (OnCombatStartTrigger)
- processDeaths integration con onDeath hooks

### ❌ Not Started
- WebSocket multiplayer (Phase 5.2-5.4)
- REST API & Controllers (Phase 6)
- AI opponents (Phase 7)
- Performance optimization (Phase 8)

**Dettagli completi:** [04-development/DEVELOPMENT-ROADMAP.md](04-development/DEVELOPMENT-ROADMAP.md)

---

## 🔧 Sistemi Chiave

### V3 GameAction System
**Status:** ✅ 98.8% tested, 18 actions implemented
**Descrizione:** Pipeline dichiarativa per tutte le mutazioni di stato, ispirata a Legends of Runeterra.

**7 Fasi:**
1. Validation - Può essere eseguita?
2. Modifiers - Applica modificatori (es. +2 damage)
3. Execution - Esegui action modificata
4. History - Log automatico in game history
5. Triggers - Risoluzione trigger (es. "when unit dies")
6. Side Effects - Esegui actions generate come side effects
7. Cleanup - Cleanup quando stack torna a 0

**18 Actions Disponibili:**
- Core: DealDamage, Draw, PlayCard, AddEnergy, AddPower, MoveUnit, Heal
- Card State: Discard, Exhaust, Ready, Recycle, Kill, Hide, Reveal, Banish
- Special: ChannelRune, Stun, CounterSpell

**Docs:** [02-architecture/GAMEACTION-SYSTEM-DESIGN.md](02-architecture/GAMEACTION-SYSTEM-DESIGN.md)

### CardStateScanner
**Status:** ✅ 100% implemented, integrated in GameManager
**Descrizione:** Sistema push-based che determina UI state per tutte le carte.

**Funzionalità:**
- Determina quali carte sono giocabili (in mano)
- Trova activated abilities disponibili (da qualsiasi zona)
- Calcola costi effettivi (con modificatori)
- Verifica play constraints (timing, risorse, condizioni custom)
- Rileva pending triggers

**Query API:**
```typescript
const playableCards = gameManager.getPlayableCards(gameId, playerId);
const activatable = gameManager.getActivatableCards(gameId, playerId);
```

**Docs:** Sezione 2.2 in [02-architecture/ENGINE-ARCHITECTURE.md](02-architecture/ENGINE-ARCHITECTURE.md)

### CardScriptRuntime (V2)
**Status:** ✅ 87% tested, functional
**Descrizione:** Sistema di esecuzione card scripts con hooks (onPlay, onDeath, onAttack, etc.)

**Pattern di utilizzo:**
```typescript
export const myCard: CardScript = {
  onPlay: async (ctx: CardContext) => {
    // Usa V3 actions per mutazioni state
    await ctx.actions.dealDamage(target, 3, 'effect');
    await ctx.actions.draw(1);
  }
}
```

**Docs:** [05-card-scripting/V3-CARD-SCRIPTING-GUIDE.md](05-card-scripting/V3-CARD-SCRIPTING-GUIDE.md)

---

## ⚠️ Sistemi Deprecated

### EffectSystem
**Status:** DEPRECATED - Non usare
**Sostituto:** V3 ModifierRegistry + TriggerRegistry
**Motivo:** V3 fornisce migliore isolamento, testabilità e composition

### CleanupSystem
**Status:** DEPRECATED - Non usare
**Sostituto:** V3 ActionExecutor Phase 7 (Cleanup)
**Motivo:** Cleanup integrato nella pipeline V3

### EventBus
**Status:** ✅ KEPT ma repurposed
**Nuovo ruolo:** Solo per infrastructure (UI updates, analytics, logging)
**Non usare per:** Game logic, card triggers, state mutations (usa V3 Triggers)

---

## 🧪 Testing

**Overall:** 240/255 tests passing (94.1%)

**Test Suites:**
- V3 ActionExecutor: 15/16 (93.8%)
- V3 ConcreteActions: 23/23 (100%)
- V3 ConcreteModifiers: 24/24 (100%)
- V3 ConcreteTriggers: 21/21 (100%)
- CardScriptRuntime: 17/20 (85%)
- Managers & Systems: ~60 tests

**Dettagli:** [04-development/TESTING-ROADMAP-UPDATED.md](04-development/TESTING-ROADMAP-UPDATED.md)

---

## 🚀 Comandi Rapidi

```bash
# Install
npm install

# Database
npm run db:generate
npm run db:migrate
npm run db:seed

# Development
npm run dev

# Build
npm run build

# Tests
npm test
npm test -- <file-pattern>
npm test -- --coverage

# Format
npm run format
```

---

## 📝 Contributing

### Aggiornamento Documentazione

Quando aggiornare i docs:
- **DEVELOPMENT-ROADMAP.md**: Dopo completamento task
- **ENGINE-ARCHITECTURE.md**: Dopo cambi architetturali
- **V3-CARD-SCRIPTING-GUIDE.md**: Quando aggiungi Actions/Modifiers/Triggers
- **TESTING-ROADMAP-UPDATED.md**: Dopo aggiunta test suites

### Style Guide
- Usa markdown GitHub-flavored
- Includi esempi di codice dove utile
- Mantieni esempi aggiornati con codebase
- Data tutte le sezioni "Status" e "Last Updated"
- Emoji solo negli headers (non nel corpo del testo)

---

## 📞 Help & Support

**Per AI Assistants:**
Leggi **[../CLAUDE.md](../CLAUDE.md)** per istruzioni complete

**Per Sviluppatori:**
1. Start from [DEVELOPMENT-ROADMAP.md](04-development/DEVELOPMENT-ROADMAP.md)
2. Check [ENGINE-ARCHITECTURE.md](02-architecture/ENGINE-ARCHITECTURE.md) per design
3. Read [V3-CARD-SCRIPTING-GUIDE.md](05-card-scripting/V3-CARD-SCRIPTING-GUIDE.md) per card scripting

**Per Bug/Issues:**
- Consulta test coverage in [TESTING-ROADMAP-UPDATED.md](04-development/TESTING-ROADMAP-UPDATED.md)
- Verifica architectural decisions in [ENGINE-ARCHITECTURE.md](02-architecture/ENGINE-ARCHITECTURE.md)

---

**Ultimo Aggiornamento:** 2025-01-10
**Prossima Revisione:** Dopo completamento Phase 5.5 Task 1
