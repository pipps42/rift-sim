/**
 * TEST_STORAGE_UNIT - Unit that remembers its own state
 *
 * Demonstrates using storage for card-specific state tracking.
 *
 * Effect: "This unit gains +1/+0 for each time it has attacked"
 * (Simplified: just tracks attacks in storage)
 */

import type { CardContext } from '../../src/engine/scripting-v2/types/CardScriptTypes';

export default {
  /**
   * Track attacks.
   */
  onAttack: async (ctx: CardContext) => {
    const storage = ctx.game.storage.getCardStorage(ctx.self.instanceId);

    // Increment attack counter
    const attackCount = storage.increment('attacksThisGame');

    console.log(`[STORAGE_UNIT] Attack #${attackCount}!`);

    // In a real implementation, you'd apply a buff here
    // For demo, just log
    console.log(`[STORAGE_UNIT] This unit has attacked ${attackCount} times total`);
  },

  /**
   * Check state when entering play.
   */
  onEntersPlay: async (ctx: CardContext) => {
    const storage = ctx.game.storage.getCardStorage(ctx.self.instanceId);

    // Initialize counter if first time
    if (!storage.has('attacksThisGame')) {
      storage.set('attacksThisGame', 0);
      console.log('[STORAGE_UNIT] Initialized attack counter');
    }
  },

  /**
   * Clean up when leaving play.
   */
  onLeavesPlay: async (ctx: CardContext) => {
    const storage = ctx.game.storage.getCardStorage(ctx.self.instanceId);

    const finalAttacks = storage.get('attacksThisGame') || 0;
    console.log(`[STORAGE_UNIT] Leaving play after ${finalAttacks} attacks`);

    // Note: CardStorage will auto-cleanup when card instance is removed from game
    // But we can also manually clear if needed
    // ctx.game.storage.clearCardStorage(ctx.self.instanceId);
  }
};
