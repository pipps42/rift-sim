import {
  Game,
  ChainItem,
  ChainItemType,
  SpellTiming,
  TurnState,
  GamePhase,
  EventType,
  GameEvent
} from '@/types/game';
import { eventBus, GameEventFactory } from '../events';
import { EffectSystem } from './EffectSystem';
import { logger } from '@/utils/logger';

/**
 * Manages spell and ability resolution using Riftbound's Chain system (LIFO stack)
 *
 * Chain Rules:
 * - Last In, First Out (LIFO) - newest item resolves first
 * - After each resolution, perform Cleanup
 * - Triggered abilities can add to chain during resolution
 * - Timing determines when items can be added (Normal/Action/Reaction)
 */
export class ChainSystem {
  private chain: ChainItem[] = [];
  private effectSystem: EffectSystem;

  constructor() {
    this.effectSystem = new EffectSystem();
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
    this.chain.push(item);

    // Change turn state to Closed
    const wasOpen = game.turnState === TurnState.NEUTRAL_OPEN || game.turnState === TurnState.SHOWDOWN_OPEN;
    if (wasOpen) {
      game.turnState = game.turnState === TurnState.NEUTRAL_OPEN
        ? TurnState.NEUTRAL_CLOSED
        : TurnState.SHOWDOWN_CLOSED;
    }

    logger.info(`ChainSystem: Added ${item.type} (${item.id}) to chain. Chain depth: ${this.chain.length}`);

    return true;
  }

  /**
   * Resolve the chain completely
   * Resolves items one by one from top to bottom with Cleanup after each
   */
  async resolve(game: Game): Promise<void> {
    logger.info(`ChainSystem: Starting chain resolution. Chain depth: ${this.chain.length}`);

    while (!this.isEmpty()) {
      // Get the top item (last added)
      const item = this.peek();
      if (!item) break;

      // Resolve the top item
      await this.resolveChainItem(game, item);

      // Remove from chain
      this.chain.pop();

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
  peek(): ChainItem | undefined {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Check if chain is empty
   */
  isEmpty(): boolean {
    return this.chain.length === 0;
  }

  /**
   * Get current chain depth
   */
  getDepth(): number {
    return this.chain.length;
  }

  /**
   * Get the entire chain (for display purposes)
   */
  getChain(): ReadonlyArray<ChainItem> {
    return [...this.chain];
  }

  /**
   * Clear the chain (for emergency cleanup)
   */
  clear(): void {
    this.chain = [];
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

    // Execute effects
    for (const effect of item.effects) {
      await this.executeEffect(game, item, effect);
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
   * Execute a single effect
   */
  private async executeEffect(game: Game, item: ChainItem, effect: any): Promise<void> {
    // Delegate to EffectSystem
    await this.effectSystem.executeEffect(
      game,
      effect,
      item.sourceCardId || '',
      item.controllerId
    );
  }

  /**
   * Perform Cleanup after chain item resolution
   */
  private async performCleanup(game: Game): Promise<void> {
    // TODO: Implement full cleanup logic
    // Cleanup steps:
    // 1. Kill units with damage >= Might
    // 2. Remove Attacker/Defender status from units not in combat
    // 3. Activate state-based effects
    // 4. Remove hidden cards from uncontrolled battlefields
    // 5. Mark Combat as Pending where necessary
    // 6. Trigger Showdowns/Combat if needed in Neutral Open

    logger.debug('ChainSystem: Performed cleanup (placeholder)');
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
  getStats(): {
    depth: number;
    itemsByType: Record<ChainItemType, number>;
    itemsByPlayer: Record<string, number>;
  } {
    const itemsByType: Record<ChainItemType, number> = {
      [ChainItemType.SPELL]: 0,
      [ChainItemType.ACTIVATED_ABILITY]: 0,
      [ChainItemType.TRIGGERED_ABILITY]: 0
    };

    const itemsByPlayer: Record<string, number> = {};

    for (const item of this.chain) {
      // Count by type
      itemsByType[item.type]++;

      // Count by player
      itemsByPlayer[item.controllerId] = (itemsByPlayer[item.controllerId] || 0) + 1;
    }

    return {
      depth: this.chain.length,
      itemsByType,
      itemsByPlayer
    };
  }
}
