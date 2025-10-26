/**
 * DamageModifier - Modifies damage dealt by DealDamageAction
 *
 * Common use cases:
 * - "Your spells deal +1 damage"
 * - "Reduce combat damage by 2"
 * - "Double all damage to units"
 *
 * Example from card script:
 * ```typescript
 * onPlay: (ctx) => {
 *   ctx.modifierRegistry.register('deal_damage', new DamageModifier({
 *     sourceCard: ctx.self,
 *     damageModification: 2, // +2 damage
 *     filter: (action) => action.data.damageType === 'spell',
 *     maxUses: 3,
 *   }));
 * }
 * ```
 */

import { ActionModifier } from '../base/ActionModifier';
import { DealDamageAction } from '../concrete/DealDamageAction';
import type { GameAction } from '../base/GameAction';
import type { Game, GameCard } from '../../../types/game';
import { GameActionType, TimingLayer } from '../../../types/actions';

export interface DamageModifierConfig {
  /**
   * Source card that created this modifier
   */
  sourceCard?: GameCard;

  /**
   * Damage modification amount
   * - Positive values increase damage
   * - Negative values reduce damage (minimum 0)
   */
  damageModification: number;

  /**
   * Optional multiplier for damage
   * - 2.0 = double damage
   * - 0.5 = half damage
   * Applied AFTER damageModification
   */
  damageMultiplier?: number;

  /**
   * Filter function to determine if this modifier applies
   * Return true to apply the modifier to this action
   */
  filter?: (action: DealDamageAction, game: Game) => boolean;

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

export class DamageModifier extends ActionModifier {
  public readonly targetActionType: GameActionType = GameActionType.DEAL_DAMAGE;
  public readonly type: string = 'damage_modification';
  public readonly timingLayer: TimingLayer = TimingLayer.DAMAGE_MODIFICATION;
  public readonly priority: number;

  private damageModification: number;
  private damageMultiplier: number;
  private filterFn: ((action: DealDamageAction, game: Game) => boolean) | undefined;
  private maxUses: number | undefined;
  private expiresWhenFn: ((game: Game) => boolean) | undefined;

  constructor(config: DamageModifierConfig) {
    super(config.sourceCard);
    this.damageModification = config.damageModification;
    this.damageMultiplier = config.damageMultiplier ?? 1.0;
    this.filterFn = config.filter;
    this.maxUses = config.maxUses;
    this.expiresWhenFn = config.expiresWhen;
    this.priority = config.priority ?? 0;
  }

  async modify(action: GameAction, game: Game): Promise<GameAction | null> {
    // Type guard - only modify DealDamageAction
    if (!(action instanceof DealDamageAction)) {
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
    const originalAmount = action.data.amount;
    let newAmount = originalAmount + this.damageModification;
    newAmount = newAmount * this.damageMultiplier;
    newAmount = Math.max(0, Math.floor(newAmount)); // Minimum 0, round down

    // Mark this modifier as used
    this.markUsed();

    // Create modified action
    return new DealDamageAction(
      action.controller,
      {
        ...action.data,
        amount: newAmount,
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
    const modStr = this.damageModification >= 0
      ? `+${this.damageModification}`
      : `${this.damageModification}`;

    let desc = `Modify damage by ${modStr}`;

    if (this.damageMultiplier !== 1.0) {
      desc += `, then multiply by ${this.damageMultiplier}x`;
    }

    if (this.maxUses !== undefined) {
      desc += ` (${this.currentUses}/${this.maxUses} uses)`;
    }

    return desc;
  }
}
