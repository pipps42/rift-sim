/**
 * ChannelRuneAction - Channels runes from Rune Deck to Base
 *
 * From RULES.md:
 * - During Channel Phase, the Turn Player channels 2 runes from Rune Deck
 * - Runes enter ready on the board at the player's Base
 * - First turn modification: Second player channels 1 extra rune (3 total)
 *
 * Example:
 * ```typescript
 * // Channel 2 runes during Channel Phase
 * const channelAction = new ChannelRuneAction(player, {
 *   amount: 2,
 * });
 * await actionExecutor.execute(channelAction);
 * ```
 */

import { GameAction } from '../base/GameAction';
import type { Player, Game, GameCard, GameEvent } from '../../../types/game';
import { GameActionType } from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
} from '../../../types/actions';

export interface ChannelRuneData {
  /**
   * Number of runes to channel (typically 2, or 3 for second player's first turn)
   */
  amount: number;
}

export class ChannelRuneAction extends GameAction<ChannelRuneData> {
  public readonly type: GameActionType = GameActionType.CHANNEL_RUNE;

  clone(): GameAction<ChannelRuneData> {
    const cloned = new ChannelRuneAction(this.controller, { ...this.data }, this.source);
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  validate(game: Game): ActionValidationResult {
    const { amount } = this.data;

    if (amount <= 0) {
      return this.validationFailure('Cannot channel 0 or negative runes', {
        amount,
      });
    }

    // Find player's rune deck
    const player = game.players.find(p => p.id === this.controller.id);
    if (!player) {
      return this.validationFailure('Player not found in game', {
        playerId: this.controller.id,
      });
    }

    const runeDeck = player.zones.runeDeck;
    if (!runeDeck) {
      return this.validationFailure('Rune deck not found', {
        playerId: player.id,
      });
    }

    // Validate there are enough runes in the deck
    if (runeDeck.length < amount) {
      return this.validationFailure('Not enough runes in Rune Deck', {
        requested: amount,
        available: runeDeck.length,
      });
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { amount } = this.data;

    // Find player
    const player = game.players.find(p => p.id === this.controller.id);
    if (!player) {
      return this.executionFailure(new Error('Player not found during execution'));
    }

    const runeDeck = player.zones.runeDeck;
    const base = player.zones.base;

    if (!runeDeck || !base) {
      return this.executionFailure(new Error('Player zones not properly initialized'));
    }

    // Channel runes from top of Rune Deck to Base
    const channeledRunes: GameCard[] = [];
    for (let i = 0; i < amount; i++) {
      const rune = runeDeck.shift(); // Take from top
      if (!rune) {
        return this.executionFailure(new Error(`Failed to channel rune ${i + 1}/${amount}`));
      }

      // Runes enter ready
      rune.ready = true;

      // Add to Base
      base.push(rune);
      channeledRunes.push(rune);
    }

    return this.executionSuccess(undefined, {
      channeledRunes: channeledRunes.map(r => r.instanceId),
    });
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'runes_channeled' as any,
      playerId: this.controller.id,
      timestamp: this.timestamp,
      data: {
        amount: this.data.amount,
      },
    };
  }

  getDescription(): string {
    return `Channel ${this.data.amount} rune(s) to Base`;
  }
}
