/**
 * SpendEnergyAction - Removes Energy from a player's Rune Pool.
 *
 * Used for:
 * - Paying card costs
 * - Paying ability activation costs
 * - Effects that consume energy
 *
 * @module engine/actions/concrete/SpendEnergyAction
 */

import { GameAction } from '../base/GameAction';
import type {
  Game,
  Player,
  GameCard,
  GameEvent,
} from '../../../types/game';
import type {
  ActionValidationResult,
  ActionExecutionResult,
  GameActionType,
} from '../../../types/actions';

export interface SpendEnergyActionData {
  /** Amount of energy to spend */
  amount: number;
}

/**
 * Action that removes Energy from a player's Rune Pool.
 */
export class SpendEnergyAction extends GameAction<SpendEnergyActionData> {
  public readonly type: GameActionType = 'spend_energy' as GameActionType;

  constructor(
    controller: Player,
    data: SpendEnergyActionData,
    source?: GameCard
  ) {
    super(controller, data, source);
  }

  validate(game: Game): ActionValidationResult {
    const { amount } = this.data;

    // Validate amount is positive
    if (amount <= 0) {
      return this.validationFailure('Energy amount must be positive', { amount });
    }

    const player = this.controller as any;

    // Validate player has Rune Pool
    if (!player.runePool) {
      return this.validationFailure('Player has no Rune Pool', { playerId: player.id });
    }

    // Validate player has enough energy
    const available = player.runePool.energy || 0;
    if (available < amount) {
      return this.validationFailure('Insufficient energy', {
        required: amount,
        available,
      });
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { amount } = this.data;

    try {
      const player = this.controller as any;

      // Remove Energy
      player.runePool.energy -= amount;

      return this.executionSuccess(undefined, {
        newTotal: player.runePool.energy,
        spent: amount,
      });

    } catch (error) {
      return this.executionFailure(error as Error);
    }
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'spend_energy' as any,
      timestamp: this.timestamp,
      data: {
        player: this.controller.id,
        amount: this.data.amount,
        source: this.source?.instanceId || null,
      },
    };
  }

  clone(): SpendEnergyAction {
    const cloned = new SpendEnergyAction(
      this.controller,
      { ...this.data },
      this.source
    );
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  getDescription(): string {
    return `${this.controller.name} spends ${this.data.amount} Energy`;
  }
}
