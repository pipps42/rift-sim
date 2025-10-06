/**
 * Card Script Runtime
 *
 * Orchestrates the execution of card scripts by integrating:
 * - CardScriptLoader (loading scripts)
 * - CardScriptSandbox (isolated execution)
 * - API implementations (BattlefieldAPI, ChainAPI, etc.)
 *
 * Provides a high-level interface for the game engine to trigger card hooks.
 */

import { CardScriptLoader } from './CardScriptLoader';
import { CardScriptSandbox, SandboxPool } from './CardScriptSandbox';
import type {
  CardScript,
  CardContext,
  BattlefieldAPI,
  ChainAPI,
  RandomAPI,
  LogAPI,
  SafeGameState,
} from './types/CardScriptTypes';
import type { Card, Player, Game, GameCard } from '../../types/game';

// ============================================================================
// Configuration
// ============================================================================

export interface RuntimeConfig {
  /** Directory containing card scripts */
  scriptsDir: string;

  /** Enable hot-reload */
  hotReload: boolean;

  /** Sandbox pool size */
  sandboxPoolSize: number;

  /** Sandbox timeout in ms */
  sandboxTimeout: number;

  /** Sandbox memory limit in MB */
  sandboxMemoryLimit: number;

  /** Enable debug logging */
  debug: boolean;
}

export const DEFAULT_RUNTIME_CONFIG: RuntimeConfig = {
  scriptsDir: 'scripts/cards',
  hotReload: true,
  sandboxPoolSize: 10,
  sandboxTimeout: 1000,
  sandboxMemoryLimit: 128,
  debug: false,
};

// ============================================================================
// Runtime Class
// ============================================================================

export class CardScriptRuntime {
  private config: RuntimeConfig;
  private loader: CardScriptLoader;
  private sandboxPool: SandboxPool;
  private apiFactory: APIFactory;
  private isInitialized: boolean = false;

  constructor(config: Partial<RuntimeConfig> = {}, apiFactory?: APIFactory) {
    this.config = { ...DEFAULT_RUNTIME_CONFIG, ...config };

    // Create loader
    this.loader = new CardScriptLoader({
      scriptsDir: this.config.scriptsDir,
      hotReload: this.config.hotReload,
      debug: this.config.debug,
    });

    // Create sandbox pool
    this.sandboxPool = new SandboxPool(this.config.sandboxPoolSize, {
      timeout: this.config.sandboxTimeout,
      memoryLimit: this.config.sandboxMemoryLimit,
      debug: this.config.debug,
    });

    // Use provided factory or create default
    this.apiFactory = apiFactory || new DefaultAPIFactory();

    this.log('Runtime created', { config: this.config });
  }

  /**
   * Initialize runtime (load scripts, setup sandbox pool).
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    await this.loader.initialize();

    this.isInitialized = true;
    this.log('Runtime initialized', {
      scriptsLoaded: this.loader.getAllScripts().length,
    });
  }

  /**
   * Execute a card hook (e.g., onPlay, onDeath, etc.).
   */
  async executeHook(
    hookName: keyof CardScript,
    card: Card,
    game: Game,
    additionalContext?: Partial<CardContext>
  ): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Runtime not initialized');
    }

    // Get script for card
    const loadedScript = this.loader.getScript(card.id);
    if (!loadedScript) {
      this.log(`No script found for card: ${card.id}`, undefined, 'debug');
      return;
    }

    // Check if hook exists
    if (!loadedScript.script[hookName]) {
      this.log(`Hook ${hookName} not defined for card: ${card.id}`, undefined, 'debug');
      return;
    }

    // Build context
    const context = this.buildContext(card, game, additionalContext);

    // Acquire sandbox from pool
    const sandbox = await this.sandboxPool.acquire();

    try {
      // Execute script in sandbox
      await sandbox.executeScript(
        loadedScript.compiledCode,
        context,
        hookName,
        [context]
      );

      this.log(`Executed ${hookName} for card: ${card.id}`, undefined, 'debug');
    } catch (error) {
      this.log(`Error executing ${hookName} for card: ${card.id}`, { error }, 'error');
      throw error;
    } finally {
      // Release sandbox back to pool
      this.sandboxPool.release(sandbox);
    }
  }

  /**
   * Execute onPlay hook.
   */
  async onPlay(card: Card, game: Game, targets?: GameCard[]): Promise<void> {
    const contextExtension: Partial<CardContext> = {};
    if (targets) {
      contextExtension.targets = targets;
    }
    return this.executeHook('onPlay', card, game, contextExtension);
  }

  /**
   * Execute onDeath hook.
   */
  async onDeath(card: Card, game: Game): Promise<void> {
    return this.executeHook('onDeath', card, game);
  }

  /**
   * Execute onTurnStart hook.
   */
  async onTurnStart(card: Card, game: Game): Promise<void> {
    return this.executeHook('onTurnStart', card, game);
  }

  /**
   * Execute onTurnEnd hook.
   */
  async onTurnEnd(card: Card, game: Game): Promise<void> {
    return this.executeHook('onTurnEnd', card, game);
  }

  /**
   * Execute onAttack hook.
   */
  async onAttack(card: Card, game: Game, defender: GameCard): Promise<void> {
    return this.executeHook('onAttack', card, game, { targets: [defender] });
  }

  /**
   * Execute onDefend hook.
   */
  async onDefend(card: Card, game: Game, attacker: GameCard): Promise<void> {
    const contextExtension: Partial<CardContext> = {
      targets: [attacker],
    };
    return this.executeHook('onDefend', card, game, contextExtension);
  }

  /**
   * Execute onDamage hook.
   */
  async onDamage(card: Card, game: Game, amount: number, target: GameCard): Promise<void> {
    return this.executeHook('onDamage', card, game, {
      targets: [target],
      eventData: { amount },
    });
  }

  /**
   * Execute onDamaged hook.
   */
  async onDamaged(card: Card, game: Game, amount: number, source?: GameCard): Promise<void> {
    const contextExtension: Partial<CardContext> = {
      eventData: { amount },
    };

    if (source) {
      contextExtension.targets = [source];
    }

    return this.executeHook('onDamaged', card, game, contextExtension);
  }

  /**
   * Check if card can be played (custom validation).
   */
  async canPlay(card: Card, game: Game): Promise<boolean> {
    const loadedScript = this.loader.getScript(card.id);
    if (!loadedScript || !loadedScript.script.canPlay) {
      return true; // No custom validation
    }

    const context = this.buildContext(card, game);
    const sandbox = await this.sandboxPool.acquire();

    try {
      const result = await sandbox.executeScript(
        loadedScript.compiledCode,
        context,
        'canPlay',
        [context]
      );

      return result === true;
    } catch (error) {
      this.log(`Error in canPlay for card: ${card.id}`, { error }, 'error');
      return false;
    } finally {
      this.sandboxPool.release(sandbox);
    }
  }

  /**
   * Check if target is valid (custom validation).
   */
  async canTarget(card: Card, game: Game, target: GameCard): Promise<boolean> {
    const loadedScript = this.loader.getScript(card.id);
    if (!loadedScript || !loadedScript.script.canTarget) {
      return true; // No custom validation
    }

    const context = this.buildContext(card, game, { targets: [target] });
    const sandbox = await this.sandboxPool.acquire();

    try {
      const result = await sandbox.executeScript(
        loadedScript.compiledCode,
        context,
        'canTarget',
        [context, target]
      );

      return result === true;
    } catch (error) {
      this.log(`Error in canTarget for card: ${card.id}`, { error }, 'error');
      return false;
    } finally {
      this.sandboxPool.release(sandbox);
    }
  }

  /**
   * Build card context for script execution.
   */
  private buildContext(
    card: Card,
    game: Game,
    additionalContext?: Partial<CardContext>
  ): CardContext {
    // Find card owner
    const owner = this.findCardOwner(card, game);
    if (!owner) {
      throw new Error(`Cannot find owner for card: ${card.id}`);
    }

    // Create safe game state
    const safeGameState = this.createSafeGameState(game);

    // Create APIs
    const battlefield = this.apiFactory.createBattlefieldAPI(game);
    const chain = this.apiFactory.createChainAPI(game);
    const random = this.apiFactory.createRandomAPI(game);
    const log = this.apiFactory.createLogAPI(card.id);

    return {
      self: card,
      owner,
      game: safeGameState,
      battlefield,
      chain,
      random,
      log,
      ...additionalContext,
    };
  }

  /**
   * Find the owner of a card in the game.
   */
  private findCardOwner(card: Card, game: Game): Player | undefined {
    // Search in both players' zones
    for (const player of game.players) {
      // Check all zones
      const zones = Object.values(player.zones);
      for (const zone of zones) {
        if (Array.isArray(zone)) {
          const found = zone.find((c) => c.cardId === card.id);
          if (found) {
            return player;
          }
        }
      }
    }
    return undefined;
  }

  /**
   * Create safe (read-only) game state for scripts.
   */
  private createSafeGameState(game: Game): SafeGameState {
    return {
      turn: game.round,
      phase: game.phase,
      activePlayer: game.players[game.currentPlayerIndex].id,
      players: game.players.map((p) => ({
        id: p.id,
        name: p.name,
        health: 20, // TODO: Get from actual health system
        maxHealth: 20,
        mana: p.runePool.energy,
        maxMana: p.runePool.energy, // TODO: Track max mana
        deckSize: p.zones.mainDeck.length,
        handSize: p.zones.hand.length,
        graveyardSize: p.zones.trash.length,
      })),
      battlefield: game.battlefields.flatMap((bf) =>
        bf.units.map((unit) => ({
          id: unit.instanceId,
          cardId: unit.cardId,
          name: 'Unit', // TODO: Get from card definition
          type: 'unit',
          owner: unit.ownerId,
          attack: 0, // TODO: Get from card stats
          health: 0,
          maxHealth: 0,
          position: { row: 0, col: 0 }, // TODO: Implement grid positions
          status: [],
          keywords: [],
          canMove: unit.ready,
          canAttack: unit.ready && !unit.temporaryModifiers.length,
          hasAttacked: false,
        }))
      ),
    };
  }

  /**
   * Get loader (for accessing scripts).
   */
  getLoader(): CardScriptLoader {
    return this.loader;
  }

  /**
   * Get sandbox pool stats.
   */
  getSandboxPoolStats(): { size: number } {
    return { size: this.config.sandboxPoolSize };
  }

  /**
   * Reload all scripts.
   */
  async reloadAllScripts(): Promise<void> {
    this.loader.clearCache();
    await this.loader.initialize();
    this.log('All scripts reloaded');
  }

  /**
   * Shutdown runtime.
   */
  async shutdown(): Promise<void> {
    await this.loader.shutdown();
    this.sandboxPool.dispose();
    this.isInitialized = false;
    this.log('Runtime shutdown');
  }

  /**
   * Internal logging.
   */
  private log(message: string, data?: any, level: 'info' | 'warn' | 'error' | 'debug' = 'info'): void {
    if (!this.config.debug && level === 'debug') {
      return;
    }

    const prefix = '[CardScriptRuntime]';
    if (data) {
      console[level](`${prefix} ${message}`, data);
    } else {
      console[level](`${prefix} ${message}`);
    }
  }
}

// ============================================================================
// API Factory Interface
// ============================================================================

/**
 * Factory for creating API implementations.
 * Allows dependency injection for testing.
 */
export interface APIFactory {
  createBattlefieldAPI(game: Game): BattlefieldAPI;
  createChainAPI(game: Game): ChainAPI;
  createRandomAPI(game: Game): RandomAPI;
  createLogAPI(cardId: string): LogAPI;
}

/**
 * Default API factory with stub implementations.
 * These will be replaced with real implementations in Step 0.5.
 */
export class DefaultAPIFactory implements APIFactory {
  createBattlefieldAPI(game: Game): BattlefieldAPI {
    return {
      getEntity: (entityId: string) => {
        console.warn('BattlefieldAPI.getEntity stub called');
        return undefined;
      },
      getEntities: (filter?: any) => {
        console.warn('BattlefieldAPI.getEntities stub called');
        return [];
      },
      getEntitiesInArea: (area: any) => {
        console.warn('BattlefieldAPI.getEntitiesInArea stub called');
        return [];
      },
      dealDamage: (target: string | GameCard, amount: number, source?: string) => {
        console.warn('BattlefieldAPI.dealDamage stub called', { target, amount, source });
      },
      heal: (target: string | GameCard, amount: number) => {
        console.warn('BattlefieldAPI.heal stub called', { target, amount });
      },
      destroy: (target: string | GameCard) => {
        console.warn('BattlefieldAPI.destroy stub called', { target });
      },
      move: (entity: string | GameCard, position: any) => {
        console.warn('BattlefieldAPI.move stub called', { entity, position });
      },
      addStatus: (target: string | GameCard, status: string, duration?: number) => {
        console.warn('BattlefieldAPI.addStatus stub called', { target, status, duration });
      },
      removeStatus: (target: string | GameCard, status: string) => {
        console.warn('BattlefieldAPI.removeStatus stub called', { target, status });
      },
      modifyStats: (target: string | GameCard, stats: any) => {
        console.warn('BattlefieldAPI.modifyStats stub called', { target, stats });
      },
      summon: (cardId: string, position: any, owner: string) => {
        console.warn('BattlefieldAPI.summon stub called', { cardId, position, owner });
      },
      transform: (entity: string | GameCard, newCardId: string) => {
        console.warn('BattlefieldAPI.transform stub called', { entity, newCardId });
      },
    };
  }

  createChainAPI(game: Game): ChainAPI {
    return {
      addEffect: (effect: any) => {
        console.warn('ChainAPI.addEffect stub called', { effect });
      },
      counter: () => {
        console.warn('ChainAPI.counter stub called');
      },
      getChainLength: () => {
        console.warn('ChainAPI.getChainLength stub called');
        return game.chain.length;
      },
      isEmpty: () => {
        console.warn('ChainAPI.isEmpty stub called');
        return game.chain.length === 0;
      },
    };
  }

  createRandomAPI(game: Game): RandomAPI {
    // Use seeded RNG for deterministic replay
    // For now, use Math.random() as placeholder
    return {
      int: (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min)) + min;
      },
      float: () => {
        return Math.random();
      },
      pick: <T>(array: T[]): T => {
        const element = array[Math.floor(Math.random() * array.length)];
        if (element === undefined) {
          throw new Error('Cannot pick from empty array');
        }
        return element;
      },
      shuffle: <T>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = shuffled[i];
          const swap = shuffled[j];
          if (temp !== undefined && swap !== undefined) {
            shuffled[i] = swap;
            shuffled[j] = temp;
          }
        }
        return shuffled;
      },
      chance: (probability: number) => {
        return Math.random() < probability;
      },
    };
  }

  createLogAPI(cardId: string): LogAPI {
    const prefix = `[Card:${cardId}]`;
    return {
      info: (message: string, data?: any) => {
        console.info(`${prefix} ${message}`, data || '');
      },
      warn: (message: string, data?: any) => {
        console.warn(`${prefix} ${message}`, data || '');
      },
      error: (message: string, data?: any) => {
        console.error(`${prefix} ${message}`, data || '');
      },
      debug: (message: string, data?: any) => {
        console.debug(`${prefix} ${message}`, data || '');
      },
    };
  }
}

// ============================================================================
// Exports
// ============================================================================

export { CardScriptLoader, CardScriptSandbox, SandboxPool };
