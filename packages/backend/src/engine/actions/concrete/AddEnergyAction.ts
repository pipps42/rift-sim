/**
 * AddEnergyAction - Adds Energy to a player's Rune Pool.
 *
 * Energy is the generic resource used to pay card costs.
 * Sources:
 * - Tapping runes: "[T]: Add [1] Energy"
 * - Spell effects
 * - Abilities
 *
 * @module engine/actions/concrete/AddEnergyAction
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
  ResourceActionData,
} from '../../../types/actions';

/**
 * Action that adds Energy to a player's Rune Pool.
 */
export class AddEnergyAction extends GameAction<ResourceActionData> {
  public readonly type: GameActionType = 'add_energy' as GameActionType;

  constructor(
    controller: Player,
    data: ResourceActionData,
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

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { amount } = this.data;

    try {
      const player = this.controller as any;

      // Initialize Rune Pool if it doesn't exist
      if (!player.runePool) {
        player.runePool = { energy: 0, power: {} };
      }

      // Add Energy
      player.runePool.energy = (player.runePool.energy || 0) + amount;

      return this.executionSuccess(undefined, {
        newTotal: player.runePool.energy,
      });

    } catch (error) {
      return this.executionFailure(error as Error);
    }
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'add_energy' as any,
      timestamp: this.timestamp,
      data: {
        player: this.controller.id,
        amount: this.data.amount,
        source: this.source?.instanceId || null,
      },
    };
  }

  clone(): AddEnergyAction {
    const cloned = new AddEnergyAction(
      this.controller,
      { ...this.data },
      this.source
    );
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  getDescription(): string {
    return `Add ${this.data.amount} Energy to ${this.controller.name}'s Rune Pool`;
  }
}
