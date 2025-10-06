import {
  Game,
  GameCard,
  Battlefield,
  Keyword
} from '@/types/game';
import { eventBus, GameEventFactory } from '../events';
import { BattlefieldManager } from '../managers/BattlefieldManager';
import { logger } from '@/utils/logger';

/**
 * Manages Cleanup step and state-based actions
 *
 * Cleanup Rules (performed after each chain item resolution and during Cleanup Phase):
 * 1. Kill units with damage >= Might
 * 2. Remove Attacker/Defender status from units not in combat
 * 3. Activate state-based effects
 * 4. Remove hidden cards from uncontrolled battlefields
 * 5. Mark Combat as Pending where necessary
 * 6. Trigger Showdowns/Combat if needed in Neutral Open
 */
export class CleanupSystem {
  private battlefieldManager: BattlefieldManager;

  constructor(battlefieldManager: BattlefieldManager) {
    this.battlefieldManager = battlefieldManager;
  }

  /**
   * Perform full Cleanup
   */
  async performCleanup(game: Game): Promise<void> {
    logger.debug('CleanupSystem: Starting cleanup');

    let unitsKilled = false;

    // Step 1: Kill units with lethal damage
    unitsKilled = await this.killLethallyDamagedUnits(game);

    // Step 2: Remove Attacker/Defender status
    await this.clearCombatStatus(game);

    // Step 3: Process state-based effects
    await this.processStateBasedEffects(game);

    // Step 4: Remove hidden cards from uncontrolled battlefields
    await this.battlefieldManager.cleanupHiddenCards(game);

    // Step 5: Update battlefield control for all battlefields
    await this.updateAllBattlefieldControl(game);

    // If units were killed, perform Cleanup again (recursive)
    if (unitsKilled) {
      logger.debug('CleanupSystem: Units were killed, performing Cleanup again');
      await this.performCleanup(game);
    }

    logger.debug('CleanupSystem: Cleanup complete');
  }

  /**
   * Kill units with damage >= Might
   */
  async killLethallyDamagedUnits(game: Game): Promise<boolean> {
    let anyUnitsKilled = false;

    for (const battlefield of game.battlefields) {
      const unitsToKill: GameCard[] = [];

      for (const unit of battlefield.units) {
        const might = this.getUnitMight(unit);

        if (unit.damage >= might) {
          unitsToKill.push(unit);
          logger.info(`CleanupSystem: Unit ${unit.instanceId} has lethal damage (${unit.damage}/${might})`);
        }
      }

      // Kill units
      for (const unit of unitsToKill) {
        await this.killUnit(game, battlefield, unit);
        anyUnitsKilled = true;
      }
    }

    return anyUnitsKilled;
  }

  /**
   * Kill a unit
   */
  private async killUnit(game: Game, battlefield: Battlefield, unit: GameCard): Promise<void> {
    logger.info(`CleanupSystem: Killing unit ${unit.instanceId}`);

    // Remove from battlefield
    const unitIndex = battlefield.units.findIndex(u => u.instanceId === unit.instanceId);
    if (unitIndex !== -1) {
      battlefield.units.splice(unitIndex, 1);
    }

    // Move to owner's trash
    const owner = game.players.find(p => p.id === unit.ownerId);
    if (owner) {
      // Reset unit state
      unit.damage = 0;
      unit.ready = false;
      unit.temporaryModifiers = [];

      owner.zones.trash.push(unit);
    }

    // Emit unit died event
    await eventBus.emit(GameEventFactory.createUnitDiedEvent(
      game.id,
      unit.controllerId,
      unit.cardId,
      battlefield.id
    ));

    // TODO: Trigger Deathknell abilities
    logger.debug('CleanupSystem: Checking for Deathknell triggers (placeholder)');
  }

  /**
   * Clear Attacker/Defender status from units
   */
  private async clearCombatStatus(game: Game): Promise<void> {
    // In Riftbound, units don't have persistent Attacker/Defender status
    // This would be tracked in combat state which is cleared after combat
    // For now, this is a placeholder for future implementation

    logger.debug('CleanupSystem: Cleared combat status (placeholder)');
  }

  /**
   * Process state-based effects
   */
  private async processStateBasedEffects(game: Game): Promise<void> {
    // State-based effects that are continuously checked:
    // - Units with damage >= Might die (handled in killLethallyDamagedUnits)
    // - Other continuous effects

    // TODO: Implement other state-based effects
    logger.debug('CleanupSystem: Processed state-based effects (placeholder)');
  }

  /**
   * Update battlefield control for all battlefields
   */
  private async updateAllBattlefieldControl(game: Game): Promise<void> {
    for (const battlefield of game.battlefields) {
      this.battlefieldManager.updateBattlefieldControl(game, battlefield);
    }
  }

  /**
   * Remove all damage from units (Expiration Phase)
   */
  async removeDamageFromUnits(game: Game): Promise<void> {
    logger.debug('CleanupSystem: Removing all damage from units');

    for (const battlefield of game.battlefields) {
      for (const unit of battlefield.units) {
        if (unit.damage > 0) {
          logger.debug(`CleanupSystem: Removing ${unit.damage} damage from unit ${unit.instanceId}`);
          unit.damage = 0;
        }
      }
    }

    // Also remove damage from units in player bases
    for (const player of game.players) {
      for (const unit of player.zones.base) {
        if (unit.damage > 0) {
          logger.debug(`CleanupSystem: Removing ${unit.damage} damage from base unit ${unit.instanceId}`);
          unit.damage = 0;
        }
      }
    }
  }

  /**
   * Remove temporary effects (Expiration Phase)
   */
  async removeTemporaryEffects(game: Game): Promise<void> {
    logger.debug('CleanupSystem: Removing temporary effects');

    // Remove "this turn" effects from all units
    for (const battlefield of game.battlefields) {
      for (const unit of battlefield.units) {
        const modifiersBefore = unit.temporaryModifiers.length;

        // Filter out expired modifiers
        unit.temporaryModifiers = unit.temporaryModifiers.filter(mod => {
          // TODO: Check duration and remove expired ones
          // For now, remove all temporary modifiers
          return false;
        });

        const modifiersRemoved = modifiersBefore - unit.temporaryModifiers.length;
        if (modifiersRemoved > 0) {
          logger.debug(`CleanupSystem: Removed ${modifiersRemoved} temporary modifiers from unit ${unit.instanceId}`);
        }
      }
    }

    // Also process base units
    for (const player of game.players) {
      for (const unit of player.zones.base) {
        unit.temporaryModifiers = [];
      }
    }
  }

  /**
   * Remove Temporary keyword cards (end of turn)
   */
  async removeTemporaryUnits(game: Game): Promise<void> {
    logger.debug('CleanupSystem: Removing Temporary units');

    for (const battlefield of game.battlefields) {
      const temporaryUnits: GameCard[] = [];

      for (const unit of battlefield.units) {
        if (this.hasKeyword(unit, Keyword.TEMPORARY)) {
          temporaryUnits.push(unit);
        }
      }

      // Remove Temporary units
      for (const unit of temporaryUnits) {
        logger.info(`CleanupSystem: Removing Temporary unit ${unit.instanceId}`);

        // Remove from battlefield
        const unitIndex = battlefield.units.findIndex(u => u.instanceId === unit.instanceId);
        if (unitIndex !== -1) {
          battlefield.units.splice(unitIndex, 1);
        }

        // Move to owner's trash
        const owner = game.players.find(p => p.id === unit.ownerId);
        if (owner) {
          owner.zones.trash.push(unit);
        }
      }
    }

    // Also check base zones
    for (const player of game.players) {
      const temporaryUnits = player.zones.base.filter(u => this.hasKeyword(u, Keyword.TEMPORARY));

      for (const unit of temporaryUnits) {
        logger.info(`CleanupSystem: Removing Temporary unit ${unit.instanceId} from base`);

        const unitIndex = player.zones.base.findIndex(u => u.instanceId === unit.instanceId);
        if (unitIndex !== -1) {
          player.zones.base.splice(unitIndex, 1);
        }

        player.zones.trash.push(unit);
      }
    }
  }

  /**
   * Check and trigger pending combats/showdowns
   */
  async checkPendingCombats(game: Game): Promise<Battlefield[]> {
    const contestedBattlefields: Battlefield[] = [];

    for (const battlefield of game.battlefields) {
      if (this.battlefieldManager.shouldTriggerShowdown(game, battlefield)) {
        contestedBattlefields.push(battlefield);
        logger.info(`CleanupSystem: Battlefield ${battlefield.id} has pending combat/showdown`);
      }
    }

    return contestedBattlefields;
  }

  /**
   * Get unit Might (helper)
   */
  private getUnitMight(unit: GameCard): number {
    // TODO: Get actual Might from card definition
    // For now, return placeholder
    return 3; // Placeholder
  }

  /**
   * Check if unit has keyword (helper)
   */
  private hasKeyword(unit: GameCard, keyword: Keyword): boolean {
    // TODO: Get actual keywords from card definition
    // For now, return false
    return false;
  }

  /**
   * Get cleanup statistics
   */
  getCleanupStats(game: Game): {
    unitsWithLethalDamage: number;
    temporaryUnits: number;
    contestedBattlefields: number;
    unitsWithDamage: number;
    unitsWithModifiers: number;
  } {
    let unitsWithLethalDamage = 0;
    let temporaryUnits = 0;
    let unitsWithDamage = 0;
    let unitsWithModifiers = 0;

    // Count units on battlefields
    for (const battlefield of game.battlefields) {
      for (const unit of battlefield.units) {
        const might = this.getUnitMight(unit);

        if (unit.damage >= might) {
          unitsWithLethalDamage++;
        }

        if (unit.damage > 0) {
          unitsWithDamage++;
        }

        if (this.hasKeyword(unit, Keyword.TEMPORARY)) {
          temporaryUnits++;
        }

        if (unit.temporaryModifiers.length > 0) {
          unitsWithModifiers++;
        }
      }
    }

    const contestedBattlefields = this.battlefieldManager.getContestedBattlefields(game).length;

    return {
      unitsWithLethalDamage,
      temporaryUnits,
      contestedBattlefields,
      unitsWithDamage,
      unitsWithModifiers
    };
  }
}
