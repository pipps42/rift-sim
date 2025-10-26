/**
 * ReadyAllCardsAction - Readies all cards controlled by a player.
 *
 * From RULES.md:
 * - Awaken Phase: Turn Player readies all Game Objects they control
 * - This includes: cards in Base, Runes, and Units on Battlefields
 *
 * Example:
 * ```typescript
 * // Ready all cards during Awaken Phase
 * const readyAction = new ReadyAllCardsAction(player, {});
 * await actionExecutor.execute(readyAction);
 * ```
 *
 * @module engine/actions/concrete/ReadyAllCardsAction
 */

import { GameAction } from '../base/GameAction';
import type { Player, Game, GameCard, GameEvent } from '../../../types/game';
import { GameActionType } from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
} from '../../../types/actions';

export interface ReadyAllCardsActionData {
  // No specific data needed - readies all cards for controller
}

/**
 * Action that readies all cards controlled by a player.
 * Used primarily in the Awaken Phase.
 */
export class ReadyAllCardsAction extends GameAction<ReadyAllCardsActionData> {
  public readonly type: GameActionType = GameActionType.READY_CARD; // Same type as ReadyCardAction

  clone(): GameAction<ReadyAllCardsActionData> {
    const cloned = new ReadyAllCardsAction(this.controller, { ...this.data }, this.source);
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  validate(game: Game): ActionValidationResult {
    // No specific validation needed - always allowed to ready your cards
    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    let readiedCount = 0;

    try {
      const player = this.controller;

      // Ready all cards in Base
      for (const card of player.zones.base) {
        if (!card.ready) {
          card.ready = true;
          readiedCount++;
        }
      }

      // Ready all Runes
      for (const rune of player.zones.runes) {
        if (!rune.ready) {
          rune.ready = true;
          readiedCount++;
        }
      }

      // Ready all Units on Battlefields controlled by this player
      for (const battlefield of game.battlefields) {
        for (const unit of battlefield.units) {
          if (unit.controllerId === player.id && !unit.ready) {
            unit.ready = true;
            readiedCount++;
          }
        }
      }

      return this.executionSuccess(undefined, {
        readiedCount,
      });

    } catch (error) {
      return this.executionFailure(error as Error);
    }
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'cards_readied' as any,
      playerId: this.controller.id,
      timestamp: this.timestamp,
      data: {
        playerId: this.controller.id,
        phase: 'awaken',
      },
    };
  }

  getDescription(): string {
    return `${this.controller.name} readies all controlled cards`;
  }
}
