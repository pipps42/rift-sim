/**
 * Card Script Loader (V2 - Direct Execution Model)
 *
 * Loads and caches card scripts using dynamic import().
 * Supports hot-reload via file watching with chokidar.
 *
 * Key differences from V1:
 * - Uses import() instead of isolated-vm compilation
 * - No sandboxing - scripts execute in main Node.js process
 * - TypeScript execution handled by tsx/ts-node loader
 * - Hot reload via cache invalidation + import query params
 */

import { pathToFileURL } from 'url';
import { watch, type FSWatcher } from 'chokidar';
import { existsSync } from 'fs';
import { resolve, join } from 'path';
import type { CardScript, LoadedScript } from './types/CardScriptTypes';

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface LoaderConfig {
  /**
   * Directory containing card scripts.
   * Default: 'scripts/cards'
   */
  scriptsDir: string;

  /**
   * Enable hot-reload with file watching.
   * Default: true in development
   */
  hotReload: boolean;

  /**
   * Enable debug logging.
   */
  debug: boolean;

  /**
   * File extension for card scripts.
   * Default: '.card.ts'
   */
  scriptExtension: string;
}

export const DEFAULT_LOADER_CONFIG: LoaderConfig = {
  scriptsDir: 'scripts/cards',
  hotReload: process.env.NODE_ENV !== 'production',
  debug: false,
  scriptExtension: '.card.ts',
};

// ============================================================================
// CARD SCRIPT LOADER
// ============================================================================

export class CardScriptLoader {
  private config: LoaderConfig;
  private scriptCache = new Map<string, LoadedScript>();
  private watcher?: FSWatcher;
  private isInitialized = false;

  constructor(config: Partial<LoaderConfig> = {}) {
    this.config = { ...DEFAULT_LOADER_CONFIG, ...config };
    this.log('Loader created', { config: this.config });
  }

  /**
   * Initialize loader (setup file watcher if hot-reload enabled).
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Verify scripts directory exists
    const scriptsPath = resolve(this.config.scriptsDir);
    if (!existsSync(scriptsPath)) {
      this.log(`Scripts directory not found: ${scriptsPath}`, undefined, 'warn');
      this.log('Creating scripts directory...', undefined, 'info');
      // Note: We'll let the caller handle directory creation
    }

    // Setup hot-reload if enabled
    if (this.config.hotReload) {
      await this.setupHotReload();
    }

    this.isInitialized = true;
    this.log('Loader initialized');
  }

  /**
   * Load a card script by ID.
   * Uses dynamic import() to load ES module.
   *
   * @param cardId - Card ID (e.g., 'RB_001_Yasuo')
   * @returns Loaded script
   */
  async loadScript(cardId: string): Promise<CardScript> {
    // Check cache first
    const cached = this.scriptCache.get(cardId);
    if (cached) {
      this.log(`Using cached script for ${cardId}`, undefined, 'debug');
      return cached.script;
    }

    // Resolve script path
    const scriptPath = this.resolveScriptPath(cardId);

    // Check if file exists
    if (!existsSync(scriptPath)) {
      throw new Error(`Script file not found for card ${cardId}: ${scriptPath}`);
    }

    // Convert to file:// URL (required for dynamic import)
    const fileUrl = pathToFileURL(scriptPath).href;

    // Add cache buster to force reload (important for hot-reload)
    // This ensures import() treats it as a new module
    const cacheBuster = this.config.hotReload ? `?t=${Date.now()}` : '';
    const importUrl = fileUrl + cacheBuster;

    this.log(`Loading script for ${cardId} from ${scriptPath}`, undefined, 'debug');

    try {
      // Dynamic import - TypeScript compilation handled by tsx/ts-node
      const module = await import(importUrl);

      // Validate module exports
      if (!module.default) {
        throw new Error(`Script ${cardId} must export default CardScript object`);
      }

      const script: CardScript = module.default;

      // Validate script is an object
      if (typeof script !== 'object' || script === null) {
        throw new Error(`Script ${cardId} default export must be an object`);
      }

      // Create loaded script metadata
      const loadedScript: LoadedScript = {
        cardId,
        script,
        filePath: scriptPath,
        loadedAt: new Date(),
      };

      // Cache it
      this.scriptCache.set(cardId, loadedScript);

      this.log(`Loaded script for ${cardId}`, { hooks: Object.keys(script) });

      return script;
    } catch (error: any) {
      this.log(`Failed to load script for ${cardId}`, { error: error.message }, 'error');
      throw new Error(`Failed to load script for card ${cardId}: ${error.message}`);
    }
  }

  /**
   * Get loaded script from cache (does not load if not cached).
   */
  getScript(cardId: string): LoadedScript | undefined {
    return this.scriptCache.get(cardId);
  }

  /**
   * Get all loaded scripts.
   */
  getAllScripts(): LoadedScript[] {
    return Array.from(this.scriptCache.values());
  }

  /**
   * Invalidate cache for a specific card (for hot-reload).
   */
  invalidateCache(cardId: string): void {
    this.scriptCache.delete(cardId);
    this.log(`Invalidated cache for ${cardId}`);
  }

  /**
   * Clear all cached scripts.
   */
  clearCache(): void {
    const count = this.scriptCache.size;
    this.scriptCache.clear();
    this.log(`Cleared cache (${count} scripts)`);
  }

  /**
   * Resolve absolute path to script file.
   */
  private resolveScriptPath(cardId: string): string {
    const filename = `${cardId}${this.config.scriptExtension}`;
    return resolve(join(this.config.scriptsDir, filename));
  }

  /**
   * Extract card ID from file path.
   */
  private extractCardIdFromPath(filePath: string): string {
    const filename = filePath.split(/[/\\]/).pop() || '';
    return filename.replace(this.config.scriptExtension, '');
  }

  /**
   * Setup hot-reload file watcher.
   */
  private async setupHotReload(): Promise<void> {
    const watchPattern = join(this.config.scriptsDir, `**/*${this.config.scriptExtension}`);

    this.log(`Setting up hot-reload watcher for: ${watchPattern}`);

    this.watcher = watch(watchPattern, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50,
      },
    });

    // Handle file changes
    this.watcher.on('change', (path) => {
      const cardId = this.extractCardIdFromPath(path);
      this.log(`Script changed: ${cardId} at ${path}`);
      this.invalidateCache(cardId);
    });

    // Handle new files
    this.watcher.on('add', (path) => {
      const cardId = this.extractCardIdFromPath(path);
      this.log(`New script detected: ${cardId} at ${path}`, undefined, 'debug');
    });

    // Handle deleted files
    this.watcher.on('unlink', (path) => {
      const cardId = this.extractCardIdFromPath(path);
      this.log(`Script deleted: ${cardId}`, undefined, 'warn');
      this.invalidateCache(cardId);
    });

    // Handle watcher errors
    this.watcher.on('error', (error: any) => {
      this.log('Watcher error', { error: error?.message || String(error) }, 'error');
    });

    this.log('Hot-reload watcher ready');
  }

  /**
   * Shutdown loader (close file watcher).
   */
  async shutdown(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close();
      this.log('Watcher closed');
    }

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
