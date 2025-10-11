/**
 * MoveUnitAction - Moves a unit between locations.
 *
 * Handles:
 * - Standard Move (Base ↔ Battlefield)
 * - Ganking (Battlefield → Battlefield)
 * - Movement restrictions
 * - Showdown/Combat triggers after move
 *
 * @module engine/actions/concrete/MoveUnitAction
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

export interface MoveUnitActionData {
  /** Unit to move */
  unit: GameCard;

  /** Destination location */
  destination: {
    type: 'base' | 'battlefield';
    battlefieldId?: string;
  };
}

/**
 * Action that moves a unit between locations.
 */
export class MoveUnitAction extends GameAction<MoveUnitActionData> {
  public readonly type: GameActionType = 'move_unit' as GameActionType;

  constructor(
    controller: Player,
    data: MoveUnitActionData,
    source?: GameCard
  ) {
    super(controller, data, source);
  }

  validate(game: Game): ActionValidationResult {
    const { unit, destination } = this.data;

    // Validate unit exists and belongs to controller
    const unitInstance = (this.controller as any).units?.find(
      (u: any) => u.instanceId === unit.instanceId
    );

    if (!unitInstance) {
      return this.validationFailure('Unit not found or not controlled by player', {
        unitId: unit.instanceId,
      });
    }

    // Validate unit is ready (not exhausted) for Standard Move
    if (!unit.ready && !this.source) {
      return this.validationFailure('Unit must be ready to move', {
        unitId: unit.instanceId,
      });
    }

    // Get current location
    const currentLocation = this.getUnitLocation(game, unit);

    if (!currentLocation) {
      return this.validationFailure('Cannot determine unit location');
    }

    // Validate movement is legal
    const isLegalMove = this.isLegalMove(currentLocation, destination, unit);

    if (!isLegalMove.valid) {
      return this.validationFailure(isLegalMove.reason!, {
        from: currentLocation,
        to: destination,
      });
    }

    // Validate destination battlefield doesn't have 2 other players already
    if (destination.type === 'battlefield' && destination.battlefieldId) {
      const battlefield = (game as any).battlefields?.find(
        (bf: any) => bf.id === destination.battlefieldId
      );

      if (battlefield) {
        const playersPresent = new Set(
          battlefield.units?.map((u: any) => u.ownerId) || []
        );

        if (playersPresent.size >= 2 && !playersPresent.has(this.controller.id)) {
          return this.validationFailure(
            'Cannot move to battlefield with 2 other players present'
          );
        }
      }
    }

    return this.validationSuccess();
  }

  execute(game: Game): ActionExecutionResult {
    const { unit, destination } = this.data;
    const sideEffects: GameAction[] = [];

    try {
      // Remove unit from current location
      this.removeUnitFromCurrentLocation(game, unit);

      // Add unit to destination
      this.addUnitToDestination(game, unit, destination);

      // Exhaust unit if this was a Standard Move (not from spell/ability)
      if (!this.source) {
        (unit as any).ready = false;
      }

      // After move, Cleanup is performed (handled by ActionExecutor)
      // This may trigger Showdown or Combat

      return this.executionSuccess(sideEffects, {
        from: this.getUnitLocation(game, unit),
        to: destination,
      });

    } catch (error) {
      return this.executionFailure(error as Error);
    }
  }

  /**
   * Get current location of a unit.
   *
   * @private
   */
  private getUnitLocation(
    game: Game,
    unit: GameCard
  ): { type: 'base' | 'battlefield'; battlefieldId?: string } | null {
    const player = this.controller as any;

    // Check if unit is at base
    if (player.base?.units?.some((u: any) => u.instanceId === unit.instanceId)) {
      return { type: 'base' };
    }

    // Check each battlefield
    for (const battlefield of (game as any).battlefields || []) {
      if (battlefield.units?.some((u: any) => u.instanceId === unit.instanceId)) {
        return { type: 'battlefield', battlefieldId: battlefield.id };
      }
    }

    return null;
  }

  /**
   * Check if a move is legal.
   *
   * @private
   */
  private isLegalMove(
    from: { type: 'base' | 'battlefield'; battlefieldId?: string },
    to: { type: 'base' | 'battlefield'; battlefieldId?: string },
    unit: GameCard
  ): { valid: boolean; reason?: string } {
    const hasGanking = (unit as any).keywords?.includes('Ganking');

    // Base → Battlefield: Always allowed
    if (from.type === 'base' && to.type === 'battlefield') {
      return { valid: true };
    }

    // Battlefield → Base: Always allowed
    if (from.type === 'battlefield' && to.type === 'base') {
      return { valid: true };
    }

    // Battlefield → Battlefield: Only with Ganking
    if (from.type === 'battlefield' && to.type === 'battlefield') {
      if (!hasGanking) {
        return {
          valid: false,
          reason: 'Unit needs Ganking keyword to move between battlefields',
        };
      }
      return { valid: true };
    }

    // Base → Base: Not allowed
    if (from.type === 'base' && to.type === 'base') {
      return { valid: false, reason: 'Cannot move from base to base' };
    }

    return { valid: false, reason: 'Invalid move' };
  }

  /**
   * Remove unit from current location.
   *
   * @private
   */
  private removeUnitFromCurrentLocation(game: Game, unit: GameCard): void {
    const player = this.controller as any;

    // Try to remove from base
    if (player.base?.units) {
      const index = player.base.units.findIndex(
        (u: any) => u.instanceId === unit.instanceId
      );
      if (index !== -1) {
        player.base.units.splice(index, 1);
        return;
      }
    }

    // Try to remove from each battlefield
    for (const battlefield of (game as any).battlefields || []) {
      if (battlefield.units) {
        const index = battlefield.units.findIndex(
          (u: any) => u.instanceId === unit.instanceId
        );
        if (index !== -1) {
          battlefield.units.splice(index, 1);
          return;
        }
      }
    }
  }

  /**
   * Add unit to destination.
   *
   * @private
   */
  private addUnitToDestination(
    game: Game,
    unit: GameCard,
    destination: { type: 'base' | 'battlefield'; battlefieldId?: string }
  ): void {
    const player = this.controller as any;

    if (destination.type === 'base') {
      if (!player.base) {
        player.base = { units: [] };
      }
      if (!player.base.units) {
        player.base.units = [];
      }
      player.base.units.push(unit);

    } else if (destination.type === 'battlefield' && destination.battlefieldId) {
      const battlefield = (game as any).battlefields?.find(
        (bf: any) => bf.id === destination.battlefieldId
      );

      if (battlefield) {
        if (!battlefield.units) {
          battlefield.units = [];
        }
        battlefield.units.push(unit);
      }
    }
  }

  toHistoryEntry(): GameEvent {
    return {
      id: this.id,
      gameId: '',
      type: 'move_unit' as any,
      timestamp: this.timestamp,
      data: {
        unit: this.data.unit.instanceId,
        destination: this.data.destination,
        controller: this.controller.id,
      },
    };
  }

  clone(): MoveUnitAction {
    const cloned = new MoveUnitAction(
      this.controller,
      { ...this.data },
      this.source
    );
    cloned.metadata = { ...this.metadata };
    return cloned;
  }

  getDescription(): string {
    const unitName = (this.data.unit as any).cardId || 'Unit';
    const destination = this.data.destination.type === 'base'
      ? 'Base'
      : `Battlefield ${this.data.destination.battlefieldId}`;

    return `Move ${unitName} to ${destination}`;
  }
}
