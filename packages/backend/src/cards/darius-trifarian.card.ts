import { CardScript, CardContext } from '../engine/scripting/types/CardScriptTypes';

/**
 * Darius, Trifarian
 * Unit - Rare - Fury
 * Cost: 5 energy + 1 fury power
 * Might: 6
 *
 * TODO: This card requires ModifyMightAction which is not yet implemented.
 * Temporarily stubbed until V3 might modification system is complete.
 */
export const dariusTrifarian: CardScript = {
  onPlay: async (ctx: CardContext) => {
    // TODO: Implement when ModifyMightAction is available
    console.log('[Darius Trifarian] Card not yet fully implemented - requires ModifyMightAction');
  },
};
