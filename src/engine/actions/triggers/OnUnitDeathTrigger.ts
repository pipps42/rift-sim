/**
 * OnUnitDeathTrigger - Triggers when a unit dies (damage >= might)
 *
 * Note: This trigger fires AFTER processDeaths() marks units as dead,
 * but before they are actually removed from the battlefield.
 *
 * Common use cases:
 * - "When this unit dies, deal 2 damage to all enemy units"
 * - "Whenever an enemy unit dies, gain 1 energy"
 * - "When a friendly unit dies, draw a card"
 *
 * Example from card script:
 * ```typescript
 * onPlay: (ctx) => {
 *   ctx.triggerRegistry.register('unit_death', new OnUnitDeathTrigger({
 *     sourceCard: ctx.self,
 *     filter: (deadUnit, game) => {
 *       // Only when this specific unit dies
 *       return deadUnit.instanceId === ctx.self.instanceId;
 *     },
 *     onTrigger: async (deadUnit, game) => {
 *       // Deal damage to all enemy units when this dies
 *       const enemyUnits = game.battlefields.flatMap(bf =>
 *         bf.units.filter(u => u.controllerId !== ctx.controller.id)
 *       );
 *
 *       return enemyUnits.map(target =>
 *         new DealDamageAction(ctx.controller, {
 *           target,
 *           amount: 2,
 *           damageType: 'effect',
 *         })
 *       );
 *     },
 *   }));
 * }
 * ```
 */

import { ActionTrigger } from '../base/ActionTrigger';
import type { GameAction } from '../base/GameAction';
import type { Game, GameCard } from '../../../types/game';
import { GameActionType, TriggerPriority } from '../../../types/actions';

export interface OnUnitDeathTriggerConfig {
  /**
   * Source card that created this trigger
   */
  sourceCard?: GameCard;

  /**
   * Filter function to determine if this trigger should fire
   * deadUnit is the unit that just died
   * Return true to fire the trigger
   */
  filter?: (deadUnit: GameCard, game: Game) => boolean;

  /**
   * Callback that fires when trigger activates
   * deadUnit is the unit that just died
   * Returns array of new actions to execute
   */
  onTrigger: (deadUnit: GameCard, game: Game) => Promise<GameAction[]> | GameAction[];

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

export class OnUnitDeathTrigger extends ActionTrigger {
  public readonly targetActionType: GameActionType = GameActionType.UNIT_DIES;
  public readonly type: string = 'on_unit_death';
  public readonly priority: TriggerPriority;

  private filterFn: ((deadUnit: GameCard, game: Game) => boolean) | undefined;
  private onTriggerFn: (deadUnit: GameCard, game: Game) => Promise<GameAction[]> | GameAction[];
  private maxTriggers: number | undefined;
  private expiresWhenFn: ((game: Game) => boolean) | undefined;

  constructor(config: OnUnitDeathTriggerConfig) {
    super(config.sourceCard, config.oneShot);
    this.filterFn = config.filter;
    this.onTriggerFn = config.onTrigger;
    this.maxTriggers = config.oneShot ? 1 : config.maxTriggers;
    this.expiresWhenFn = config.expiresWhen;
    this.priority = (config.priority ?? 0) as TriggerPriority;
  }

  /**
   * Standard onAction implementation (required by base class)
   * For unit deaths, this is not typically called - use triggerForDeath instead
   */
  async onAction(action: GameAction, game: Game): Promise<GameAction[]> {
    // This trigger is special - it doesn't respond to actions directly
    // It responds to unit death events which are handled separately
    return [];
  }

  /**
   * Special trigger for unit deaths
   * Instead of taking a GameAction, it takes the dead unit directly
   */
  async shouldTriggerForDeath(deadUnit: GameCard, game: Game): Promise<boolean> {
    // Check max triggers
    if (this.maxTriggers !== undefined && this.getFireCount() >= this.maxTriggers) {
      return false;
    }

    // Check filter
    if (this.filterFn && !this.filterFn(deadUnit, game)) {
      return false;
    }

    return true;
  }

  /**
   * Standard shouldTrigger for compatibility with ActionExecutor
   * This won't be called for death triggers, but required by interface
   */
  async shouldTrigger(action: GameAction, game: Game): Promise<boolean> {
    return false;
  }

  /**
   * Fire the trigger for a unit death
   */
  async triggerForDeath(deadUnit: GameCard, game: Game): Promise<GameAction[]> {
    // Execute trigger callback
    const generatedActions = await this.onTriggerFn(deadUnit, game);

    // Mark trigger as fired
    this.markFired();

    return generatedActions;
  }

  /**
   * Standard trigger for compatibility with ActionExecutor
   * This won't be called for death triggers, but required by interface
   */
  async trigger(action: GameAction, game: Game): Promise<GameAction[]> {
    return [];
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
    let desc = 'When a unit dies';

    if (this.maxTriggers !== undefined) {
      desc += ` (${this.getFireCount()}/${this.maxTriggers} triggers)`;
    }

    return desc;
  }
}
