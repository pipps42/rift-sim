/**
 * DealDamageAction - Inflicts damage to a unit.
 *
 * This is one of the most common actions in the game.
 * Can be modified by:
 * - Spell damage modifiers
 * - Damage prevention (Deflect, Shield)
 * - Damage amplification
 *
 * Note: In Riftbound, damage can only be dealt to units, not players.
 * The game uses a point-based victory system (first to 8 points wins).
 *
 * @module engine/actions/concrete/DealDamageAction
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
  DamageActionData,
} from '../../../types/actions';

/**
 * Action that deals damage to a unit or player.
 */
export class DealDamageAction extends GameAction<DamageActionData> {
  public readonly type: GameActionType = 'deal_damage' as GameActionType;

  constructor(
    controller: Player,
    data: DamageActionData,
    source?: GameCard
  ) {
    super(controller, data, source);
  }

  validate(game: Game): ActionValidationResult {
    const { target, amount } = this.data;

    // Validate target exists
    if (!target) {
      return this.validationFailure('No target specified');
    }

    // Validate amount is positive
    if (amount < 0) {
      return this.validationFailure('Damage amount cannot be negative', { amount });
    }

    // Validate target is a unit on one of the battlefields
    let unitFound = false;
    for (const bf of game.battlefields) {
      if (bf.units.some(u => u.instanceId === target.instanceId)) {
        unitFound = true;
        break;
      }
    }

    if (!unitFound) {
      return this.validationFailure('Target unit not found on battlefield', {
        targetId: target.instanceId,
      });
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { target, amount, damageType } = this.data;

    try {
      // Damage to unit - find it on one of the battlefields
      let unit: GameCard | undefined;
      for (const bf of game.battlefields) {
        unit = bf.units.find(u => u.instanceId === target.instanceId);
        if (unit) break;
      }

      if (!unit) {
        return this.executionFailure(new Error('Unit not found'));
      }

      // Apply damage
      unit.damage = (unit.damage || 0) + amount;

      // Track damage source for effects (custom property, not in GameCard type)
      const unitWithHistory = unit as any;
      if (!unitWithHistory.damageHistory) {
        unitWithHistory.damageHistory = [];
      }
      unitWithHistory.damageHistory.push({
        amount,
        source: this.source,
        type: damageType,
        timestamp: this.timestamp,
      });

      return this.executionSuccess();

    } catch (error) {
      return this.executionFailure(error as Error);
    }
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'deal_damage' as any,
      timestamp: this.timestamp,
      data: {
        source: this.source?.instanceId || null,
        target: this.data.target.instanceId,
        amount: this.data.amount,
        damageType: this.data.damageType,
        controller: this.controller.id,
      },
    };
  }

  clone(): DealDamageAction {
    const cloned = new DealDamageAction(
      this.controller,
      { ...this.data },
      this.source
    );
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  getDescription(): string {
    const targetName = this.data.target.cardId || 'unit';
    return `Deal ${this.data.amount} ${this.data.damageType} damage to ${targetName}`;
  }
}
