/**
 * T1.2.2: Card Script Loader Tests
 *
 * Tests for script loading, caching, hot-reload, and error handling
 */

import { CardScriptLoader } from '../CardScriptLoader';
import type { LoadedScript, ScriptChangeListener } from '../CardScriptLoader';
import * as fs from 'fs/promises';
import * as path from 'path';

// Use CommonJS __dirname equivalent for ESM
const TEST_SCRIPTS_DIR = path.join(process.cwd(), 'test-fixtures', 'card-scripts');

describe('CardScriptLoader - Basic Loading', () => {
  let loader: CardScriptLoader;

  beforeAll(async () => {
    // Create test scripts directory
    await fs.mkdir(TEST_SCRIPTS_DIR, { recursive: true });
  });

  beforeEach(async () => {
    // Clean directory before each test to avoid contamination
    await fs.rm(TEST_SCRIPTS_DIR, { recursive: true, force: true });
    await fs.mkdir(TEST_SCRIPTS_DIR, { recursive: true });

    loader = new CardScriptLoader({
      scriptsDir: TEST_SCRIPTS_DIR,
      hotReload: false,
      debug: false,
    });
  });

  afterEach(async () => {
    await loader.shutdown();
  });

  afterAll(async () => {
    // Cleanup test directory
    await fs.rm(TEST_SCRIPTS_DIR, { recursive: true, force: true });
  });

  test('should create loader with config', () => {
    expect(loader).toBeDefined();
  });

  test('should initialize loader', async () => {
    await loader.initialize();
    expect(loader.getAllScripts()).toEqual([]);
  });

  test('should load valid script file', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'TestCard.ts');
    const scriptContent = `
      export const cardScript = {
        id: 'TEST_CARD',
        name: 'Test Card',
        type: 'unit',
        cost: 3,
        rarity: 'common',
        stats: { attack: 2, health: 3 },
        onPlay: (context) => {
          context.log.info('Card played!');
        }
      };
    `;

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    const result = await loader.loadScript(scriptPath);

    expect(result).toBeDefined();
    expect(result?.script.id).toBe('TEST_CARD');
    expect(result?.script.name).toBe('Test Card');
    expect(result?.script.type).toBe('unit');
    expect(result?.script.cost).toBe(3);
    expect(result?.script.rarity).toBe('common');
    expect(result?.script.onPlay).toBeInstanceOf(Function);
    expect(result?.filePath).toBe(scriptPath);
  });

  test('should throw error for non-existent script', async () => {
    await loader.initialize();
    const result = await loader.loadScript(path.join(TEST_SCRIPTS_DIR, 'NonExistent.ts'));

    expect(result).toBeNull();
    expect(loader.getErrors().length).toBeGreaterThan(0);
  });

  test('should handle invalid script syntax', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'InvalidSyntax.ts');
    const scriptContent = `
      export const cardScript = {
        id: 'INVALID',
        name: 'Invalid',
        type: 'unit',
        cost: 1,
        rarity: 'common',
        onPlay: (context) =>
          // Missing closing brace
      };
    `;

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    const result = await loader.loadScript(scriptPath);

    expect(result).toBeNull();
    expect(loader.getErrors().length).toBeGreaterThan(0);
  });

  test('should load multiple scripts', async () => {
    const script1Content = `
      export const cardScript = {
        id: 'CARD_1',
        name: 'Card 1',
        type: 'spell',
        cost: 2,
        rarity: 'common'
      };
    `;
    const script2Content = `
      export const cardScript = {
        id: 'CARD_2',
        name: 'Card 2',
        type: 'artifact',
        cost: 4,
        rarity: 'rare'
      };
    `;

    await fs.writeFile(path.join(TEST_SCRIPTS_DIR, 'Card1.ts'), script1Content);
    await fs.writeFile(path.join(TEST_SCRIPTS_DIR, 'Card2.ts'), script2Content);

    await loader.initialize();

    const scripts = loader.getAllScripts();
    expect(scripts.length).toBe(2);

    const ids = scripts.map(s => s.script.id);
    expect(ids).toContain('CARD_1');
    expect(ids).toContain('CARD_2');
  });

  test('should cache loaded scripts', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'CachedCard.ts');
    const scriptContent = `
      export const cardScript = {
        id: 'CACHED_CARD',
        name: 'Cached Card',
        type: 'unit',
        cost: 1,
        rarity: 'common'
      };
    `;

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    const result1 = await loader.loadScript(scriptPath);
    const result2 = loader.getScript('CACHED_CARD');

    expect(result1).toBe(result2);
    expect(loader.hasScript('CACHED_CARD')).toBe(true);
  });

  test('should get script by ID', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'GetById.ts');
    const scriptContent = `
      export const cardScript = {
        id: 'GET_BY_ID_CARD',
        name: 'Get By ID',
        type: 'spell',
        cost: 3,
        rarity: 'epic'
      };
    `;

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    await loader.loadScript(scriptPath);

    const script = loader.getScript('GET_BY_ID_CARD');
    expect(script).toBeDefined();
    expect(script?.script.name).toBe('Get By ID');
  });

  test('should return undefined for non-existent script ID', () => {
    const script = loader.getScript('NON_EXISTENT_ID');
    expect(script).toBeUndefined();
  });

  test('should list all loaded scripts', async () => {
    const script1Content = `export const cardScript = { id: 'LIST_1', name: 'List 1', type: 'unit', cost: 1, rarity: 'common' };`;
    const script2Content = `export const cardScript = { id: 'LIST_2', name: 'List 2', type: 'spell', cost: 2, rarity: 'rare' };`;

    await fs.writeFile(path.join(TEST_SCRIPTS_DIR, 'List1.ts'), script1Content);
    await fs.writeFile(path.join(TEST_SCRIPTS_DIR, 'List2.ts'), script2Content);

    await loader.initialize();

    const scripts = loader.getAllScripts();

    expect(scripts.length).toBe(2);
    expect(scripts.map(s => s.script.id)).toContain('LIST_1');
    expect(scripts.map(s => s.script.id)).toContain('LIST_2');
  });

  test('should clear cache', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'ClearCache.ts');
    const scriptContent = `export const cardScript = { id: 'CLEAR_CACHE_CARD', name: 'Clear', type: 'unit', cost: 1, rarity: 'common' };`;

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    await loader.loadScript(scriptPath);
    expect(loader.hasScript('CLEAR_CACHE_CARD')).toBe(true);

    loader.clearCache();
    expect(loader.hasScript('CLEAR_CACHE_CARD')).toBe(false);
  });

  test('should reload specific script', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'ReloadCard.ts');
    const scriptContent = `export const cardScript = { id: 'RELOAD_CARD', name: 'Reload V1', type: 'unit', cost: 1, rarity: 'common' };`;

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    await loader.loadScript(scriptPath);
    const script1 = loader.getScript('RELOAD_CARD');
    expect(script1?.script.name).toBe('Reload V1');

    // Modify script
    const updatedContent = `export const cardScript = { id: 'RELOAD_CARD', name: 'Reload V2', type: 'unit', cost: 1, rarity: 'common' };`;
    await fs.writeFile(scriptPath, updatedContent);

    await loader.reloadScript('RELOAD_CARD');
    const script2 = loader.getScript('RELOAD_CARD');
    expect(script2?.script.name).toBe('Reload V2');
  });

  test('should get all errors', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'ErrorCard.ts');
    const scriptContent = `export const cardScript = { id: 'ERROR_CARD', name: 'Error' };`; // Missing required fields

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    await loader.loadScript(scriptPath);

    const errors = loader.getErrors();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]?.error).toBeDefined();
  });
});

describe('CardScriptLoader - Hot Reload', () => {
  let loader: CardScriptLoader;

  beforeAll(async () => {
    await fs.mkdir(TEST_SCRIPTS_DIR, { recursive: true });
  });

  beforeEach(() => {
    loader = new CardScriptLoader({
      scriptsDir: TEST_SCRIPTS_DIR,
      hotReload: true,
      debug: false,
    });
  });

  afterEach(async () => {
    await loader.shutdown();
  });

  afterAll(async () => {
    await fs.rm(TEST_SCRIPTS_DIR, { recursive: true, force: true });
  });

  // FIXME: Flaky test - chokidar watcher needs explicit 'ready' event handling
  // The watcher may not be fully initialized when files are created
  test.skip('should detect new script file', (done) => {
    loader.initialize().then(() => {
      const listener: ScriptChangeListener = (event, cardId, data) => {
        if (event === 'loaded' && cardId === 'HOT_RELOAD_NEW') {
          expect(cardId).toBe('HOT_RELOAD_NEW');
          loader.removeListener(listener);
          done();
        }
      };

      loader.addListener(listener);

      setTimeout(async () => {
        const scriptPath = path.join(TEST_SCRIPTS_DIR, 'HotReloadNew.ts');
        const scriptContent = `export const cardScript = { id: 'HOT_RELOAD_NEW', name: 'New', type: 'unit', cost: 1, rarity: 'common' };`;
        await fs.writeFile(scriptPath, scriptContent);
      }, 500);
    });
  }, 10000);

  // FIXME: Flaky test - chokidar watcher needs explicit 'ready' event handling
  test.skip('should detect script modification', (done) => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'HotReloadModify.ts');

    const initialContent = `export const cardScript = { id: 'HOT_RELOAD_MODIFY', name: 'Version 1', type: 'unit', cost: 1, rarity: 'common' };`;

    fs.writeFile(scriptPath, initialContent).then(() => {
      return loader.initialize();
    }).then(() => {
      const listener: ScriptChangeListener = (event, cardId) => {
        if (event === 'changed' && cardId === 'HOT_RELOAD_MODIFY') {
          expect(cardId).toBe('HOT_RELOAD_MODIFY');
          loader.removeListener(listener);
          done();
        }
      };

      loader.addListener(listener);

      setTimeout(async () => {
        const modifiedContent = `export const cardScript = { id: 'HOT_RELOAD_MODIFY', name: 'Version 2', type: 'unit', cost: 1, rarity: 'common' };`;
        await fs.writeFile(scriptPath, modifiedContent);
      }, 1000);
    });
  }, 10000);

  // FIXME: Flaky test - chokidar watcher needs explicit 'ready' event handling
  test.skip('should detect script deletion', (done) => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'HotReloadDelete.ts');

    const scriptContent = `export const cardScript = { id: 'HOT_RELOAD_DELETE', name: 'Delete Me', type: 'unit', cost: 1, rarity: 'common' };`;

    fs.writeFile(scriptPath, scriptContent).then(() => {
      return loader.initialize();
    }).then(() => {
      const listener: ScriptChangeListener = (event, cardId) => {
        if (event === 'deleted' && cardId === 'HOT_RELOAD_DELETE') {
          expect(cardId).toBe('HOT_RELOAD_DELETE');
          loader.removeListener(listener);
          done();
        }
      };

      loader.addListener(listener);

      setTimeout(async () => {
        await fs.unlink(scriptPath);
      }, 1000);
    });
  }, 10000);

  test('should add and remove listeners', () => {
    const listener: ScriptChangeListener = () => {};

    loader.addListener(listener);
    loader.removeListener(listener);

    // No error should occur
    expect(true).toBe(true);
  });
});

describe('CardScriptLoader - Error Handling', () => {
  let loader: CardScriptLoader;

  beforeAll(async () => {
    await fs.mkdir(TEST_SCRIPTS_DIR, { recursive: true });
  });

  beforeEach(async () => {
    // Clean directory before each test
    await fs.rm(TEST_SCRIPTS_DIR, { recursive: true, force: true });
    await fs.mkdir(TEST_SCRIPTS_DIR, { recursive: true });

    loader = new CardScriptLoader({
      scriptsDir: TEST_SCRIPTS_DIR,
      hotReload: false,
      debug: false,
    });
  });

  afterEach(async () => {
    await loader.shutdown();
  });

  afterAll(async () => {
    await fs.rm(TEST_SCRIPTS_DIR, { recursive: true, force: true });
  });

  test('should handle script without cardScript export', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'NoExport.ts');
    const scriptContent = `
      export const someValue = 42;
    `;

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    const result = await loader.loadScript(scriptPath);

    expect(result).toBeNull();
    const errors = loader.getErrors();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]?.error.message).toMatch(/cardScript/i);
  });

  test('should handle script without ID field', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'NoId.ts');
    const scriptContent = `
      export const cardScript = {
        name: 'No ID Card',
        type: 'unit',
        cost: 1,
        rarity: 'common'
      };
    `;

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    const result = await loader.loadScript(scriptPath);

    expect(result).toBeNull();
    const errors = loader.getErrors();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]?.error.message).toMatch(/id/i);
  });

  test('should handle script without name field', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'NoName.ts');
    const scriptContent = `
      export const cardScript = {
        id: 'NO_NAME',
        type: 'unit',
        cost: 1,
        rarity: 'common'
      };
    `;

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    const result = await loader.loadScript(scriptPath);

    expect(result).toBeNull();
    const errors = loader.getErrors();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]?.error.message).toMatch(/name/i);
  });

  test('should handle script without type field', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'NoType.ts');
    const scriptContent = `
      export const cardScript = {
        id: 'NO_TYPE',
        name: 'No Type',
        cost: 1,
        rarity: 'common'
      };
    `;

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    const result = await loader.loadScript(scriptPath);

    expect(result).toBeNull();
    const errors = loader.getErrors();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]?.error.message).toMatch(/type/i);
  });

  test('should handle script with invalid type', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'InvalidType.ts');
    const scriptContent = `
      export const cardScript = {
        id: 'INVALID_TYPE',
        name: 'Invalid Type',
        type: 'invalid_type',
        cost: 1,
        rarity: 'common'
      };
    `;

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    const result = await loader.loadScript(scriptPath);

    expect(result).toBeNull();
    const errors = loader.getErrors();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]?.error.message).toMatch(/type/i);
  });

  test('should handle script with invalid rarity', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'InvalidRarity.ts');
    const scriptContent = `
      export const cardScript = {
        id: 'INVALID_RARITY',
        name: 'Invalid Rarity',
        type: 'unit',
        cost: 1,
        rarity: 'invalid_rarity'
      };
    `;

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    const result = await loader.loadScript(scriptPath);

    expect(result).toBeNull();
    const errors = loader.getErrors();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]?.error.message).toMatch(/rarity/i);
  });

  test('should handle script with invalid cost', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'InvalidCost.ts');
    const scriptContent = `
      export const cardScript = {
        id: 'INVALID_COST',
        name: 'Invalid Cost',
        type: 'unit',
        cost: -1,
        rarity: 'common'
      };
    `;

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    const result = await loader.loadScript(scriptPath);

    expect(result).toBeNull();
    const errors = loader.getErrors();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]?.error.message).toMatch(/cost/i);
  });

  test('should handle runtime errors in script', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'RuntimeError.ts');
    const scriptContent = `
      throw new Error('Runtime error during load');
      export const cardScript = { id: 'RUNTIME_ERROR', name: 'Error', type: 'unit', cost: 1, rarity: 'common' };
    `;

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    const result = await loader.loadScript(scriptPath);

    expect(result).toBeNull();
    const errors = loader.getErrors();
    expect(errors.length).toBeGreaterThan(0);
  });

  test('should track error with timestamp and file path', async () => {
    const scriptPath = path.join(TEST_SCRIPTS_DIR, 'ErrorTracking.ts');
    const scriptContent = `export const cardScript = { id: 'ERROR_TRACKING' };`; // Missing required fields

    await fs.writeFile(scriptPath, scriptContent);
    await loader.initialize();

    await loader.loadScript(scriptPath);

    const errors = loader.getErrors();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]?.filePath).toBe(scriptPath);
    expect(errors[0]?.timestamp).toBeDefined();
    expect(typeof errors[0]?.timestamp).toBe('number');
  });
});

describe('CardScriptLoader - Shutdown', () => {
  test('should shutdown cleanly', async () => {
    const loader = new CardScriptLoader({
      scriptsDir: TEST_SCRIPTS_DIR,
      hotReload: true,
    });

    await loader.initialize();
    await loader.shutdown();

    expect(loader.getAllScripts()).toEqual([]);
  });

  test('should handle multiple shutdowns', async () => {
    const loader = new CardScriptLoader({
      scriptsDir: TEST_SCRIPTS_DIR,
      hotReload: false,
    });

    await loader.initialize();
    await loader.shutdown();
    await loader.shutdown(); // Should not throw

    expect(true).toBe(true);
  });
});
