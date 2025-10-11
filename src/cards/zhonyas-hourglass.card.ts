import { CardScript, CardContext } from '../engine/scripting/types/CardScriptTypes';

/**
 * Zhonya's Hourglass
 * Gear - Epic
 *
 * TODO: This card requires OnUnitWouldDieTrigger which is not yet implemented.
 * Temporarily stubbed until death prevention system is complete.
 */
export const zhonyasHourglass: CardScript = {
  onPlay: async (ctx: CardContext) => {
    // TODO: Implement when OnUnitWouldDieTrigger is available
    console.log("[Zhonya's Hourglass] Card not yet fully implemented - requires OnUnitWouldDieTrigger");
  },
};
