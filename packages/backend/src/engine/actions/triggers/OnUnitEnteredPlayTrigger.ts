/**
 * OnUnitEnteredPlayTrigger - Triggers when units enter play (Board zone)
 *
 * Common use cases:
 * - "When a unit enters play, draw a card"
 * - "When you play a Fury unit, deal 1 damage to target"
 * - "Whenever an enemy unit enters, gain 1 energy"
 *
 * Example from card script:
 * ```typescript
 * onPlay: (ctx) => {
 *   ctx.triggerRegistry.register('play_card', new OnUnitEnteredPlayTrigger({
 *     sourceCard: ctx.self,
 *     filter: (playedCard, game) => {
 *       // Only when you play Fury units
 *       return playedCard.cardType === 'UNIT' &&
 *              playedCard.controllerId === ctx.controller.id &&
 *              playedCard.domains?.includes('fury');
 *     },
 *     onTrigger: async (playedCard, game) => {
 *       // Deal 1 damage to enemy champion
 *       const opponent = getOpponent(game, ctx.controller.id);
 *       const champion = findChampion(opponent);
 *       return [
 *         new DealDamageAction(ctx.controller, {
 *           target: champion,
 *           amount: 1,
 *           damageType: 'effect',
 *         })
 *       ];
 *     },
 *   }))
 * }
 * ```
 */

import { ActionTrigger } from '../base/ActionTrigger';
import { PlayCardAction } from '../concrete/PlayCardAction';
import type { GameAction } from '../base/GameAction';
import type { Game, GameCard } from '../../../types/game';
import type { GameActionType } from '../../../types/actions';

export interface OnUnitEnteredPlayTriggerConfig {
  /**
   * Source card that created this trigger
   */
  sourceCard?: GameCard;

  /**
   * Filter function to determine if this trigger should fire
   * Return true to fire the trigger for this card
   */
  filter?: (playedCard: GameCard, game: Game) => boolean;

  /**
   * Callback that fires when trigger activates
   * Returns array of new actions to execute
   */
  onTrigger: (playedCard: GameCard, game: Game) => Promise<GameAction[]> | GameAction[];

  /**
   * Maximum number of times this trigger can fire
   * undefined = unlimited
   */
  maxTriggers?: number;

  /**
   * Should this trigger only fire once?
   * Convenience for maxTriggers: 1
   */
  oneShot?: boolean;

  /**
   * Expiration condition
   */
  expiresWhen?: (game: Game) => boolean;

  /**
   * Priority for trigger execution (higher = fires first)
   * Default: 0
   */
  priority?: number;
}

export class OnUnitEnteredPlayTrigger extends ActionTrigger {
  public readonly type: string = 'unit_entered_play';
  public readonly priority: number;

  private filterFn: ((playedCard: GameCard, game: Game) => boolean) | undefined;
  private onTriggerFn: (playedCard: GameCard, game: Game) => Promise<GameAction[]> | GameAction[];
  private maxTriggers: number | undefined;
  private expiresWhenFn: ((game: Game) => boolean) | undefined;

  constructor(config: OnUnitEnteredPlayTriggerConfig) {
    super(config.sourceCard);
    this.filterFn = config.filter;
    this.onTriggerFn = config.onTrigger;
    this.maxTriggers = config.oneShot ? 1 : config.maxTriggers;
    this.expiresWhenFn = config.expiresWhen;
    this.priority = config.priority ?? 0;
  }

  async onAction(action: GameAction, game: Game): Promise<GameAction[]> {
    // Only trigger on PlayCardAction
    if (!(action instanceof PlayCardAction)) {
      return [];
    }

    const playedCard = action.data.card;

    // Only trigger for units (not Gear/Spell)
    const cardType = (playedCard as any).type;
    if (cardType !== 'unit') {
      return [];
    }

    // Check max triggers
    if (this.maxTriggers !== undefined && this.getFireCount() >= this.maxTriggers) {
      return [];
    }

    // Check filter
    if (this.filterFn && !this.filterFn(playedCard, game)) {
      return [];
    }

    // Execute trigger callback
    const generatedActions = await this.onTriggerFn(playedCard, game);

    // Mark trigger as fired
    this.markFired();

    return generatedActions;
  }

  isActive(game: Game): boolean {
    // Check max triggers
    if (this.maxTriggers !== undefined && this.getFireCount() >= this.maxTriggers) {
      return false;
    }

    // Check expiration
    if (this.expiresWhenFn && this.expiresWhenFn(game)) {
      return false;
    }

    return true;
  }

  getDescription(): string {
    let desc = 'When a unit enters play';

    if (this.maxTriggers !== undefined) {
      desc += ` (${this.getFireCount()}/${this.maxTriggers} triggers)`;
    }

    return desc;
  }
}
