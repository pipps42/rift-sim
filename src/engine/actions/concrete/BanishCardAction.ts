/**
 * BanishCardAction - Moves a card to the Banishment zone
 *
 * From RULES.md:
 * - Banishment is a Non-Board Zone (public, not ordered)
 * - Cards can be banished temporarily or permanently
 * - When a card moves from Board to Non-Board, it loses all temporary modifications
 *   (damage, buffs, keywords, etc.)
 *
 * Example:
 * ```typescript
 * // Banish an enemy unit
 * const banishAction = new BanishCardAction(player, {
 *   card: enemyUnit,
 *   fromZone: 'battlefield',
 *   permanent: false, // Can return
 * });
 * await actionExecutor.execute(banishAction);
 * ```
 */

import { GameAction } from '../base/GameAction';
import type { Player, Game, GameCard, GameEvent } from '../../../types/game';
import { GameActionType } from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
} from '../../../types/actions';

export interface BanishCardData {
  /**
   * Card to banish
   */
  card: GameCard;

  /**
   * Zone the card is being banished from
   */
  fromZone: string;

  /**
   * Whether this is permanent banishment (default: temporary)
   */
  permanent?: boolean;
}

export class BanishCardAction extends GameAction<BanishCardData> {
  public readonly type: GameActionType = GameActionType.BANISH_CARD;

  clone(): GameAction<BanishCardData> {
    const cloned = new BanishCardAction(this.controller, { ...this.data }, this.source);
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
      case 'base':
        cardFound = owner.zones.base.some(c => c.instanceId === card.instanceId);
        break;
      case 'trash':
        cardFound = owner.zones.trash.some(c => c.instanceId === card.instanceId);
        break;
      case 'battlefield':
        // Check all battlefields
        for (const bf of game.battlefields) {
          if (bf.units.some(u => u.instanceId === card.instanceId)) {
            cardFound = true;
            break;
          }
        }
        break;
      default:
        return this.validationFailure('Invalid source zone for banishment', {
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
    const { card, fromZone, permanent } = this.data;

    // Find the card's owner
    const owner = game.players.find(p => p.id === card.ownerId);
    if (!owner) {
      return this.executionFailure(new Error('Card owner not found during execution'));
    }

    // Remove from source zone
    let removed = false;

    switch (fromZone) {
      case 'hand': {
        const index = owner.zones.hand.findIndex(c => c.instanceId === card.instanceId);
        if (index !== -1) {
          owner.zones.hand.splice(index, 1);
          removed = true;
        }
        break;
      }
      case 'base': {
        const index = owner.zones.base.findIndex(c => c.instanceId === card.instanceId);
        if (index !== -1) {
          owner.zones.base.splice(index, 1);
          removed = true;
        }
        break;
      }
      case 'trash': {
        const index = owner.zones.trash.findIndex(c => c.instanceId === card.instanceId);
        if (index !== -1) {
          owner.zones.trash.splice(index, 1);
          removed = true;
        }
        break;
      }
      case 'battlefield': {
        for (const bf of game.battlefields) {
          const index = bf.units.findIndex(u => u.instanceId === card.instanceId);
          if (index !== -1) {
            bf.units.splice(index, 1);
            removed = true;
            break;
          }
        }
        break;
      }
    }

    if (!removed) {
      return this.executionFailure(new Error('Failed to remove card from source zone'));
    }

    // Clear temporary modifications if moving from Board zone
    const isBoardZone = fromZone === 'base' || fromZone === 'battlefield';
    if (isBoardZone) {
      // Reset temporary effects (as per RULES.md)
      const cardAny = card as any;
      cardAny.damage = 0;
      cardAny.temporaryBuffs = [];
      cardAny.temporaryKeywords = [];
      cardAny.statusEffects = [];
      cardAny.stunned = false;
    }

    // Add to Banishment zone
    if (!owner.zones.banishment) {
      owner.zones.banishment = [];
    }
    owner.zones.banishment.push(card);

    // Mark as permanent if specified
    if (permanent) {
      (card as any).permanentlyBanished = true;
    }

    return this.executionSuccess(undefined, {
      cardId: card.instanceId,
      fromZone,
      permanent: permanent || false,
    });
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'card_banished' as any,
      playerId: this.controller.id,
      cardId: this.data.card.instanceId,
      timestamp: this.timestamp,
      data: {
        cardId: this.data.card.cardId,
        fromZone: this.data.fromZone,
        permanent: this.data.permanent || false,
      },
    };
  }

  getDescription(): string {
    const permanent = this.data.permanent ? ' (permanent)' : '';
    return `Banish ${this.data.card.cardId} from ${this.data.fromZone}${permanent}`;
  }
}
