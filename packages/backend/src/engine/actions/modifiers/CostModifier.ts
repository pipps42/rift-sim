/**
 * CostModifier - Modifies the cost of playing cards
 *
 * Common use cases:
 * - "Your spells cost 1 less"
 * - "The next card you play costs 2 less"
 * - "Cards cost 1 more for your opponent"
 *
 * Example from card script:
 * ```typescript
 * onPlay: (ctx) => {
 *   ctx.modifierRegistry.register('play_card', new CostModifier({
 *     sourceCard: ctx.self,
 *     energyCostModification: -1, // Reduce energy cost by 1
 *     filter: (action) => {
 *       const card = action.data.card;
 *       return card.cardType === CardType.SPELL;
 *     },
 *     maxUses: 1, // Only the next card
 *   }));
 * }
 * ```
 */

import { ActionModifier } from '../base/ActionModifier';
import { PlayCardAction } from '../concrete/PlayCardAction';
import type { GameAction } from '../base/GameAction';
import type { Game, GameCard } from '../../../types/game';
import { GameActionType, TimingLayer } from '../../../types/actions';

export interface CostModifierConfig {
  /**
   * Source card that created this modifier
   */
  sourceCard?: GameCard;

  /**
   * Energy cost modification
   * - Negative values reduce cost
   * - Positive values increase cost
   * Cost cannot go below 0
   */
  energyCostModification?: number;

  /**
   * Power cost modification (for rune-based costs)
   * - Negative values reduce cost
   * - Positive values increase cost
   * Cost cannot go below 0
   */
  powerCostModification?: number;

  /**
   * Filter function to determine if this modifier applies
   * Return true to apply the modifier to this action
   */
  filter?: (action: PlayCardAction, game: Game) => boolean;

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

export class CostModifier extends ActionModifier {
  public readonly targetActionType: GameActionType = GameActionType.PLAY_CARD;
  public readonly type: string = 'cost_modification';
  public readonly timingLayer: TimingLayer = TimingLayer.COST_MODIFICATION;
  public readonly priority: number;

  private energyCostModification: number;
  private powerCostModification: number;
  private filterFn: ((action: PlayCardAction, game: Game) => boolean) | undefined;
  private maxUses: number | undefined;
  private expiresWhenFn: ((game: Game) => boolean) | undefined;

  constructor(config: CostModifierConfig) {
    super(config.sourceCard);
    this.energyCostModification = config.energyCostModification ?? 0;
    this.powerCostModification = config.powerCostModification ?? 0;
    this.filterFn = config.filter;
    this.maxUses = config.maxUses;
    this.expiresWhenFn = config.expiresWhen;
    this.priority = config.priority ?? 0;
  }

  async modify(action: GameAction, game: Game): Promise<GameAction | null> {
    // Type guard - only modify PlayCardAction
    if (!(action instanceof PlayCardAction)) {
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

    // Apply cost modifications
    const originalEnergyCost = (action.data as any).energyCost ?? 0;
    const newEnergyCost = Math.max(0, originalEnergyCost + this.energyCostModification);

    // Mark this modifier as used
    this.markUsed();

    // Create modified action with updated costs
    const modifiedData: any = { ...action.data };
    if (this.energyCostModification !== 0) {
      modifiedData.energyCost = newEnergyCost;
    }
    // Note: powerCosts is an array of {domain, amount}, not a single number
    // Power cost modification would need to modify the powerCosts array
    if (this.powerCostModification !== 0 && modifiedData.powerCosts) {
      modifiedData.powerCosts = modifiedData.powerCosts.map((cost: any) => ({
        ...cost,
        amount: Math.max(0, cost.amount + this.powerCostModification)
      }));
    }

    return new PlayCardAction(
      action.controller,
      modifiedData,
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
    const parts: string[] = [];

    if (this.energyCostModification !== 0) {
      const energyStr = this.energyCostModification >= 0
        ? `+${this.energyCostModification}`
        : `${this.energyCostModification}`;
      parts.push(`Energy ${energyStr}`);
    }

    if (this.powerCostModification !== 0) {
      const powerStr = this.powerCostModification >= 0
        ? `+${this.powerCostModification}`
        : `${this.powerCostModification}`;
      parts.push(`Power ${powerStr}`);
    }

    let desc = `Modify cost: ${parts.join(', ')}`;

    if (this.maxUses !== undefined) {
      desc += ` (${this.currentUses}/${this.maxUses} uses)`;
    }

    return desc;
  }
}
