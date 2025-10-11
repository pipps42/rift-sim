import { CardScript, CardContext } from '../engine/scripting/types/CardScriptTypes';
import { GameCard, isUnitCard } from '../types/game';

/**
 * Disintegrate
 * Spell - Common - Fury
 * Cost: 4 energy
 *
 * ACTION (Play on your turn or in showdowns.)
 * Deal 3 to a unit at a battlefield. If this kills it, do this: draw 1.
 *
 * Implementation:
 * - When played, requires player to select a unit on any battlefield
 * - Deals 3 damage to the target
 * - If the damage kills the unit (damage >= might), draw 1 card
 */
export const disintegrate: CardScript = {
  onPlay: async (ctx: CardContext) => {
    const { actions, owner, opponent, game } = ctx;

    // Find all units on battlefields
    const unitsOnBattlefields: GameCard[] = [];
    const allBattlefields = game.battlefields || [];

    for (const bf of allBattlefields) {
      // Check owner's side
      const ownerSide = bf.sides[owner.id];
      if (ownerSide) {
        for (const card of ownerSide) {
          // Only target units (not gear or other permanents)
          if (isUnitCard(card)) {
            unitsOnBattlefields.push(card);
          }
        }
      }

      // Check opponent's side
      const opponentSide = bf.sides[opponent.id];
      if (opponentSide) {
        for (const card of opponentSide) {
          // Only target units (not gear or other permanents)
          if (isUnitCard(card)) {
            unitsOnBattlefields.push(card);
          }
        }
      }
    }

    if (unitsOnBattlefields.length === 0) {
      // No valid targets, spell fizzles
      return;
    }

    // In a real implementation, this would prompt the player to select a target
    // For now, we'll target the first available unit
    // TODO: Integrate with player input system when available
    const targetUnit = unitsOnBattlefields[0];
    if (!targetUnit) {
      // Should not happen due to earlier check, but TypeScript wants null check
      return;
    }

    // Check target's current stats before dealing damage
    const currentDamage = targetUnit.damage;
    const targetMight = targetUnit.might ?? 0; // Type-safe access to might

    // Deal 3 damage
    await actions.dealDamage(targetUnit, 3, 'effect');

    // Check if the damage killed the unit
    // A unit dies when damage >= might
    const newDamage = currentDamage + 3;
    const unitWasKilled = newDamage >= targetMight;

    if (unitWasKilled) {
      // Draw 1 card as a reward for killing the target
      await actions.draw(1);
    }
  },
};
