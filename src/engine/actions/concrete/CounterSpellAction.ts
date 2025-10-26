/**
 * CounterSpellAction - Counters (cancels) a spell or ability on the Chain
 *
 * From RULES.md:
 * - Counter is a Limited Action (only when instructed)
 * - Countered spell/ability is removed from Chain without resolving
 * - Typically used by Reaction-timing spells during Closed State
 *
 * Chain mechanics (RULES.md):
 * - Chain is LIFO stack (Last In, First Out)
 * - Items on Chain can be spells or activated/triggered abilities
 * - Countering removes item from Chain completely
 *
 * Example:
 * ```typescript
 * // Counter an enemy spell on the Chain
 * const counterAction = new CounterSpellAction(player, {
 *   targetChainItemId: enemySpell.id,
 * });
 * await actionExecutor.execute(counterAction);
 * ```
 */

import { GameAction } from '../base/GameAction';
import type { Player, Game, GameCard, GameEvent, ChainItem } from '../../../types/game';
import { GameActionType } from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
} from '../../../types/actions';

export interface CounterSpellData {
  /**
   * ID of the ChainItem to counter
   */
  targetChainItemId: string;

  /**
   * Whether this counter can target abilities (default: spells only)
   */
  canCounterAbilities?: boolean;
}

export class CounterSpellAction extends GameAction<CounterSpellData> {
  public readonly type: GameActionType = GameActionType.COUNTER_SPELL;

  clone(): GameAction<CounterSpellData> {
    const cloned = new CounterSpellAction(this.controller, { ...this.data }, this.source);
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  validate(game: Game): ActionValidationResult {
    const { targetChainItemId, canCounterAbilities } = this.data;

    // Chain must exist and not be empty
    if (!game.chain || game.chain.length === 0) {
      return this.validationFailure('No active Chain to counter', {});
    }

    // Find target item on Chain
    const targetItem = game.chain.find(item => item.id === targetChainItemId);
    if (!targetItem) {
      return this.validationFailure('Target not found on Chain', {
        targetId: targetChainItemId,
      });
    }

    // Check if already resolved
    if (targetItem.resolved) {
      return this.validationFailure('Cannot counter already-resolved item', {
        targetId: targetChainItemId,
      });
    }

    // Check if we can counter this type
    if (targetItem.type !== 'spell' && !canCounterAbilities) {
      return this.validationFailure('Can only counter spells (not abilities)', {
        targetType: targetItem.type,
      });
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { targetChainItemId } = this.data;

    // Find and remove the target from Chain
    const targetIndex = game.chain.findIndex(item => item.id === targetChainItemId);
    if (targetIndex === -1) {
      return this.executionFailure(new Error('Target not found on Chain during execution'));
    }

    const targetItem = game.chain[targetIndex];
    if (!targetItem) {
      return this.executionFailure(new Error('Target item not found during execution'));
    }

    // Remove from Chain (countered items don't resolve)
    game.chain.splice(targetIndex, 1);

    // The countered spell goes to its owner's trash (if it was a card)
    if (targetItem.sourceCardId) {
      // Find the source card
      for (const player of game.players) {
        const sourceCard = this.findCardAnywhere(game, targetItem.sourceCardId, player.id);
        if (sourceCard) {
          // Move to trash (already happens during spell resolution usually)
          // But countered spells still go to trash
          const owner = game.players.find(p => p.id === sourceCard.ownerId);
          if (owner && !owner.zones.trash.some(c => c.instanceId === sourceCard.instanceId)) {
            owner.zones.trash.push(sourceCard);
          }
          break;
        }
      }
    }

    return this.executionSuccess(undefined, {
      counteredItemId: targetItem.id,
      counteredType: targetItem.type,
      sourceCardId: targetItem.sourceCardId,
    });
  }

  /**
   * Helper to find a card anywhere in game zones
   */
  private findCardAnywhere(game: Game, cardInstanceId: string, ownerId: string): GameCard | undefined {
    const owner = game.players.find(p => p.id === ownerId);
    if (!owner) return undefined;

    // Check all zones
    const zones = [
      owner.zones.hand,
      owner.zones.base,
      owner.zones.trash,
      owner.zones.banishment || [],
      owner.zones.mainDeck,
      owner.zones.runeDeck,
    ];

    for (const zone of zones) {
      const card = zone.find(c => c.instanceId === cardInstanceId);
      if (card) return card;
    }

    // Check battlefields
    for (const bf of game.battlefields) {
      const card = bf.units.find(u => u.instanceId === cardInstanceId);
      if (card) return card;
    }

    return undefined;
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'spell_countered' as any,
      playerId: this.controller.id,
      timestamp: this.timestamp,
      data: {
        targetChainItemId: this.data.targetChainItemId,
        sourceCardId: this.source?.instanceId,
      },
    };
  }

  getDescription(): string {
    return `Counter spell/ability (Chain item ${this.data.targetChainItemId})`;
  }
}
