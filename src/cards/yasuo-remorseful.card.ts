import { CardScript, CardContext } from '../engine/scripting/types/CardScriptTypes';
import { OnCombatStartTrigger, CombatStartData } from '../engine/actions/triggers/OnCombatStartTrigger';
import { DealDamageAction } from '../engine/actions/concrete/DealDamageAction';
import { GameCard, isUnitCard } from '../types/game';

/**
 * Yasuo, Remorseful
 * Unit - Rare - Calm
 * Cost: 6 energy + 2 calm power
 * Might: 6
 *
 * Effect: When I attack, deal damage equal to my Might to an enemy unit here.
 *
 * Implementation:
 * - Registers OnCombatStartTrigger when enters play
 * - Triggers only when this unit is attacking
 * - Deals damage equal to current might to an enemy unit on the same battlefield
 */
export const yasuoRemorseful: CardScript = {
  onEntersPlay: async (ctx: CardContext) => {
    const { owner, opponent, self } = ctx;

    // Type assertion: Yasuo is a unit, so we can safely assert to UnitGameCard
    if (!isUnitCard(self)) {
      throw new Error('Yasuo must be a unit card');
    }

    // Register trigger for when this unit attacks
    const trigger = new OnCombatStartTrigger({
      sourceCard: self,
      filter: (combatData: CombatStartData, game) => {
        // Only trigger when Yasuo is attacking
        if (!isUnitCard(self)) return false;
        return combatData.participant.instanceId === self.instanceId && combatData.isAttacker;
      },
      onTrigger: async (combatData: CombatStartData, game) => {
        // Type check self again in the callback (TypeScript needs this)
        if (!isUnitCard(self)) {
          return [];
        }

        // Find enemy units on the same battlefield
        const enemyUnitsHere: GameCard[] = [];
        const battlefieldId = combatData.battlefieldId;

        const battlefield = game.battlefields?.find(bf => bf.id === battlefieldId);
        if (!battlefield) {
          return [];
        }

        // Get enemy side on this battlefield
        // Use opponent from context instead of combatData.opposingPlayerId
        // This is more robust and works correctly in mirror matches (Yasuo vs Yasuo)
        const enemySide = battlefield.sides[opponent.id];

        if (enemySide) {
          for (const unit of enemySide) {
            // Only target units (not gear or other permanents)
            if (isUnitCard(unit)) {
              enemyUnitsHere.push(unit);
            }
          }
        }

        if (enemyUnitsHere.length === 0) {
          // No enemy units to target
          return [];
        }

        // In a real implementation, player would choose target
        // For now, target the first enemy unit
        const targetUnit = enemyUnitsHere[0];

        if (!targetUnit) {
          return [];
        }

        // Deal damage equal to Yasuo's current might
        // TypeScript narrowing works, but we need to assert might exists
        const yasuoMight = self.might ?? 6; // Default to 6 if somehow undefined

        return [
          new DealDamageAction(
            owner,
            {
              target: targetUnit,
              amount: yasuoMight,
              damageType: 'effect',
            },
            self
          ),
        ];
      },
    });

    // Register the trigger with the game
    // In V3 system, triggers are registered on the card itself
    const selfAny = self as any;
    if (!selfAny.triggers) {
      selfAny.triggers = [];
    }
    selfAny.triggers.push(trigger);
  },
};
