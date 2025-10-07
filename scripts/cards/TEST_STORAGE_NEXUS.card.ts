/**
 * TEST_STORAGE_NEXUS - Example Nexus card with spell tracking
 *
 * Demonstrates LoR-style card storage pattern:
 * - Nexus tracks "spells cast this turn"
 * - Other cards (like Yasuo) can read this counter
 *
 * Effect:
 * - When any spell is cast, increment counter
 * - At turn end, reset counter
 */

import type { CardContext } from '../../src/engine/scripting-v2/types/CardScriptTypes';

export default {
  /**
   * Listen for spell casts globally.
   */
  onSpellCast: async (ctx: CardContext) => {
    const storage = ctx.game.storage.getCardStorage(ctx.self.instanceId);

    // Increment spell counter
    const newCount = storage.increment('spellsCastThisTurn');

    console.log(`[NEXUS] Spell cast! Total this turn: ${newCount}`);
  },

  /**
   * Reset counter at turn end.
   */
  onTurnEnd: async (ctx: CardContext) => {
    const storage = ctx.game.storage.getCardStorage(ctx.self.instanceId);

    const finalCount = storage.get('spellsCastThisTurn') || 0;
    console.log(`[NEXUS] Turn ended with ${finalCount} spells cast`);

    // Reset for next turn
    storage.set('spellsCastThisTurn', 0);
  }
};
