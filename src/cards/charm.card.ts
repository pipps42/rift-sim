import { CardScript, CardContext } from '../engine/scripting/types/CardScriptTypes';
import { GameCard } from '../types/game';

/**
 * Charm
 * Spell - Common - Calm
 * Cost: 1 energy + 1 calm power
 *
 * Effect: Move an enemy unit.
 *
 * TODO: This card requires ActionsAPI.moveUnit() which is not yet implemented.
 * Temporarily disabled until movement system is complete.
 */
export const charm: CardScript = {
  onPlay: async (ctx: CardContext) => {
    // TODO: Implement when moveUnit action is available
    console.log('[Charm] Card not yet fully implemented - requires moveUnit action');
  },
};

/* ORIGINAL IMPLEMENTATION - TO BE RESTORED WHEN moveUnit IS READY

export const charm: CardScript = {
  onPlay: async (ctx: CardContext) => {
    const { actions, game, owner, opponent } = ctx;

    // Find all enemy units on battlefields
    const enemyUnits: GameCard[] = [];

    // Check opponent's base
    const opponentBase = opponent.zones.base;
    for (const card of opponentBase) {
      if (card.cardType === 'unit') {
        enemyUnits.push(card);
      }
    }

    // Check opponent's units on battlefields
    for (const bf of game.battlefields) {
      const opponentSide = bf.sides[opponent.id];
      if (opponentSide) {
        for (const unit of opponentSide) {
          enemyUnits.push(unit);
        }
      }
    }

    if (enemyUnits.length === 0) {
      // No valid targets, spell fizzles
      return;
    }

    // In a real implementation, player would choose target and destination
    // For now, move the first enemy unit to owner's base
    const targetUnit = enemyUnits[0];
    if (!targetUnit) {
      return;
    }

    // Determine current location
    const currentLocation = targetUnit.zone;

    // Move to owner's base
    await actions.moveUnit(targetUnit, currentLocation, 'base');
  },
};

*/
