/**
 * TEST_HISTORY_CARD - Example card using various history queries
 *
 * Effect: "Gains different bonuses based on game history"
 * - +1/+0 for each attack this turn
 * - +0/+1 for each unit death this turn
 * - Draw a card if 3+ spells cast this turn
 */

import type { CardContext } from '../../src/engine/scripting-v2/types/CardScriptTypes';

export default {
  /**
   * Check multiple history conditions when entering play.
   */
  onEntersPlay: async (ctx: CardContext) => {
    console.log('[HISTORY_CARD] Analyzing game history...');

    // Use history query helpers instead of manual filtering
    const attacks = ctx.game.historyQuery.getAttacksThisTurn(ctx.owner.id);
    const deaths = ctx.game.historyQuery.getUnitsDeathsThisTurn();
    const spells = ctx.game.historyQuery.getSpellsCastThisTurn(ctx.owner.id);
    const cardsDrawn = ctx.game.historyQuery.getCardsDrawnThisTurn(ctx.owner.id);

    console.log(`[HISTORY_CARD] Turn ${ctx.game.round} stats:`);
    console.log(`  - Attacks: ${attacks}`);
    console.log(`  - Deaths: ${deaths}`);
    console.log(`  - Spells: ${spells}`);
    console.log(`  - Cards drawn: ${cardsDrawn}`);

    // Apply bonuses based on history
    if (attacks > 0) {
      console.log(`[HISTORY_CARD] Gains +${attacks}/+0 from attacks`);
    }

    if (deaths > 0) {
      console.log(`[HISTORY_CARD] Gains +0/+${deaths} from deaths`);
    }

    if (spells >= 3) {
      console.log('[HISTORY_CARD] 3+ spells cast, bonus effect triggers!');
    }
  },

  /**
   * Check specific event when attacking.
   */
  onAttack: async (ctx: CardContext) => {
    // Check if this is the first attack this turn
    const previousAttacks = ctx.game.historyQuery.getAttacksThisTurn(ctx.owner.id);

    if (previousAttacks === 0) {
      console.log('[HISTORY_CARD] First attack of the turn!');
    } else {
      console.log(`[HISTORY_CARD] Attack #${previousAttacks + 1} this turn`);
    }

    // Check damage dealt this turn
    const damageDealt = ctx.game.historyQuery.getTotalDamageDealtThisTurn(ctx.owner.id);
    console.log(`[HISTORY_CARD] ${damageDealt} total damage dealt this turn`);
  },

  /**
   * React to game state at turn end.
   */
  onTurnEnd: async (ctx: CardContext) => {
    // Get summary of turn events
    const events = ctx.game.historyQuery.getEventsThisTurn();

    console.log(`[HISTORY_CARD] Turn ${ctx.game.round} summary: ${events.length} events`);

    // Check for specific patterns
    const didCombatOccur = ctx.game.historyQuery.didEventOccurThisTurn(
      e => e.type === ('ATTACK' as any)
    );

    const didSpellsOccur = ctx.game.historyQuery.didEventOccurThisTurn(
      e => e.type === ('SPELL_CAST' as any)
    );

    console.log(`  - Combat occurred: ${didCombatOccur}`);
    console.log(`  - Spells cast: ${didSpellsOccur}`);
  }
};
