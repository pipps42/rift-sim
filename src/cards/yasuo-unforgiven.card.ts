import { CardScript, CardContext } from '../engine/scripting/types/CardScriptTypes';

/**
 * Yasuo, Unforgiven
 * Unit - Legendary - Calm
 *
 * TODO: This card requires location property on GameCard and moveUnit action.
 * Temporarily stubbed until movement system is complete.
 */
export const yasuoUnforgiven: CardScript = {
  onPlay: async (ctx: CardContext) => {
    // TODO: Implement when movement system is available
    console.log('[Yasuo Unforgiven] Card not yet fully implemented - requires movement system');
  },
};
