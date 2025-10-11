/**
 * HideCardAction - Hide a card facedown on a battlefield
 *
 * From RULES.md:
 * - Hide: discretionary action during Action Phase
 * - Card must have Hidden keyword
 * - Goes to battlefield's facedown zone (max 1 card per battlefield)
 * - During Cleanup: hidden cards are removed from battlefields without controller's units
 *
 * Example:
 * ```typescript
 * const hideAction = new HideCardAction(player, {
 *   card: cardWithHiddenKeyword,
 *   battlefield: targetBattlefield,
 * });
 * await actionExecutor.execute(hideAction);
 * ```
 */

import { GameAction } from '../base/GameAction';
import type { Player, Game, GameCard, GameEvent, Battlefield } from '../../../types/game';
import { GameActionType } from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
} from '../../../types/actions';

export interface HideCardData {
  /**
   * Card to hide (must have Hidden keyword)
   */
  card: GameCard;

  /**
   * Battlefield to hide the card at
   */
  battlefield: Battlefield;
}

export class HideCardAction extends GameAction<HideCardData> {
  public readonly type: GameActionType = GameActionType.HIDE_CARD;

  clone(): GameAction<HideCardData> {
    const cloned = new HideCardAction(this.controller, { ...this.data }, this.source);
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  validate(game: Game): ActionValidationResult {
    const { card, battlefield } = this.data;

    // Card must be in controller's hand
    const cardInHand = this.controller.zones.hand.find(c => c.instanceId === card.instanceId);
    if (!cardInHand) {
      return this.validationFailure('Card not in hand', {
        cardId: card.instanceId,
      });
    }

    // Card must have Hidden keyword
    // Note: In a full implementation, check card.keywords array
    // For now, we assume the caller has verified this
    // TODO: Add keyword checking when keyword system is integrated

    // Battlefield must exist in game
    const bf = game.battlefields.find(b => b.id === battlefield.id);
    if (!bf) {
      return this.validationFailure('Battlefield not found', {
        battlefieldId: battlefield.id,
      });
    }

    // Battlefield facedown zone must be empty (max 1 card)
    if (bf.facedownCards.length > 0) {
      return this.validationFailure('Battlefield facedown zone already has a card', {
        battlefieldId: battlefield.id,
      });
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { card, battlefield } = this.data;

    // Remove from hand
    const handIdx = this.controller.zones.hand.findIndex(c => c.instanceId === card.instanceId);
    if (handIdx === -1) {
      return this.executionFailure(new Error('Card not found in hand'));
    }

    this.controller.zones.hand.splice(handIdx, 1);

    // Find battlefield and add to facedown zone
    const bf = game.battlefields.find(b => b.id === battlefield.id);
    if (!bf) {
      return this.executionFailure(new Error('Battlefield not found'));
    }

    bf.facedownCards.push(card);

    return this.executionSuccess();
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'card_hidden' as any,
      playerId: this.controller.id,
      cardId: this.data.card.instanceId,
      battlefieldId: this.data.battlefield.id,
      timestamp: this.timestamp,
      data: {
        cardId: this.data.card.cardId,
        battlefieldId: this.data.battlefield.id,
      },
    };
  }

  getDescription(): string {
    return `Hide ${this.data.card.cardId} at ${this.data.battlefield.id}`;
  }
}
