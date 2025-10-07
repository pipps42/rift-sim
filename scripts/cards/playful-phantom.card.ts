/**
 * Playful Phantom - V2 (Direct Execution)
 *
 * A simple vanilla 5/5 unit for 5 energy.
 * No special abilities - pure stats.
 *
 * Card ID: PLAYFUL_PHANTOM
 * Type: Unit (Spirit)
 * Cost: 5 energy
 * Might: 5
 * Domain: Calm
 *
 * Description: "A simple vanilla unit."
 * Flavor: "Ethereal and playful, yet mighty."
 *
 * This card demonstrates the minimal script for a vanilla unit
 * that just needs to track when it enters/leaves play.
 */

import type { CardContext } from '../../src/engine/scripting-v2/types/CardScriptTypes';
import { EventType } from '../../src/types/game';

export default {
  /**
   * When this unit enters play (is summoned/played).
   * Optional logging for game events.
   */
  onEntersPlay: async (ctx: CardContext) => {
    console.log(`[PLAYFUL_PHANTOM] ${ctx.self.cardId} enters play for ${ctx.owner.name}`);

    // Add event to history
    ctx.game.history.push({
      id: `unit-enters-${Date.now()}`,
      gameId: ctx.game.id,
      type: EventType.UNIT_PLAYED,
      playerId: ctx.owner.id,
      cardId: ctx.self.instanceId,
      timestamp: new Date(),
      data: {
        turn: ctx.game.round,
        might: 5,
      },
    });
  },

  /**
   * When this unit leaves play (dies, is destroyed, bounced, etc).
   * Cleanup any temporary effects or tracking.
   */
  onLeavesPlay: async (ctx: CardContext) => {
    console.log(`[PLAYFUL_PHANTOM] ${ctx.self.cardId} leaves play`);

    // Cleanup storage if needed
    if (ctx.game.storage.hasCardStorage(ctx.self.instanceId)) {
      ctx.game.storage.clearCardStorage(ctx.self.instanceId);
    }
  },

  /**
   * When this unit dies specifically (health reaches 0).
   * Different from onLeavesPlay - this only triggers on death.
   */
  onDeath: async (ctx: CardContext) => {
    console.log(`[PLAYFUL_PHANTOM] ${ctx.self.cardId} has died`);

    // Add death event to history
    ctx.game.history.push({
      id: `unit-death-${Date.now()}`,
      gameId: ctx.game.id,
      type: EventType.UNIT_DEATH,
      playerId: ctx.owner.id,
      cardId: ctx.self.instanceId,
      timestamp: new Date(),
      data: {
        turn: ctx.game.round,
        damage: ctx.self.damage,
      },
    });
  },

  /**
   * When this unit attacks.
   * For vanilla units, just logging.
   */
  onAttack: async (ctx: CardContext) => {
    console.log(`[PLAYFUL_PHANTOM] ${ctx.self.cardId} attacks!`);

    // Track attack in storage (for potential synergies)
    const storage = ctx.game.storage.getCardStorage(ctx.self.instanceId);
    const attackCount = storage.increment('attacksThisGame');

    console.log(`[PLAYFUL_PHANTOM] Attack count: ${attackCount}`);

    // Add attack event to history
    ctx.game.history.push({
      id: `attack-${Date.now()}`,
      gameId: ctx.game.id,
      type: EventType.ATTACK,
      playerId: ctx.owner.id,
      cardId: ctx.self.instanceId,
      timestamp: new Date(),
      data: {
        turn: ctx.game.round,
        might: 5,
      },
    });
  },
};
