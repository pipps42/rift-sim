/**
 * OnPhaseChangeTrigger - Triggers when game phase changes
 *
 * Common use cases:
 * - "At the start of your turn, draw a card"
 * - "At the end of turn, gain 1 energy"
 * - "During your Awaken Phase, deal 1 damage to all enemies"
 *
 * Riftbound Turn Phases (from RULES.md):
 * 1. AWAKEN - Ready all permanents
 * 2. BEGINNING - Scoring Step (Hold), effects "at the start"
 * 3. CHANNEL - Channel 2 runes
 * 4. DRAW - Draw 1 card, Rune Pool empties
 * 5. ACTION - Main phase for playing cards/moving units
 * 6. ENDING - Effects "at the end of turn"
 * 7. EXPIRATION - Remove damage, expire "this turn" effects
 * 8. CLEANUP - Process deaths, cleanup expired effects
 *
 * Example from card script:
 * ```typescript
 * onPlay: (ctx) => {
 *   ctx.triggerRegistry.register('phase_change', new OnPhaseChangeTrigger({
 *     sourceCard: ctx.self,
 *     targetPhase: 'AWAKEN',
 *     timing: 'start',
 *     filter: (phaseData, game) => {
 *       // Only during your turn
 *       return game.players[game.currentPlayerIndex].id === ctx.controller.id;
 *     },
 *     onTrigger: async (phaseData, game) => {
 *       // Ready target unit when your turn starts
 *       return [
 *         new ReadyCardAction(ctx.controller, { card: targetUnit })
 *       ];
 *     },
 *   }))
 * }
 * ```
 */

import { ActionTrigger } from '../base/ActionTrigger';
import type { GameAction } from '../base/GameAction';
import type { Game, GameCard, GamePhase } from '../../../types/game';
import type { GameActionType } from '../../../types/actions';

export type PhaseTiming = 'start' | 'end';

export interface PhaseChangeData {
  /**
   * Phase being entered/exited
   */
  phase: GamePhase;

  /**
   * Previous phase
   */
  previousPhase: GamePhase;

  /**
   * When this trigger fires (start or end of phase)
   */
  timing: PhaseTiming;

  /**
   * Current player (Turn Player)
   */
  currentPlayerId: string;

  /**
   * Turn number
   */
  turn: number;
}

export interface OnPhaseChangeTriggerConfig {
  /**
   * Source card that created this trigger
   */
  sourceCard?: GameCard;

  /**
   * Target phase to trigger on (undefined = any phase)
   */
  targetPhase?: GamePhase;

  /**
   * When to trigger: start or end of phase
   * Default: 'start'
   */
  timing?: PhaseTiming;

  /**
   * Filter function to determine if this trigger should fire
   * Return true to fire the trigger for this phase change
   */
  filter?: (phaseData: PhaseChangeData, game: Game) => boolean;

  /**
   * Callback that fires when trigger activates
   * Returns array of new actions to execute
   */
  onTrigger: (phaseData: PhaseChangeData, game: Game) => Promise<GameAction[]> | GameAction[];

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

export class OnPhaseChangeTrigger extends ActionTrigger {
  public readonly type: string = 'phase_change';
  public readonly priority: number;

  private targetPhase: GamePhase | undefined;
  private timing: PhaseTiming;
  private filterFn: ((phaseData: PhaseChangeData, game: Game) => boolean) | undefined;
  private onTriggerFn: (phaseData: PhaseChangeData, game: Game) => Promise<GameAction[]> | GameAction[];
  private maxTriggers: number | undefined;
  private expiresWhenFn: ((game: Game) => boolean) | undefined;

  constructor(config: OnPhaseChangeTriggerConfig) {
    super(config.sourceCard);
    this.targetPhase = config.targetPhase;
    this.timing = config.timing ?? 'start';
    this.filterFn = config.filter;
    this.onTriggerFn = config.onTrigger;
    this.maxTriggers = config.oneShot ? 1 : config.maxTriggers;
    this.expiresWhenFn = config.expiresWhen;
    this.priority = config.priority ?? 0;
  }

  async onAction(action: GameAction, game: Game): Promise<GameAction[]> {
    // Phase changes are not actions in the V3 system yet
    // This trigger would be manually invoked by TurnManager
    // when phases change

    // For now, return empty array
    // In full implementation, this would check action.type === 'phase_change'
    return [];
  }

  /**
   * Manual trigger invocation for phase changes
   * Called by TurnManager when phase changes
   */
  async triggerPhaseChange(phaseData: PhaseChangeData, game: Game): Promise<GameAction[]> {
    // Check if this is the target phase (if specified)
    if (this.targetPhase !== undefined && phaseData.phase !== this.targetPhase) {
      return [];
    }

    // Check timing
    if (phaseData.timing !== this.timing) {
      return [];
    }

    // Check max triggers
    if (this.maxTriggers !== undefined && this.getFireCount() >= this.maxTriggers) {
      return [];
    }

    // Check filter
    if (this.filterFn && !this.filterFn(phaseData, game)) {
      return [];
    }

    // Execute trigger callback
    const generatedActions = await this.onTriggerFn(phaseData, game);

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
    const timingStr = this.timing === 'start' ? 'At the start of' : 'At the end of';
    const phaseStr = this.targetPhase ?? 'any phase';
    let desc = `${timingStr} ${phaseStr}`;

    if (this.maxTriggers !== undefined) {
      desc += ` (${this.getFireCount()}/${this.maxTriggers} triggers)`;
    }

    return desc;
  }

  getTargetPhase(): GamePhase | undefined {
    return this.targetPhase;
  }

  getTiming(): PhaseTiming {
    return this.timing;
  }
}
