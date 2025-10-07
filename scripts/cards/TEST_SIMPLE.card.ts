/**
 * TEST_SIMPLE - Simple test card
 *
 * Effect: When played, log a message
 */

import type { CardContext } from '../../src/engine/scripting-v2/types/CardScriptTypes';

export default {
  onPlay: async (ctx: CardContext) => {
    console.log(`[TEST_SIMPLE] Card played by ${ctx.owner.name}`);
    console.log(`[TEST_SIMPLE] Game is in phase: ${ctx.game.phase}`);
    console.log(`[TEST_SIMPLE] Current turn: ${ctx.game.round}`);
  }
};
