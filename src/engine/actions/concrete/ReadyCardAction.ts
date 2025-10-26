/**
 * ReadyCardAction - Readies a card (exhausted → ready)
 *
 * From RULES.md:
 * - Awaken Phase: Turn Player readies all Game Objects they control
 * - Gear enters the board ready
 * - Some abilities can ready cards
 *
 * Example:
 * ```typescript
 * // Ready all cards during Awaken Phase
 * const readyActions = playerCards.map(card =>
 *   new ReadyCardAction(player, { card })
 * );
 * ```
 */

import { GameAction } from '../base/GameAction';
import type { Player, Game, GameCard, GameEvent } from '../../../types/game';
import { GameActionType } from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
} from '../../../types/actions';

export interface ReadyCardData {
  /**
   * Card to ready
   */
  card: GameCard;
}

export class ReadyCardAction extends GameAction<ReadyCardData> {
  public readonly type: GameActionType = GameActionType.READY_CARD;

  clone(): GameAction<ReadyCardData> {
    const cloned = new ReadyCardAction(this.controller, { ...this.data }, this.source);
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

    // Card must be exhausted (not already ready)
    if (card.ready) {
      return this.validationFailure('Card is already ready', {
        cardId: card.instanceId,
      });
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { card } = this.data;

    // Find the card and ready it
    let found = false;

    // Check Base
    for (const player of game.players) {
      const baseCard = player.zones.base.find(c => c.instanceId === card.instanceId);
      if (baseCard) {
        baseCard.ready = true;
        found = true;
        break;
      }
    }

    // Check Battlefields
    if (!found) {
      for (const bf of game.battlefields) {
        const unit = bf.units.find(u => u.instanceId === card.instanceId);
        if (unit) {
          unit.ready = true;
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
      type: 'card_readied' as any,
      playerId: this.controller.id,
      cardId: this.data.card.instanceId,
      timestamp: this.timestamp,
      data: {
        cardId: this.data.card.cardId,
      },
    };
  }

  getDescription(): string {
    return `Ready ${this.data.card.cardId}`;
  }
}
