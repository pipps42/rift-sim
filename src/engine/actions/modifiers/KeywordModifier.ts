/**
 * KeywordModifier - Modifies keywords on cards
 *
 * Common use cases:
 * - "Your units gain Assault 2"
 * - "Remove Shield from target unit"
 * - "Units you control have Ganking this turn"
 *
 * Example from card script:
 * ```typescript
 * onPlay: (ctx) => {
 *   // Grant Ganking to all your units this turn
 *   ctx.modifierRegistry.register('play_card', new KeywordModifier({
 *     sourceCard: ctx.self,
 *     operation: 'grant',
 *     keyword: 'GANKING',
 *     filter: (action, game) => {
 *       if (!(action instanceof PlayCardAction)) return false;
 *       const card = action.data.card;
 *       return card.cardType === 'UNIT' && card.controllerId === ctx.controller.id;
 *     },
 *     expiresWhen: (game) => !isInPlay(ctx.self, game),
 *   }));
 * }
 * ```
 */

import { ActionModifier } from '../base/ActionModifier';
import type { GameAction } from '../base/GameAction';
import type { Game, GameCard, Keyword } from '../../../types/game';
import type { GameActionType } from '../../../types/actions';
import { TimingLayer } from '../../../types/actions';

export type KeywordOperation = 'grant' | 'remove';

export interface KeywordModifierConfig {
  /**
   * Source card that created this modifier
   */
  sourceCard?: GameCard;

  /**
   * Operation: grant or remove keyword
   */
  operation: KeywordOperation;

  /**
   * Keyword to grant or remove
   */
  keyword: Keyword;

  /**
   * Optional value for keywords like Assault 2, Shield 3
   */
  keywordValue?: number;

  /**
   * Filter function to determine which actions to modify
   * Return true to apply this modifier to the action
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
   * Default: 0
   */
  priority?: number;
}

export class KeywordModifier extends ActionModifier {
  public readonly type: string = 'keyword_modification';
  public readonly timingLayer: TimingLayer = TimingLayer.KEYWORD_MODIFICATION;
  public readonly priority: number;

  private operation: KeywordOperation;
  private keyword: Keyword;
  private keywordValue: number | undefined;
  private filterFn: ((action: GameAction<any>, game: Game) => boolean) | undefined;
  private expiresWhenFn: ((game: Game) => boolean) | undefined;
  private maxUses: number | undefined;

  constructor(config: KeywordModifierConfig) {
    super(config.sourceCard);
    this.operation = config.operation;
    this.keyword = config.keyword;
    this.keywordValue = config.keywordValue;
    this.filterFn = config.filter;
    this.expiresWhenFn = config.expiresWhen;
    this.maxUses = config.oneShot ? 1 : config.maxUses;
    this.priority = config.priority ?? 0;
  }

  async modify(action: GameAction, game: Game): Promise<GameAction | null> {
    // Check max uses
    if (this.maxUses !== undefined && this.currentUses >= this.maxUses) {
      return action;
    }

    // Check filter
    if (this.filterFn && !this.filterFn(action, game)) {
      return action;
    }

    // This modifier doesn't change the action itself
    // It would modify card properties directly (keywords are on GameCard)
    // The actual keyword modification would be handled by the engine

    // Mark as used
    this.markUsed();

    // For now, return action unchanged
    // In a real implementation, this would interact with a keyword system
    // to add/remove keywords from the target card
    return action;
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
    const op = this.operation === 'grant' ? 'Grant' : 'Remove';
    const value = this.keywordValue !== undefined ? ` ${this.keywordValue}` : '';
    let desc = `${op} ${this.keyword}${value}`;

    if (this.maxUses !== undefined) {
      desc += ` (${this.currentUses}/${this.maxUses} uses)`;
    }

    return desc;
  }

  getKeyword(): Keyword {
    return this.keyword;
  }

  getOperation(): KeywordOperation {
    return this.operation;
  }

  getKeywordValue(): number | undefined {
    return this.keywordValue;
  }
}
