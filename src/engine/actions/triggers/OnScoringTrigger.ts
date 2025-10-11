/**
 * OnScoringTrigger - Triggers when a player scores points
 *
 * Common use cases:
 * - "When you score, draw a card"
 * - "When an opponent scores, gain 2 energy"
 * - "When you Conquer a battlefield, ready all your units"
 *
 * Scoring in Riftbound:
 * - Hold: Control battlefield during Beginning Phase (Scoring Step)
 * - Conquer: Gain control of battlefield that wasn't controlled during Beginning Phase
 *
 * Example from card script:
 * ```typescript
 * onPlay: (ctx) => {
 *   ctx.triggerRegistry.register('scoring', new OnScoringTrigger({
 *     sourceCard: ctx.self,
 *     filter: (scoringData, game) => {
 *       // Only when you score (Hold or Conquer)
 *       return scoringData.playerId === ctx.controller.id;
 *     },
 *     onTrigger: async (scoringData, game) => {
 *       // Draw a card when you score
 *       return [
 *         new DrawCardAction(ctx.controller, {
 *           count: 1,
 *           fromZone: 'mainDeck',
 *           toZone: 'hand',
 *         })
 *       ];
 *     },
 *   }))
 * }
 * ```
 */

import { ActionTrigger } from '../base/ActionTrigger';
import type { GameAction } from '../base/GameAction';
import type { Game, GameCard, Battlefield } from '../../../types/game';
import type { GameActionType } from '../../../types/actions';

export type ScoringMethod = 'hold' | 'conquer';

export interface ScoringData {
  /**
   * Player who scored
   */
  playerId: string;

  /**
   * Battlefield that was scored
   */
  battlefield: Battlefield;

  /**
   * How the score was achieved
   */
  method: ScoringMethod;

  /**
   * Points awarded (usually 1, or 0 for Final Point special cases)
   */
  pointsAwarded: number;

  /**
   * Whether this was the Final Point (8th point)
   */
  isFinalPoint: boolean;
}

export interface OnScoringTriggerConfig {
  /**
   * Source card that created this trigger
   */
  sourceCard?: GameCard;

  /**
   * Filter function to determine if this trigger should fire
   * Return true to fire the trigger for this scoring event
   */
  filter?: (scoringData: ScoringData, game: Game) => boolean;

  /**
   * Callback that fires when trigger activates
   * Returns array of new actions to execute
   */
  onTrigger: (scoringData: ScoringData, game: Game) => Promise<GameAction[]> | GameAction[];

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

export class OnScoringTrigger extends ActionTrigger {
  public readonly type: string = 'scoring';
  public readonly priority: number;

  private filterFn: ((scoringData: ScoringData, game: Game) => boolean) | undefined;
  private onTriggerFn: (scoringData: ScoringData, game: Game) => Promise<GameAction[]> | GameAction[];
  private maxTriggers: number | undefined;
  private expiresWhenFn: ((game: Game) => boolean) | undefined;

  constructor(config: OnScoringTriggerConfig) {
    super(config.sourceCard);
    this.filterFn = config.filter;
    this.onTriggerFn = config.onTrigger;
    this.maxTriggers = config.oneShot ? 1 : config.maxTriggers;
    this.expiresWhenFn = config.expiresWhen;
    this.priority = config.priority ?? 0;
  }

  async onAction(action: GameAction, game: Game): Promise<GameAction[]> {
    // Scoring events are not actions in the V3 system yet
    // This trigger would be manually invoked by ScoringManager
    // when scoring occurs

    // For now, return empty array
    // In full implementation, this would check action.type === 'scoring'
    return [];
  }

  /**
   * Manual trigger invocation for scoring events
   * Called by ScoringManager when scoring occurs
   */
  async triggerScoring(scoringData: ScoringData, game: Game): Promise<GameAction[]> {
    // Check max triggers
    if (this.maxTriggers !== undefined && this.getFireCount() >= this.maxTriggers) {
      return [];
    }

    // Check filter
    if (this.filterFn && !this.filterFn(scoringData, game)) {
      return [];
    }

    // Execute trigger callback
    const generatedActions = await this.onTriggerFn(scoringData, game);

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
    let desc = 'When a player scores';

    if (this.maxTriggers !== undefined) {
      desc += ` (${this.getFireCount()}/${this.maxTriggers} triggers)`;
    }

    return desc;
  }
}
