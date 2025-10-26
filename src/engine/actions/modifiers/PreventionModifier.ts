/**
 * PreventionModifier - Prevents actions from executing
 *
 * Common use cases:
 * - "Prevent all damage to your units"
 * - "Cards cannot be played this turn"
 * - "Units cannot move to battlefields"
 *
 * Example from card script:
 * ```typescript
 * onPlay: (ctx) => {
 *   // Prevent all damage to your Champion this turn
 *   ctx.modifierRegistry.register('deal_damage', new PreventionModifier({
 *     sourceCard: ctx.self,
 *     filter: (action, game) => {
 *       if (!(action instanceof DealDamageAction)) return false;
 *       const target = action.data.target;
 *       return target.instanceId === ctx.champion.instanceId;
 *     },
 *     expiresWhen: (game) => game.turnPhase === 'END_OF_TURN',
 *   }));
 * }
 * ```
 */

import { ActionModifier } from '../base/ActionModifier';
import type { GameAction } from '../base/GameAction';
import type { Game, GameCard } from '../../../types/game';
import type { GameActionType } from '../../../types/actions';
import { TimingLayer } from '../../../types/actions';

export interface PreventionModifierConfig {
  /**
   * Source card that created this modifier
   */
  sourceCard?: GameCard;

  /**
   * Filter function to determine which actions to prevent
   * Return true to prevent this action
   */
  filter?: (action: GameAction<any>, game: Game) => boolean;

  /**
   * Target action types to prevent (if undefined, applies to all)
   */
  targetActionTypes?: GameActionType[];

  /**
   * Custom prevention message
   */
  preventionMessage?: string;

  /**
   * Expiration condition
   */
  expiresWhen?: (game: Game) => boolean;

  /**
   * Maximum number of actions this can prevent
   */
  maxPrevents?: number;

  /**
   * Should this modifier only prevent once?
   */
  oneShot?: boolean;

  /**
   * Priority for modifier execution (higher = fires first)
   * Default: 100 (apply before all other modifiers)
   */
  priority?: number;
}

export class PreventionModifier extends ActionModifier {
  public readonly type: string = 'prevention';
  public readonly timingLayer: TimingLayer = TimingLayer.PREVENTION;
  public readonly priority: number;

  private filterFn: ((action: GameAction<any>, game: Game) => boolean) | undefined;
  private targetActionTypes: GameActionType[] | undefined;
  private preventionMessage: string;
  private expiresWhenFn: ((game: Game) => boolean) | undefined;
  private maxPrevents: number | undefined;

  constructor(config: PreventionModifierConfig) {
    super(config.sourceCard);
    this.filterFn = config.filter;
    this.targetActionTypes = config.targetActionTypes;
    this.preventionMessage = config.preventionMessage ?? 'Action prevented by modifier';
    this.expiresWhenFn = config.expiresWhen;
    this.maxPrevents = config.oneShot ? 1 : config.maxPrevents;
    this.priority = config.priority ?? 100;
  }

  async modify(action: GameAction, game: Game): Promise<GameAction | null> {
    // Check max prevents
    if (this.maxPrevents !== undefined && this.currentUses >= this.maxPrevents) {
      return action;
    }

    // Check target action types
    if (this.targetActionTypes && !this.targetActionTypes.includes(action.type)) {
      return action;
    }

    // Check filter
    if (this.filterFn && !this.filterFn(action, game)) {
      return action;
    }

    // Mark as used
    this.markUsed();

    // Return null to prevent the action
    // The ActionExecutor will handle null as "action prevented"
    return null;
  }

  isActive(game: Game): boolean {
    // Check max prevents
    if (this.maxPrevents !== undefined && this.currentUses >= this.maxPrevents) {
      return false;
    }

    // Check expiration
    if (this.expiresWhenFn && this.expiresWhenFn(game)) {
      return false;
    }

    return true;
  }

  getDescription(): string {
    let desc = 'Prevent actions';

    if (this.targetActionTypes && this.targetActionTypes.length > 0) {
      desc += ` (${this.targetActionTypes.join(', ')})`;
    }

    if (this.maxPrevents !== undefined) {
      desc += ` (${this.currentUses}/${this.maxPrevents} prevents)`;
    }

    return desc;
  }

  getPreventionMessage(): string {
    return this.preventionMessage;
  }

  getTargetActionTypes(): GameActionType[] | undefined {
    return this.targetActionTypes;
  }
}
