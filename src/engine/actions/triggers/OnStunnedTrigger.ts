/**
 * OnStunnedTrigger - Triggers when a unit is stunned
 *
 * From RULES.md:
 * - Stun is a status effect that prevents units from contributing damage in combat
 * - Stunned units don't contribute their Might during combat
 *
 * Common use cases:
 * - "When you stun an enemy unit, draw a card" (e.g., Yasuo-like effects)
 * - "When this unit is stunned, gain +1 Might"
 * - "After stunning a unit, deal 2 damage to it"
 *
 * Example from card script (Yasuo-like):
 * ```typescript
 * onPlay: (ctx) => {
 *   ctx.triggers.onStunned({
 *     filter: (stunData) => {
 *       // Only when we stun an enemy
 *       return stunData.stunner?.instanceId === ctx.self.instanceId &&
 *              stunData.target.controllerId !== ctx.owner.id;
 *     },
 *     effect: async (stunData) => {
 *       // Deal 2 damage to stunned enemy
 *       await ctx.actions.dealDamage(stunData.target, 2, 'effect');
 *     }
 *   });
 * }
 * ```
 */

import { ActionTrigger } from '../base/ActionTrigger';
import type { GameAction } from '../base/GameAction';
import type { Game, GameCard } from '../../../types/game';
import { GameActionType, TriggerPriority } from '../../../types/actions';
import type { StunUnitAction } from '../concrete/StunUnitAction';

export interface StunnedData {
  /**
   * Unit that was stunned
   */
  target: GameCard;

  /**
   * Card that caused the stun (if any)
   */
  stunner: GameCard | undefined;

  /**
   * Duration of the stun
   */
  duration: number;

  /**
   * Player who controlled the stun action
   */
  controllerId: string;
}

export interface OnStunnedTriggerConfig {
  /**
   * Source card that created this trigger
   */
  sourceCard?: GameCard;

  /**
   * Filter function to determine if this trigger should fire
   * Return true to fire the trigger for this stun
   */
  filter?: (stunData: StunnedData, game: Game) => boolean;

  /**
   * Callback that fires when trigger activates
   * Returns array of new actions to execute
   */
  onTrigger: (stunData: StunnedData, game: Game) => Promise<GameAction[]> | GameAction[];

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
   * Priority for trigger execution
   * Default: NORMAL (0)
   */
  priority?: number;
}

export class OnStunnedTrigger extends ActionTrigger {
  public readonly targetActionType: GameActionType = GameActionType.STUN_UNIT;
  public readonly type: string = 'on_stunned';
  public readonly priority: TriggerPriority;

  private filterFn: ((stunData: StunnedData, game: Game) => boolean) | undefined;
  private onTriggerFn: (stunData: StunnedData, game: Game) => Promise<GameAction[]> | GameAction[];
  private maxTriggers: number | undefined;
  private expiresWhenFn: ((game: Game) => boolean) | undefined;

  constructor(config: OnStunnedTriggerConfig) {
    super(config.sourceCard, config.oneShot);
    this.filterFn = config.filter;
    this.onTriggerFn = config.onTrigger;
    this.maxTriggers = config.oneShot ? 1 : config.maxTriggers;
    this.expiresWhenFn = config.expiresWhen;
    this.priority = (config.priority ?? TriggerPriority.NORMAL) as TriggerPriority;
  }

  async onAction(action: GameAction, game: Game): Promise<GameAction[]> {
    // Check if trigger has expired
    if (this.maxTriggers !== undefined && this.getFireCount() >= this.maxTriggers) {
      return [];
    }

    if (this.expiresWhenFn && this.expiresWhenFn(game)) {
      return [];
    }

    // Verify this is a StunUnitAction
    if (action.type !== GameActionType.STUN_UNIT) {
      return [];
    }

    const stunAction = action as StunUnitAction;
    const stunData: StunnedData = {
      target: stunAction.data.target,
      stunner: stunAction.source,
      duration: stunAction.data.duration,
      controllerId: stunAction.controller.id,
    };

    // Apply filter
    if (this.filterFn && !this.filterFn(stunData, game)) {
      return [];
    }

    // Fire trigger
    const generatedActions = await Promise.resolve(this.onTriggerFn(stunData, game));
    this.markFired();

    return generatedActions;
  }

  isActive(game: Game): boolean {
    if (this.maxTriggers !== undefined && this.getFireCount() >= this.maxTriggers) {
      return false;
    }

    if (this.expiresWhenFn && this.expiresWhenFn(game)) {
      return false;
    }

    // Check if source card is still in play
    if (this.sourceCard) {
      const sourceStillInPlay = this.isCardInPlay(this.sourceCard, game);
      if (!sourceStillInPlay) {
        return false;
      }
    }

    return true;
  }

  isExpired(): boolean {
    if (this.maxTriggers !== undefined && this.getFireCount() >= this.maxTriggers) {
      return true;
    }

    return false;
  }

  /**
   * Helper to check if a card is still in play
   */
  private isCardInPlay(card: GameCard, game: Game): boolean {
    // Check Base
    for (const player of game.players) {
      if (player.zones.base.some(c => c.instanceId === card.instanceId)) {
        return true;
      }
    }

    // Check Battlefields
    for (const bf of game.battlefields) {
      if (bf.units.some(u => u.instanceId === card.instanceId)) {
        return true;
      }
    }

    return false;
  }

  getDescription(): string {
    return `On stunned trigger${this.sourceCard ? ` from ${this.sourceCard.cardId}` : ''}`;
  }
}
