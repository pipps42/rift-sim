/**
 * Example card: Adaptive Lightning
 * Demonstrates dynamic cost reduction using CardStateScanner metadata
 *
 * Card text: "This spell's Energy cost is reduced by the highest Might among units you control.
 *             Deal damage equal to the cost reduction to target unit."
 */

import type { CardScript } from '../../engine/scripting/types/CardScriptTypes';
import { DealDamageAction } from '../../engine/actions/concrete/DealDamageAction';
import type { GameCard } from '../../types/game';

/**
 * Helper: Get all units on battlefield for a player
 */
function getBattlefieldUnits(game: any, playerId: string): GameCard[] {
  const units: GameCard[] = [];
  for (const bf of game.battlefields) {
    if (bf.sides && bf.sides[playerId]) {
      units.push(...bf.sides[playerId]);
    }
  }
  return units;
}

/**
 * Helper: Check if card is a unit
 */
function isUnitCard(card: GameCard): boolean {
  return card.cardType === 'unit' || card.cardType === 'champion';
}

export const adaptiveLightning: CardScript = {
  metadata: {
    // Cost modifier based on battlefield state
    costModifiers: [
      {
        id: 'might_reduction',
        description: 'Costs 1 less for each point of highest Might you control',
        calculate: (ctx) => {
          const myUnits = getBattlefieldUnits(ctx.game, ctx.owner.id);
          const highestMight = Math.max(
            ...myUnits.filter(isUnitCard).map(u => u.might ?? 0),
            0
          );

          return {
            energyChange: -highestMight, // Negative = reduction
          };
        },
      },
    ],

    // Constraint: Must have a target
    playConstraints: [
      {
        id: 'has_target',
        description: 'Must have an enemy unit to target',
        check: (ctx) => {
          const enemyUnits = getBattlefieldUnits(ctx.game, ctx.opponent.id);
          if (enemyUnits.length === 0) {
            return {
              satisfied: false,
              reason: 'No enemy units to target',
            };
          }
          return { satisfied: true };
        },
      },
    ],
  },

  // Main effect
  onPlay: async (ctx: import('../../engine/scripting/types/CardScriptTypes').CardContext) => {
    // Calculate damage (same as cost reduction)
    const myUnits = getBattlefieldUnits(ctx.game, ctx.owner.id);
    const highestMight = Math.max(
      ...myUnits.filter(isUnitCard).map(u => u.might ?? 0),
      0
    );

    const target = ctx.targets?.[0];
    if (!target) {
      throw new Error('No target selected');
    }

    // Deal damage via V3 action
    await ctx.actions.dealDamage(target, highestMight, 'effect');
  },
};
