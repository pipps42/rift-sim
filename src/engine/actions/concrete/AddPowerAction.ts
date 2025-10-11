/**
 * AddPowerAction - Adds Power of a specific domain to a player's Rune Pool.
 *
 * Power is domain-specific resource used to pay card costs.
 * Each power has a domain (or Universal).
 *
 * Sources:
 * - Recycling runes: "Recycle: Add [Domain] Power"
 * - Spell effects
 * - Abilities
 *
 * @module engine/actions/concrete/AddPowerAction
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
 * Action that adds Power to a player's Rune Pool.
 */
export class AddPowerAction extends GameAction<ResourceActionData> {
  public readonly type: GameActionType = 'add_power' as GameActionType;

  constructor(
    controller: Player,
    data: ResourceActionData,
    source?: GameCard
  ) {
    super(controller, data, source);
  }

  validate(game: Game): ActionValidationResult {
    const { amount, resourceType } = this.data;

    // Validate amount is positive
    if (amount <= 0) {
      return this.validationFailure('Power amount must be positive', { amount });
    }

    // Validate domain is specified
    if (!resourceType) {
      return this.validationFailure('Power domain must be specified');
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { amount, resourceType } = this.data;

    try {
      const player = this.controller as any;

      // Initialize Rune Pool if it doesn't exist
      if (!player.runePool) {
        player.runePool = { energy: 0, power: {} };
      }

      // Initialize power object if it doesn't exist
      if (!player.runePool.power) {
        player.runePool.power = {};
      }

      // Add Power for this domain
      const domain = resourceType!;
      player.runePool.power[domain] = (player.runePool.power[domain] || 0) + amount;

      return this.executionSuccess(undefined, {
        domain,
        newTotal: player.runePool.power[domain],
      });

    } catch (error) {
      return this.executionFailure(error as Error);
    }
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'add_power' as any,
      timestamp: this.timestamp,
      data: {
        player: this.controller.id,
        amount: this.data.amount,
        domain: this.data.resourceType,
        source: this.source?.instanceId || null,
      },
    };
  }

  clone(): AddPowerAction {
    const cloned = new AddPowerAction(
      this.controller,
      { ...this.data },
      this.source
    );
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  getDescription(): string {
    return `Add ${this.data.amount} ${this.data.resourceType} Power to ${this.controller.name}'s Rune Pool`;
  }
}
