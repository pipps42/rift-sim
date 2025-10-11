/**
 * OnDamageDealtTrigger - Triggers when damage is dealt
 *
 * Common use cases:
 * - "Whenever this unit deals damage, draw a card"
 * - "When you deal spell damage, gain 1 energy"
 * - "After dealing combat damage, ready this unit"
 *
 * Example from card script:
 * ```typescript
 * onPlay: (ctx) => {
 *   ctx.triggerRegistry.register('deal_damage', new OnDamageDealtTrigger({
 *     sourceCard: ctx.self,
 *     filter: (action, game) => {
 *       // Only when this specific card deals damage
 *       return action.source?.instanceId === ctx.self.instanceId;
 *     },
 *     onTrigger: async (action, game) => {
 *       // Draw a card when this unit deals damage
 *       return [
 *         new DrawCardAction(ctx.controller, {
 *           count: 1,
 *           fromZone: 'mainDeck',
 *           toZone: 'hand',
 *         })
 *       ];
 *     },
 *   }));
 * }
 * ```
 */

import { ActionTrigger } from '../base/ActionTrigger';
import { DealDamageAction } from '../concrete/DealDamageAction';
import type { GameAction } from '../base/GameAction';
import type { Game, GameCard } from '../../../types/game';
import { GameActionType, TriggerPriority } from '../../../types/actions';

export interface OnDamageDealtTriggerConfig {
  /**
   * Source card that created this trigger
   */
  sourceCard?: GameCard;

  /**
   * Filter function to determine if this trigger should fire
   * Return true to fire the trigger for this action
   */
  filter?: (action: DealDamageAction, game: Game) => boolean;

  /**
   * Callback that fires when trigger activates
   * Returns array of new actions to execute
   */
  onTrigger: (action: DealDamageAction, game: Game) => Promise<GameAction[]> | GameAction[];

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

export class OnDamageDealtTrigger extends ActionTrigger {
  public readonly targetActionType: GameActionType = GameActionType.DEAL_DAMAGE;
  public readonly type: string = 'on_damage_dealt';
  public readonly priority: TriggerPriority;

  private filterFn: ((action: DealDamageAction, game: Game) => boolean) | undefined;
  private onTriggerFn: (action: DealDamageAction, game: Game) => Promise<GameAction[]> | GameAction[];
  private maxTriggers: number | undefined;
  private expiresWhenFn: ((game: Game) => boolean) | undefined;

  constructor(config: OnDamageDealtTriggerConfig) {
    super(config.sourceCard, config.oneShot);
    this.filterFn = config.filter;
    this.onTriggerFn = config.onTrigger;
    this.maxTriggers = config.oneShot ? 1 : config.maxTriggers;
    this.expiresWhenFn = config.expiresWhen;
    this.priority = (config.priority ?? 0) as TriggerPriority;
  }

  async onAction(action: GameAction, game: Game): Promise<GameAction[]> {
    // Type guard - only trigger on DealDamageAction
    if (!(action instanceof DealDamageAction)) {
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
    // Type guard - only trigger on DealDamageAction
    if (!(action instanceof DealDamageAction)) {
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
    if (!(action instanceof DealDamageAction)) {
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
    let desc = 'When damage is dealt';

    if (this.maxTriggers !== undefined) {
      desc += ` (${this.getFireCount()}/${this.maxTriggers} triggers)`;
    }

    return desc;
  }
}
