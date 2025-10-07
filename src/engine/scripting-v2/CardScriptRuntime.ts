/**
 * Card Script Runtime (V2 - Direct Execution Model)
 *
 * Orchestrates card script execution with direct access to game engine.
 * No sandboxing, no serialization - scripts run in main Node.js process.
 *
 * Key differences from V1:
 * - No SandboxPool - scripts execute directly
 * - No API bridge - context contains direct Game reference
 * - Simpler error handling (no isolate timeout errors)
 * - ~200 lines instead of 600+
 */

import { CardScriptLoader } from './CardScriptLoader';
import type {
  CardScript,
  CardContext,
  EventData,
} from './types/CardScriptTypes';
import type { Card, Game, GameCard, Player } from '../../types/game';

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface RuntimeConfig {
  /**
   * Directory containing card scripts.
   */
  scriptsDir: string;

  /**
   * Enable hot-reload.
   */
  hotReload: boolean;

  /**
   * Enable debug logging.
   */
  debug: boolean;

  /**
   * Timeout for script execution (milliseconds).
   * Note: This is a soft timeout using Promise.race(), not enforced by isolate.
   */
  timeout: number;
}

export const DEFAULT_RUNTIME_CONFIG: RuntimeConfig = {
  scriptsDir: 'scripts/cards',
  hotReload: process.env.NODE_ENV !== 'production',
  debug: false,
  timeout: 5000, // 5 seconds
};

// ============================================================================
// CARD SCRIPT RUNTIME
// ============================================================================

export class CardScriptRuntime {
  private config: RuntimeConfig;
  private loader: CardScriptLoader;
  private isInitialized = false;

  constructor(config: Partial<RuntimeConfig> = {}) {
    this.config = { ...DEFAULT_RUNTIME_CONFIG, ...config };

    // Create loader
    this.loader = new CardScriptLoader({
      scriptsDir: this.config.scriptsDir,
      hotReload: this.config.hotReload,
      debug: this.config.debug,
    });

    this.log('Runtime created', { config: this.config });
  }

  /**
   * Initialize runtime (load scripts, setup hot-reload).
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    await this.loader.initialize();

    this.isInitialized = true;
    this.log('Runtime initialized');
  }

  /**
   * Execute a card hook.
   *
   * @param hookName - Hook to execute (e.g., 'onPlay', 'onAttack')
   * @param card - Card definition
   * @param game - Game instance
   * @param additionalContext - Additional context data (targets, eventData, etc.)
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

    // Load script
    let script: CardScript;
    try {
      // Use scriptPath if available (allows multiple cards to share same script)
      // Otherwise fall back to card.id
      const scriptId = card.scriptPath ? card.scriptPath.replace('cards/', '').replace('.ts', '') : card.id;
      script = await this.loader.loadScript(scriptId);
    } catch (error: any) {
      // Script not found or failed to load - this is OK, card just has no script
      this.log(`No script for card ${card.id}: ${error.message}`, undefined, 'debug');
      return;
    }

    // Check if hook exists
    const hook = script[hookName];
    if (!hook || typeof hook !== 'function') {
      this.log(`Hook ${hookName} not defined for card ${card.id}`, undefined, 'debug');
      return;
    }

    // Build context
    const context = this.buildContext(card, game, additionalContext);

    // Execute hook directly (with timeout wrapper)
    try {
      this.log(`Executing ${hookName} for ${card.id}`, undefined, 'debug');

      // Execute hook (type assertion needed because hooks have varying signatures)
      // We trust TypeScript caught signature mismatches at compile time
      await this.executeWithTimeout(
        async () => await (hook as any)(context),
        this.config.timeout,
        `Script timeout for ${card.id}.${hookName}`
      );

      this.log(`Completed ${hookName} for ${card.id}`, undefined, 'debug');
    } catch (error: any) {
      this.log(`Error in ${hookName} for ${card.id}`, { error: error.message }, 'error');

      // Re-throw error to propagate to caller
      // In production, caller can decide whether to crash or log
      throw new Error(`Script error in ${card.id}.${hookName}: ${error.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // CONVENIENCE METHODS (commonly used hooks)
  // -------------------------------------------------------------------------

  async onPlay(card: Card, game: Game, targets?: GameCard[]): Promise<void> {
    return this.executeHook('onPlay', card, game, targets ? { targets } : undefined);
  }

  async onDeath(card: Card, game: Game): Promise<void> {
    return this.executeHook('onDeath', card, game);
  }

  async onTurnStart(card: Card, game: Game): Promise<void> {
    return this.executeHook('onTurnStart', card, game);
  }

  async onTurnEnd(card: Card, game: Game): Promise<void> {
    return this.executeHook('onTurnEnd', card, game);
  }

  async onAttack(card: Card, game: Game, targets?: GameCard[]): Promise<void> {
    return this.executeHook('onAttack', card, game, targets ? { targets } : undefined);
  }

  async onDefend(card: Card, game: Game, attacker?: GameCard): Promise<void> {
    return this.executeHook('onDefend', card, game, attacker ? { targets: [attacker] } : undefined);
  }

  async onDamage(card: Card, game: Game, amount: number, target?: GameCard): Promise<void> {
    return this.executeHook('onDamage', card, game, {
      ...(target && { targets: [target] }),
      eventData: { amount },
    });
  }

  async onDamaged(card: Card, game: Game, amount: number, source?: GameCard): Promise<void> {
    return this.executeHook('onDamaged', card, game, {
      ...(source && { targets: [source] }),
      eventData: { amount },
    });
  }

  /**
   * Check if card can be played (custom validation).
   */
  async canPlay(card: Card, game: Game): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('Runtime not initialized');
    }

    try {
      const script = await this.loader.loadScript(card.id);
      if (!script.canPlay) {
        return true; // No custom validation
      }

      const context = this.buildContext(card, game);

      const result = await this.executeWithTimeout(
        () => script.canPlay!(context),
        this.config.timeout,
        `canPlay timeout for ${card.id}`
      );

      return result === true;
    } catch (error) {
      // If script fails, default to allowing play
      this.log(`canPlay error for ${card.id}, defaulting to true`, { error }, 'warn');
      return true;
    }
  }

  /**
   * Check if target is valid (custom validation).
   */
  async canTarget(card: Card, game: Game, target: GameCard): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('Runtime not initialized');
    }

    try {
      const script = await this.loader.loadScript(card.id);
      if (!script.canTarget) {
        return true; // No custom validation
      }

      const context = this.buildContext(card, game, { targets: [target] });

      const result = await this.executeWithTimeout(
        () => script.canTarget!(context, target),
        this.config.timeout,
        `canTarget timeout for ${card.id}`
      );

      return result === true;
    } catch (error) {
      this.log(`canTarget error for ${card.id}, defaulting to true`, { error }, 'warn');
      return true;
    }
  }

  // -------------------------------------------------------------------------
  // INTERNAL METHODS
  // -------------------------------------------------------------------------

  /**
   * Build CardContext for script execution.
   */
  private buildContext(
    card: Card,
    game: Game,
    additionalContext?: Partial<CardContext>
  ): CardContext {
    // Find card owner in game
    const owner = this.findCardOwner(card, game);
    if (!owner) {
      throw new Error(`Cannot find owner for card: ${card.id}`);
    }

    // Find GameCard instance for this card (if it exists in game)
    const self = this.findGameCardInstance(card, game);
    if (!self) {
      // Card not in game yet - create temporary instance
      // This happens when validating canPlay before card enters game
      const tempSelf: GameCard = {
        instanceId: `temp-${card.id}`,
        cardId: card.id,
        controllerId: owner.id,
        ownerId: owner.id,
        zone: 'hand',
        ready: true,
        damage: 0,
        temporaryModifiers: [],
        counters: [],
      };

      return {
        self: tempSelf,
        owner,
        game, // Direct reference to game instance
        ...additionalContext,
      };
    }

    return {
      self,
      owner,
      game, // Direct reference to game instance
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
      const allCards = [
        ...player.zones.hand,
        ...player.zones.mainDeck,
        ...player.zones.runeDeck,
        ...player.zones.championZone,
        ...player.zones.trash,
        ...player.zones.banishment,
        ...player.zones.base,
        ...player.zones.runes,
      ];

      const found = allCards.find((c) => c.cardId === card.id);
      if (found) {
        return player;
      }
    }

    // If not found in zones, check battlefield units
    for (const battlefield of game.battlefields) {
      for (const unit of battlefield.units) {
        if (unit.cardId === card.id) {
          return game.players.find(p => p.id === unit.ownerId);
        }
      }
    }

    return undefined;
  }

  /**
   * Find GameCard instance for a card definition.
   */
  private findGameCardInstance(card: Card, game: Game): GameCard | undefined {
    // Search in all player zones
    for (const player of game.players) {
      const allCards = [
        ...player.zones.hand,
        ...player.zones.mainDeck,
        ...player.zones.runeDeck,
        ...player.zones.championZone,
        ...player.zones.trash,
        ...player.zones.banishment,
        ...player.zones.base,
        ...player.zones.runes,
      ];

      const found = allCards.find((c) => c.cardId === card.id);
      if (found) return found;
    }

    // Check battlefield units
    for (const battlefield of game.battlefields) {
      const found = battlefield.units.find((u) => u.cardId === card.id);
      if (found) return found;
    }

    return undefined;
  }

  /**
   * Execute function with timeout.
   */
  private async executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs: number,
    errorMessage: string
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
    });

    return Promise.race([fn(), timeoutPromise]);
  }

  // -------------------------------------------------------------------------
  // PUBLIC API
  // -------------------------------------------------------------------------

  /**
   * Get loader instance (for accessing scripts directly).
   */
  getLoader(): CardScriptLoader {
    return this.loader;
  }

  /**
   * Reload all scripts (clear cache and re-initialize).
   */
  async reloadAllScripts(): Promise<void> {
    this.loader.clearCache();
    await this.loader.initialize();
    this.log('All scripts reloaded');
  }

  /**
   * Shutdown runtime (close watcher, clear cache).
   */
  async shutdown(): Promise<void> {
    await this.loader.shutdown();
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
