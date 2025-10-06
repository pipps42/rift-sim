/**
 * Card Script Loader
 *
 * Loads and compiles card scripts from the filesystem.
 * Implements hot-reload with chokidar for development workflow.
 * Caches compiled scripts for performance.
 *
 * Architecture:
 * - Scripts are TypeScript files in /scripts/cards/ directory
 * - Each file exports a CardScript object
 * - File watcher detects changes and reloads automatically
 * - Compilation errors are logged and tracked
 */

import fs from 'fs/promises';
import path from 'path';
import * as chokidar from 'chokidar';
import type { CardScript, LoadedScript, ScriptError } from './types/CardScriptTypes';

// ============================================================================
// Configuration
// ============================================================================

export interface LoaderConfig {
  /** Directory containing card scripts */
  scriptsDir: string;

  /** Enable hot-reload (file watching) */
  hotReload: boolean;

  /** Enable debug logging */
  debug: boolean;

  /** File pattern to watch */
  pattern: string;
}

export const DEFAULT_LOADER_CONFIG: LoaderConfig = {
  scriptsDir: path.join(process.cwd(), 'scripts', 'cards'),
  hotReload: true,
  debug: false,
  pattern: '**/*.ts',
};

// ============================================================================
// Loader Class
// ============================================================================

export class CardScriptLoader {
  private config: LoaderConfig;
  private scripts: Map<string, LoadedScript> = new Map();
  private errors: Map<string, ScriptError> = new Map();
  private watcher: chokidar.FSWatcher | undefined;
  private listeners: Set<ScriptChangeListener> = new Set();
  private isInitialized: boolean = false;

  constructor(config: Partial<LoaderConfig> = {}) {
    this.config = { ...DEFAULT_LOADER_CONFIG, ...config };
    this.log('Loader created', { config: this.config });
  }

  /**
   * Initialize loader and load all scripts.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Ensure scripts directory exists
    try {
      await fs.access(this.config.scriptsDir);
    } catch (error) {
      this.log(`Scripts directory not found, creating: ${this.config.scriptsDir}`, undefined, 'warn');
      await fs.mkdir(this.config.scriptsDir, { recursive: true });
    }

    // Load all existing scripts
    await this.loadAllScripts();

    // Setup file watcher if hot-reload is enabled
    if (this.config.hotReload) {
      this.setupWatcher();
    }

    this.isInitialized = true;
    this.log('Loader initialized', {
      scriptsLoaded: this.scripts.size,
      errorsCount: this.errors.size,
    });
  }

  /**
   * Load all scripts from the scripts directory.
   */
  private async loadAllScripts(): Promise<void> {
    try {
      const files = await this.findScriptFiles(this.config.scriptsDir);

      for (const file of files) {
        await this.loadScript(file);
      }

      this.log(`Loaded ${files.length} script files`);
    } catch (error) {
      this.log('Failed to load scripts', { error }, 'error');
    }
  }

  /**
   * Recursively find all script files in directory.
   */
  private async findScriptFiles(dir: string): Promise<string[]> {
    const files: string[] = [];

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          const subFiles = await this.findScriptFiles(fullPath);
          files.push(...subFiles);
        } else if (entry.isFile() && entry.name.endsWith('.ts')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      this.log(`Failed to read directory: ${dir}`, { error }, 'error');
    }

    return files;
  }

  /**
   * Load and compile a single script file.
   */
  async loadScript(filePath: string): Promise<LoadedScript | null> {
    try {
      // Read file
      const code = await fs.readFile(filePath, 'utf-8');

      // Get file stats
      const stats = await fs.stat(filePath);

      // Compile script (strip TypeScript types for now)
      const compiledCode = this.compileScript(code);

      // Parse script to extract metadata
      const script = this.parseScript(compiledCode, filePath);

      // Validate script
      this.validateScript(script);

      // Create loaded script
      const loadedScript: LoadedScript = {
        script,
        compiledCode,
        filePath,
        lastModified: stats.mtimeMs,
      };

      // Cache script
      this.scripts.set(script.id, loadedScript);

      // Clear any previous errors for this file
      this.errors.delete(filePath);

      this.log(`Loaded script: ${script.id}`, { filePath });

      // Notify listeners
      this.notifyListeners('loaded', script.id, loadedScript);

      return loadedScript;
    } catch (error) {
      this.handleLoadError(filePath, error as Error);
      return null;
    }
  }

  /**
   * Compile TypeScript to JavaScript (simple strip for now).
   * In production, use proper TypeScript compiler API.
   */
  private compileScript(code: string): string {
    // Remove export but keep const - we'll assign to global in the script wrapper
    // This is compatible with both parseScript (for metadata extraction) and
    // Sandbox execution (which wraps the script to expose cardScript globally)
    // In Step 0.4, we'll add proper TypeScript compilation
    return code.replace(/export\s+const\s+cardScript/, 'const cardScript');
  }

  /**
   * Parse script to extract CardScript object.
   * This is a simple regex-based parser for the demo.
   * In production, use proper AST parsing.
   */
  private parseScript(code: string, filePath: string): CardScript {
    // Check for cardScript constant (export already removed by compileScript)
    const constMatch = code.match(/const\s+cardScript\s*=\s*\{/);
    if (!constMatch) {
      throw new Error('Script must export "cardScript" constant');
    }

    // Eval the code to extract cardScript object
    // In Step 0.4, we'll use proper TypeScript AST parsing
    try {
      // Wrap in function to capture cardScript
      const wrappedCode = `
        (function() {
          ${code}
          return cardScript;
        })()
      `;

      // eslint-disable-next-line no-eval
      const cardScript = eval(wrappedCode);

      if (!cardScript) {
        throw new Error('Script must export "cardScript" object');
      }

      return cardScript;
    } catch (error) {
      throw new Error(`Failed to parse script: ${(error as Error).message}`);
    }
  }

  /**
   * Validate script structure and required fields.
   */
  private validateScript(script: CardScript): void {
    const required = ['id', 'name', 'type', 'cost', 'rarity'];

    for (const field of required) {
      if (!(field in script)) {
        throw new Error(`Script missing required field: ${field}`);
      }
    }

    // Validate id format
    if (typeof script.id !== 'string' || script.id.length === 0) {
      throw new Error('Script id must be a non-empty string');
    }

    // Validate type
    const validTypes = ['unit', 'spell', 'artifact', 'ritual'];
    if (!validTypes.includes(script.type)) {
      throw new Error(`Invalid card type: ${script.type}`);
    }

    // Validate rarity
    const validRarities = ['common', 'rare', 'epic', 'legendary'];
    if (!validRarities.includes(script.rarity)) {
      throw new Error(`Invalid rarity: ${script.rarity}`);
    }

    // Validate cost
    if (typeof script.cost !== 'number' || script.cost < 0) {
      throw new Error('Script cost must be a non-negative number');
    }
  }

  /**
   * Get a loaded script by card ID.
   */
  getScript(cardId: string): LoadedScript | undefined {
    return this.scripts.get(cardId);
  }

  /**
   * Get all loaded scripts.
   */
  getAllScripts(): LoadedScript[] {
    return Array.from(this.scripts.values());
  }

  /**
   * Get all script errors.
   */
  getErrors(): ScriptError[] {
    return Array.from(this.errors.values());
  }

  /**
   * Check if a script is loaded.
   */
  hasScript(cardId: string): boolean {
    return this.scripts.has(cardId);
  }

  /**
   * Reload a specific script.
   */
  async reloadScript(cardId: string): Promise<LoadedScript | null> {
    const existing = this.scripts.get(cardId);
    if (!existing) {
      this.log(`Cannot reload script: ${cardId} not found`, undefined, 'warn');
      return null;
    }

    return this.loadScript(existing.filePath);
  }

  /**
   * Clear all cached scripts.
   */
  clearCache(): void {
    this.scripts.clear();
    this.errors.clear();
    this.log('Cache cleared');
  }

  /**
   * Setup file watcher for hot-reload.
   */
  private setupWatcher(): void {
    const watchPath = path.join(this.config.scriptsDir, this.config.pattern);

    this.watcher = chokidar.watch(watchPath, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100,
      },
    });

    this.watcher
      .on('add', (filePath: string) => this.handleFileAdded(filePath))
      .on('change', (filePath: string) => this.handleFileChanged(filePath))
      .on('unlink', (filePath: string) => this.handleFileDeleted(filePath))
      .on('error', (error: unknown) => this.log('Watcher error', { error }, 'error'));

    this.log('File watcher initialized', { watchPath });
  }

  /**
   * Handle file added event.
   */
  private async handleFileAdded(filePath: string): Promise<void> {
    this.log(`File added: ${filePath}`, undefined, 'debug');
    await this.loadScript(filePath);
  }

  /**
   * Handle file changed event.
   */
  private async handleFileChanged(filePath: string): Promise<void> {
    this.log(`File changed: ${filePath}`, undefined, 'debug');

    // Find script by file path
    const entry = Array.from(this.scripts.entries()).find(
      ([_, script]) => script.filePath === filePath
    );

    if (entry) {
      const [cardId, oldScript] = entry;
      const newScript = await this.loadScript(filePath);

      if (newScript) {
        this.notifyListeners('changed', cardId, newScript, oldScript);
      }
    } else {
      // New file
      await this.loadScript(filePath);
    }
  }

  /**
   * Handle file deleted event.
   */
  private handleFileDeleted(filePath: string): void {
    this.log(`File deleted: ${filePath}`, undefined, 'debug');

    // Find and remove script by file path
    const entry = Array.from(this.scripts.entries()).find(
      ([_, script]) => script.filePath === filePath
    );

    if (entry) {
      const [cardId, script] = entry;
      this.scripts.delete(cardId);
      this.notifyListeners('deleted', cardId, script);
    }
  }

  /**
   * Handle script loading errors.
   */
  private handleLoadError(filePath: string, error: Error): void {
    const scriptError: ScriptError = {
      cardId: path.basename(filePath, '.ts'),
      filePath,
      error,
      timestamp: Date.now(),
    };

    this.errors.set(filePath, scriptError);
    this.log(`Failed to load script: ${filePath}`, { error: error.message }, 'error');
    this.notifyListeners('error', scriptError.cardId, scriptError);
  }

  /**
   * Add a change listener.
   */
  addListener(listener: ScriptChangeListener): void {
    this.listeners.add(listener);
  }

  /**
   * Remove a change listener.
   */
  removeListener(listener: ScriptChangeListener): void {
    this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of a change.
   */
  private notifyListeners(
    event: ScriptChangeEvent,
    cardId: string,
    data: LoadedScript | ScriptError,
    oldData?: LoadedScript
  ): void {
    for (const listener of this.listeners) {
      try {
        listener(event, cardId, data, oldData);
      } catch (error) {
        this.log('Listener error', { error }, 'error');
      }
    }
  }

  /**
   * Shutdown loader and cleanup resources.
   */
  async shutdown(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = undefined;
    }

    this.listeners.clear();
    this.clearCache();

    this.isInitialized = false;
    this.log('Loader shutdown');
  }

  /**
   * Internal logging.
   */
  private log(message: string, data?: any, level: 'info' | 'warn' | 'error' | 'debug' = 'info'): void {
    if (!this.config.debug && level === 'debug') {
      return;
    }

    const prefix = '[CardScriptLoader]';
    if (data) {
      console[level](`${prefix} ${message}`, data);
    } else {
      console[level](`${prefix} ${message}`);
    }
  }
}

// ============================================================================
// Types
// ============================================================================

export type { LoadedScript, ScriptError } from './types/CardScriptTypes';

export type ScriptChangeEvent = 'loaded' | 'changed' | 'deleted' | 'error';

export type ScriptChangeListener = (
  event: ScriptChangeEvent,
  cardId: string,
  data: LoadedScript | ScriptError,
  oldData?: LoadedScript
) => void;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a loader with default configuration.
 */
export function createLoader(config?: Partial<LoaderConfig>): CardScriptLoader {
  return new CardScriptLoader(config);
}

/**
 * Load a single script file (convenience function).
 */
export async function loadScriptFile(filePath: string): Promise<LoadedScript | null> {
  const loader = new CardScriptLoader({ hotReload: false });
  await loader.initialize();
  const script = await loader.loadScript(filePath);
  await loader.shutdown();
  return script;
}
