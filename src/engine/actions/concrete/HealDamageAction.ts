/**
 * HealDamageAction - Removes damage from a unit
 *
 * From RULES.md:
 * - In Riftbound, there's no player health - units have Might and accumulate damage
 * - "Healing" means removing damage counters from a unit
 * - Damage is automatically removed during Expiration Step
 * - Some cards can heal (remove damage) as an effect
 *
 * Note: This is different from traditional TCGs with HP healing.
 * In Riftbound:
 * - Units don't have max HP, they have Might (combat strength)
 * - Units die when damage >= Might
 * - Healing removes accumulated damage, not restores HP
 *
 * Example:
 * ```typescript
 * // Remove 2 damage from a wounded unit
 * const healAction = new HealDamageAction(player, {
 *   target: woundedUnit,
 *   amount: 2,
 * });
 * await actionExecutor.execute(healAction);
 * ```
 */

import { GameAction } from '../base/GameAction';
import type { Player, Game, GameCard, GameEvent } from '../../../types/game';
import { GameActionType } from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
  HealActionData,
} from '../../../types/actions';

export class HealDamageAction extends GameAction<HealActionData> {
  public readonly type: GameActionType = GameActionType.HEAL_DAMAGE;

  clone(): GameAction<HealActionData> {
    const cloned = new HealDamageAction(this.controller, { ...this.data }, this.source);
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  validate(game: Game): ActionValidationResult {
    const { target, amount } = this.data;

    if (amount <= 0) {
      return this.validationFailure('Heal amount must be positive', {
        amount,
      });
    }

    // Target must be a unit (only units can take/be healed of damage)
    const cardType = (target as any).type;
    if (cardType !== 'unit' && cardType !== 'champion') {
      return this.validationFailure('Can only heal units', {
        cardType,
        targetId: target.instanceId,
      });
    }

    // Target must be on board
    let onBoard = false;

    // Check Base
    for (const player of game.players) {
      if (player.zones.base.some(c => c.instanceId === target.instanceId)) {
        onBoard = true;
        break;
      }
    }

    // Check Battlefields
    if (!onBoard) {
      for (const bf of game.battlefields) {
        if (bf.units.some(u => u.instanceId === target.instanceId)) {
          onBoard = true;
          break;
        }
      }
    }

    if (!onBoard) {
      return this.validationFailure('Target unit not found on board', {
        targetId: target.instanceId,
      });
    }

    // Check if target has any damage to heal
    const targetAny = target as any;
    const currentDamage = targetAny.damage || 0;

    if (currentDamage === 0) {
      // Not an error, but we'll note it in validation
      // Some cards might say "heal up to X" and healing 0 is valid
      // Target has no damage but action is still valid
      return this.validationSuccess();
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { target, amount } = this.data;

    // Find the target and reduce damage
    const targetAny = target as any;
    const currentDamage = targetAny.damage || 0;

    // Calculate new damage (can't go below 0)
    const damageRemoved = Math.min(amount, currentDamage);
    const newDamage = Math.max(0, currentDamage - amount);

    // Update target's damage
    targetAny.damage = newDamage;

    return this.executionSuccess(undefined, {
      targetId: target.instanceId,
      damageRemoved,
      previousDamage: currentDamage,
      newDamage,
    });
  }

  toHistoryEntry(): GameEvent {
    const { target, amount, source } = this.data;
    const targetAny = target as any;

    return {
      id: this.id,
      gameId: '',
      type: 'damage_healed' as any,
      playerId: this.controller.id,
      cardId: target.instanceId,
      timestamp: this.timestamp,
      data: {
        targetId: target.instanceId,
        targetCardId: target.cardId,
        healAmount: amount,
        sourceId: source?.instanceId,
        sourceCardId: source?.cardId,
        finalDamage: targetAny.damage || 0,
      },
    };
  }

  getDescription(): string {
    return `Heal ${this.data.amount} damage from ${this.data.target.cardId}`;
  }
}
