/**
 * OnMoveCompleteTrigger - Triggers when a unit completes movement
 *
 * From RULES.md:
 * - After a move is complete, a Cleanup is performed
 * - This can trigger Showdown (if battlefield becomes Contested)
 * - Or Combat (if battlefield has units from 2 opposing players)
 *
 * Common use cases:
 * - "When this unit moves, deal 1 damage to all enemy units at the destination"
 * - "After moving to a battlefield, draw a card"
 * - "When this unit arrives at a battlefield, gain +1 Might"
 *
 * Example from card script:
 * ```typescript
 * onPlay: (ctx) => {
 *   ctx.triggers.onMoveComplete({
 *     filter: (moveData) => {
 *       // Only when this specific unit moves
 *       return moveData.movedCard.instanceId === ctx.self.instanceId;
 *     },
 *     effect: async (moveData) => {
 *       // Deal 1 damage to all enemy units at destination
 *       const enemies = getEnemyUnitsAt(moveData.destination, game);
 *       for (const enemy of enemies) {
 *         await ctx.actions.dealDamage(enemy, 1, 'effect');
 *       }
 *     }
 *   });
 * }
 * ```
 */

import { ActionTrigger } from '../base/ActionTrigger';
import type { GameAction } from '../base/GameAction';
import type { Game, GameCard } from '../../../types/game';
import { GameActionType, TriggerPriority } from '../../../types/actions';
import type { MoveUnitAction } from '../concrete/MoveUnitAction';

export interface MoveCompleteData {
  /**
   * Card that moved
   */
  movedCard: GameCard;

  /**
   * Source location (base or battlefield ID)
   */
  from: string;

  /**
   * Destination location (base or battlefield ID)
   */
  to: string;

  /**
   * Player who controlled the move
   */
  controllerId: string;
}

export interface OnMoveCompleteTriggerConfig {
  /**
   * Source card that created this trigger
   */
  sourceCard?: GameCard;

  /**
   * Filter function to determine if this trigger should fire
   * Return true to fire the trigger for this move
   */
  filter?: (moveData: MoveCompleteData, game: Game) => boolean;

  /**
   * Callback that fires when trigger activates
   * Returns array of new actions to execute
   */
  onTrigger: (moveData: MoveCompleteData, game: Game) => Promise<GameAction[]> | GameAction[];

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

export class OnMoveCompleteTrigger extends ActionTrigger {
  public readonly targetActionType: GameActionType = GameActionType.MOVE_UNIT;
  public readonly type: string = 'on_move_complete';
  public readonly priority: TriggerPriority;

  private filterFn: ((moveData: MoveCompleteData, game: Game) => boolean) | undefined;
  private onTriggerFn: (moveData: MoveCompleteData, game: Game) => Promise<GameAction[]> | GameAction[];
  private maxTriggers: number | undefined;
  private expiresWhenFn: ((game: Game) => boolean) | undefined;

  constructor(config: OnMoveCompleteTriggerConfig) {
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

    // Verify this is a MoveUnitAction
    if (action.type !== GameActionType.MOVE_UNIT) {
      return [];
    }

    const moveAction = action as MoveUnitAction;
    const moveData: MoveCompleteData = {
      movedCard: moveAction.data.unit,
      from: 'unknown', // MoveUnitAction doesn't track source, only destination
      to: moveAction.data.destination.type === 'base'
        ? 'base'
        : moveAction.data.destination.battlefieldId || 'battlefield',
      controllerId: moveAction.controller.id,
    };

    // Apply filter
    if (this.filterFn && !this.filterFn(moveData, game)) {
      return [];
    }

    // Fire trigger
    const generatedActions = await Promise.resolve(this.onTriggerFn(moveData, game));
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
    return `On move complete trigger${this.sourceCard ? ` from ${this.sourceCard.cardId}` : ''}`;
  }
}
