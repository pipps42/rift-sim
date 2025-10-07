/**
 * Basic Rune - V2 (Direct Execution)
 *
 * All basic runes share the same two abilities:
 * 1. [T]: Add [1] energy (tap ability)
 * 2. Recycle this: Add [Domain] power (sacrifice ability)
 *
 * Used for all 6 basic runes:
 * - BASIC_RUNE_FURY
 * - BASIC_RUNE_CALM
 * - BASIC_RUNE_MIND
 * - BASIC_RUNE_BODY
 * - BASIC_RUNE_CHAOS
 * - BASIC_RUNE_ORDER
 *
 * MIGRATED FROM V1 (isolated-vm):
 * - Removed globalThis.cardScript pattern
 * - Changed to export default
 * - Direct access to ctx.game instead of serialized context
 * - Direct state mutation instead of return values
 * - Added TypeScript types from CardContext
 */

import type { CardContext } from '../../src/engine/scripting-v2/types/CardScriptTypes';
import { EventType } from '../../src/types/game';

export default {
  /**
   * Activated Ability: [T]: Add [1] energy
   *
   * When the rune is tapped, add 1 energy to the player's rune pool.
   * This is typically called by the player action system when they
   * tap a rune on the board.
   */
  onTap: async (ctx: CardContext) => {
    const { self, owner } = ctx;

    // Check if rune is ready (not already tapped)
    if (!self.ready) {
      throw new Error(`${self.cardId} is already exhausted`);
    }

    // Tap the rune (direct mutation)
    self.ready = false;

    // Add 1 energy to player's rune pool (direct mutation)
    owner.runePool.energy += 1;

    console.log(`[BASIC_RUNE] ${self.cardId} tapped for 1 energy (total: ${owner.runePool.energy})`);
  },

  /**
   * Activated Ability: Recycle this - Add [Domain] power
   *
   * Sacrifice the rune to add 1 power of its domain to the player's rune pool.
   * The rune moves from board to bottom of rune deck.
   */
  onRecycle: async (ctx: CardContext) => {
    const { self, owner, game } = ctx;

    // Get the rune's domain from eventData (passed by caller)
    // The domain is determined by the card definition
    const domain = ctx.eventData?.domain;

    if (!domain) {
      throw new Error('Rune has no domain defined in eventData');
    }

    // Find rune on board
    const runeIndex = owner.zones.runes.findIndex((r) => r.instanceId === self.instanceId);

    if (runeIndex === -1) {
      throw new Error(`${self.cardId} not found in rune zone`);
    }

    // Remove from board (direct mutation)
    owner.zones.runes.splice(runeIndex, 1);

    // Add to bottom of rune deck (recycle mechanic)
    owner.zones.runeDeck.push(self);

    // Add 1 power of the rune's domain
    let powerPool = owner.runePool.power.find((p) => p.domain === domain);

    if (!powerPool) {
      // Create new power pool for this domain
      powerPool = { domain, amount: 1 };
      owner.runePool.power.push(powerPool);
    } else {
      powerPool.amount += 1;
    }

    console.log(`[BASIC_RUNE] ${self.cardId} recycled for 1 ${domain} power`);

    // Add event to history for tracking
    game.history.push({
      id: `rune-recycle-${Date.now()}`,
      gameId: game.id,
      type: EventType.RUNE_RECYCLE,
      playerId: owner.id,
      cardId: self.instanceId,
      timestamp: new Date(),
      data: {
        domain,
        turn: game.round,
      },
    });
  },
};
