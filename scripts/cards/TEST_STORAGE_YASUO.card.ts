/**
 * TEST_STORAGE_YASUO - Example Yasuo card reading from Nexus storage
 *
 * Demonstrates reading shared data from another card's storage.
 *
 * Effect: "When this unit attacks, deal damage equal to the number of
 * spells cast this turn to all enemy units"
 *
 * This is a simplified version showing the storage pattern.
 */

import type { CardContext } from '../../src/engine/scripting-v2/types/CardScriptTypes';

export default {
  onAttack: async (ctx: CardContext) => {
    console.log(`[YASUO] Attacking!`);

    // Find Nexus card for owner
    // In real game, you'd have a helper like: ctx.game.getNexus(ctx.owner)
    // For this test, we'll assume Nexus instance ID is stored somewhere accessible

    // For demo purposes, let's assume we know the Nexus instance ID
    // In production, you'd find it via game.findNexusForPlayer(ctx.owner.id)
    const nexusInstanceId = ctx.eventData?.nexusId || 'nexus-p1';

    const nexusStorage = ctx.game.storage.getCardStorage(nexusInstanceId);
    const spellsCast = nexusStorage.get('spellsCastThisTurn') || 0;

    console.log(`[YASUO] Reading from Nexus: ${spellsCast} spells cast this turn`);

    if (spellsCast === 0) {
      console.log('[YASUO] No spells cast, no damage dealt');
      return;
    }

    // Find enemy units on battlefield
    const enemyUnits = ctx.game.battlefields
      .flatMap(bf => bf.units)
      .filter(unit => unit.ownerId !== ctx.owner.id);

    console.log(`[YASUO] Dealing ${spellsCast} damage to ${enemyUnits.length} enemy units`);

    // Deal damage to each enemy
    for (const enemy of enemyUnits) {
      enemy.damage += spellsCast;
      console.log(`[YASUO] Dealt ${spellsCast} damage to ${enemy.cardId} (now ${enemy.damage} total damage)`);
    }
  }
};
