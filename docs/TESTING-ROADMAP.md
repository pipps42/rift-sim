# Testing Roadmap - Riftbound Simulator

**Version:** 1.0
**Last Updated:** 2025-10-02
**Status:** 🟡 In Progress

---

## 📊 Current State Analysis

### Components Implemented (Untested)
- ✅ **Core Engine** (Phases 1-4): ~3,000 LOC
  - GameManager, TurnManager, EventBus
  - ActionValidator, ChainSystem, PriorityManager
  - BattlefieldManager, CombatManager, CleanupSystem
  - EffectSystem, KeywordSystem, AbilitySystem

- ✅ **Card Scripting System** (Phase 0): ~4,500 LOC
  - CardScriptTypes, CardScriptSandbox, CardScriptLoader
  - CardScriptRuntime, BattlefieldAPI, ChainAPI, RandomAPI
  - 4 example cards (FireWarrior, LightningBolt, Phoenix, Archmage)

- ✅ **Database Layer** (Phase 5.1): ~1,000 LOC
  - Prisma schema (9 models)
  - Seed script (11 cards + 2 users)
  - CardFactory with script integration

**Total:** ~8,500 LOC (0% tested in real scenarios)

### Critical Gaps
- ❌ No integration tests between layers
- ❌ Unit tests written but never executed
- ❌ Database not set up locally (Prisma Client not generated)
- ❌ Example cards never run against real engine
- ❌ No end-to-end game simulation
- ❌ Potential circular dependencies unchecked
- ❌ Performance characteristics unknown

---

## 🎯 Testing Strategy

### Testing Pyramid

```
                    ┌─────────────┐
                    │     E2E     │  3 scenarios
                    │   Tests     │  Full games
                    └─────────────┘
                   ┌───────────────┐
                   │  Integration  │  ~50 tests
                   │     Tests     │  Layer communication
                   └───────────────┘
                ┌─────────────────────┐
                │    Unit Tests       │  ~150 tests
                │  Component isolation│  Individual modules
                └─────────────────────┘
```

### Coverage Targets

| Layer | Target Coverage | Priority |
|-------|----------------|----------|
| Core Engine | 80% | HIGH |
| Card Scripting | 90% | CRITICAL |
| Database | 70% | MEDIUM |
| Integration | 100% happy paths | HIGH |
| E2E | 3+ scenarios | MEDIUM |

---

## 🏗️ Phase T1: Foundation Testing

**Duration:** 2 days
**Objective:** Verify base layers work in isolation
**Status:** 🔴 Not Started

### Step T1.1: Database Setup & Prisma Client
**Priority:** 🔴 CRITICAL (blocks everything)

#### Tasks
1. Start PostgreSQL container
2. Generate Prisma Client (`npm run db:generate`)
3. Run migrations (`npm run db:migrate`)
4. Seed database (`npm run db:seed`)
5. Verify with Prisma Studio

#### Success Criteria
- ✅ PostgreSQL running on `localhost:5432`
- ✅ Prisma Client generated in `src/generated/prisma/`
- ✅ Database contains:
  - 11 cards (4 with scripts)
  - 2 test users
  - All tables created
- ✅ Prisma Studio accessible at `localhost:5555`

#### Commands
```bash
# Start database
docker-compose up -d postgres

# Generate client
npm run db:generate

# Create tables
npm run db:migrate

# Populate data
npm run db:seed

# View data
npm run db:studio
```

#### Expected Issues
- Port 5432 already in use → Stop other PostgreSQL instances
- Permission denied → Check Docker daemon running
- Migration conflicts → `npm run db:reset` and retry

#### Time Estimate: 1 hour

---

### Step T1.2: Card Scripting System Unit Tests
**Priority:** 🔴 CRITICAL

#### Test Suites
1. **CardScriptSandbox.test.ts** (already written)
   - Sandbox initialization
   - Script execution
   - API injection
   - Security (timeout, memory limits)
   - Error handling

2. **CardScriptLoader.test.ts** (already written)
   - Script loading from filesystem
   - Hot-reload with chokidar
   - Script validation
   - Error tracking
   - Cache management

3. **CardScriptRuntime.test.ts** (already written)
   - Hook execution orchestration
   - API factory integration
   - Context building
   - Sandbox pool management

#### Success Criteria
- ✅ All 3 test suites passing
- ✅ 60+ test cases green
- ✅ 0 flaky tests
- ✅ Execution time <10s total

#### Commands
```bash
# Run all Card Scripting tests
npm test -- CardScript

# Run individual suites
npm test -- CardScriptSandbox
npm test -- CardScriptLoader
npm test -- CardScriptRuntime

# With coverage
npm test -- --coverage CardScript
```

#### Expected Issues
- **Isolated-vm compilation errors** (Windows)
  - Solution: Verify Node.js version >=18
  - Fallback: Skip sandbox tests, use mock
- **File watcher timeouts**
  - Solution: Increase test timeouts to 10s
- **Mock API type mismatches**
  - Solution: Update mocks to match latest API signatures

#### Time Estimate: 2-3 hours

---

### Step T1.3: Core Engine Unit Tests
**Priority:** 🟡 HIGH

#### New Test Files to Create

**1. GameManager.test.ts**
```typescript
describe('GameManager', () => {
  // Initialization
  test('Initialize game with 2 players');
  test('Setup initial zones (hand, deck, runes)');
  test('Mulligan phase');

  // Phase transitions
  test('Advance through all 8 phases');
  test('Turn increment after Cleanup');

  // Actions
  test('Player can play card during Action phase');
  test('Player cannot play card during closed state');

  // Win conditions
  test('Game ends when player reaches 8 points');
  test('Game ends on burn-out');
});
```

**2. TurnManager.test.ts**
```typescript
describe('TurnManager', () => {
  // Phase flow
  test('Awaken → Beginning → Channel → Draw → Action → Ending → Expiration → Cleanup');
  test('Phase-specific actions allowed');

  // Priority
  test('Active player gets priority in Action phase');
  test('Priority passing between players');

  // State transitions
  test('Neutral Open → Neutral Closed on both pass');
  test('Showdown triggers on contested battlefield');
});
```

**3. CombatManager.test.ts**
```typescript
describe('CombatManager', () => {
  // Combat calculation
  test('Total might calculation (attacking vs defending)');
  test('Assault keyword adds might when attacking');
  test('Shield keyword adds might when defending');

  // Damage distribution
  test('Distribute damage to defending units');
  test('Tank keyword forces damage priority');
  test('Lethal damage destroys unit');

  // Special cases
  test('Ganking allows battlefield movement');
  test('Deflect redirects damage');
});
```

#### Success Criteria
- ✅ 3 new test suites
- ✅ ~40 test cases total
- ✅ 80%+ statement coverage for tested modules
- ✅ No regressions in existing tests

#### Time Estimate: 4-5 hours

---

### T1 Milestone: Foundation Solid
**Definition of Done:**
- ✅ Database running with seeded data
- ✅ 100+ unit tests passing
- ✅ 0 compilation errors
- ✅ CI pipeline green (if set up)

**Blockers to Resolve:**
1. Prisma Client generation
2. Isolated-vm Windows compatibility
3. Type mismatches between layers

---

## 🔗 Phase T2: Integration Testing

**Duration:** 3 days
**Objective:** Verify layers communicate correctly
**Status:** 🔴 Blocked by T1

### Step T2.1: CardFactory + Database Integration
**Priority:** 🟡 HIGH

#### Test File
**CardFactory.integration.test.ts**

```typescript
describe('CardFactory Integration', () => {
  let prisma: PrismaClient;
  let runtime: CardScriptRuntime;
  let factory: CardFactory;

  beforeAll(async () => {
    // Use test database
    prisma = new PrismaClient();
    runtime = new CardScriptRuntime({ scriptsDir: 'scripts/cards' });
    await runtime.initialize();
    factory = await createCardFactory(prisma, runtime);
  });

  describe('Database Loading', () => {
    test('Load all cards from database', async () => {
      const cards = factory.getAllCards();
      expect(cards.length).toBeGreaterThan(10);
    });

    test('Card metadata matches database', async () => {
      const card = factory.getCard('FIRE_WARRIOR_001');
      expect(card).toBeDefined();
      expect(card.name).toBe('Fire Warrior');
      expect(card.energyCost).toBe(3);
      expect(card.might).toBe(3);
    });

    test('JSON fields parsed correctly', async () => {
      const card = factory.getCard('FIRE_WARRIOR_001');
      expect(card.domains).toContain('fire');
      expect(card.keywords).toContain('ASSAULT');
      expect(card.tags).toContain('warrior');
    });
  });

  describe('Script Integration', () => {
    test('Scripted cards identified correctly', async () => {
      const scriptedCards = factory.getScriptedCards();
      expect(scriptedCards.length).toBe(4); // FireWarrior, Lightning, Phoenix, Archmage

      const ids = scriptedCards.map(c => c.id);
      expect(ids).toContain('FIRE_WARRIOR_001');
      expect(ids).toContain('LIGHTNING_BOLT_001');
    });

    test('scriptPath links to actual file', async () => {
      const card = factory.getCard('PHOENIX_001');
      const loader = runtime.getLoader();
      expect(loader.hasScript('PHOENIX_001')).toBe(true);
    });
  });

  describe('Queries', () => {
    test('Get cards by type', () => {
      const units = factory.getCardsByType(CardType.UNIT);
      expect(units.length).toBeGreaterThan(0);
      expect(units.every(c => c.cardType === CardType.UNIT)).toBe(true);
    });

    test('Get cards by rarity', () => {
      const mythic = factory.getCardsByRarity(Rarity.MYTHIC);
      expect(mythic).toContainEqual(
        expect.objectContaining({ id: 'PHOENIX_001' })
      );
    });

    test('Get cards by domain', () => {
      const fireCards = factory.getCardsByDomain(Domain.FIRE);
      expect(fireCards.length).toBeGreaterThan(0);
    });
  });

  describe('Hot Reload', () => {
    test('Reload card from database', async () => {
      const card = await factory.reloadCard('FIRE_WARRIOR_001');
      expect(card).toBeDefined();
    });

    test('Reload all cards', async () => {
      await factory.reload();
      expect(factory.getAllCards().length).toBeGreaterThan(0);
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await runtime.shutdown();
  });
});
```

#### Success Criteria
- ✅ CardFactory loads 11 cards from database
- ✅ 4 scripted cards link correctly to script files
- ✅ All query methods work
- ✅ Hot-reload updates card data

#### Time Estimate: 3 hours

---

### Step T2.2: Runtime + Example Cards Integration
**Priority:** 🔴 CRITICAL

#### Test File
**ExampleCards.integration.test.ts**

```typescript
describe('Example Cards Integration', () => {
  let runtime: CardScriptRuntime;
  let factory: CardFactory;
  let game: Game;

  beforeEach(async () => {
    // Initialize runtime with example cards
    runtime = new CardScriptRuntime({ scriptsDir: 'scripts/cards' });
    await runtime.initialize();

    factory = await createCardFactory(prisma, runtime);

    // Create minimal game state
    game = createTestGame();
  });

  describe('Fire Warrior', () => {
    test('onPlay deals 2 damage to target', async () => {
      const fireWarrior = factory.getCard('FIRE_WARRIOR_001');
      const target = createTestUnit('TARGET_001', 5); // 5 health

      // Simulate playing Fire Warrior targeting the unit
      await runtime.onPlay(fireWarrior, game, [target]);

      // Verify damage was dealt
      // NOTE: This requires BattlefieldAPI to actually modify state
      // For now, verify API was called
      expect(mockBattlefieldAPI.dealDamage).toHaveBeenCalledWith(
        target.id, 2, fireWarrior.id
      );
    });

    test('onAttack adds burning status', async () => {
      const fireWarrior = factory.getCard('FIRE_WARRIOR_001');
      const defender = createTestUnit('DEFENDER_001', 5);

      await runtime.onAttack(fireWarrior, game, defender);

      expect(mockBattlefieldAPI.addStatus).toHaveBeenCalledWith(
        defender.id, 'burning', 2
      );
    });

    test('onDeath deals 1 damage to all enemies', async () => {
      const fireWarrior = factory.getCard('FIRE_WARRIOR_001');

      // Mock 3 enemy units
      mockBattlefieldAPI.getEntities.mockReturnValue([
        createTestUnit('ENEMY_001', 5),
        createTestUnit('ENEMY_002', 3),
        createTestUnit('ENEMY_003', 4),
      ]);

      await runtime.onDeath(fireWarrior, game);

      expect(mockBattlefieldAPI.dealDamage).toHaveBeenCalledTimes(3);
    });
  });

  describe('Lightning Bolt', () => {
    test('Deals 3 damage to target', async () => {
      const spell = factory.getCard('LIGHTNING_BOLT_001');
      const target = createTestUnit('TARGET_001', 5);

      await runtime.onPlay(spell, game, [target]);

      expect(mockBattlefieldAPI.dealDamage).toHaveBeenCalledWith(
        target.id, 3, spell.id
      );
    });

    test('50% chance to stun (statistical)', async () => {
      const spell = factory.getCard('LIGHTNING_BOLT_001');
      const target = createTestUnit('TARGET_001', 10);

      let stunCount = 0;
      const trials = 100;

      for (let i = 0; i < trials; i++) {
        jest.clearAllMocks();
        await runtime.onPlay(spell, game, [target]);

        if (mockBattlefieldAPI.addStatus.mock.calls.some(
          call => call[1] === 'stunned'
        )) {
          stunCount++;
        }
      }

      // Verify ~50% stun rate (40-60% tolerance)
      expect(stunCount).toBeGreaterThan(40);
      expect(stunCount).toBeLessThan(60);
    });

    test('Chain lightning on kill', async () => {
      const spell = factory.getCard('LIGHTNING_BOLT_001');
      const target = createTestUnit('TARGET_001', 3); // Will be killed

      // Mock another enemy
      mockBattlefieldAPI.getEntities.mockReturnValue([
        createTestUnit('ENEMY_002', 5),
      ]);

      await runtime.onPlay(spell, game, [target]);

      // Verify bounce damage (1 damage to second target)
      expect(mockBattlefieldAPI.dealDamage).toHaveBeenCalledWith(
        expect.any(String), 1, spell.id
      );
    });
  });

  describe('Phoenix', () => {
    test('onPlay deals 1 damage to all enemies', async () => {
      const phoenix = factory.getCard('PHOENIX_001');

      mockBattlefieldAPI.getEntities.mockReturnValue([
        createTestUnit('ENEMY_001', 5),
        createTestUnit('ENEMY_002', 5),
      ]);

      await runtime.onPlay(phoenix, game);

      expect(mockBattlefieldAPI.dealDamage).toHaveBeenCalledTimes(2);
    });

    test('onDeath triggers resurrection', async () => {
      const phoenix = factory.getCard('PHOENIX_001');

      await runtime.onDeath(phoenix, game);

      // Verify resurrection effect added to chain
      expect(mockChainAPI.addEffect).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'CREATE_TOKEN',
          description: expect.stringContaining('Resurrect'),
        })
      );
    });

    test('onTurnStart regenerates health', async () => {
      const phoenix = factory.getCard('PHOENIX_001');

      // Set active player to owner
      game.currentPlayerIndex = 0;

      await runtime.onTurnStart(phoenix, game);

      expect(mockBattlefieldAPI.heal).toHaveBeenCalledWith(phoenix.id, 1);
    });

    test('Activated ability: Flames of Rebirth', async () => {
      const phoenix = factory.getCard('PHOENIX_001');

      mockBattlefieldAPI.getEntities.mockReturnValue([
        createTestUnit('ENEMY_001', 5),
        createTestUnit('ENEMY_002', 5),
      ]);

      // Execute activated ability (requires custom trigger)
      // For now, verify structure exists
      const script = runtime.getLoader().getScript('PHOENIX_001');
      expect(script?.script.activatedAbilities).toBeDefined();
      expect(script?.script.activatedAbilities?.length).toBeGreaterThan(0);
    });
  });

  describe('Archmage', () => {
    test('onPlay draws cards based on spells cast', async () => {
      const archmage = factory.getCard('ARCHMAGE_001');

      // Mock 3 spells cast this turn
      const context = { eventData: { spellsCastThisTurn: 3 } };

      await runtime.executeHook('onPlay', archmage, game, context);

      expect(mockChainAPI.addEffect).toHaveBeenCalledTimes(3);
    });

    test('Spell trigger: Gain +1/+1', async () => {
      const archmage = factory.getCard('ARCHMAGE_001');

      // Simulate spell cast event
      // NOTE: Requires trigger system implementation
      const script = runtime.getLoader().getScript('ARCHMAGE_001');
      expect(script?.script.triggers).toBeDefined();
      expect(script?.script.triggers?.some(
        t => t.event === 'SPELL_CAST'
      )).toBe(true);
    });

    test('Activated: Arcane Blast', async () => {
      const archmage = factory.getCard('ARCHMAGE_001');
      const script = runtime.getLoader().getScript('ARCHMAGE_001');

      const arcaneBlast = script?.script.activatedAbilities?.find(
        a => a.name === 'Arcane Blast'
      );

      expect(arcaneBlast).toBeDefined();
      expect(arcaneBlast?.description).toContain('2 damage');
    });
  });
});
```

#### Success Criteria
- ✅ All 4 example cards execute without errors
- ✅ onPlay hooks trigger correctly
- ✅ Damage, healing, status effects called on API
- ✅ Random effects work (stun chance)
- ✅ Complex mechanics (Phoenix resurrection, Archmage synergy) verified

#### Time Estimate: 4 hours

---

### Step T2.3: Engine + Actions Integration
**Priority:** 🟡 HIGH

#### Test File
**GameFlow.integration.test.ts**

```typescript
describe('Complete Game Flow Integration', () => {
  let gameManager: GameManager;
  let turnManager: TurnManager;
  let runtime: CardScriptRuntime;
  let factory: CardFactory;

  beforeEach(async () => {
    // Initialize full game stack
    runtime = new CardScriptRuntime({ scriptsDir: 'scripts/cards' });
    await runtime.initialize();

    factory = await createCardFactory(prisma, runtime);

    gameManager = new GameManager(eventBus);
    turnManager = new TurnManager(eventBus);

    // Create game with 2 players
    const game = await gameManager.createGame({
      player1Id: 'test-user-1',
      player2Id: 'test-user-2',
      // Pre-built decks with example cards
    });
  });

  describe('Turn Cycle', () => {
    test('Complete turn: Awaken → Cleanup', async () => {
      const game = gameManager.getGame();

      // Awaken Phase
      expect(game.phase).toBe(GamePhase.AWAKEN);
      await turnManager.advancePhase(game);

      // Beginning Phase
      expect(game.phase).toBe(GamePhase.BEGINNING);
      await turnManager.advancePhase(game);

      // Channel Phase
      expect(game.phase).toBe(GamePhase.CHANNEL);
      // Player channels a rune
      await gameManager.channelRune(game, 'player1', 'BASIC_RUNE_FIRE');
      await turnManager.advancePhase(game);

      // Draw Phase
      expect(game.phase).toBe(GamePhase.DRAW);
      // Player draws 1 card
      await turnManager.advancePhase(game);

      // Action Phase
      expect(game.phase).toBe(GamePhase.ACTION);
      // Player plays Fire Warrior
      await gameManager.playCard(game, 'player1', 'FIRE_WARRIOR_001', {
        targets: ['enemy-unit-id'],
      });
      // Both players pass
      await gameManager.passPriority(game, 'player1');
      await gameManager.passPriority(game, 'player2');
      await turnManager.advancePhase(game);

      // Ending Phase
      expect(game.phase).toBe(GamePhase.ENDING);
      await turnManager.advancePhase(game);

      // Expiration Phase
      expect(game.phase).toBe(GamePhase.EXPIRATION);
      await turnManager.advancePhase(game);

      // Cleanup Phase
      expect(game.phase).toBe(GamePhase.CLEANUP);
      await turnManager.advancePhase(game);

      // Back to Awaken, next turn
      expect(game.phase).toBe(GamePhase.AWAKEN);
      expect(game.round).toBe(2);
    });

    test('Action Phase: Play card with script', async () => {
      const game = gameManager.getGame();

      // Advance to Action phase
      await advanceToPhase(game, GamePhase.ACTION);

      // Give player 1 a Fire Warrior in hand
      const fireWarrior = factory.getCard('FIRE_WARRIOR_001');
      addCardToHand(game, 'player1', fireWarrior);

      // Give player 1 enough mana
      game.players[0].runePool.energy = 10;

      // Player 1 plays Fire Warrior targeting enemy unit
      const enemyUnit = addUnitToBattlefield(game, 'player2', 'ENEMY_UNIT', 5);

      await gameManager.playCard(game, 'player1', 'FIRE_WARRIOR_001', {
        targets: [enemyUnit.instanceId],
      });

      // Verify:
      // 1. Card removed from hand
      expect(game.players[0].zones.hand.length).toBe(0);

      // 2. Unit summoned to battlefield
      const battlefield = game.battlefields[0];
      expect(battlefield.units.some(u => u.cardId === 'FIRE_WARRIOR_001')).toBe(true);

      // 3. onPlay script executed (enemy took 2 damage)
      // NOTE: Requires real BattlefieldAPI implementation
      expect(enemyUnit.damage).toBe(2);
    });
  });

  describe('Combat with Scripted Cards', () => {
    test('Fire Warrior attacks with Assault keyword', async () => {
      const game = gameManager.getGame();

      // Setup battlefield
      const battlefield = game.battlefields[0];
      const fireWarrior = addUnitToBattlefield(game, 'player1', 'FIRE_WARRIOR_001', 3);
      const defender = addUnitToBattlefield(game, 'player2', 'BASIC_UNIT', 3);

      // Both units at same battlefield
      moveUnitToBattlefield(fireWarrior, battlefield.id);
      moveUnitToBattlefield(defender, battlefield.id);

      // Ready Fire Warrior for attack
      fireWarrior.ready = true;

      // Player 1 attacks
      await gameManager.declareAttack(game, 'player1', [fireWarrior.instanceId]);

      // Combat calculation
      const combatResult = await combatManager.resolveCombat(game, battlefield.id);

      // Verify:
      // 1. Fire Warrior has Assault (+X might when attacking)
      // 2. onAttack script triggered (burning status applied)
      expect(combatResult.attackingUnits[0].hasAssaultBonus).toBe(true);
      expect(defender.status).toContain('burning');
    });

    test('Phoenix dies and triggers resurrection', async () => {
      const game = gameManager.getGame();

      // Summon Phoenix
      const phoenix = addUnitToBattlefield(game, 'player1', 'PHOENIX_001', 3);

      // Deal lethal damage
      await battlefieldAPI.dealDamage(phoenix.instanceId, 10);

      // Process death trigger
      await runtime.onDeath(factory.getCard('PHOENIX_001'), game);

      // Verify resurrection effect in chain
      expect(game.chain.some(
        item => item.effects.some(e => e.type === 'CREATE_TOKEN')
      )).toBe(true);

      // Advance to end of turn
      await advanceToPhase(game, GamePhase.ENDING);

      // Resolve chain
      await chainSystem.resolveChain(game);

      // Verify Phoenix is back on battlefield with 1 health
      const resurrectedPhoenix = game.battlefields[0].units.find(
        u => u.cardId === 'PHOENIX_001'
      );
      expect(resurrectedPhoenix).toBeDefined();
      expect(resurrectedPhoenix.health).toBe(1);
    });
  });

  describe('Chain Resolution', () => {
    test('Spell chain: Lightning Bolt → Counter Spell', async () => {
      const game = gameManager.getGame();

      await advanceToPhase(game, GamePhase.ACTION);

      // Player 1 casts Lightning Bolt
      await gameManager.playCard(game, 'player1', 'LIGHTNING_BOLT_001', {
        targets: ['enemy-unit'],
      });

      // Verify chain has 1 item
      expect(game.chain.length).toBe(1);

      // Player 2 casts Counter Spell (if implemented)
      // await gameManager.playCard(game, 'player2', 'COUNTER_SPELL_001');

      // Both players pass
      await gameManager.passPriority(game, 'player2');
      await gameManager.passPriority(game, 'player1');

      // Resolve chain in reverse order
      await chainSystem.resolveChain(game);

      // Verify Lightning Bolt was countered
      // expect(game.chain.length).toBe(0);
    });
  });

  describe('State Consistency', () => {
    test('Game state serialization', () => {
      const game = gameManager.getGame();

      // Serialize to JSON
      const serialized = JSON.stringify(game);

      // Deserialize
      const deserialized = JSON.parse(serialized);

      // Verify critical fields
      expect(deserialized.id).toBe(game.id);
      expect(deserialized.round).toBe(game.round);
      expect(deserialized.players.length).toBe(2);
    });

    test('No memory leaks after 10 turns', async () => {
      const game = gameManager.getGame();
      const initialMemory = process.memoryUsage().heapUsed;

      // Play 10 turns
      for (let i = 0; i < 10; i++) {
        await playFullTurn(game);
      }

      // Force garbage collection (if --expose-gc)
      if (global.gc) global.gc();

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB

      // Verify <50MB increase
      expect(memoryIncrease).toBeLessThan(50);
    });
  });
});
```

#### Success Criteria
- ✅ Complete turn cycle (8 phases) works
- ✅ Player can play scripted card in Action phase
- ✅ Combat triggers card scripts (onAttack, onDeath)
- ✅ Chain resolution works
- ✅ Game state remains consistent

#### Time Estimate: 6 hours

---

### T2 Milestone: Integration Working
**Definition of Done:**
- ✅ CardFactory loads cards from DB successfully
- ✅ 4 example cards execute without errors
- ✅ 1 complete turn cycle works end-to-end
- ✅ Combat with scripted cards functions
- ✅ No state corruption after actions

**Critical Fixes Needed:**
1. **BattlefieldAPI real implementation** (currently stubs)
2. **ChainAPI connects to actual chain system**
3. **Event triggers** fire for card scripts
4. **State mutations** actually modify game state

---

## 🎮 Phase T3: End-to-End Testing

**Duration:** 2 days
**Objective:** Play complete games from start to finish
**Status:** 🔴 Blocked by T2

### Step T3.1: Full Game Simulation
**Priority:** 🟡 HIGH

#### Test File
**FullGame.e2e.test.ts**

```typescript
describe('Full Game Simulation (E2E)', () => {
  describe('Complete Game to Victory', () => {
    test('Play game to 8 points (Hold victory)', async () => {
      // Initialize game
      const game = await createGame({
        player1: createTestDeck('Fire Aggro'),
        player2: createTestDeck('Control'),
      });

      // Mulligan
      await mulligan(game, 'player1', [0, 2]); // Discard 2 cards
      await mulligan(game, 'player2', [1]);

      let turnCount = 0;
      const maxTurns = 50; // Safety limit

      // Play until someone wins
      while (!game.winner && turnCount < maxTurns) {
        // Turn structure
        await playTurn(game, {
          // AI makes semi-random valid moves
          channelRune: true,
          playCards: 1-2,
          declareAttacks: true,
        });

        turnCount++;

        // Check win conditions
        if (game.players[0].score >= 8) {
          expect(game.winner).toBe('player1');
          expect(game.status).toBe(GameStatus.FINISHED);
          break;
        }
        if (game.players[1].score >= 8) {
          expect(game.winner).toBe('player2');
          break;
        }
      }

      // Verify game completed naturally
      expect(turnCount).toBeLessThan(maxTurns);
      expect(game.winner).toBeDefined();

      console.log(`Game completed in ${turnCount} turns. Winner: ${game.winner}`);
    }, 60000); // 60s timeout

    test('Burn-out victory condition', async () => {
      const game = await createGame({
        player1: createTestDeck('Mill'),
        player2: createSmallDeck(10), // Small deck for testing
      });

      // Force player 2 to draw entire deck
      for (let i = 0; i < 15; i++) {
        await forceDraw(game, 'player2');
      }

      // Player 2 tries to draw with empty deck and trash
      game.players[1].zones.mainDeck = [];
      game.players[1].zones.trash = [];

      await forceDraw(game, 'player2');

      // Verify burn-out
      expect(game.winner).toBe('player1');
      expect(game.winCondition).toContain('burn-out');
    });
  });

  describe('Match Replay System', () => {
    test('Replay match from event log', async () => {
      // Play a complete game
      const originalGame = await playFullGame();

      // Extract event log
      const events = await prisma.matchEvent.findMany({
        where: { matchId: originalGame.id },
        orderBy: { sequence: 'asc' },
      });

      expect(events.length).toBeGreaterThan(50);

      // Reconstruct game from events
      const replayedGame = await replayGameFromEvents(events);

      // Verify final state matches
      expect(replayedGame.round).toBe(originalGame.round);
      expect(replayedGame.winner).toBe(originalGame.winner);
      expect(replayedGame.players[0].score).toBe(originalGame.players[0].score);
      expect(replayedGame.players[1].score).toBe(originalGame.players[1].score);
    });

    test('Event sequence is deterministic', async () => {
      const seed = 12345;

      // Play same game twice with same seed
      const game1 = await playFullGame({ randomSeed: seed });
      const game2 = await playFullGame({ randomSeed: seed });

      // Verify event sequences match
      const events1 = await getMatchEvents(game1.id);
      const events2 = await getMatchEvents(game2.id);

      expect(events1.length).toBe(events2.length);

      for (let i = 0; i < events1.length; i++) {
        expect(events1[i].type).toBe(events2[i].type);
        expect(events1[i].data).toEqual(events2[i].data);
      }
    });
  });

  describe('Edge Cases', () => {
    test('Game with only scripted cards', async () => {
      // Deck with only cards that have scripts
      const deck = {
        main: Array(40).fill('FIRE_WARRIOR_001'),
        rune: Array(12).fill('BASIC_RUNE_FIRE'),
        champion: 'PHOENIX_001',
      };

      const game = await createGame({
        player1: deck,
        player2: deck,
      });

      // Play 5 turns
      for (let i = 0; i < 5; i++) {
        await playTurn(game);
      }

      // Verify no crashes
      expect(game.status).toBe(GameStatus.IN_PROGRESS);
    });

    test('Complex interaction: Phoenix + Archmage', async () => {
      const game = await createGame();

      // Player 1: Summon Archmage
      await summonUnit(game, 'player1', 'ARCHMAGE_001');

      // Player 1: Cast spell (triggers Archmage +1/+1)
      await playCard(game, 'player1', 'LIGHTNING_BOLT_001');

      const archmage = getUnit(game, 'ARCHMAGE_001');
      expect(archmage.might).toBeGreaterThan(5); // Base 5 + 1

      // Player 2: Summon Phoenix
      await summonUnit(game, 'player2', 'PHOENIX_001');

      // Player 1: Kill Phoenix with Archmage ability
      await activateAbility(game, archmage.id, 'Arcane Blast');

      // Phoenix dies and triggers resurrection
      // Wait for end of turn
      await advanceToPhase(game, GamePhase.ENDING);

      // Phoenix resurrects
      const phoenix = getUnit(game, 'PHOENIX_001');
      expect(phoenix).toBeDefined();
      expect(phoenix.health).toBe(1);
    });
  });
});
```

#### Success Criteria
- ✅ At least 1 complete game reaches victory condition
- ✅ Game completes in <50 turns (reasonable time)
- ✅ Event replay reconstructs exact final state
- ✅ Deterministic with same random seed
- ✅ No crashes or infinite loops

#### Time Estimate: 6 hours

---

### Step T3.2: Performance & Stress Testing
**Priority:** 🟢 MEDIUM

#### Test File
**Performance.e2e.test.ts**

```typescript
describe('Performance Tests', () => {
  describe('Script Execution Performance', () => {
    test('onPlay hook executes in <100ms', async () => {
      const runtime = new CardScriptRuntime();
      await runtime.initialize();

      const card = factory.getCard('FIRE_WARRIOR_001');
      const game = createTestGame();

      // Warm up
      for (let i = 0; i < 10; i++) {
        await runtime.onPlay(card, game);
      }

      // Benchmark
      const iterations = 1000;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        await runtime.onPlay(card, game);
      }

      const end = performance.now();
      const avgTime = (end - start) / iterations;

      expect(avgTime).toBeLessThan(100); // <100ms per execution
      console.log(`Average script execution time: ${avgTime.toFixed(2)}ms`);
    });

    test('Sandbox pool reuses instances', async () => {
      const pool = new SandboxPool(5);

      const sandbox1 = await pool.acquire();
      pool.release(sandbox1);

      const sandbox2 = await pool.acquire();

      // Verify same instance reused
      expect(sandbox2).toBe(sandbox1);
    });
  });

  describe('Memory & Resource Management', () => {
    test('100 turns without memory leak', async () => {
      const game = await createGame();
      const initialMemory = process.memoryUsage().heapUsed;

      // Play 100 turns
      for (let i = 0; i < 100; i++) {
        await playTurn(game);

        // Periodic GC
        if (i % 10 === 0 && global.gc) {
          global.gc();
        }
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024;

      // Allow <200MB increase
      expect(memoryIncrease).toBeLessThan(200);

      console.log(`Memory increase after 100 turns: ${memoryIncrease.toFixed(2)}MB`);
    });

    test('10 concurrent games', async () => {
      const games = await Promise.all(
        Array(10).fill(null).map(() => createGame())
      );

      // Play 5 turns in each game concurrently
      for (let turn = 0; turn < 5; turn++) {
        await Promise.all(
          games.map(game => playTurn(game))
        );
      }

      // Verify all games still in progress
      games.forEach(game => {
        expect(game.status).toBe(GameStatus.IN_PROGRESS);
      });
    });
  });

  describe('Database Performance', () => {
    test('Card loading <100ms', async () => {
      const start = performance.now();

      const factory = await createCardFactory(prisma, runtime);

      const end = performance.now();
      const loadTime = end - start;

      expect(loadTime).toBeLessThan(100);
      console.log(`Card loading time: ${loadTime.toFixed(2)}ms`);
    });

    test('Match event persistence <10ms per event', async () => {
      const events = Array(100).fill(null).map((_, i) => ({
        matchId: 'test-match',
        type: 'CARD_PLAYED',
        round: 1,
        sequence: i,
        data: { cardId: 'TEST_001' },
      }));

      const start = performance.now();

      await prisma.matchEvent.createMany({ data: events });

      const end = performance.now();
      const avgTime = (end - start) / events.length;

      expect(avgTime).toBeLessThan(10);
      console.log(`Avg event insert time: ${avgTime.toFixed(2)}ms`);
    });
  });

  describe('Stress Tests', () => {
    test('1000 script executions without crash', async () => {
      const runtime = new CardScriptRuntime();
      await runtime.initialize();

      const cards = [
        factory.getCard('FIRE_WARRIOR_001'),
        factory.getCard('LIGHTNING_BOLT_001'),
        factory.getCard('PHOENIX_001'),
        factory.getCard('ARCHMAGE_001'),
      ];

      const game = createTestGame();

      for (let i = 0; i < 1000; i++) {
        const card = cards[i % cards.length];
        await runtime.onPlay(card, game);
      }

      // If we get here, no crashes occurred
      expect(true).toBe(true);
    });

    test('Handle 1000 units on battlefield', async () => {
      const game = createTestGame();

      // Add 1000 units (stress test)
      for (let i = 0; i < 1000; i++) {
        addUnitToBattlefield(game, 'player1', 'BASIC_UNIT', 1);
      }

      // Query entities
      const units = battlefieldAPI.getEntities({ type: 'unit' });

      expect(units.length).toBe(1000);

      // Filter with complex query
      const fireUnits = battlefieldAPI.getEntities({
        type: 'unit',
        domains: ['fire'],
        minMight: 3,
      });

      expect(Array.isArray(fireUnits)).toBe(true);
    });
  });
});
```

#### Success Criteria
- ✅ Script execution <100ms average
- ✅ No memory leaks (<200MB increase over 100 turns)
- ✅ 10 concurrent games run successfully
- ✅ Database operations performant (<100ms card loading)
- ✅ 1000+ script executions without crash

#### Time Estimate: 4 hours

---

### T3 Milestone: E2E Complete
**Definition of Done:**
- ✅ At least 1 full game playable from start to finish
- ✅ Event replay system working
- ✅ Performance benchmarks established
- ✅ No critical bugs in happy path
- ✅ Memory usage acceptable

---

## 🚨 Known Blockers & Risks

### Critical Blockers (Must Fix)
1. **Prisma Client Generation**
   - **Impact:** Blocks all database tests
   - **Fix:** `npm run db:generate`
   - **Time:** 10 minutes

2. **BattlefieldAPI Stub Implementation**
   - **Impact:** Card scripts can't actually modify game state
   - **Fix:** Implement real operations in `BattlefieldAPIImpl.ts`
   - **Time:** 4-6 hours

3. **Isolated-vm Windows Compatibility**
   - **Impact:** Sandbox tests may fail on Windows
   - **Fix:** Test on Windows, use mock if needed
   - **Time:** 2 hours

### High-Risk Areas
4. **Circular Dependencies**
   - Types between Game and Scripting layers
   - Monitor during compilation

5. **State Mutations**
   - Scripts must actually modify game state
   - Not just call API methods

6. **Event System Integration**
   - EventBus needs to trigger card scripts
   - Currently disconnected

### Performance Risks
7. **Isolated-vm Overhead**
   - Each script execution spins up isolate
   - Pool reuse critical

8. **Database Connection Pool**
   - Multiple concurrent games
   - May exhaust connections

---

## 📈 Success Metrics & KPIs

### Code Quality
- **Test Coverage:** 80%+ overall
- **Critical Path:** 100% (game flow, combat, scripting)
- **Bug Density:** <1 bug per 1000 LOC

### Performance
- **Script Execution:** <100ms avg
- **Database Queries:** <50ms p95
- **Memory Usage:** <500MB for 10 concurrent games
- **Turn Processing:** <1s per turn

### Reliability
- **Crash Rate:** 0% in happy path
- **State Corruption:** 0 instances
- **Replay Accuracy:** 100% deterministic

### Developer Experience
- **Test Run Time:** <30s for unit tests
- **CI Pipeline:** <5 minutes total
- **Hot Reload:** <2s after script change

---

## 🗓️ Timeline & Milestones

### Week 1: Foundation (T1)
**Days 1-2:**
- ✅ Database setup
- ✅ Unit tests: Card Scripting
- ✅ Unit tests: Core Engine

**Milestone:** 100+ tests passing, 0 compilation errors

---

### Week 2: Integration (T2)
**Days 3-5:**
- ✅ CardFactory integration
- ✅ Example cards working
- ✅ Game flow integration

**Milestone:** 1 complete turn cycle working

---

### Week 3: E2E (T3)
**Days 6-7:**
- ✅ Full game simulation
- ✅ Performance testing
- ✅ Documentation

**Milestone:** 1 playable game end-to-end

---

## 🔄 Continuous Integration

### CI Pipeline (Future)
```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  unit-tests:
    - npm run db:generate
    - npm test -- --coverage
    - Upload coverage to Codecov

  integration-tests:
    - docker-compose up -d postgres
    - npm run db:migrate
    - npm test -- integration

  e2e-tests:
    - npm test -- e2e
    - Timeout: 10 minutes
```

---

## 📚 Documentation Deliverables

### Test Documentation
- [x] This testing roadmap
- [ ] Test writing guidelines
- [ ] Mock data generators guide
- [ ] Performance benchmarking guide

### Code Documentation
- [ ] CardFactory API docs
- [ ] BattlefieldAPI implementation guide
- [ ] Game flow state machine diagram
- [ ] Event system architecture

---

## 🎯 Next Steps

### Immediate Actions (Start Now)
1. **Run T1.1:** Database setup (`docker-compose up -d`)
2. **Run T1.2:** Card Scripting tests (`npm test -- CardScript`)
3. **Fix blockers:** BattlefieldAPI stubs → real impl

### After T1 Complete
4. Write CardFactory integration tests
5. Test example cards against real engine
6. Fix state mutation issues

### After T2 Complete
7. Implement simple AI for E2E
8. Run full game simulation
9. Benchmark performance

---

## 📊 Progress Tracking

| Phase | Status | Tests | Coverage | Blockers |
|-------|--------|-------|----------|----------|
| T1.1 Database | 🔴 Not Started | 0/5 | 0% | None |
| T1.2 Card Scripting | 🔴 Not Started | 0/60 | 0% | Isolated-vm |
| T1.3 Core Engine | 🔴 Not Started | 0/40 | 0% | None |
| T2.1 CardFactory | 🔴 Not Started | 0/15 | 0% | Prisma Client |
| T2.2 Example Cards | 🔴 Not Started | 0/20 | 0% | BattlefieldAPI |
| T2.3 Game Flow | 🔴 Not Started | 0/10 | 0% | State mutations |
| T3.1 Full Game | 🔴 Not Started | 0/5 | 0% | T2 complete |
| T3.2 Performance | 🔴 Not Started | 0/10 | 0% | None |

**Overall Progress:** 0% (0/165 tests)

---

## 🆘 Support & Resources

### Getting Help
- Check existing test files for examples
- Review API documentation in code comments
- Ask specific questions with context

### Useful Commands
```bash
# Database
docker-compose up -d postgres
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio

# Testing
npm test                          # All tests
npm test -- CardScript            # Specific suite
npm test -- --coverage            # With coverage
npm test -- --watch               # Watch mode

# Debugging
npm test -- --verbose             # Verbose output
npm test -- --detectOpenHandles   # Find async issues
```

### Common Issues
**Issue:** Tests timeout
**Solution:** Increase timeout in test config

**Issue:** Database connection refused
**Solution:** `docker-compose up -d postgres`

**Issue:** Prisma Client errors
**Solution:** `npm run db:generate`

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-02 | Initial testing roadmap created |

---

**Next Update:** After T1 completion (ETA: 2 days)
