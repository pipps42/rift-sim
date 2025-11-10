/**
 * RecycleCardAction - Recycle a card (move to bottom of deck)
 *
 * From RULES.md:
 * - Recycle: put card at the bottom of its deck
 * - Basic Runes: "Recycle this: Add [Domain] power"
 * - During Mulligan: discarded cards are recycled
 *
 * Example:
 * ```typescript
 * // Recycle a rune to add power
 * const recycleAction = new RecycleCardAction(player, {
 *   card: runeCard,
 *   fromZone: 'base',
 *   toDeck: 'runeDeck',
 * });
 * await actionExecutor.execute(recycleAction);
 *
 * // Then add power
 * const addPowerAction = new AddPowerAction(player, {
 *   domain: runeCard.domains[0],
 *   amount: 1,
 * });
 * ```
 */

import { GameAction } from '../base/GameAction';
import type { Player, Game, GameCard, GameEvent } from '../../../types/game';
import { GameActionType } from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
} from '../../../types/actions';

export type ZoneName = 'hand' | 'base' | 'battlefield' | 'trash' | 'banishment';
export type DeckName = 'mainDeck' | 'runeDeck';

export interface RecycleCardData {
  /**
   * Card to recycle
   */
  card: GameCard;

  /**
   * Zone the card is currently in
   */
  fromZone: ZoneName;

  /**
   * Which deck to recycle to (bottom)
   */
  toDeck: DeckName;
}

export class RecycleCardAction extends GameAction<RecycleCardData> {
  public readonly type: GameActionType = GameActionType.RECYCLE_CARD;

  clone(): GameAction<RecycleCardData> {
    const cloned = new RecycleCardAction(this.controller, { ...this.data }, this.source);
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  validate(game: Game): ActionValidationResult {
    const { card, fromZone } = this.data;

    // Find the player who owns this card
    const owner = game.players.find(p => p.id === card.ownerId);
    if (!owner) {
      return this.validationFailure('Card owner not found', {
        ownerId: card.ownerId,
      });
    }

    // Validate card exists in fromZone
    let cardFound = false;

    switch (fromZone) {
      case 'hand':
        cardFound = owner.zones.hand.some(c => c.instanceId === card.instanceId);
        break;
      case 'base':
        cardFound = owner.zones.base.some(c => c.instanceId === card.instanceId);
        break;
      case 'battlefield':
        for (const bf of game.battlefields) {
          if (bf.units.some(u => u.instanceId === card.instanceId)) {
            cardFound = true;
            break;
          }
        }
        break;
      case 'trash':
        cardFound = owner.zones.trash.some(c => c.instanceId === card.instanceId);
        break;
      case 'banishment':
        cardFound = owner.zones.banishment.some(c => c.instanceId === card.instanceId);
        break;
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
    const { card, fromZone, toDeck } = this.data;

    // Find owner
    const owner = game.players.find(p => p.id === card.ownerId);
    if (!owner) {
      return this.executionFailure(new Error('Card owner not found'));
    }

    // Remove card from fromZone
    let removed = false;

    switch (fromZone) {
      case 'hand':
        const handIdx = owner.zones.hand.findIndex(c => c.instanceId === card.instanceId);
        if (handIdx !== -1) {
          owner.zones.hand.splice(handIdx, 1);
          removed = true;
        }
        break;
      case 'base':
        const baseIdx = owner.zones.base.findIndex(c => c.instanceId === card.instanceId);
        if (baseIdx !== -1) {
          owner.zones.base.splice(baseIdx, 1);
          removed = true;
        }
        break;
      case 'battlefield':
        for (const bf of game.battlefields) {
          const unitIdx = bf.units.findIndex(u => u.instanceId === card.instanceId);
          if (unitIdx !== -1) {
            bf.units.splice(unitIdx, 1);
            removed = true;
            break;
          }
        }
        break;
      case 'trash':
        const trashIdx = owner.zones.trash.findIndex(c => c.instanceId === card.instanceId);
        if (trashIdx !== -1) {
          owner.zones.trash.splice(trashIdx, 1);
          removed = true;
        }
        break;
      case 'banishment':
        const banishIdx = owner.zones.banishment.findIndex(c => c.instanceId === card.instanceId);
        if (banishIdx !== -1) {
          owner.zones.banishment.splice(banishIdx, 1);
          removed = true;
        }
        break;
    }

    if (!removed) {
      return this.executionFailure(new Error('Failed to remove card from zone'));
    }

    // Add to bottom of specified deck
    if (toDeck === 'mainDeck') {
      owner.zones.mainDeck.push(card);
    } else {
      owner.zones.runeDeck.push(card);
    }

    return this.executionSuccess();
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'card_recycled' as any,
      playerId: this.controller.id,
      cardId: this.data.card.instanceId,
      timestamp: this.timestamp,
      data: {
        cardId: this.data.card.cardId,
        fromZone: this.data.fromZone,
        toDeck: this.data.toDeck,
      },
    };
  }

  getDescription(): string {
    return `Recycle ${this.data.card.cardId} from ${this.data.fromZone} to ${this.data.toDeck}`;
  }
}
