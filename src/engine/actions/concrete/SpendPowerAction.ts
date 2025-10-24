/**
 * SpendPowerAction - Removes Power from a player's Rune Pool.
 *
 * Used for:
 * - Paying card power costs (Fury, Calm, Mind, Body, Chaos, Order, Universal)
 * - Paying ability activation power costs
 * - Effects that consume power
 *
 * @module engine/actions/concrete/SpendPowerAction
 */

import { GameAction } from '../base/GameAction';
import type {
  Game,
  Player,
  GameCard,
  GameEvent,
  Domain,
} from '../../../types/game';
import type {
  ActionValidationResult,
  ActionExecutionResult,
  GameActionType,
} from '../../../types/actions';

export interface SpendPowerActionData {
  /** Power domain to spend from */
  domain: Domain;

  /** Amount of power to spend */
  amount: number;
}

/**
 * Action that removes Power from a player's Rune Pool.
 */
export class SpendPowerAction extends GameAction<SpendPowerActionData> {
  public readonly type: GameActionType = 'spend_power' as GameActionType;

  constructor(
    controller: Player,
    data: SpendPowerActionData,
    source?: GameCard
  ) {
    super(controller, data, source);
  }

  validate(game: Game): ActionValidationResult {
    const { domain, amount } = this.data;

    // Validate amount is positive
    if (amount <= 0) {
      return this.validationFailure('Power amount must be positive', { amount });
    }

    const player = this.controller as any;

    // Validate player has Rune Pool
    if (!player.runePool) {
      return this.validationFailure('Player has no Rune Pool', { playerId: player.id });
    }

    // Find power pool for this domain
    const powerPool = player.runePool.power.find((p: any) => p.domain === domain);
    const available = powerPool?.amount || 0;

    // Validate player has enough power in this domain
    if (available < amount) {
      return this.validationFailure(`Insufficient ${domain} power`, {
        required: amount,
        available,
        domain,
      });
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { domain, amount } = this.data;

    try {
      const player = this.controller as any;

      // Find power pool for this domain
      const powerPool = player.runePool.power.find((p: any) => p.domain === domain);

      if (!powerPool) {
        return this.executionFailure(new Error(`No ${domain} power pool found`));
      }

      // Remove Power
      powerPool.amount -= amount;

      return this.executionSuccess(undefined, {
        domain,
        spent: amount,
        newTotal: powerPool.amount,
      });

    } catch (error) {
      return this.executionFailure(error as Error);
    }
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'spend_power' as any,
      timestamp: this.timestamp,
      data: {
        player: this.controller.id,
        domain: this.data.domain,
        amount: this.data.amount,
        source: this.source?.instanceId || null,
      },
    };
  }

  clone(): SpendPowerAction {
    const cloned = new SpendPowerAction(
      this.controller,
      { ...this.data },
      this.source
    );
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  getDescription(): string {
    return `${this.controller.name} spends ${this.data.amount} ${this.data.domain} power`;
  }
}
