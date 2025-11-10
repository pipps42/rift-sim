/**
 * StartCombatAction - Announces the start of combat
 *
 * This action is executed at the beginning of the Showdown Step to:
 * - Notify all OnCombatStartTrigger instances
 * - Allow "when I attack" and "when I defend" triggers to fire
 * - Set up the Initial Chain with combat-triggered abilities
 *
 * This action doesn't modify game state directly - it exists purely
 * to trigger registered combat start triggers.
 *
 * Example:
 * ```typescript
 * const startCombat = new StartCombatAction(focusPlayer, {
 *   participant: attackingUnit,
 *   isAttacker: true,
 *   battlefieldId: battlefield.id,
 *   attackers: allAttackingUnits,
 *   defenders: allDefendingUnits,
 *   opposingPlayerId: defender.id
 * });
 * await executor.execute(startCombat);
 * ```
 */

import { GameAction } from '../base/GameAction';
import type { Player, Game, GameCard, GameEvent } from '../../../types/game';
import { GameActionType } from '../../../types/actions';
import type {
  ActionValidationResult,
  ActionExecutionResult,
} from '../../../types/actions';
import type { CombatStartData } from '../triggers/OnCombatStartTrigger';

/**
 * Action that announces combat start for a participant
 */
export class StartCombatAction extends GameAction<CombatStartData> {
  public readonly type: GameActionType = GameActionType.START_COMBAT;

  constructor(
    controller: Player,
    data: CombatStartData,
    source?: GameCard
  ) {
    super(controller, data, source);
  }

  validate(game: Game): ActionValidationResult {
    const { participant, battlefieldId, attackers, defenders } = this.data;

    // Validate participant exists
    if (!participant) {
      return this.validationFailure('No combat participant specified');
    }

    // Validate battlefield exists
    const battlefield = game.battlefields.find(bf => bf.id === battlefieldId);
    if (!battlefield) {
      return this.validationFailure('Battlefield not found', {
        battlefieldId,
      });
    }

    // Validate participant is on the battlefield
    const participantOnField = battlefield.units.some(
      u => u.instanceId === participant.instanceId
    );
    if (!participantOnField) {
      return this.validationFailure('Participant not on battlefield', {
        participantId: participant.instanceId,
        battlefieldId,
      });
    }

    // Validate attackers and defenders are not empty
    if (attackers.length === 0) {
      return this.validationFailure('No attackers in combat');
    }

    if (defenders.length === 0) {
      return this.validationFailure('No defenders in combat');
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    // This action doesn't modify game state
    // Its purpose is to trigger OnCombatStartTrigger instances
    // which will be called by ActionExecutor Phase 5 (Triggers)

    // Return success - triggers will be handled by executor
    return this.executionSuccess([], {
      participant: this.data.participant.instanceId,
      isAttacker: this.data.isAttacker,
      battlefieldId: this.data.battlefieldId,
    });
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'combat_start' as any,
      timestamp: this.timestamp,
      data: {
        participant: this.data.participant.instanceId,
        isAttacker: this.data.isAttacker,
        battlefieldId: this.data.battlefieldId,
        attackers: this.data.attackers.map(u => u.instanceId),
        defenders: this.data.defenders.map(u => u.instanceId),
        opposingPlayerId: this.data.opposingPlayerId,
      },
    };
  }

  clone(): StartCombatAction {
    return new StartCombatAction(this.controller, this.data, this.source);
  }

  getDescription(): string {
    const roleText = this.data.isAttacker ? 'attacking' : 'defending';
    return `${this.data.participant.name} ${roleText} at battlefield ${this.data.battlefieldId}`;
  }
}
