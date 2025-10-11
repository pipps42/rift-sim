/**
 * OnCardPlayedTrigger - Triggers when a card is played
 *
 * Common use cases:
 * - "Whenever you play a spell, deal 1 damage to target unit"
 * - "When your opponent plays a unit, draw a card"
 * - "After playing a card, reduce the cost of the next card by 1"
 *
 * Example from card script:
 * ```typescript
 * onPlay: (ctx) => {
 *   ctx.triggerRegistry.register('play_card', new OnCardPlayedTrigger({
 *     sourceCard: ctx.self,
 *     filter: (action, game) => {
 *       // Only when controller plays a spell
 *       const card = action.data.card;
 *       return action.controller.id === ctx.controller.id &&
 *              card.cardType === CardType.SPELL;
 *     },
 *     onTrigger: async (action, game) => {
 *       // Deal 1 damage when you play a spell
 *       const target = game.battlefields[0].units[0]; // Example target
 *       if (!target) return [];
 *
 *       return [
 *         new DealDamageAction(ctx.controller, {
 *           target,
 *           amount: 1,
 *           damageType: 'effect',
 *         })
 *       ];
 *     },
 *   }));
 * }
 * ```
 */

import { ActionTrigger } from '../base/ActionTrigger';
import { PlayCardAction } from '../concrete/PlayCardAction';
import type { GameAction } from '../base/GameAction';
import type { Game, GameCard } from '../../../types/game';
import { GameActionType, TriggerPriority } from '../../../types/actions';

export interface OnCardPlayedTriggerConfig {
  /**
   * Source card that created this trigger
   */
  sourceCard?: GameCard;

  /**
   * Filter function to determine if this trigger should fire
   * Return true to fire the trigger for this action
   */
  filter?: (action: PlayCardAction, game: Game) => boolean;

  /**
   * Callback that fires when trigger activates
   * Returns array of new actions to execute
   */
  onTrigger: (action: PlayCardAction, game: Game) => Promise<GameAction[]> | GameAction[];

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

export class OnCardPlayedTrigger extends ActionTrigger {
  public readonly targetActionType: GameActionType = GameActionType.PLAY_CARD;
  public readonly type: string = 'on_card_played';
  public readonly priority: TriggerPriority;

  private filterFn: ((action: PlayCardAction, game: Game) => boolean) | undefined;
  private onTriggerFn: (action: PlayCardAction, game: Game) => Promise<GameAction[]> | GameAction[];
  private maxTriggers: number | undefined;
  private expiresWhenFn: ((game: Game) => boolean) | undefined;

  constructor(config: OnCardPlayedTriggerConfig) {
    super(config.sourceCard, config.oneShot);
    this.filterFn = config.filter;
    this.onTriggerFn = config.onTrigger;
    this.maxTriggers = config.oneShot ? 1 : config.maxTriggers;
    this.expiresWhenFn = config.expiresWhen;
    this.priority = (config.priority ?? 0) as TriggerPriority;
  }

  async onAction(action: GameAction, game: Game): Promise<GameAction[]> {
    // Type guard - only trigger on PlayCardAction
    if (!(action instanceof PlayCardAction)) {
      return [];
    }

    // Check max triggers
    if (this.maxTriggers !== undefined && this.getFireCount() >= this.maxTriggers) {
      return [];
    }

    // Check filter
    if (this.filterFn && !this.filterFn(action, game)) {
      return [];
    }

    // Execute trigger callback
    const generatedActions = await this.onTriggerFn(action, game);

    // Mark trigger as fired
    this.markFired();

    return generatedActions;
  }

  async shouldTrigger(action: GameAction, game: Game): Promise<boolean> {
    // Type guard - only trigger on PlayCardAction
    if (!(action instanceof PlayCardAction)) {
      return false;
    }

    // Check max triggers
    if (this.maxTriggers !== undefined && this.getFireCount() >= this.maxTriggers) {
      return false;
    }

    // Check filter
    if (this.filterFn && !this.filterFn(action, game)) {
      return false;
    }

    return true;
  }

  async trigger(action: GameAction, game: Game): Promise<GameAction[]> {
    // Type guard (already checked in shouldTrigger, but TypeScript doesn't know)
    if (!(action instanceof PlayCardAction)) {
      return [];
    }

    // Execute trigger callback
    const generatedActions = await this.onTriggerFn(action, game);

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
    let desc = 'When a card is played';

    if (this.maxTriggers !== undefined) {
      desc += ` (${this.getFireCount()}/${this.maxTriggers} triggers)`;
    }

    return desc;
  }
}
