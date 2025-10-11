/**
 * RevealCardAction - Reveals a card from a private zone
 *
 * From RULES.md:
 * - Reveal is a Limited Action (only when instructed)
 * - Cards can be revealed from Hand, Deck, or other private zones
 * - Revealed information becomes public to all players
 *
 * Privacy levels (RULES.md):
 * - Public: all can see (board, trash, banishment)
 * - Private: only controller (hand, facedown cards)
 * - Secret: no one (cards in deck)
 *
 * Example:
 * ```typescript
 * // Reveal a card from hand
 * const revealAction = new RevealCardAction(player, {
 *   card: handCard,
 *   fromZone: 'hand',
 *   duration: 'permanent', // Stays revealed
 * });
 * await actionExecutor.execute(revealAction);
 * ```
 */

import { GameAction } from '../base/GameAction';
import type { Player, Game, GameCard, GameEvent } from '../../../types/game';
import { GameActionType } from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
} from '../../../types/actions';

export interface RevealCardData {
  /**
   * Card to reveal
   */
  card: GameCard;

  /**
   * Zone the card is being revealed from
   */
  fromZone: string;

  /**
   * How long the card stays revealed
   * - 'instant': just show it once
   * - 'until_played': stays revealed until played
   * - 'permanent': permanently revealed (rare)
   */
  duration?: 'instant' | 'until_played' | 'permanent';

  /**
   * Players who can see the revealed card (default: all players)
   */
  visibleTo?: string[]; // Player IDs, undefined = all
}

export class RevealCardAction extends GameAction<RevealCardData> {
  public readonly type: GameActionType = GameActionType.REVEAL_CARD;

  clone(): GameAction<RevealCardData> {
    const cloned = new RevealCardAction(this.controller, { ...this.data }, this.source);
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  validate(game: Game): ActionValidationResult {
    const { card, fromZone } = this.data;

    // Find the card's owner
    const owner = game.players.find(p => p.id === card.ownerId);
    if (!owner) {
      return this.validationFailure('Card owner not found', {
        ownerId: card.ownerId,
      });
    }

    // Verify card exists in the specified zone
    let cardFound = false;

    switch (fromZone) {
      case 'hand':
        cardFound = owner.zones.hand.some(c => c.instanceId === card.instanceId);
        break;
      case 'mainDeck':
        cardFound = owner.zones.mainDeck.some(c => c.instanceId === card.instanceId);
        break;
      case 'runeDeck':
        cardFound = owner.zones.runeDeck.some(c => c.instanceId === card.instanceId);
        break;
      default:
        return this.validationFailure('Can only reveal from private zones', {
          fromZone,
        });
    }

    if (!cardFound) {
      return this.validationFailure('Card not found in specified zone', {
        cardId: card.instanceId,
        fromZone,
      });
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { card, fromZone, duration, visibleTo } = this.data;

    // Mark card as revealed
    const cardAny = card as any;

    // Initialize reveal metadata if not present
    if (!cardAny.revealMetadata) {
      cardAny.revealMetadata = {
        isRevealed: false,
        revealedAt: undefined,
        revealedBy: undefined,
        duration: undefined,
        visibleTo: undefined,
      };
    }

    // Update reveal status
    cardAny.revealMetadata.isRevealed = true;
    cardAny.revealMetadata.revealedAt = this.timestamp;
    cardAny.revealMetadata.revealedBy = this.controller.id;
    cardAny.revealMetadata.duration = duration || 'instant';
    cardAny.revealMetadata.visibleTo = visibleTo; // undefined = all players

    // For 'instant' duration, the reveal is just for the event
    // The card returns to private status immediately after
    if (duration === 'instant') {
      // We'll emit the event but not persist the reveal
      // This is handled by the history entry
    }

    return this.executionSuccess(undefined, {
      cardId: card.instanceId,
      cardName: card.cardId,
      fromZone,
      duration: duration || 'instant',
    });
  }

  toHistoryEntry(): GameEvent {
    const { card, fromZone, duration, visibleTo } = this.data;

    return {
      id: this.id,
      gameId: '',
      type: 'card_revealed' as any,
      playerId: this.controller.id,
      cardId: card.instanceId,
      timestamp: this.timestamp,
      data: {
        cardId: card.cardId,
        cardName: card.cardId, // For UI display
        fromZone,
        duration: duration || 'instant',
        visibleTo: visibleTo || 'all',
      },
    };
  }

  getDescription(): string {
    const duration = this.data.duration ? ` (${this.data.duration})` : '';
    return `Reveal ${this.data.card.cardId} from ${this.data.fromZone}${duration}`;
  }
}
