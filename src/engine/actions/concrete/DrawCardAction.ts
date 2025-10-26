/**
 * DrawCardAction - Draws cards from a player's deck.
 *
 * Handles:
 * - Drawing from Main Deck
 * - Burn Out when deck is empty (shuffle Trash → Main Deck, opponent gains point)
 * - Moving cards from deck to hand
 *
 * @module engine/actions/concrete/DrawCardAction
 */

import { GameAction } from '../base/GameAction';
import type {
  Game,
  Player,
  GameCard,
  GameEvent,
} from '../../../types/game';
import type {
  ActionValidationResult,
  ActionExecutionResult,
  GameActionType,
} from '../../../types/actions';

export interface DrawCardActionData {
  /** Number of cards to draw */
  amount: number;

  /** Optional: specific deck to draw from (defaults to Main Deck) */
  deckType?: 'main' | 'rune';
}

/**
 * Action that draws cards from a player's deck.
 */
export class DrawCardAction extends GameAction<DrawCardActionData> {
  public readonly type: GameActionType = 'draw_card' as GameActionType;

  constructor(
    controller: Player,
    data: DrawCardActionData,
    source?: GameCard
  ) {
    super(controller, data, source);
  }

  validate(game: Game): ActionValidationResult {
    const { amount } = this.data;

    // Validate amount is positive
    if (amount <= 0) {
      return this.validationFailure('Must draw at least 1 card', { amount });
    }

    // Note: We don't validate deck size here because Burn Out allows drawing even with empty deck
    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { amount } = this.data;
    const sideEffects: GameAction[] = [];

    try {
      for (let i = 0; i < amount; i++) {
        const drawResult = this.drawSingleCard(game);

        if (drawResult.burnOut) {
          // Burn Out occurred - add side effect for opponent to gain point
          // TODO: Create GainPointAction when implemented
        }
      }

      return this.executionSuccess(sideEffects, {
        cardsDrawn: amount,
      });

    } catch (error) {
      return this.executionFailure(error as Error);
    }
  }

  /**
   * Draw a single card, handling Burn Out if necessary.
   *
   * @private
   */
  private drawSingleCard(game: Game): { card?: GameCard; burnOut: boolean } {
    const player = this.controller as any;
    const mainDeck = player.mainDeck || [];
    const hand = player.hand || [];
    const trash = player.trash || [];

    // Check if Main Deck is empty
    if (mainDeck.length === 0) {
      // BURN OUT!
      if (trash.length === 0) {
        // Both deck and trash empty - Burn Out with no shuffle
        // Still give opponent a point
        return { burnOut: true };
      }

      // Shuffle Trash into Main Deck
      this.shuffleTrashIntoDeck(player);

      // Opponent gains 1 point (handled by side effect)
      // Continue with draw...
    }

    // Draw from top of deck
    const drawnCard = mainDeck.shift();

    if (drawnCard) {
      hand.push(drawnCard);
    }

    return { card: drawnCard, burnOut: mainDeck.length === 0 && trash.length === 0 };
  }

  /**
   * Shuffle Trash into Main Deck (Burn Out procedure).
   *
   * @private
   */
  private shuffleTrashIntoDeck(player: any): void {
    const trash = player.trash || [];
    const mainDeck = player.mainDeck || [];

    // Move all cards from Trash to Main Deck
    while (trash.length > 0) {
      mainDeck.push(trash.pop());
    }

    // Shuffle Main Deck
    this.shuffleDeck(mainDeck);
  }

  /**
   * Fisher-Yates shuffle algorithm.
   *
   * @private
   */
  private shuffleDeck(deck: any[]): void {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'draw_card' as any,
      timestamp: this.timestamp,
      data: {
        player: this.controller.id,
        amount: this.data.amount,
        source: this.source?.instanceId || null,
      },
    };
  }

  clone(): DrawCardAction {
    const cloned = new DrawCardAction(
      this.controller,
      { ...this.data },
      this.source
    );
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  getDescription(): string {
    return `${this.controller.name} draws ${this.data.amount} card(s)`;
  }
}
