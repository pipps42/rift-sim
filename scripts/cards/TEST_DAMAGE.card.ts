/**
 * TEST_DAMAGE - Test card with damage effect
 *
 * Effect: When attacks, deal 2 damage to first enemy unit
 */

import type { CardContext } from '../../src/engine/scripting-v2/types/CardScriptTypes';

export default {
  onAttack: async (ctx: CardContext) => {
    console.log(`[TEST_DAMAGE] ${ctx.self.cardId} is attacking!`);

    // Find enemy units on battlefield
    const enemyUnits = ctx.game.battlefields
      .flatMap(bf => bf.units)
      .filter(unit => unit.ownerId !== ctx.owner.id);

    if (enemyUnits.length === 0) {
      console.log('[TEST_DAMAGE] No enemy units to damage');
      return;
    }

    const target = enemyUnits[0];
    console.log(`[TEST_DAMAGE] Dealing 2 damage to ${target.cardId}`);

    // Direct mutation of game state (this is what we want to test)
    target.damage += 2;

    console.log(`[TEST_DAMAGE] Target now has ${target.damage} damage`);
  }
};
