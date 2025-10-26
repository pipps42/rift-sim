/**
 * MightModifier - Modifies unit Might values
 *
 * Common use cases:
 * - "Your units get +1 Might"
 * - "Target unit gets -2 Might until end of turn"
 * - "While you control 3+ units, they get +1/+1"
 *
 * NOTE: This is different from keyword-based Might modifications (Assault, Shield).
 * This affects base Might values or creates ongoing effects.
 *
 * Example from card script:
 * ```typescript
 * onPlay: (ctx) => {
 *   // All your units get +1 Might this turn
 *   ctx.modifierRegistry.register('deal_damage', new MightModifier({
 *     sourceCard: ctx.self,
 *     mightModification: 1,
 *     filter: (action, game) => {
 *       if (!(action instanceof DealDamageAction)) return false;
 *       const source = action.source;
 *       return source?.controllerId === ctx.controller.id;
 *     },
 *     expiresWhen: (game) => game.turnPhase === 'END_OF_TURN',
 *   }));
 * }
 * ```
 */

import { ActionModifier } from '../base/ActionModifier';
import { DealDamageAction } from '../concrete/DealDamageAction';
import type { GameAction } from '../base/GameAction';
import type { Game, GameCard } from '../../../types/game';
import type { GameActionType } from '../../../types/actions';
import { TimingLayer } from '../../../types/actions';

export type MightModification = number | { multiply: number } | ((currentMight: number, game: Game) => number);

export interface MightModifierConfig {
  /**
   * Source card that created this modifier
   */
  sourceCard?: GameCard;

  /**
   * Might modification to apply
   * - number: add/subtract Might (e.g., +2 or -1)
   * - {multiply: X}: multiply Might by X
   * - function: calculate based on current Might
   */
  mightModification: MightModification;

  /**
   * Filter function to determine which actions to modify
   * Typically filters for DealDamageAction with source being a unit
   */
  filter?: (action: GameAction<any>, game: Game) => boolean;

  /**
   * Expiration condition
   */
  expiresWhen?: (game: Game) => boolean;

  /**
   * Maximum number of times this can apply
   */
  maxUses?: number;

  /**
   * Should this modifier only apply once?
   */
  oneShot?: boolean;

  /**
   * Priority for modifier execution (higher = fires first)
   * Default: 10 (apply before damage modifiers)
   */
  priority?: number;
}

export class MightModifier extends ActionModifier {
  public readonly type: string = 'might_modification';
  public readonly timingLayer: TimingLayer = TimingLayer.STAT_MODIFICATION;
  public readonly priority: number;

  private mightModification: MightModification;
  private filterFn: ((action: GameAction<any>, game: Game) => boolean) | undefined;
  private expiresWhenFn: ((game: Game) => boolean) | undefined;
  private maxUses: number | undefined;

  constructor(config: MightModifierConfig) {
    super(config.sourceCard);
    this.mightModification = config.mightModification;
    this.filterFn = config.filter;
    this.expiresWhenFn = config.expiresWhen;
    this.maxUses = config.oneShot ? 1 : config.maxUses;
    this.priority = config.priority ?? 10;
  }

  async modify(action: GameAction, game: Game): Promise<GameAction | null> {
    // Only apply to DealDamageAction
    if (!(action instanceof DealDamageAction)) {
      return action;
    }

    // Check max uses
    if (this.maxUses !== undefined && this.currentUses >= this.maxUses) {
      return action;
    }

    // Check filter
    if (this.filterFn && !this.filterFn(action, game)) {
      return action;
    }

    // Get current damage amount (represents Might in combat)
    const currentAmount = action.data.amount;
    let newAmount: number;

    // Apply modification
    if (typeof this.mightModification === 'number') {
      // Simple addition/subtraction
      newAmount = Math.max(0, currentAmount + this.mightModification);
    } else if (typeof this.mightModification === 'object' && 'multiply' in this.mightModification) {
      // Multiplication
      newAmount = Math.max(0, Math.floor(currentAmount * this.mightModification.multiply));
    } else if (typeof this.mightModification === 'function') {
      // Custom function
      newAmount = Math.max(0, this.mightModification(currentAmount, game));
    } else {
      newAmount = currentAmount;
    }

    // Create modified action
    const modifiedAction = new DealDamageAction(
      action.controller,
      {
        ...action.data,
        amount: newAmount,
      },
      action.source
    );

    // Preserve metadata
    modifiedAction.metadata = { ...action.metadata };

    // Mark as used
    this.markUsed();

    return modifiedAction;
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
    let modStr: string;

    if (typeof this.mightModification === 'number') {
      modStr = this.mightModification >= 0 ? `+${this.mightModification}` : `${this.mightModification}`;
    } else if (typeof this.mightModification === 'object' && 'multiply' in this.mightModification) {
      modStr = `×${this.mightModification.multiply}`;
    } else {
      modStr = 'dynamic';
    }

    let desc = `Modify Might by ${modStr}`;

    if (this.maxUses !== undefined) {
      desc += ` (${this.currentUses}/${this.maxUses} uses)`;
    }

    return desc;
  }

  getMightModification(): MightModification {
    return this.mightModification;
  }
}
