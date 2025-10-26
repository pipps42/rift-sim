/**
 * KillCardAction - Kill a permanent (send to trash)
 *
 * From RULES.md:
 * - Kill: limited action, send permanent to trash
 * - During Cleanup: units with damage >= might are killed
 * - Can be triggered by card effects: "kill target unit"
 *
 * Example:
 * ```typescript
 * // Kill a unit
 * const killAction = new KillCardAction(player, {
 *   card: unitCard,
 * });
 * await actionExecutor.execute(killAction);
 * ```
 */

import { GameAction } from '../base/GameAction';
import type { Player, Game, GameCard, GameEvent } from '../../../types/game';
import { GameActionType } from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
} from '../../../types/actions';

export interface KillCardData {
  /**
   * Card to kill (must be a permanent on board)
   */
  card: GameCard;
}

export class KillCardAction extends GameAction<KillCardData> {
  public readonly type: GameActionType = GameActionType.KILL_CARD;

  clone(): GameAction<KillCardData> {
    const cloned = new KillCardAction(this.controller, { ...this.data }, this.source);
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  validate(game: Game): ActionValidationResult {
    const { card } = this.data;

    // Card must be on board (Base or Battlefield)
    let cardFound = false;

    // Check Base
    for (const player of game.players) {
      if (player.zones.base.some(c => c.instanceId === card.instanceId)) {
        cardFound = true;
        break;
      }
    }

    // Check Battlefields
    if (!cardFound) {
      for (const bf of game.battlefields) {
        if (bf.units.some(u => u.instanceId === card.instanceId)) {
          cardFound = true;
          break;
        }
      }
    }

    if (!cardFound) {
      return this.validationFailure('Card not found on board', {
        cardId: card.instanceId,
      });
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { card } = this.data;

    // Find owner
    const owner = game.players.find(p => p.id === card.ownerId);
    if (!owner) {
      return this.executionFailure(new Error('Card owner not found'));
    }

    // Remove from board
    let removed = false;

    // Check Base
    const baseIdx = owner.zones.base.findIndex(c => c.instanceId === card.instanceId);
    if (baseIdx !== -1) {
      owner.zones.base.splice(baseIdx, 1);
      removed = true;
    }

    // Check Battlefields
    if (!removed) {
      for (const bf of game.battlefields) {
        const unitIdx = bf.units.findIndex(u => u.instanceId === card.instanceId);
        if (unitIdx !== -1) {
          bf.units.splice(unitIdx, 1);
          removed = true;
          break;
        }
      }
    }

    if (!removed) {
      return this.executionFailure(new Error('Failed to remove card from board'));
    }

    // Add to trash
    owner.zones.trash.push(card);

    return this.executionSuccess();
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'unit_died' as any,
      playerId: this.controller.id,
      cardId: this.data.card.instanceId,
      timestamp: this.timestamp,
      data: {
        cardId: this.data.card.cardId,
      },
    };
  }

  getDescription(): string {
    return `Kill ${this.data.card.cardId}`;
  }
}
