/**
 * Example card: Desperate Gambit
 * Demonstrates additional costs and constraint checking using CardStateScanner metadata
 *
 * Card text: "As an additional cost to play this, discard 1 card.
 *             Deal 5 damage to target unit."
 */

import type { CardScript, CardContext } from '../../engine/scripting/types/CardScriptTypes';
import { DealDamageAction } from '../../engine/actions/concrete/DealDamageAction';
import type { GameCard } from '../../types/game';

export const desperateGambit: CardScript = {
  metadata: {
    // Constraint: Must have a card to discard
    playConstraints: [
      {
        id: 'can_discard',
        description: 'Must have a card to discard',
        check: (ctx) => {
          const handSize = ctx.owner.zones.hand.length;
          if (handSize <= 1) {
            return {
              satisfied: false,
              reason: 'No cards to discard',
            };
          }
          return { satisfied: true };
        },
      },
      {
        id: 'has_target',
        description: 'Must have a unit to target',
        check: (ctx) => {
          // Check if there are any units on battlefield
          let hasUnits = false;
          for (const bf of ctx.game.battlefields) {
            if (bf.sides) {
              for (const side of Object.values(bf.sides)) {
                if (side && side.length > 0) {
                  hasUnits = true;
                  break;
                }
              }
            }
            if (hasUnits) break;
          }
          if (!hasUnits) {
            return {
              satisfied: false,
              reason: 'No units to target',
            };
          }
          return { satisfied: true };
        },
      },
    ],
  },

  // TODO: additionalCosts hook not yet in CardScript interface
  // Will be added when GameManager integration is complete

  // Main effect
  onPlay: async (ctx: CardContext) => {
    const target = ctx.targets?.[0];
    if (!target) {
      throw new Error('No target selected');
    }

    await ctx.actions.dealDamage(target, 5, 'effect');
  },
};
