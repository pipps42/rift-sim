# Riftbound Simulator - Documentation

## 📚 Documentation Overview

This directory contains all technical documentation for the Riftbound TCG game engine.

---

## 🎯 Start Here

### For New Contributors
1. **[RULES.md](./RULES.md)** - Learn the game rules (1v1 TCG mechanics)
2. **[DEVELOPMENT-ROADMAP.md](./DEVELOPMENT-ROADMAP.md)** - Current status & next steps
3. **[ENGINE-ARCHITECTURE.md](./ENGINE-ARCHITECTURE.md)** - How everything fits together

### For Card Designers
1. **[V3-CARD-SCRIPTING-GUIDE.md](./V3-CARD-SCRIPTING-GUIDE.md)** - How to write card scripts
2. **[KEYWORDS.md](./KEYWORDS.md)** - Card keyword reference
3. **[RULES.md](./RULES.md)** - Game rules for card design

### For Engine Developers
1. **[ENGINE-ARCHITECTURE.md](./ENGINE-ARCHITECTURE.md)** - Complete system architecture
2. **[GAMEACTION-SYSTEM-DESIGN.md](./GAMEACTION-SYSTEM-DESIGN.md)** - V3 action pipeline deep dive
3. **[TESTING-ROADMAP-UPDATED.md](./TESTING-ROADMAP-UPDATED.md)** - Test coverage status

---

## 📖 Document Index

### Core Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| **[DEVELOPMENT-ROADMAP.md](./DEVELOPMENT-ROADMAP.md)** | Project status, priorities, next steps | All |
| **[ENGINE-ARCHITECTURE.md](./ENGINE-ARCHITECTURE.md)** | Complete architecture overview | Developers |
| **[RULES.md](./RULES.md)** | Complete game rules | Card Designers, Developers |

### Technical Deep Dives

| Document | Purpose | Audience |
|----------|---------|----------|
| **[GAMEACTION-SYSTEM-DESIGN.md](./GAMEACTION-SYSTEM-DESIGN.md)** | V3 GameAction System internals | Engine Developers |
| **[V3-CARD-SCRIPTING-GUIDE.md](./V3-CARD-SCRIPTING-GUIDE.md)** | How to write V3 card scripts | Card Designers |
| **[TESTING-ROADMAP-UPDATED.md](./TESTING-ROADMAP-UPDATED.md)** | Test coverage & testing strategy | QA, Developers |

### Reference

| Document | Purpose | Audience |
|----------|---------|----------|
| **[KEYWORDS.md](./KEYWORDS.md)** | Card keyword definitions | Card Designers |
| **[MODELS.md](./MODELS.md)** | Database schema reference | Backend Developers |
| **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** | How to setup local database | Developers |

---

## 🗺️ Project Status Quick Reference

### ✅ What's Working
- V3 GameAction System (98.8% tested)
- V2 Card Scripting Runtime (87% tested)
- Database & Prisma ORM
- Core managers (GameManager, TurnManager, etc.)
- Game setup & lifecycle

### 🚧 What's In Progress
- **Integration Layer** (Phase 5.5)
  - Connecting V2 Runtime → V3 Actions
  - Player action implementation
  - Chain system integration

### ❌ What's Missing
- Player input handling (playCard, activateAbility)
- Combat triggers (OnCombatStartTrigger)
- Chain resolution with card scripts
- Full end-to-end game loop

**See [DEVELOPMENT-ROADMAP.md](./DEVELOPMENT-ROADMAP.md) for details.**

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│         Player Input Layer              │  ← MISSING (Phase 5.5 Task 1)
│  playCard(), move(), activateAbility()  │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│           Game Managers                 │  ← Partially done
│  GameManager, TurnManager, Combat, etc. │
└────────────────┬────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
┌────────┴──────┐  ┌──────┴──────────────┐
│ V2 Card       │  │ V3 GameAction       │  ← Both work perfectly
│ Scripting     │──│ System              │     in isolation!
│ Runtime       │  │ (Actions/Modifiers/ │
└───────────────┘  │  Triggers)          │
                   └─────────────────────┘
                            │
                   ┌────────┴─────────┐
                   │   Game State     │
                   │   (types/game.ts)│
                   └──────────────────┘
```

**Problem**: The arrow between Managers → V2/V3 is missing!

---

## 🔍 Key Architecture Decisions

### 1. V3 GameAction System is Core
All state mutations go through the V3 pipeline:
- Validation → Modifiers → Execute → History → Triggers → Cleanup
- Declarative actions (intentions, not mutations)
- Fully tested, production-ready

### 2. V2 Card Scripts Bridge to V3
Card scripts use V2 runtime (TypeScript execution) but:
- Call V3 actions via `ctx.actions.*`
- Register V3 modifiers via `ctx.modifiers.*`
- Register V3 triggers via `ctx.triggers.*`

### 3. Deprecated Systems
- **EffectSystem** → Use V3 Modifiers
- **CleanupSystem** → Use V3 ActionExecutor Phase 7
- **EventBus** → Keep for infrastructure only (logging, UI updates)

### 4. Type System
- `GameCard extends BaseCard` (might? optional)
- Type guards: `isUnitCard()`, `isSpellCard()`, etc.
- `CardContext` includes `opponent` for convenience

---

## 🚀 Getting Started

### Setup Development Environment

```bash
# Clone repo
git clone <repo-url>
cd riftbound-simulator

# Install dependencies
npm install

# Setup database
npm run db:generate
npm run db:migrate
npm run db:seed

# Run tests
npm test

# Start dev server (when API ready)
npm run dev
```

### Run Your First Card Script

See [V3-CARD-SCRIPTING-GUIDE.md](./V3-CARD-SCRIPTING-GUIDE.md) for examples.

---

## 📞 Need Help?

1. Check [DEVELOPMENT-ROADMAP.md](./DEVELOPMENT-ROADMAP.md) for current status
2. Read [ENGINE-ARCHITECTURE.md](./ENGINE-ARCHITECTURE.md) for system overview
3. See [V3-CARD-SCRIPTING-GUIDE.md](./V3-CARD-SCRIPTING-GUIDE.md) for card examples
4. Open an issue on GitHub (when project is public)

---

## 📝 Contributing

### Documentation Style Guide
- Use markdown with GitHub flavor
- Include code examples where helpful
- Keep examples up-to-date with codebase
- Use emoji sparingly (headers only)
- Date all status updates

### When to Update Docs
- **DEVELOPMENT-ROADMAP.md**: After completing any task
- **ENGINE-ARCHITECTURE.md**: After major architectural changes
- **V3-CARD-SCRIPTING-GUIDE.md**: When adding new Actions/Modifiers/Triggers
- **TESTING-ROADMAP-UPDATED.md**: After adding test suites

---

**Last Updated:** 2025-01-10
