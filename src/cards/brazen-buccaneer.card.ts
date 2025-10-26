import { CardScript, CardContext } from '../engine/scripting/types/CardScriptTypes';

/**
 * Brazen Buccaneer
 * Unit - Common - Fury
 * Cost: 6 energy (can be reduced to 4 if discarding a card)
 * Might: 5
 *
 * Effect: As you play me, you may discard a card as an additional cost. If you do, reduce my cost by 2.
 *
 * Implementation:
 * - This is a cost modification effect that happens during the play action
 * - The card's energyCost should be dynamically calculated based on whether the player chooses to discard
 * - In the V3 system, this would be handled by a CostModifier
 *
 * Note: Cost modification effects are complex and require integration with the payment system.
 * This implementation provides a basic structure, but full functionality requires:
 * 1. Player choice system (modal: "Discard a card to reduce cost by 2?")
 * 2. Cost calculation hook (before payment validation)
 * 3. Discard action execution (as part of playing the card)
 *
 * For now, we'll implement a simplified version that can be enhanced later.
 */
export const brazenBuccaneer: CardScript = {
  /**
   * This hook would ideally be called before cost payment
   * to allow the player to choose whether to discard.
   *
   * However, the current CardScript interface doesn't have a "beforePlay" or "modifyCost" hook.
   * This effect would need to be implemented at the engine level, possibly with:
   * - A new hook: `onCalculateCost(ctx) => number | null`
   * - Or a modifier that checks for the card being played and adjusts cost
   *
   * For documentation purposes, this is how it would work:
   */
  onPlay: async (ctx: CardContext) => {
    // By the time onPlay executes, the card has already been paid for and is resolving
    // The cost reduction would need to happen BEFORE this point

    // If we had access to a "wasDiscardPaid" flag in the context, we could:
    // if (ctx.playContext?.discardedCard) {
    //   // The player chose to discard, and the cost was already reduced
    //   // This is just for tracking/logging
    // }

    // For now, this card enters play without additional effects
    // The cost reduction logic would be handled by the game engine's payment system
  },

  // FUTURE IMPLEMENTATION NOTES:
  // To properly implement this card, we need to add a new hook to CardScript:
  //
  // getCostModification?: (ctx: CardContext, baseCost: number) => {
  //   // Return modified cost if player makes the choice
  //   const playerWantsToDiscard = await ctx.ui.askYesNo("Discard a card to reduce cost by 2?");
  //   if (playerWantsToDiscard && ctx.owner.zones.hand.length > 1) {
  //     const cardToDiscard = await ctx.ui.selectCard(ctx.owner.zones.hand, "Choose a card to discard");
  //     if (cardToDiscard) {
  //       await ctx.actions.discard(cardToDiscard);
  //       return baseCost - 2;
  //     }
  //   }
  //   return baseCost;
  // }
};
