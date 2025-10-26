/**
 * StunUnitAction - Stuns a unit (doesn't contribute damage in combat)
 *
 * From RULES.md:
 * - Stun is a Limited Action (only when instructed by card effect)
 * - Stunned units don't contribute their Might during combat
 * - Stun is typically temporary (duration-based or until end of turn)
 *
 * Example:
 * ```typescript
 * // Stun an enemy unit
 * const stunAction = new StunUnitAction(player, {
 *   target: enemyUnit,
 *   duration: 1, // 1 turn
 * });
 * await actionExecutor.execute(stunAction);
 * ```
 */

import { GameAction } from '../base/GameAction';
import type { Player, Game, GameCard, GameEvent } from '../../../types/game';
import { GameActionType } from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
  StunActionData,
} from '../../../types/actions';

export class StunUnitAction extends GameAction<StunActionData> {
  public readonly type: GameActionType = GameActionType.STUN_UNIT;

  clone(): GameAction<StunActionData> {
    const cloned = new StunUnitAction(this.controller, { ...this.data }, this.source);
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  validate(game: Game): ActionValidationResult {
    const { target, duration } = this.data;

    if (duration <= 0) {
      return this.validationFailure('Stun duration must be positive', {
        duration,
      });
    }

    // Target must be a unit
    const cardType = (target as any).type;
    if (cardType !== 'unit') {
      return this.validationFailure('Can only stun units', {
        cardType,
        targetId: target.instanceId,
      });
    }

    // Target must be on board (Base or Battlefield)
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

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { target, duration } = this.data;

    // Apply stun status
    // We'll store stun as a status effect on the card
    // This assumes GameCard has a statusEffects array or similar
    const targetCard = target as any;

    // Initialize status effects if not present
    if (!targetCard.statusEffects) {
      targetCard.statusEffects = [];
    }

    // Add stun effect
    const stunEffect = {
      type: 'stun',
      duration: duration,
      appliedAt: this.timestamp,
      source: this.source?.instanceId,
    };

    targetCard.statusEffects.push(stunEffect);

    // Mark as stunned (for easier checking)
    targetCard.stunned = true;

    return this.executionSuccess(undefined, {
      targetId: target.instanceId,
      duration,
    });
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'unit_stunned' as any,
      playerId: this.controller.id,
      cardId: this.data.target.instanceId,
      timestamp: this.timestamp,
      data: {
        targetId: this.data.target.instanceId,
        duration: this.data.duration,
        sourceId: this.source?.instanceId,
      },
    };
  }

  getDescription(): string {
    return `Stun ${this.data.target.cardId} for ${this.data.duration} turn(s)`;
  }
}
