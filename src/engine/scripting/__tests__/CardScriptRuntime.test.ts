/**
 * T1.2.3: Card Script Runtime Tests
 *
 * Tests for runtime execution, hooks, and game state integration
 */

import { CardScriptRuntime, type APIFactory } from '../CardScriptRuntime';
import { CardScriptLoader } from '../CardScriptLoader';
import type { BattlefieldAPI, ChainAPI, RandomAPI, LogAPI } from '../types/CardScriptTypes';
import type { Card, Player, Game, GameCard, LegendCard, UnitCard } from '../../../types/game';
import { CardType, Rarity, Domain, GamePhase, TurnState, GameStatus } from '../../../types/game';
import * as fs from 'fs/promises';
import * as path from 'path';

const TEST_SCRIPTS_DIR = path.join(process.cwd(), 'test-fixtures', 'runtime-scripts');

// Mock API Factory for testing
class MockAPIFactory implements APIFactory {
  createBattlefieldAPI(game: Game): BattlefieldAPI {
    return {
      getEntity: () => undefined,
      getEntities: () => [],
      getEntitiesInArea: () => [],
      dealDamage: () => {},
      heal: () => {},
      destroy: () => {},
      move: () => {},
      addStatus: () => {},
      removeStatus: () => {},
      modifyStats: () => {},
      summon: () => {},
      transform: () => {},
    };
  }

  createChainAPI(game: Game): ChainAPI {
    return {
      addEffect: () => {},
      counter: () => {},
      getChainLength: () => 0,
      isEmpty: () => true,
    };
  }

  createRandomAPI(game: Game): RandomAPI {
    return {
      int: (min, max) => min,
      float: () => 0.5,
      pick: <T>(array: T[]) => array[0]!,
      shuffle: <T>(array: T[]) => [...array],
      chance: () => true,
    };
  }

  createLogAPI(cardId: string): LogAPI {
    return {
      info: () => {},
      warn: () => {},
      error: () => {},
      debug: () => {},
    };
  }
}

// Helper to create mock game state
function createMockGame(): Game {
  const legendCard: LegendCard = {
    id: 'legend1',
    name: 'Test Legend',
    energyCost: 0,
    powerCost: [],
    description: 'Test legend',
    cardType: CardType.LEGEND,
    rarity: Rarity.MYTHIC,
    domains: [Domain.FURY],
    keywords: [],
    tags: [],
    domainIdentity: [Domain.FURY],
    championTag: 'test',
    legendaryAbility: {} as any,
  };

  const player: Player = {
    id: 'player1',
    name: 'Player 1',
    score: 0,
    championLegend: legendCard,
    zones: {
      base: [],
      runes: [],
      hand: [],
      mainDeck: [],
      runeDeck: [],
      championZone: [],
      trash: [],
      banishment: [],
    },
    runePool: {
      energy: 5,
      power: [],
    },
    hasPlayedCard: false,
    turnsPassed: 0,
  };

  return {
    id: 'game1',
    players: [player, player], // Simplified: same player twice
    currentPlayerIndex: 0,
    phase: GamePhase.ACTION,
    turnState: TurnState.NEUTRAL_OPEN,
    round: 1,
    status: GameStatus.IN_PROGRESS,
    battlefields: [],
    chain: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Helper to create mock card
function createMockCard(id: string): Card {
  const unitCard: UnitCard = {
    id,
    name: 'Test Card',
    energyCost: 3,
    powerCost: [],
    description: 'Test card',
    cardType: CardType.UNIT,
    rarity: Rarity.COMMON,
    domains: [Domain.FURY],
    keywords: [],
    tags: [],
    might: 5,
    subtypes: [],
    abilities: [],
  };
  return unitCard;
}

// Helper to add card to game zones so findCardOwner can find it
function addCardToGame(game: Game, card: Card): void {
  const gameCard: GameCard = {
    instanceId: `instance_${card.id}`,
    cardId: card.id,
    controllerId: game.players[0].id,
    ownerId: game.players[0].id,
    zone: 'hand',
    ready: true,
    damage: 0,
    temporaryModifiers: [],
    counters: [],
  };
  game.players[0].zones.hand.push(gameCard);
}

describe('CardScriptRuntime - Initialization', () => {
  let runtime: CardScriptRuntime;

  beforeAll(async () => {
    await fs.mkdir(TEST_SCRIPTS_DIR, { recursive: true });
  });

  beforeEach(async () => {
    // Clean directory
    await fs.rm(TEST_SCRIPTS_DIR, { recursive: true, force: true });
    await fs.mkdir(TEST_SCRIPTS_DIR, { recursive: true });

    runtime = new CardScriptRuntime({
      scriptsDir: TEST_SCRIPTS_DIR,
      hotReload: false,
      debug: false,
    }, new MockAPIFactory());
  });

  afterEach(async () => {
    await runtime.shutdown();
  });

  afterAll(async () => {
    await fs.rm(TEST_SCRIPTS_DIR, { recursive: true, force: true });
  });

  test('should create runtime successfully', () => {
    expect(runtime).toBeDefined();
  });

  test('should have access to loader', () => {
    const loader = runtime.getLoader();
    expect(loader).toBeInstanceOf(CardScriptLoader);
  });

  test('should initialize successfully', async () => {
    await expect(runtime.initialize()).resolves.not.toThrow();
  });

  test('should get sandbox pool stats', () => {
    const stats = runtime.getSandboxPoolStats();
    expect(stats).toBeDefined();
    expect(stats.size).toBeGreaterThan(0);
  });

  test('should shutdown cleanly', async () => {
    await runtime.initialize();
    await expect(runtime.shutdown()).resolves.not.toThrow();
  });

  test('should handle multiple shutdowns', async () => {
    await runtime.initialize();
    await runtime.shutdown();
    await runtime.shutdown(); // Should not throw
    expect(true).toBe(true);
  });
});

describe('CardScriptRuntime - Hook Execution', () => {
  let runtime: CardScriptRuntime;

  beforeAll(async () => {
    await fs.mkdir(TEST_SCRIPTS_DIR, { recursive: true });
  });

  beforeEach(async () => {
    // Clean directory
    await fs.rm(TEST_SCRIPTS_DIR, { recursive: true, force: true });
    await fs.mkdir(TEST_SCRIPTS_DIR, { recursive: true });

    // Create test card script
    const testCardScript = `
      export const cardScript = {
        id: 'TEST_HOOK_CARD',
        name: 'Test Hook Card',
        type: 'unit',
        cost: 3,
        rarity: 'common',
        onPlay: (context) => {
          context.log.info('onPlay executed');
        },
        onDeath: (context) => {
          context.log.info('onDeath executed');
        },
        onTurnStart: (context) => {
          context.log.info('onTurnStart executed');
        }
      };
    `;

    await fs.writeFile(
      path.join(TEST_SCRIPTS_DIR, 'TEST_HOOK_CARD.ts'),
      testCardScript
    );

    runtime = new CardScriptRuntime({
      scriptsDir: TEST_SCRIPTS_DIR,
      hotReload: false,
      debug: false,
    }, new MockAPIFactory());

    await runtime.initialize();
  });

  afterEach(async () => {
    await runtime.shutdown();
  });

  afterAll(async () => {
    await fs.rm(TEST_SCRIPTS_DIR, { recursive: true, force: true });
  });

  test('should execute onPlay hook', async () => {
    const card = createMockCard('TEST_HOOK_CARD');
    const game = createMockGame();
    addCardToGame(game, card);

    await expect(runtime.onPlay(card, game)).resolves.not.toThrow();
  });

  test('should execute onDeath hook', async () => {
    const card = createMockCard('TEST_HOOK_CARD');
    const game = createMockGame();
    addCardToGame(game, card);

    await expect(runtime.onDeath(card, game)).resolves.not.toThrow();
  });

  test('should execute onTurnStart hook', async () => {
    const card = createMockCard('TEST_HOOK_CARD');
    const game = createMockGame();
    addCardToGame(game, card);

    await expect(runtime.onTurnStart(card, game)).resolves.not.toThrow();
  });

  test('should handle missing hook gracefully', async () => {
    const card = createMockCard('TEST_HOOK_CARD');
    const game = createMockGame();

    // onAttack is not defined in the script
    await expect(runtime.onAttack(card, game, {} as GameCard)).resolves.not.toThrow();
  });

  test('should handle non-existent card script', async () => {
    const card = createMockCard('NON_EXISTENT');
    const game = createMockGame();

    // Should not throw, just return silently
    await expect(runtime.onPlay(card, game)).resolves.not.toThrow();
  });

  test('should throw if not initialized', async () => {
    const newRuntime = new CardScriptRuntime({
      scriptsDir: TEST_SCRIPTS_DIR,
      hotReload: false,
    }, new MockAPIFactory());

    const card = createMockCard('TEST_HOOK_CARD');
    const game = createMockGame();

    await expect(newRuntime.executeHook('onPlay', card, game)).rejects.toThrow('not initialized');

    await newRuntime.shutdown();
  });
});

describe('CardScriptRuntime - Validation Hooks', () => {
  let runtime: CardScriptRuntime;

  beforeAll(async () => {
    await fs.mkdir(TEST_SCRIPTS_DIR, { recursive: true });
  });

  beforeEach(async () => {
    // Clean directory
    await fs.rm(TEST_SCRIPTS_DIR, { recursive: true, force: true });
    await fs.mkdir(TEST_SCRIPTS_DIR, { recursive: true });

    // Create card with validation hooks
    const validationScript = `
      export const cardScript = {
        id: 'VALIDATION_CARD',
        name: 'Validation Card',
        type: 'spell',
        cost: 2,
        rarity: 'common',
        canPlay: (context) => {
          return context.owner.mana >= 5;
        },
        canTarget: (context, target) => {
          return target.health < 10;
        }
      };
    `;

    await fs.writeFile(
      path.join(TEST_SCRIPTS_DIR, 'VALIDATION_CARD.ts'),
      validationScript
    );

    runtime = new CardScriptRuntime({
      scriptsDir: TEST_SCRIPTS_DIR,
      hotReload: false,
      debug: false,
    }, new MockAPIFactory());

    await runtime.initialize();
  });

  afterEach(async () => {
    await runtime.shutdown();
  });

  afterAll(async () => {
    await fs.rm(TEST_SCRIPTS_DIR, { recursive: true, force: true });
  });

  test('should execute canPlay validation', async () => {
    const card = createMockCard('VALIDATION_CARD');
    const game = createMockGame();
    addCardToGame(game, card);

    const result = await runtime.canPlay(card, game);
    expect(typeof result).toBe('boolean');
  });

  test('should execute canTarget validation', async () => {
    const card = createMockCard('VALIDATION_CARD');
    const game = createMockGame();
    addCardToGame(game, card);

    const target: GameCard = {
      instanceId: 'target1',
      cardId: 'TARGET_CARD',
      controllerId: 'player1',
      ownerId: 'player1',
      zone: 'base',
      ready: true,
      damage: 0,
      temporaryModifiers: [],
      counters: [],
    };

    const result = await runtime.canTarget(card, game, target);
    expect(typeof result).toBe('boolean');
  });

  test('should return true for missing canPlay', async () => {
    const card = createMockCard('NON_EXISTENT');
    const game = createMockGame();

    const result = await runtime.canPlay(card, game);
    expect(result).toBe(true);
  });

  test('should return true for missing canTarget', async () => {
    const card = createMockCard('NON_EXISTENT');
    const game = createMockGame();
    const target = {} as GameCard;

    const result = await runtime.canTarget(card, game, target);
    expect(result).toBe(true);
  });
});

describe('CardScriptRuntime - Error Handling', () => {
  let runtime: CardScriptRuntime;

  beforeAll(async () => {
    await fs.mkdir(TEST_SCRIPTS_DIR, { recursive: true });
  });

  beforeEach(async () => {
    // Clean directory
    await fs.rm(TEST_SCRIPTS_DIR, { recursive: true, force: true });
    await fs.mkdir(TEST_SCRIPTS_DIR, { recursive: true });

    // Create card that throws error
    const errorScript = `
      export const cardScript = {
        id: 'ERROR_CARD',
        name: 'Error Card',
        type: 'unit',
        cost: 1,
        rarity: 'common',
        onPlay: (context) => {
          throw new Error('Intentional error');
        }
      };
    `;

    await fs.writeFile(
      path.join(TEST_SCRIPTS_DIR, 'ERROR_CARD.ts'),
      errorScript
    );

    runtime = new CardScriptRuntime({
      scriptsDir: TEST_SCRIPTS_DIR,
      hotReload: false,
      debug: false,
    }, new MockAPIFactory());

    await runtime.initialize();
  });

  afterEach(async () => {
    await runtime.shutdown();
  });

  afterAll(async () => {
    await fs.rm(TEST_SCRIPTS_DIR, { recursive: true, force: true });
  });

  test('should propagate errors from hooks', async () => {
    const card = createMockCard('ERROR_CARD');
    const game = createMockGame();

    await expect(runtime.onPlay(card, game)).rejects.toThrow();
  });

  test('should return false for errors in canPlay', async () => {
    const errorScript = `
      export const cardScript = {
        id: 'ERROR_VALIDATION',
        name: 'Error Validation',
        type: 'spell',
        cost: 1,
        rarity: 'common',
        canPlay: (context) => {
          throw new Error('Validation error');
        }
      };
    `;

    await fs.writeFile(
      path.join(TEST_SCRIPTS_DIR, 'ERROR_VALIDATION.ts'),
      errorScript
    );

    await runtime.reloadAllScripts();

    const card = createMockCard('ERROR_VALIDATION');
    const game = createMockGame();

    const result = await runtime.canPlay(card, game);
    expect(result).toBe(false);
  });

  test('should return false for errors in canTarget', async () => {
    const errorScript = `
      export const cardScript = {
        id: 'ERROR_TARGET',
        name: 'Error Target',
        type: 'spell',
        cost: 1,
        rarity: 'common',
        canTarget: (context, target) => {
          throw new Error('Target validation error');
        }
      };
    `;

    await fs.writeFile(
      path.join(TEST_SCRIPTS_DIR, 'ERROR_TARGET.ts'),
      errorScript
    );

    await runtime.reloadAllScripts();

    const card = createMockCard('ERROR_TARGET');
    const game = createMockGame();
    const target = {} as GameCard;

    const result = await runtime.canTarget(card, game, target);
    expect(result).toBe(false);
  });
});

describe('CardScriptRuntime - Script Reload', () => {
  let runtime: CardScriptRuntime;

  beforeAll(async () => {
    await fs.mkdir(TEST_SCRIPTS_DIR, { recursive: true });
  });

  beforeEach(async () => {
    // Clean directory
    await fs.rm(TEST_SCRIPTS_DIR, { recursive: true, force: true });
    await fs.mkdir(TEST_SCRIPTS_DIR, { recursive: true });

    const script = `
      export const cardScript = {
        id: 'RELOAD_CARD',
        name: 'Reload Card V1',
        type: 'unit',
        cost: 1,
        rarity: 'common'
      };
    `;

    await fs.writeFile(
      path.join(TEST_SCRIPTS_DIR, 'RELOAD_CARD.ts'),
      script
    );

    runtime = new CardScriptRuntime({
      scriptsDir: TEST_SCRIPTS_DIR,
      hotReload: false,
      debug: false,
    }, new MockAPIFactory());

    await runtime.initialize();
  });

  afterEach(async () => {
    await runtime.shutdown();
  });

  afterAll(async () => {
    await fs.rm(TEST_SCRIPTS_DIR, { recursive: true, force: true });
  });

  test('should reload all scripts', async () => {
    const loader = runtime.getLoader();
    expect(loader.getAllScripts().length).toBe(1);

    // Modify script
    const updatedScript = `
      export const cardScript = {
        id: 'RELOAD_CARD',
        name: 'Reload Card V2',
        type: 'unit',
        cost: 2,
        rarity: 'rare'
      };
    `;

    await fs.writeFile(
      path.join(TEST_SCRIPTS_DIR, 'RELOAD_CARD.ts'),
      updatedScript
    );

    await runtime.reloadAllScripts();

    const script = loader.getScript('RELOAD_CARD');
    expect(script?.script.name).toBe('Reload Card V2');
    expect(script?.script.cost).toBe(2);
  });
});
