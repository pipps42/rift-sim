/**
 * RemoveAllDamageAction - Removes all damage from all units in play.
 *
 * From RULES.md - Used in TWO places:
 * 1. Combat Resolution Step (line 264): "Si rimuove tutto il danno da tutte le unità"
 *    - After removing dead units
 *    - After recalling or conquering
 * 2. Expiration Phase (line 139): "Si rimuove tutto il danno dalle unità"
 *    - After ending effects
 *    - Before removing temporary units
 *
 * Example:
 * ```typescript
 * // After Combat Resolution
 * const removeDamageAction = new RemoveAllDamageAction(player, {});
 * await actionExecutor.execute(removeDamageAction);
 *
 * // In Expiration Phase
 * const removeDamageAction = new RemoveAllDamageAction(turnPlayer, {});
 * await actionExecutor.execute(removeDamageAction);
 * ```
 *
 * @module engine/actions/concrete/RemoveAllDamageAction
 */

import { GameAction } from '../base/GameAction';
import type { Player, Game, GameEvent } from '../../../types/game';
import { GameActionType } from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
} from '../../../types/actions';

export interface RemoveAllDamageActionData {
  // No specific data needed - removes damage from all units
}

/**
 * Action that removes all damage from all units in play.
 * Used in the Expiration Phase.
 */
export class RemoveAllDamageAction extends GameAction<RemoveAllDamageActionData> {
  public readonly type: GameActionType = 'remove_all_damage' as GameActionType;

  clone(): GameAction<RemoveAllDamageActionData> {
    const cloned = new RemoveAllDamageAction(this.controller, { ...this.data }, this.source);
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  validate(game: Game): ActionValidationResult {
    // No specific validation - always allowed in Expiration Phase
    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    let unitsHealed = 0;
    let totalDamageRemoved = 0;

    try {
      // Remove damage from all units on battlefields
      for (const battlefield of game.battlefields) {
        for (const unit of battlefield.units) {
          if (unit.damage !== undefined && unit.damage > 0) {
            totalDamageRemoved += unit.damage;
            unit.damage = 0;
            unitsHealed++;
          }
        }
      }

      // Also check Base zones for units (Gear doesn't take damage)
      for (const player of game.players) {
        for (const card of player.zones.base) {
          if (card.damage !== undefined && card.damage > 0) {
            totalDamageRemoved += card.damage;
            card.damage = 0;
            unitsHealed++;
          }
        }
      }

      return this.executionSuccess(undefined, {
        unitsHealed,
        totalDamageRemoved,
      });

    } catch (error) {
      return this.executionFailure(error as Error);
    }
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'damage_removed' as any,
      timestamp: this.timestamp,
      data: {
        phase: 'expiration',
        allUnits: true,
      },
    };
  }

  getDescription(): string {
    return `Remove all damage from units (Expiration Phase)`;
  }
}
