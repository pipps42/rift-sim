/**
 * OnCombatStartTrigger - Triggers when combat starts
 *
 * From RULES.md:
 * - Combat starts with a Showdown Step
 * - During Showdown Step, triggers for "When I attack" and "When I defend" fire
 * - Attacking units get Assault bonus, defending units get Shield bonus
 * - These triggers create Initial Chain before Showdown proceeds
 *
 * Common use cases:
 * - "When I attack, gain +2 Might this turn"
 * - "When I defend, draw a card"
 * - "When this unit enters combat, stun an enemy unit"
 *
 * Example from card script:
 * ```typescript
 * onPlay: (ctx) => {
 *   ctx.triggers.onCombatStart({
 *     filter: (combatData) => combatData.isAttacker,
 *     effect: async (combatData) => {
 *       // Gain +2 Might when attacking
 *       await ctx.modifiers.onMight({
 *         modify: (might) => might + 2,
 *         filter: (card) => card.instanceId === ctx.self.instanceId,
 *         duration: 'turn',
 *       });
 *     }
 *   });
 * }
 * ```
 */

import { ActionTrigger } from '../base/ActionTrigger';
import type { GameAction } from '../base/GameAction';
import type { Game, GameCard } from '../../../types/game';
import { GameActionType, TriggerPriority } from '../../../types/actions';

export interface CombatStartData {
  /**
   * Card participating in combat
   */
  participant: GameCard;

  /**
   * Whether this card is attacking (vs defending)
   */
  isAttacker: boolean;

  /**
   * Battlefield where combat is happening
   */
  battlefieldId: string;

  /**
   * All attacking units
   */
  attackers: GameCard[];

  /**
   * All defending units
   */
  defenders: GameCard[];

  /**
   * Opposing player ID
   */
  opposingPlayerId: string;
}

export interface OnCombatStartTriggerConfig {
  /**
   * Source card that created this trigger
   */
  sourceCard?: GameCard;

  /**
   * Filter function to determine if this trigger should fire
   * Return true to fire the trigger for this combat
   */
  filter?: (combatData: CombatStartData, game: Game) => boolean;

  /**
   * Callback that fires when trigger activates
   * Returns array of new actions to execute
   */
  onTrigger: (combatData: CombatStartData, game: Game) => Promise<GameAction[]> | GameAction[];

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

export class OnCombatStartTrigger extends ActionTrigger {
  public readonly targetActionType: GameActionType = GameActionType.START_COMBAT;
  public readonly type: string = 'on_combat_start';
  public readonly priority: TriggerPriority;

  private filterFn: ((combatData: CombatStartData, game: Game) => boolean) | undefined;
  private onTriggerFn: (combatData: CombatStartData, game: Game) => Promise<GameAction[]> | GameAction[];
  private maxTriggers: number | undefined;
  private expiresWhenFn: ((game: Game) => boolean) | undefined;

  constructor(config: OnCombatStartTriggerConfig) {
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

    // Extract combat data from action
    // This assumes START_COMBAT action has combat data
    const combatData = (action as any).data as CombatStartData | undefined;

    if (!combatData) {
      return [];
    }

    // Apply filter
    if (this.filterFn && !this.filterFn(combatData, game)) {
      return [];
    }

    // Fire trigger
    const generatedActions = await Promise.resolve(this.onTriggerFn(combatData, game));
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
    return `On combat start trigger${this.sourceCard ? ` from ${this.sourceCard.cardId}` : ''}`;
  }
}
