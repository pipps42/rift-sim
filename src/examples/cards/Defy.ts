/**
 * Defy - REACTION spell that counters low-cost spells
 *
 * Card Details:
 * - Type: Spell
 * - Rarity: Common
 * - Domain: Calm
 * - Cost: 1 Energy + 1 Calm Power
 * - Keywords: REACTION
 *
 * Effect:
 * "Counter a spell that costs no more than 4 Energy and no more than 1 Power."
 *
 * Implementation Notes:
 * - REACTION keyword allows playing during Closed State (chain resolution)
 * - Uses TargetingSystem to target spells on the Chain
 * - Validates target cost constraints via targetRequirements and playConstraints
 * - Uses V3 counterSpell action for clean chain manipulation
 */

import type { CardScript, CardContext } from '@/engine/scripting/types/CardScriptTypes';
import { TargetType, TargetProperty, ComparisonOperator, CardType } from '@/types/game';
import type { ChainItem } from '@/types/game';

export const Defy: CardScript = {
  metadata: {
    targetRequirements: [
      {
        targetType: TargetType.CHAIN_ITEM,
        count: 1,
        optional: false,
        restrictions: [
          {
            property: TargetProperty.CARD_TYPE,
            operator: ComparisonOperator.EQUALS,
            value: CardType.SPELL
          },
          {
            property: TargetProperty.ENERGY_COST,
            operator: ComparisonOperator.LESS_THAN,
            value: 5  // ≤ 4 means < 5
          }
        ]
      }
    ],
    playConstraints: [
      {
        id: 'check_power_cost',
        description: 'Target spell must cost no more than 1 Power',
        check: (ctx: CardContext): { satisfied: boolean; reason?: string } => {
          // Note: Power cost validation is done here because TargetingSystem
          // doesn't yet support POWER_COST property. This can be moved to
          // targetRequirements once that property is added.
          if (!ctx.targets || ctx.targets.length === 0) {
            return { satisfied: false, reason: 'No target selected' };
          }

          const target = ctx.targets[0] as ChainItem;
          const totalPowerCost = (target.sourceCard?.powerCost || []).reduce((sum, p) => sum + p.amount, 0);

          if (totalPowerCost > 1) {
            return { satisfied: false, reason: 'Target spell costs more than 1 Power' };
          }

          return { satisfied: true };
        }
      }
    ]
  },

  onPlay: async (ctx: CardContext) => {
    const target = ctx.targets?.[0] as ChainItem;

    if (!target) {
      throw new Error('No target selected');
    }

    // Counter the spell using V3 action
    await ctx.actions.counterSpell(target.id, false); // false = spells only, not abilities
  }
}
