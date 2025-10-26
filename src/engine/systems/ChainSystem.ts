import {
  Game,
  ChainItem,
  ChainItemType,
  SpellTiming,
  TurnState,
  GamePhase,
  EventType,
  GameEvent,
  GameCard,
  Player,
} from '@/types/game';
import { eventBus, GameEventFactory } from '../events';
import { CardScriptRuntime } from '../scripting/CardScriptRuntime';
import { logger } from '@/utils/logger';

/**
 * Manages spell and ability resolution using Riftbound's Chain system (LIFO stack)
 *
 * Chain Rules:
 * - Last In, First Out (LIFO) - newest item resolves first
 * - After each resolution, perform Cleanup
 * - Triggered abilities can add to chain during resolution
 * - Timing determines when items can be added (Normal/Action/Reaction)
 *
 * ⭐ V3 Integration:
 * - Uses CardScriptRuntime to execute spell/ability scripts (not EffectSystem)
 * - Cleanup calls game.processDeaths() (ActionExecutor Phase 7)
 * - Triggered abilities handled by TriggerRegistry
 */
export class ChainSystem {
  private cardScriptRuntime: CardScriptRuntime;

  constructor(cardScriptRuntime: CardScriptRuntime) {
    this.cardScriptRuntime = cardScriptRuntime;
  }

  /**
   * Push an item onto the chain
   */
  push(game: Game, item: ChainItem): boolean {
    // Validate timing
    if (!this.canAddToChain(game, item)) {
      logger.warn(`ChainSystem: Cannot add item ${item.id} to chain - invalid timing`);
      return false;
    }

    // Add to chain (top of stack)
    game.chain = game.chain || [];
    game.chain.push(item);

    // Change turn state to Closed
    const wasOpen = game.turnState === TurnState.NEUTRAL_OPEN || game.turnState === TurnState.SHOWDOWN_OPEN;
    if (wasOpen) {
      game.turnState = game.turnState === TurnState.NEUTRAL_OPEN
        ? TurnState.NEUTRAL_CLOSED
        : TurnState.SHOWDOWN_CLOSED;
    }

    logger.info(`ChainSystem: Added ${item.type} (${item.id}) to chain. Chain depth: ${game.chain.length}`);

    return true;
  }

  /**
   * Resolve the chain completely
   * Resolves items one by one from top to bottom with Cleanup after each
   */
  async resolve(game: Game): Promise<void> {
    game.chain = game.chain || [];
    logger.info(`ChainSystem: Starting chain resolution. Chain depth: ${game.chain.length}`);

    while (!this.isEmpty(game)) {
      // Get the top item (last added)
      const item = this.peek(game);
      if (!item) break;

      // Resolve the top item
      await this.resolveChainItem(game, item);

      // Remove from chain
      game.chain.pop();

      // Perform Cleanup after resolution
      await this.performCleanup(game);

      // Check for new triggered abilities
      await this.checkTriggeredAbilities(game);
    }

    // Return to Open state
    game.turnState = game.turnState === TurnState.NEUTRAL_CLOSED
      ? TurnState.NEUTRAL_OPEN
      : TurnState.SHOWDOWN_OPEN;

    logger.info('ChainSystem: Chain resolution complete');
  }

  /**
   * Peek at the top item without removing it
   */
  peek(game: Game): ChainItem | undefined {
    return game.chain?.[game.chain.length - 1];
  }

  /**
   * Check if chain is empty
   */
  isEmpty(game: Game): boolean {
    return !game.chain || game.chain.length === 0;
  }

  /**
   * Get current chain depth
   */
  getDepth(game: Game): number {
    return game.chain?.length || 0;
  }

  /**
   * Get the entire chain (for display purposes)
   */
  getChain(game: Game): ReadonlyArray<ChainItem> {
    return [...(game.chain || [])];
  }

  /**
   * Clear the chain (for emergency cleanup)
   */
  clear(game: Game): void {
    game.chain = [];
    logger.warn('ChainSystem: Chain forcibly cleared');
  }

  /**
   * Check if an item can be added to the chain based on timing
   */
  canAddToChain(game: Game, item: ChainItem): boolean {
    const timing = item.spellTiming || SpellTiming.NORMAL;

    // Check timing restrictions
    switch (timing) {
      case SpellTiming.NORMAL:
        // Only during Neutral Open in own turn
        if (game.turnState !== TurnState.NEUTRAL_OPEN) {
          return false;
        }
        // Must be current player
        const currentPlayer = game.players[game.currentPlayerIndex];
        if (currentPlayer?.id !== item.controllerId) {
          return false;
        }
        break;

      case SpellTiming.ACTION:
        // During Neutral Open (own turn) or any Showdown state
        if (game.turnState === TurnState.NEUTRAL_CLOSED) {
          return false; // Cannot play during closed state without Reaction
        }
        if (game.turnState === TurnState.NEUTRAL_OPEN) {
          // Must be current player
          const currentPlayer = game.players[game.currentPlayerIndex];
          if (currentPlayer?.id !== item.controllerId) {
            return false;
          }
        }
        // Showdown states are always OK for Action timing
        break;

      case SpellTiming.REACTION:
        // Can be played anytime (even during Closed State)
        // No restrictions
        break;

      default:
        logger.warn(`ChainSystem: Unknown spell timing: ${timing}`);
        return false;
    }

    return true;
  }

  /**
   * Resolve a single chain item
   *
   * ⭐ V3: Executes card script via CardScriptRuntime instead of EffectSystem
   */
  private async resolveChainItem(game: Game, item: ChainItem): Promise<void> {
    logger.info(`ChainSystem: Resolving ${item.type} (${item.id}) from ${item.controllerId}`);

    // Check if targets are still valid
    if (!this.validateTargets(game, item)) {
      logger.warn(`ChainSystem: ${item.id} targets became invalid, fizzled`);
      return;
    }

    // Mark as resolved
    item.resolved = true;

    // Get controller player
    const controller = game.players.find(p => p.id === item.controllerId);
    if (!controller) {
      logger.error(`ChainSystem: Controller ${item.controllerId} not found`);
      return;
    }

    // Get source card
    const card = item.sourceCard;
    if (!card) {
      logger.warn(`ChainSystem: No source card for chain item ${item.id}`);
      return;
    }

    // ⭐ V3: Execute card script via CardScriptRuntime
    try {
      // Load script
      const scriptId = card.scriptPath
        ? card.scriptPath.replace('cards/', '').replace('.ts', '')
        : card.cardId;

      const script = await this.cardScriptRuntime.getLoader().loadScript(scriptId);

      if (script && script.onPlay) {
        // Build context with targets
        const context = await this.buildCardContext(game, controller, card, script, item.targets);

        // Execute onPlay hook
        await this.cardScriptRuntime.executeHook('onPlay', card as any, game, context);

        logger.debug(`ChainSystem: Executed onPlay for ${card.name}`);
      }

    } catch (error) {
      logger.error(`ChainSystem: Failed to execute script for ${item.id}:`, error);
    } finally {
      // Move spell card to trash after resolution (always, even if script failed)
      if (item.type === ChainItemType.SPELL) {
        card.zone = 'trash';
        controller.zones.trash = controller.zones.trash || [];
        controller.zones.trash.push(card);
      }
    }

    // Emit resolution event based on type
    switch (item.type) {
      case ChainItemType.SPELL:
        await eventBus.emit(GameEventFactory.createSpellCastEvent(
          game.id,
          item.controllerId,
          item.sourceCardId || '',
          item.targets.map(t => t.cardId || '')
        ));
        break;

      case ChainItemType.ACTIVATED_ABILITY:
      case ChainItemType.TRIGGERED_ABILITY:
        await eventBus.emit(GameEventFactory.createAbilityActivatedEvent(
          game.id,
          item.controllerId,
          item.sourceAbilityId || '',
          item.sourceCardId || '',
          item.targets.map(t => t.cardId || '')
        ));
        break;
    }

    logger.debug(`ChainSystem: ${item.id} resolved successfully`);
  }

  /**
   * Validate that targets are still legal
   */
  private validateTargets(game: Game, item: ChainItem): boolean {
    // TODO: Implement full target validation
    // For now, assume targets are valid if they exist
    // Full implementation will check:
    // - Target still exists
    // - Target still in legal zone
    // - Target still meets requirements

    return true;
  }

  /**
   * Build card context for script execution.
   *
   * ⭐ V3: Adapted from GameManager.buildCardContext
   */
  private async buildCardContext(
    game: Game,
    player: Player,
    card: GameCard,
    script: any,
    targets?: any[]
  ): Promise<any> {
    return {
      card,
      owner: player,
      controller: player, // For now, controller = owner
      game,
      targets: targets || [],
      metadata: script.metadata || {},
      actions: {} as any, // ActionExecutor will inject this
      modifiers: {} as any, // ModifierRegistry will inject this
      triggers: {} as any, // TriggerRegistry will inject this
      log: {
        info: (msg: string) => logger.info(`[${card.name}] ${msg}`),
        debug: (msg: string) => logger.debug(`[${card.name}] ${msg}`),
        warn: (msg: string) => logger.warn(`[${card.name}] ${msg}`),
        error: (msg: string) => logger.error(`[${card.name}] ${msg}`),
      },
    };
  }

  /**
   * Perform Cleanup after chain item resolution
   *
   * ⭐ V3: Calls game.processDeaths() to handle state-based actions
   */
  private async performCleanup(game: Game): Promise<void> {
    logger.debug('ChainSystem: Performing cleanup');

    // 1. Process deaths (state-based action)
    // Units with damage >= might are killed and moved to trash
    if (game.processDeaths) {
      await game.processDeaths();
    }

    // TODO: Implement remaining cleanup steps:
    // 2. Remove Attacker/Defender status from units not in combat
    // 3. Activate state-based effects
    // 4. Remove hidden cards from uncontrolled battlefields
    // 5. Mark Combat as Pending where necessary
    // 6. Trigger Showdowns/Combat if needed in Neutral Open

    logger.debug('ChainSystem: Cleanup completed');
  }

  /**
   * Check for triggered abilities after an event
   */
  private async checkTriggeredAbilities(game: Game): Promise<void> {
    // TODO: Implement triggered ability detection
    // Triggered abilities ("When...", "At...") can add themselves to the chain
    // Multiple triggers are ordered by:
    // 1. Controller chooses order for their triggers
    // 2. Turn Order determines order between players

    logger.debug('ChainSystem: Checked for triggered abilities (placeholder)');
  }

  /**
   * Get statistics about the chain
   */
  getStats(game: Game): {
    depth: number;
    itemsByType: Record<ChainItemType, number>;
    itemsByPlayer: Record<string, number>;
  } {
    const chain = game.chain || [];
    const itemsByType: Record<ChainItemType, number> = {
      [ChainItemType.SPELL]: 0,
      [ChainItemType.ACTIVATED_ABILITY]: 0,
      [ChainItemType.TRIGGERED_ABILITY]: 0
    };

    const itemsByPlayer: Record<string, number> = {};

    for (const item of chain) {
      // Count by type
      itemsByType[item.type]++;

      // Count by player
      itemsByPlayer[item.controllerId] = (itemsByPlayer[item.controllerId] || 0) + 1;
    }

    return {
      depth: chain.length,
      itemsByType,
      itemsByPlayer
    };
  }
}
