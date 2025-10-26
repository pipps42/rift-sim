/**
 * ExhaustCardAction - Exhausts a card (ready → exhausted)
 *
 * From RULES.md:
 * - Units enter the board exhausted (unless Accelerate)
 * - Units must exhaust to perform Standard Move
 * - Runes can be tapped (exhausted) to add energy: [T]: Add [1]
 * - Gear enters ready but can be exhausted by abilities
 *
 * Example:
 * ```typescript
 * // Exhaust a rune to add energy
 * const exhaustAction = new ExhaustCardAction(player, {
 *   card: runeCard,
 * });
 * await actionExecutor.execute(exhaustAction);
 * ```
 */

import { GameAction } from '../base/GameAction';
import type { Player, Game, GameCard, GameEvent } from '../../../types/game';
import { GameActionType } from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
} from '../../../types/actions';

export interface ExhaustCardData {
  /**
   * Card to exhaust
   */
  card: GameCard;
}

export class ExhaustCardAction extends GameAction<ExhaustCardData> {
  public readonly type: GameActionType = GameActionType.EXHAUST_CARD;

  clone(): GameAction<ExhaustCardData> {
    const cloned = new ExhaustCardAction(this.controller, { ...this.data }, this.source);
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  validate(game: Game): ActionValidationResult {
    const { card } = this.data;

    // Card must exist in game
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

    // Card must be ready (not already exhausted)
    if (!card.ready) {
      return this.validationFailure('Card is already exhausted', {
        cardId: card.instanceId,
      });
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { card } = this.data;

    // Find the card and exhaust it
    let found = false;

    // Check Base
    for (const player of game.players) {
      const baseCard = player.zones.base.find(c => c.instanceId === card.instanceId);
      if (baseCard) {
        baseCard.ready = false;
        found = true;
        break;
      }
    }

    // Check Battlefields
    if (!found) {
      for (const bf of game.battlefields) {
        const unit = bf.units.find(u => u.instanceId === card.instanceId);
        if (unit) {
          unit.ready = false;
          found = true;
          break;
        }
      }
    }

    if (!found) {
      return this.executionFailure(new Error('Card not found during execution'));
    }

    return this.executionSuccess();
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'card_exhausted' as any,
      playerId: this.controller.id,
      cardId: this.data.card.instanceId,
      timestamp: this.timestamp,
      data: {
        cardId: this.data.card.cardId,
      },
    };
  }

  getDescription(): string {
    return `Exhaust ${this.data.card.cardId}`;
  }
}
