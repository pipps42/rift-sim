import { CardScript, CardContext } from '../engine/scripting/types/CardScriptTypes';

/**
 * Vi, Destructive
 * Unit - Rare - Fury
 *
 * TODO: This card requires ModifyMightAction which is not yet implemented.
 * Temporarily stubbed until V3 might modification system is complete.
 */
export const viDestructive: CardScript = {
  onPlay: async (ctx: CardContext) => {
    // TODO: Implement when ModifyMightAction is available
    console.log('[Vi Destructive] Card not yet fully implemented - requires ModifyMightAction');
  },
};
