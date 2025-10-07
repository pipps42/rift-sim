/**
 * YASUO_IMPROVED - Yasuo with History Query API
 *
 * Effect: "When this unit attacks, deal damage equal to the number of
 * spells cast this turn by the controller to all enemy units"
 *
 * This version uses the new HistoryQueryAPI instead of manual filtering.
 * Compare to the old approach in CARD-SCRIPTING-SYSTEM.md.
 */

import type { CardContext } from '../../src/engine/scripting-v2/types/CardScriptTypes';

export default {
  onAttack: async (ctx: CardContext) => {
    console.log(`[YASUO] Attacking!`);

    // NEW: Use history query helper instead of manual filter
    // Before: ctx.game.history.filter(e => ...).length
    // After: Direct API call
    const spellsCast = ctx.game.historyQuery.getSpellsCastThisTurn(ctx.owner.id);

    console.log(`[YASUO] ${spellsCast} spells cast this turn by ${ctx.owner.name}`);

    if (spellsCast === 0) {
      console.log('[YASUO] No spells cast, no bonus damage');
      return;
    }

    // Find enemy units on battlefield
    const enemies = ctx.game.battlefields
      .flatMap(bf => bf.units)
      .filter(unit => unit.ownerId !== ctx.owner.id);

    if (enemies.length === 0) {
      console.log('[YASUO] No enemies to damage');
      return;
    }

    console.log(`[YASUO] Dealing ${spellsCast} damage to ${enemies.length} enemy units`);

    // Deal damage to each enemy
    for (const enemy of enemies) {
      enemy.damage += spellsCast;
      console.log(`[YASUO] Dealt ${spellsCast} damage to ${enemy.cardId}`);
    }
  }
};
