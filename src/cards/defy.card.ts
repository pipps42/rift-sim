import { CardScript, CardContext } from '../engine/scripting/types/CardScriptTypes';
import { GameCard, ChainItem } from '../types/game';

/**
 * Defy
 * Spell - Common - Calm
 * Cost: 1 energy + 1 calm power
 *
 * REACTION (Play any time, even before spells and abilities resolve.)
 * Counter a spell that costs no more than 4 [energy] and no more than [1 power].
 *
 * Implementation:
 * - REACTION keyword means it can be played in response to other spells/abilities
 * - Targets a spell on the Chain
 * - Can only counter spells that meet cost restrictions:
 *   1. Energy cost <= 4
 *   2. Total power cost <= 1 (any domain)
 * - Uses CounterSpellAction from V3 system
 */
export const defy: CardScript = {
  onPlay: async (ctx: CardContext) => {
    const { actions, game, owner } = ctx;

    // Find valid targets on the Chain
    const validTargets: ChainItem[] = [];

    for (const item of game.chain) {
      // Only target spells (not abilities, unless canCounterAbilities is specified)
      if (item.type !== 'spell') {
        continue;
      }

      // Counter works on spells IN THE CHAIN
      // Get the source card from the chain item
      const sourceCard = item.sourceCard;

      if (!sourceCard) {
        // ChainItem should have sourceCard reference when added to chain
        // If not, skip this item
        continue;
      }

      // Check energy cost restriction: <= 4
      if (sourceCard.energyCost > 4) {
        continue;
      }

      // Check power cost restriction: total power <= 1
      // Sum up all power costs across all domains
      const totalPowerCost = sourceCard.powerCost.reduce(
        (sum: number, pc) => sum + pc.amount,
        0
      );

      if (totalPowerCost > 1) {
        // Spell costs more than 1 power, can't counter it with Defy
        continue;
      }

      // Valid target
      validTargets.push(item);
    }

    if (validTargets.length === 0) {
      // No valid targets, spell fizzles
      return;
    }

    // In a real implementation, player would choose which spell to counter
    // For now, counter the first valid target (usually the most recent spell)
    const targetItem = validTargets[0];
    if (!targetItem) {
      // Should not happen due to earlier check, but TypeScript wants null check
      return;
    }

    // Counter the spell using the V3 CounterSpellAction
    await actions.counterSpell(targetItem.id, false); // canCounterAbilities = false

    // Log the counter
    console.log(`[Defy] Countered spell: ${targetItem.id}`);
  },

  /**
   * Additional implementation notes:
   *
   * 1. REACTION timing:
   *    - This spell should be playable during the Chain resolution window
   *    - The game engine needs to provide priority to players after each Chain item is added
   *    - Players can respond with REACTION spells/abilities
   *
   * 2. Cost validation:
   *    - "no more than 4" energy is straightforward
   *    - "no more than rune" is interpreted as: can counter spells that cost only runes (not domain power)
   *    - Example valid targets: 0 cost spells, spells costing 1-4 energy + any runes
   *    - Example invalid targets: spells costing fury/calm/wild power
   *
   * 3. Chain interaction:
   *    - When a spell is countered, it's removed from the Chain
   *    - It doesn't resolve and goes to trash
   *    - Other spells/abilities on the Chain continue to resolve normally
   */
};
