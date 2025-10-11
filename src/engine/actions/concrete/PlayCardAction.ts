/**
 * PlayCardAction - Plays a card from hand.
 *
 * Handles:
 * - Cost payment (Energy + Power)
 * - Timing validation (Default/Action/Reaction)
 * - Turn state checks
 * - Card resolution (permanent vs spell)
 *
 * @module engine/actions/concrete/PlayCardAction
 */

import { GameAction } from '../base/GameAction';
import type {
  Game,
  Player,
  GameCard,
  GameEvent,
} from '../../../types/game';
import {
  CardTiming,
  TurnState,
} from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
  GameActionType,
} from '../../../types/actions';

export interface PlayCardActionData {
  /** Card to play */
  card: GameCard;

  /** Targets for the card (if any) */
  targets?: any[];

  /** Additional costs paid (if any) */
  additionalCosts?: Record<string, any>;
}

/**
 * Action that plays a card from hand.
 */
export class PlayCardAction extends GameAction<PlayCardActionData> {
  public readonly type: GameActionType = 'play_card' as GameActionType;

  constructor(
    controller: Player,
    data: PlayCardActionData,
    source?: GameCard
  ) {
    super(controller, data, source);
  }

  validate(game: Game): ActionValidationResult {
    const { card, targets } = this.data;

    // Validate card is in player's hand
    const hand = (this.controller as any).hand || [];
    const cardInHand = hand.find((c: any) => c.instanceId === card.instanceId);

    if (!cardInHand) {
      return this.validationFailure('Card not in hand', {
        cardId: card.instanceId,
      });
    }

    // Validate timing (Default/Action/Reaction vs Turn State)
    const timingValid = this.validateTiming(game, card);
    if (!timingValid.valid) {
      return timingValid;
    }

    // Validate targets
    const targetsValid = this.validateTargets(game, card, targets);
    if (!targetsValid.valid) {
      return targetsValid;
    }

    // Validate costs can be paid
    const costsValid = this.validateCosts(game, card);
    if (!costsValid.valid) {
      return costsValid;
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { card } = this.data;
    const sideEffects: GameAction[] = [];

    try {
      // 1. Remove card from hand
      const hand = (this.controller as any).hand || [];
      const index = hand.findIndex((c: any) => c.instanceId === card.instanceId);
      if (index !== -1) {
        hand.splice(index, 1);
      }

      // 2. Pay costs
      this.payCosts(game, card);

      // 3. Put card on Chain (if spell) or battlefield (if permanent)
      const isPermanent = this.isPermanent(card);

      if (isPermanent) {
        // Permanents (Unit/Gear) go directly to battlefield
        // They don't give priority before resolution
        this.putPermanentInPlay(game, card);

      } else {
        // Spells go on Chain
        // TODO: Add to Chain when GameChain is implemented
        // For now, resolve immediately
        this.resolveSpell(game, card);
      }

      return this.executionSuccess(sideEffects, {
        cardPlayed: card.instanceId,
        isPermanent,
      });

    } catch (error) {
      return this.executionFailure(error as Error);
    }
  }

  /**
   * Validate timing based on card keywords and turn state.
   *
   * @private
   */
  private validateTiming(game: Game, card: GameCard): ActionValidationResult {
    const turnState = (game as any).turnState as TurnState;
    const cardTiming = this.getCardTiming(card);
    const isActivePlayer = (game as any).activePlayer?.id === this.controller.id;

    // Default timing: Only Neutral Open in own turn
    if (cardTiming === CardTiming.DEFAULT) {
      if (turnState !== TurnState.NEUTRAL_OPEN || !isActivePlayer) {
        return this.validationFailure(
          'Card can only be played during your Action Phase (Neutral Open)',
          { cardTiming, turnState }
        );
      }
    }

    // Action timing: Neutral Open OR Showdown (Open/Closed)
    if (cardTiming === CardTiming.ACTION) {
      if (
        turnState !== TurnState.NEUTRAL_OPEN &&
        turnState !== TurnState.SHOWDOWN_OPEN &&
        turnState !== TurnState.SHOWDOWN_CLOSED
      ) {
        return this.validationFailure(
          'Action cards can only be played during Neutral Open or Showdowns',
          { cardTiming, turnState }
        );
      }
    }

    // Reaction timing: Always allowed
    // (no restrictions)

    return this.validationSuccess();
  }

  /**
   * Get card timing from keywords.
   *
   * @private
   */
  private getCardTiming(card: GameCard): CardTiming {
    const keywords = (card as any).keywords || [];

    if (keywords.includes('Reaction')) {
      return CardTiming.REACTION;
    }
    if (keywords.includes('Action')) {
      return CardTiming.ACTION;
    }
    return CardTiming.DEFAULT;
  }

  /**
   * Validate targets are legal.
   *
   * @private
   */
  private validateTargets(
    game: Game,
    card: GameCard,
    targets?: any[]
  ): ActionValidationResult {
    // TODO: Implement target validation based on card script
    // For now, accept any targets
    return this.validationSuccess();
  }

  /**
   * Validate costs can be paid.
   *
   * @private
   */
  private validateCosts(game: Game, card: GameCard): ActionValidationResult {
    const runePool = (this.controller as any).runePool || { energy: 0, power: {} };
    const cost = (card as any).cost || { energy: 0, power: {} };

    // Check Energy
    if (cost.energy > runePool.energy) {
      return this.validationFailure('Insufficient Energy', {
        required: cost.energy,
        available: runePool.energy,
      });
    }

    // Check Power
    if (cost.power) {
      for (const [domain, amount] of Object.entries(cost.power)) {
        const available = runePool.power[domain] || 0;
        if ((amount as number) > available) {
          return this.validationFailure(`Insufficient ${domain} Power`, {
            required: amount,
            available,
          });
        }
      }
    }

    return this.validationSuccess();
  }

  /**
   * Pay costs for the card.
   *
   * @private
   */
  private payCosts(game: Game, card: GameCard): void {
    const runePool = (this.controller as any).runePool;
    const cost = (card as any).cost || { energy: 0, power: {} };

    // Pay Energy
    runePool.energy -= cost.energy || 0;

    // Pay Power
    if (cost.power) {
      for (const [domain, amount] of Object.entries(cost.power)) {
        runePool.power[domain] -= amount as number;
      }
    }
  }

  /**
   * Check if card is a permanent (Unit/Gear).
   *
   * @private
   */
  private isPermanent(card: GameCard): boolean {
    const cardType = (card as any).type;
    return cardType === 'unit' || cardType === 'gear';
  }

  /**
   * Put permanent into play.
   *
   * @private
   */
  private putPermanentInPlay(game: Game, card: GameCard): void {
    const cardType = (card as any).type;

    if (cardType === 'unit') {
      // Units go to Base by default
      const player = this.controller as any;
      if (!player.base) {
        player.base = { units: [] };
      }
      if (!player.base.units) {
        player.base.units = [];
      }
      player.base.units.push(card);

    } else if (cardType === 'gear') {
      // Gears go to gear zone
      const player = this.controller as any;
      if (!player.gears) {
        player.gears = [];
      }
      player.gears.push(card);
    }
  }

  /**
   * Resolve spell effect.
   *
   * @private
   */
  private resolveSpell(game: Game, card: GameCard): void {
    // TODO: Execute card script
    // For now, just move to trash
    const player = this.controller as any;
    if (!player.trash) {
      player.trash = [];
    }
    player.trash.push(card);
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'play_card' as any,
      timestamp: this.timestamp,
      data: {
        card: this.data.card.instanceId,
        cardId: (this.data.card as any).cardId,
        controller: this.controller.id,
        targets: this.data.targets,
      },
    };
  }

  clone(): PlayCardAction {
    const cloned = new PlayCardAction(
      this.controller,
      { ...this.data },
      this.source
    );
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  getDescription(): string {
    const cardName = (this.data.card as any).cardId || 'Card';
    return `${this.controller.name} plays ${cardName}`;
  }
}
