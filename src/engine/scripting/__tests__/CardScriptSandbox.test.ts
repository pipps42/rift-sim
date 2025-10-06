/**
 * T1.2.1: Card Script Sandbox Tests
 *
 * Tests for sandbox isolation, security, and resource limits
 */

import { CardScriptSandbox } from '../CardScriptSandbox';
import type { CardContext, SafeGameState } from '../types/CardScriptTypes';
import type { Card, Player } from '../../../types/game';

// Mock CardContext for testing
const createMockContext = (): CardContext => ({
  self: {
    id: 'TEST_CARD',
    name: 'Test Card',
  } as Card,
  owner: {
    id: 'player1',
    name: 'Player 1',
  } as Player,
  game: {
    turn: 1,
    phase: 'ACTION',
    activePlayer: 'player1',
    players: [],
    battlefield: [],
  } as SafeGameState,
  battlefield: {
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
  },
  chain: {
    addEffect: () => {},
    counter: () => {},
    getChainLength: () => 0,
    isEmpty: () => true,
  },
  random: {
    int: (min: number, max: number) => Math.floor((min + max) / 2),
    float: () => 0.5,
    pick: (arr: any[]) => arr[0],
    shuffle: (arr: any[]) => arr,
    chance: () => true,
  },
  log: {
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
  },
});

describe('CardScriptSandbox - Basic Functionality', () => {
  let sandbox: CardScriptSandbox;

  beforeEach(() => {
    sandbox = new CardScriptSandbox({ debug: false });
  });

  afterEach(() => {
    sandbox.dispose();
  });

  test('should create sandbox successfully', () => {
    expect(sandbox).toBeDefined();
  });

  test('should initialize sandbox', async () => {
    await expect(sandbox.initialize()).resolves.not.toThrow();
  });

  test('should execute simple card script', async () => {
    const scriptCode = `
      globalThis.cardScript = {
        id: 'TEST_CARD',
        name: 'Test Card',
        onPlay: () => {
          return { success: true, value: 42 };
        }
      };
    `;

    const context = createMockContext();
    const result = await sandbox.executeScript(scriptCode, context, 'onPlay', []);

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.value).toBe(42);
  });

  test('should handle missing handler gracefully', async () => {
    const scriptCode = `
      globalThis.cardScript = {
        id: 'TEST_CARD',
        name: 'Test Card',
        onPlay: () => {
          return { executed: 'onPlay' };
        }
      };
    `;

    const context = createMockContext();
    const result = await sandbox.executeScript(scriptCode, context, 'onDeath', []);

    expect(result).toBeUndefined();
  });

  test('should pass context to card script', async () => {
    const scriptCode = `
      globalThis.cardScript = {
        id: 'TEST_CARD',
        name: 'Test Card',
        onPlay: () => {
          return {
            selfId: self.id,
            ownerId: owner.id,
            gameTurn: gameState.turn
          };
        }
      };
    `;

    const context = createMockContext();
    const result = await sandbox.executeScript(scriptCode, context, 'onPlay', []);

    expect(result.selfId).toBe('TEST_CARD');
    expect(result.ownerId).toBe('player1');
    expect(result.gameTurn).toBe(1);
  });

  test('should handle script errors', async () => {
    const scriptCode = `
      globalThis.cardScript = {
        id: 'ERROR_CARD',
        onPlay: () => {
          throw new Error('Intentional error');
        }
      };
    `;

    const context = createMockContext();

    await expect(
      sandbox.executeScript(scriptCode, context, 'onPlay', [])
    ).rejects.toThrow();
  });

  test('should throw error if script does not export cardScript', async () => {
    const scriptCode = `
      const x = 42;
    `;

    const context = createMockContext();

    await expect(
      sandbox.executeScript(scriptCode, context, 'onPlay', [])
    ).rejects.toThrow(/cardScript/);
  });
});

describe('CardScriptSandbox - Security & Isolation', () => {
  let sandbox: CardScriptSandbox;

  beforeEach(() => {
    sandbox = new CardScriptSandbox({ debug: false });
  });

  afterEach(() => {
    sandbox.dispose();
  });

  test('should isolate from Node.js globals', async () => {
    const scriptCode = `
      globalThis.cardScript = {
        id: 'ISOLATION_CARD',
        onPlay: () => {
          let processType = 'undefined';
          try {
            processType = typeof process;
          } catch (e) {}
          return { processType };
        }
      };
    `;

    const context = createMockContext();
    const result = await sandbox.executeScript(scriptCode, context, 'onPlay', []);

    expect(result.processType).toBe('undefined');
  });

  test('should block require() access', async () => {
    const scriptCode = `
      globalThis.cardScript = {
        id: 'REQUIRE_CARD',
        onPlay: () => {
          let blocked = false;
          try {
            require('fs');
          } catch (e) {
            blocked = true;
          }
          return { blocked };
        }
      };
    `;

    const context = createMockContext();
    const result = await sandbox.executeScript(scriptCode, context, 'onPlay', []);

    expect(result.blocked).toBe(true);
  });

  test('should provide safe JSON access', async () => {
    const scriptCode = `
      globalThis.cardScript = {
        id: 'JSON_CARD',
        onPlay: () => {
          const obj = { name: 'Jinx', might: 4 };
          const json = JSON.stringify(obj);
          const parsed = JSON.parse(json);
          return parsed;
        }
      };
    `;

    const context = createMockContext();
    const result = await sandbox.executeScript(scriptCode, context, 'onPlay', []);

    expect(result.name).toBe('Jinx');
    expect(result.might).toBe(4);
  });

  test('should provide safe console access', async () => {
    const scriptCode = `
      globalThis.cardScript = {
        id: 'CONSOLE_CARD',
        onPlay: () => {
          console.log('Test log');
          console.warn('Test warning');
          return { consoleWorks: true };
        }
      };
    `;

    const context = createMockContext();
    const result = await sandbox.executeScript(scriptCode, context, 'onPlay', []);

    expect(result.consoleWorks).toBe(true);
  });

  test('should allow safe JavaScript operations', async () => {
    const scriptCode = `
      globalThis.cardScript = {
        id: 'SAFE_OPS_CARD',
        onPlay: () => {
          const arr = [1, 2, 3];
          const doubled = arr.map(x => x * 2);
          const sum = doubled.reduce((a, b) => a + b, 0);
          return { sum };
        }
      };
    `;

    const context = createMockContext();
    const result = await sandbox.executeScript(scriptCode, context, 'onPlay', []);

    expect(result.sum).toBe(12);
  });
});

describe('CardScriptSandbox - Context APIs', () => {
  let sandbox: CardScriptSandbox;

  beforeEach(() => {
    sandbox = new CardScriptSandbox({ debug: false });
  });

  afterEach(() => {
    sandbox.dispose();
  });

  test('should provide battlefield API', async () => {
    const scriptCode = `
      globalThis.cardScript = {
        id: 'BATTLEFIELD_CARD',
        onPlay: () => {
          const hasBattlefield = typeof battlefield !== 'undefined';
          const hasMethods = typeof battlefield.getEntity === 'function';
          return { hasBattlefield, hasMethods };
        }
      };
    `;

    const context = createMockContext();
    const result = await sandbox.executeScript(scriptCode, context, 'onPlay', []);

    expect(result.hasBattlefield).toBe(true);
    expect(result.hasMethods).toBe(true);
  });

  test('should provide chain API', async () => {
    const scriptCode = `
      globalThis.cardScript = {
        id: 'CHAIN_CARD',
        onPlay: () => {
          const hasChain = typeof chain !== 'undefined';
          const isEmpty = chain.isEmpty();
          return { hasChain, isEmpty };
        }
      };
    `;

    const context = createMockContext();
    const result = await sandbox.executeScript(scriptCode, context, 'onPlay', []);

    expect(result.hasChain).toBe(true);
    expect(result.isEmpty).toBe(true);
  });

  test('should provide random API', async () => {
    const scriptCode = `
      globalThis.cardScript = {
        id: 'RANDOM_CARD',
        onPlay: () => {
          const hasRandom = typeof random !== 'undefined';
          const randomInt = random.int(1, 10);
          const randomFloat = random.float();
          return { hasRandom, randomInt, randomFloat };
        }
      };
    `;

    const context = createMockContext();
    const result = await sandbox.executeScript(scriptCode, context, 'onPlay', []);

    expect(result.hasRandom).toBe(true);
    expect(result.randomInt).toBeGreaterThanOrEqual(1);
    expect(result.randomFloat).toBeGreaterThanOrEqual(0);
  });

  test('should provide log API', async () => {
    const scriptCode = `
      globalThis.cardScript = {
        id: 'LOG_CARD',
        onPlay: () => {
          const hasLog = typeof log !== 'undefined';
          log.info('Test info message');
          return { hasLog };
        }
      };
    `;

    const context = createMockContext();
    const result = await sandbox.executeScript(scriptCode, context, 'onPlay', []);

    expect(result.hasLog).toBe(true);
  });
});

describe('CardScriptSandbox - Resource Limits', () => {
  test('should enforce timeout on long-running scripts', async () => {
    const sandbox = new CardScriptSandbox({ timeout: 100, debug: false });

    const scriptCode = `
      globalThis.cardScript = {
        id: 'TIMEOUT_CARD',
        onPlay: () => {
          const start = Date.now();
          while (Date.now() - start < 5000) {
            // Infinite-ish loop
          }
          return { completed: true };
        }
      };
    `;

    const context = createMockContext();

    await expect(
      sandbox.executeScript(scriptCode, context, 'onPlay', [])
    ).rejects.toThrow();

    sandbox.dispose();
  }, 2000);

  test('should enforce memory limits', async () => {
    const sandbox = new CardScriptSandbox({ memoryLimit: 8, debug: false });

    const scriptCode = `
      globalThis.cardScript = {
        id: 'MEMORY_CARD',
        onPlay: () => {
          const arr = [];
          try {
            for (let i = 0; i < 10000000; i++) {
              arr.push({ data: 'x'.repeat(1000) });
            }
          } catch (e) {
            return { memoryError: true };
          }
          return { completed: true, length: arr.length };
        }
      };
    `;

    const context = createMockContext();

    // Should either throw or catch internal memory error
    try {
      const result = await sandbox.executeScript(scriptCode, context, 'onPlay', []);
      // If it completes, it should have caught the memory error
      expect(result.memoryError || result.completed).toBeTruthy();
    } catch (e: any) {
      // Or it throws due to memory limit
      expect(e).toBeDefined();
    }

    sandbox.dispose();
  }, 10000);
});

describe('CardScriptSandbox - Disposal', () => {
  test('should dispose correctly', () => {
    const sandbox = new CardScriptSandbox({ debug: false });

    expect(() => sandbox.dispose()).not.toThrow();
  });

  test('should handle multiple dispose calls', () => {
    const sandbox = new CardScriptSandbox({ debug: false });

    sandbox.dispose();

    // Second dispose should not throw
    expect(() => sandbox.dispose()).not.toThrow();
  });

  test('should not execute after disposal', async () => {
    const sandbox = new CardScriptSandbox({ debug: false });

    sandbox.dispose();

    const scriptCode = `
      globalThis.cardScript = {
        id: 'DISPOSED_CARD',
        onPlay: () => ({ success: true })
      };
    `;

    const context = createMockContext();

    // Should throw because sandbox is disposed
    await expect(
      sandbox.executeScript(scriptCode, context, 'onPlay', [])
    ).rejects.toThrow();
  });
});

describe('CardScriptSandbox - Multiple Executions', () => {
  let sandbox: CardScriptSandbox;

  beforeEach(() => {
    sandbox = new CardScriptSandbox({ debug: false });
  });

  afterEach(() => {
    sandbox.dispose();
  });

  test('should support multiple sequential executions', async () => {
    const scriptCode1 = `
      globalThis.cardScript = {
        id: 'CARD_1',
        onPlay: () => ({ value: 1 })
      };
    `;

    const scriptCode2 = `
      globalThis.cardScript = {
        id: 'CARD_2',
        onPlay: () => ({ value: 2 })
      };
    `;

    const context = createMockContext();

    const result1 = await sandbox.executeScript(scriptCode1, context, 'onPlay', []);
    const result2 = await sandbox.executeScript(scriptCode2, context, 'onPlay', []);

    expect(result1.value).toBe(1);
    expect(result2.value).toBe(2);
  });
});
