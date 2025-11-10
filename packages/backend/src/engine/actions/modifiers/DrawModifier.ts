/**
 * DrawModifier - Modifies the number of cards drawn
 *
 * Common use cases:
 * - "Whenever you would draw a card, draw 2 instead"
 * - "Draw 1 less card"
 * - "The first time you draw each turn, draw an extra card"
 *
 * Example from card script:
 * ```typescript
 * onPlay: (ctx) => {
 *   ctx.modifierRegistry.register('draw_card', new DrawModifier({
 *     sourceCard: ctx.self,
 *     countModification: 1, // Draw 1 extra
 *     filter: (action, game) => {
 *       // Only on your turn
 *       return game.players[game.currentPlayerIndex].id === action.controller.id;
 *     },
 *     expiresWhen: (game) => game.phase === GamePhase.ENDING,
 *   }));
 * }
 * ```
 */

import { ActionModifier } from '../base/ActionModifier';
import { DrawCardAction } from '../concrete/DrawCardAction';
import type { GameAction } from '../base/GameAction';
import type { Game, GameCard } from '../../../types/game';
import { GameActionType, TimingLayer } from '../../../types/actions';

export interface DrawModifierConfig {
  /**
   * Source card that created this modifier
   */
  sourceCard?: GameCard;

  /**
   * Number of cards modification
   * - Positive values increase draw count
   * - Negative values reduce draw count
   * Final count cannot go below 1
   */
  countModification?: number;

  /**
   * Multiplier for draw count
   * - 2.0 = double the draw
   * - 0 = prevent draw entirely
   * Applied AFTER countModification
   */
  countMultiplier?: number;

  /**
   * Filter function to determine if this modifier applies
   * Return true to apply the modifier to this action
   */
  filter?: (action: DrawCardAction, game: Game) => boolean;

  /**
   * Maximum number of times this modifier can be used
   * undefined = unlimited uses
   */
  maxUses?: number;

  /**
   * Expiration condition
   */
  expiresWhen?: (game: Game) => boolean;

  /**
   * Priority for modifier application (higher = applies first)
   * Default: 0
   */
  priority?: number;
}

export class DrawModifier extends ActionModifier {
  public readonly targetActionType: GameActionType = GameActionType.DRAW_CARD;
  public readonly type: string = 'draw_modification';
  public readonly timingLayer: TimingLayer = TimingLayer.DAMAGE_MODIFICATION;
  public readonly priority: number;

  private countModification: number;
  private countMultiplier: number;
  private filterFn: ((action: DrawCardAction, game: Game) => boolean) | undefined;
  private maxUses: number | undefined;
  private expiresWhenFn: ((game: Game) => boolean) | undefined;

  constructor(config: DrawModifierConfig) {
    super(config.sourceCard);
    this.countModification = config.countModification ?? 0;
    this.countMultiplier = config.countMultiplier ?? 1.0;
    this.filterFn = config.filter;
    this.maxUses = config.maxUses;
    this.expiresWhenFn = config.expiresWhen;
    this.priority = config.priority ?? 0;
  }

  async modify(action: GameAction, game: Game): Promise<GameAction | null> {
    // Type guard - only modify DrawCardAction
    if (!(action instanceof DrawCardAction)) {
      return action;
    }

    // Check filter
    if (this.filterFn && !this.filterFn(action, game)) {
      return action;
    }

    // Check max uses
    if (this.maxUses !== undefined && this.currentUses >= this.maxUses) {
      return action;
    }

    // Apply modification
    const originalCount = action.data.amount;
    let newCount = originalCount + this.countModification;
    newCount = newCount * this.countMultiplier;
    newCount = Math.max(1, Math.floor(newCount)); // Minimum 1, round down

    // If multiplier is 0, prevent the draw entirely
    if (this.countMultiplier === 0) {
      this.markUsed();
      return null; // Prevent the action
    }

    // Mark this modifier as used
    this.markUsed();

    // Create modified action
    return new DrawCardAction(
      action.controller,
      {
        ...action.data,
        amount: newCount,
      },
      action.source
    );
  }

  isActive(game: Game): boolean {
    // Check max uses
    if (this.maxUses !== undefined && this.currentUses >= this.maxUses) {
      return false;
    }

    // Check expiration
    if (this.expiresWhenFn && this.expiresWhenFn(game)) {
      return false;
    }

    return true;
  }

  getDescription(): string {
    const modStr = this.countModification >= 0
      ? `+${this.countModification}`
      : `${this.countModification}`;

    let desc = `Modify draw count by ${modStr}`;

    if (this.countMultiplier !== 1.0) {
      if (this.countMultiplier === 0) {
        desc = 'Prevent card draw';
      } else {
        desc += `, then multiply by ${this.countMultiplier}x`;
      }
    }

    if (this.maxUses !== undefined) {
      desc += ` (${this.currentUses}/${this.maxUses} uses)`;
    }

    return desc;
  }
}
