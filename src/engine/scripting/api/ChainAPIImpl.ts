/**
 * Chain API Implementation
 *
 * Provides card scripts with controlled access to the effect chain.
 * Allows scripts to add effects and interact with the chain resolution system.
 */

import type { ChainAPI } from '../types/CardScriptTypes';
import { ChainItemType } from '../../../types/game';
import type { Game, Effect } from '../../../types/game';

/**
 * Implementation of ChainAPI that operates on game state.
 */
export class ChainAPIImpl implements ChainAPI {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  /**
   * Add effect to chain.
   */
  addEffect(effect: Effect): void {
    // Create a chain item for the effect
    const chainItem = {
      id: this.generateChainItemId(),
      type: ChainItemType.TRIGGERED_ABILITY,
      controllerId: this.game.players[this.game.currentPlayerIndex].id,
      targets: [],
      effects: [effect],
      timestamp: new Date(),
      resolved: false,
    };

    // Add to chain
    this.game.chain.push(chainItem);

    console.debug('[ChainAPI] Effect added to chain', { effect, chainLength: this.game.chain.length });
  }

  /**
   * Counter/cancel last effect in chain.
   */
  counter(): void {
    if (this.game.chain.length === 0) {
      console.warn('[ChainAPI] Cannot counter: chain is empty');
      return;
    }

    // Remove last item from chain
    const countered = this.game.chain.pop();

    console.debug('[ChainAPI] Effect countered', { countered });
  }

  /**
   * Get current chain length.
   */
  getChainLength(): number {
    return this.game.chain.length;
  }

  /**
   * Check if chain is empty.
   */
  isEmpty(): boolean {
    return this.game.chain.length === 0;
  }

  /**
   * Generate unique chain item ID.
   */
  private generateChainItemId(): string {
    return `chain_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
