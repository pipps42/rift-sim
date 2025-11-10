/**
 * DiscardCardAction - Discard a card from hand to trash
 *
 * From RULES.md:
 * - Discard: limited action, move card from hand to trash
 * - Used during mulligan, card effects, etc.
 *
 * Example:
 * ```typescript
 * const discardAction = new DiscardCardAction(player, {
 *   card: cardInHand,
 * });
 * await actionExecutor.execute(discardAction);
 * ```
 */

import { GameAction } from '../base/GameAction';
import type { Player, Game, GameCard, GameEvent } from '../../../types/game';
import { GameActionType } from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
} from '../../../types/actions';

export interface DiscardCardData {
  /**
   * Card to discard (must be in hand)
   */
  card: GameCard;
}

export class DiscardCardAction extends GameAction<DiscardCardData> {
  public readonly type: GameActionType = GameActionType.DISCARD_CARD;

  clone(): GameAction<DiscardCardData> {
    const cloned = new DiscardCardAction(this.controller, { ...this.data }, this.source);
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  validate(game: Game): ActionValidationResult {
    const { card } = this.data;

    // Card must be in controller's hand
    const hand = this.controller.zones.hand;
    const cardInHand = hand.find(c => c.instanceId === card.instanceId);

    if (!cardInHand) {
      return this.validationFailure('Card not in hand', {
        cardId: card.instanceId,
      });
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { card } = this.data;

    // Remove from hand
    const handIdx = this.controller.zones.hand.findIndex(c => c.instanceId === card.instanceId);
    if (handIdx === -1) {
      return this.executionFailure(new Error('Card not found in hand'));
    }

    this.controller.zones.hand.splice(handIdx, 1);

    // Add to trash
    this.controller.zones.trash.push(card);

    return this.executionSuccess();
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'card_discarded' as any,
      playerId: this.controller.id,
      cardId: this.data.card.instanceId,
      timestamp: this.timestamp,
      data: {
        cardId: this.data.card.cardId,
      },
    };
  }

  getDescription(): string {
    return `Discard ${this.data.card.cardId}`;
  }
}
