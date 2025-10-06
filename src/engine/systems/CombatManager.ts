import {
  Game,
  Battlefield,
  CombatState,
  CombatStep,
  CombatUnit,
  DamageDistribution,
  ShowdownState,
  GameCard,
  Keyword,
  TurnState
} from '@/types/game';
import { eventBus, GameEventFactory } from '../events';
import { PriorityManager } from '../managers/PriorityManager';
import { logger } from '@/utils/logger';

/**
 * Manages combat resolution including Showdowns and damage calculation
 *
 * Combat Rules:
 * - Showdown: when units from different players meet at battlefield
 * - Focus: player who initiated the event has Focus during Showdown
 * - Combat Damage: total Might comparison between attacking/defending units
 * - Keywords: Assault (+X when attacking), Shield (+X when defending), Tank (must be killed first)
 * - Damage Distribution: attacking player chooses how to distribute damage to defenders
 */
export class CombatManager {
  private priorityManager: PriorityManager;

  constructor(priorityManager: PriorityManager) {
    this.priorityManager = priorityManager;
  }

  /**
   * Initiate a Showdown at a battlefield
   */
  async initiateShowdown(
    game: Game,
    battlefieldId: string,
    focusPlayerId: string
  ): Promise<void> {
    const battlefield = game.battlefields.find(b => b.id === battlefieldId);
    if (!battlefield) {
      throw new Error(`Battlefield ${battlefieldId} not found`);
    }

    if (!battlefield.contested) {
      throw new Error('Cannot initiate Showdown on non-contested battlefield');
    }

    logger.info(`CombatManager: Initiating Showdown at battlefield ${battlefieldId}`);

    // Determine relevant players (players with units at this battlefield)
    const relevantPlayers = this.getRelevantPlayersForBattlefield(game, battlefield);

    // Create Showdown state
    game.showdownState = {
      battlefield: battlefieldId,
      relevantPlayers,
      focusPlayer: focusPlayerId,
      initialChainCreated: false
    };

    // Change turn state to Showdown Open
    game.turnState = TurnState.SHOWDOWN_OPEN;

    // Reset priority for Showdown
    this.priorityManager.resetForShowdown(game, focusPlayerId, relevantPlayers);

    // Emit showdown start event
    await eventBus.emit(GameEventFactory.createShowdownStartEvent(
      game.id,
      battlefieldId,
      focusPlayerId,
      relevantPlayers
    ));

    logger.debug(`CombatManager: Showdown state set. Focus player: ${focusPlayerId}, Relevant players: ${relevantPlayers.join(', ')}`);
  }

  /**
   * Resolve a Showdown (after all players pass priority)
   */
  async resolveShowdown(game: Game): Promise<void> {
    if (!game.showdownState) {
      throw new Error('No active Showdown to resolve');
    }

    const battlefieldId = game.showdownState.battlefield;
    logger.info(`CombatManager: Resolving Showdown at battlefield ${battlefieldId}`);

    const battlefield = game.battlefields.find(b => b.id === battlefieldId);
    if (!battlefield) {
      throw new Error('Showdown battlefield not found');
    }

    // Determine if combat should occur
    if (this.shouldProceedToCombat(game, battlefield)) {
      await this.initiateCombat(game, battlefield);
    } else {
      logger.info('CombatManager: No combat necessary at this battlefield');
    }

    // End Showdown
    await this.endShowdown(game);
  }

  /**
   * End Showdown and return to normal state
   */
  private async endShowdown(game: Game): Promise<void> {
    if (!game.showdownState) return;

    const battlefieldId = game.showdownState.battlefield;

    // Clear Showdown state
    delete game.showdownState;

    // Return to neutral state
    game.turnState = TurnState.NEUTRAL_OPEN;

    // Emit showdown end event
    await eventBus.emit(GameEventFactory.createShowdownEndEvent(
      game.id,
      battlefieldId
    ));

    logger.info('CombatManager: Showdown ended, returned to Neutral Open');
  }

  /**
   * Initiate combat at a battlefield
   */
  private async initiateCombat(game: Game, battlefield: Battlefield): Promise<void> {
    logger.info(`CombatManager: Initiating combat at battlefield ${battlefield.id}`);

    // Determine attacking and defending players
    const { attackingPlayer, defendingPlayer } = this.determineAttackerDefender(game, battlefield);

    if (!attackingPlayer || !defendingPlayer) {
      logger.warn('CombatManager: Cannot determine attacker/defender for combat');
      return;
    }

    // Get units for each side
    const attackingUnits = this.prepareAttackingUnits(game, battlefield, attackingPlayer);
    const defendingUnits = this.prepareDefendingUnits(game, battlefield, defendingPlayer);

    // Create combat state
    game.combatState = {
      battlefield: battlefield.id,
      attackingPlayer,
      defendingPlayer,
      attackingUnits,
      defendingUnits,
      step: CombatStep.SHOWDOWN,
      totalAttackingMight: this.calculateTotalMight(attackingUnits),
      totalDefendingMight: this.calculateTotalMight(defendingUnits)
    };

    // Emit combat start event
    await eventBus.emit(GameEventFactory.createCombatStartEvent(
      game.id,
      battlefield.id,
      attackingPlayer,
      defendingPlayer
    ));

    // Proceed to combat damage
    await this.resolveCombatDamage(game);
  }

  /**
   * Resolve combat damage
   */
  private async resolveCombatDamage(game: Game): Promise<void> {
    if (!game.combatState) return;

    logger.info('CombatManager: Resolving combat damage');

    game.combatState.step = CombatStep.COMBAT_DAMAGE;

    const attackTotal = game.combatState.totalAttackingMight;
    const defendTotal = game.combatState.totalDefendingMight;

    logger.debug(`CombatManager: Attack total: ${attackTotal}, Defense total: ${defendTotal}`);

    // Determine winner
    if (attackTotal > defendTotal) {
      // Attackers win
      const excessDamage = attackTotal - defendTotal;
      logger.info(`CombatManager: Attackers win with ${excessDamage} excess damage`);

      // Distribute damage to defending units
      await this.distributeDefenderDamage(game, attackTotal);
    } else if (defendTotal > attackTotal) {
      // Defenders win
      const excessDamage = defendTotal - attackTotal;
      logger.info(`CombatManager: Defenders win with ${excessDamage} excess damage`);

      // Distribute damage to attacking units
      await this.distributeAttackerDamage(game, defendTotal);
    } else {
      // Tie
      logger.info('CombatManager: Combat is a tie, all units take damage equal to opposing total');

      // Both sides take damage
      await this.distributeDefenderDamage(game, attackTotal);
      await this.distributeAttackerDamage(game, defendTotal);
    }

    // Move to resolution step
    game.combatState.step = CombatStep.RESOLUTION;

    // Emit combat damage event (simplified - would need proper damage tracking)
    await eventBus.emit(GameEventFactory.createCombatDamageEvent(
      game.id,
      game.combatState.battlefield,
      attackTotal,
      'target-placeholder' // Would be actual target ID
    ));

    // Apply damage to actual units
    await this.applyDamageToUnits(game);

    // End combat
    await this.endCombat(game);
  }

  /**
   * Distribute damage to defending units
   */
  private async distributeDefenderDamage(game: Game, totalDamage: number): Promise<void> {
    if (!game.combatState) return;

    const distribution = this.calculateDamageDistribution(
      game.combatState.defendingUnits,
      totalDamage
    );

    game.combatState.damageDistribution = distribution;

    logger.debug(`CombatManager: Distributed ${totalDamage} damage to ${distribution.length} defending units`);
  }

  /**
   * Distribute damage to attacking units
   */
  private async distributeAttackerDamage(game: Game, totalDamage: number): Promise<void> {
    if (!game.combatState) return;

    const distribution = this.calculateDamageDistribution(
      game.combatState.attackingUnits,
      totalDamage
    );

    // Append to damage distribution
    if (!game.combatState.damageDistribution) {
      game.combatState.damageDistribution = [];
    }
    game.combatState.damageDistribution.push(...distribution);

    logger.debug(`CombatManager: Distributed ${totalDamage} damage to ${distribution.length} attacking units`);
  }

  /**
   * Calculate damage distribution with Tank priority
   */
  private calculateDamageDistribution(
    units: CombatUnit[],
    totalDamage: number
  ): DamageDistribution[] {
    const distribution: DamageDistribution[] = [];

    // Sort units: Tank units must receive lethal damage first
    const tankUnits = units.filter(u => u.keywords.includes(Keyword.TANK));
    const nonTankUnits = units.filter(u => !u.keywords.includes(Keyword.TANK));

    let remainingDamage = totalDamage;

    // Damage Tank units first
    for (const unit of tankUnits) {
      if (remainingDamage <= 0) break;

      const damageToAssign = Math.min(remainingDamage, unit.might);
      distribution.push({
        targetCardId: unit.cardId,
        damage: damageToAssign,
        isLethalDamage: damageToAssign >= unit.might
      });

      remainingDamage -= damageToAssign;
    }

    // Then damage non-Tank units
    for (const unit of nonTankUnits) {
      if (remainingDamage <= 0) break;

      const damageToAssign = Math.min(remainingDamage, unit.might);
      distribution.push({
        targetCardId: unit.cardId,
        damage: damageToAssign,
        isLethalDamage: damageToAssign >= unit.might
      });

      remainingDamage -= damageToAssign;
    }

    return distribution;
  }

  /**
   * Apply damage to actual game units
   */
  private async applyDamageToUnits(game: Game): Promise<void> {
    if (!game.combatState?.damageDistribution) return;

    const battlefield = game.battlefields.find(b => b.id === game.combatState!.battlefield);
    if (!battlefield) return;

    for (const damage of game.combatState.damageDistribution) {
      const unit = battlefield.units.find(u => u.cardId === damage.targetCardId);
      if (unit) {
        unit.damage += damage.damage;

        logger.debug(`CombatManager: Applied ${damage.damage} damage to unit ${unit.instanceId} (total: ${unit.damage}/${unit.damage})`);

        if (damage.isLethalDamage) {
          logger.info(`CombatManager: Unit ${unit.instanceId} received lethal damage`);
        }
      }
    }
  }

  /**
   * End combat and clean up combat state
   */
  private async endCombat(game: Game): Promise<void> {
    if (!game.combatState) return;

    const battlefieldId = game.combatState.battlefield;

    // Emit combat end event
    await eventBus.emit(GameEventFactory.createCombatEndEvent(
      game.id,
      battlefieldId
    ));

    // Clear combat state
    delete game.combatState;

    logger.info('CombatManager: Combat ended');
  }

  /**
   * Prepare attacking units with combat bonuses
   */
  private prepareAttackingUnits(game: Game, battlefield: Battlefield, attackingPlayer: string): CombatUnit[] {
    const units = battlefield.units.filter(u => u.controllerId === attackingPlayer);

    return units.map(unit => {
      const combatUnit: CombatUnit = {
        cardId: unit.cardId,
        might: this.getUnitMight(unit),
        keywords: this.getUnitKeywords(unit),
        damage: unit.damage,
        hasAssaultBonus: this.hasKeyword(unit, Keyword.ASSAULT),
        hasShieldBonus: false,
        isStunned: false
      };

      // Apply Assault bonus
      if (combatUnit.hasAssaultBonus) {
        // TODO: Get actual Assault value from card
        const assaultBonus = 2; // Placeholder
        combatUnit.might += assaultBonus;
        logger.debug(`CombatManager: Unit ${unit.instanceId} gains +${assaultBonus} from Assault`);
      }

      return combatUnit;
    });
  }

  /**
   * Prepare defending units with combat bonuses
   */
  private prepareDefendingUnits(game: Game, battlefield: Battlefield, defendingPlayer: string): CombatUnit[] {
    const units = battlefield.units.filter(u => u.controllerId === defendingPlayer);

    return units.map(unit => {
      const combatUnit: CombatUnit = {
        cardId: unit.cardId,
        might: this.getUnitMight(unit),
        keywords: this.getUnitKeywords(unit),
        damage: unit.damage,
        hasAssaultBonus: false,
        hasShieldBonus: this.hasKeyword(unit, Keyword.SHIELD),
        isStunned: false
      };

      // Apply Shield bonus
      if (combatUnit.hasShieldBonus) {
        // TODO: Get actual Shield value from card
        const shieldBonus = 2; // Placeholder
        combatUnit.might += shieldBonus;
        logger.debug(`CombatManager: Unit ${unit.instanceId} gains +${shieldBonus} from Shield`);
      }

      return combatUnit;
    });
  }

  /**
   * Calculate total Might for a group of units
   */
  private calculateTotalMight(units: CombatUnit[]): number {
    return units
      .filter(u => !u.isStunned)
      .reduce((total, unit) => total + unit.might, 0);
  }

  /**
   * Determine attacker and defender for combat
   */
  private determineAttackerDefender(game: Game, battlefield: Battlefield): {
    attackingPlayer: string;
    defendingPlayer: string;
  } {
    // In Riftbound, the player who initiated the Showdown (Focus player) is typically the attacker
    const focusPlayer = game.showdownState?.focusPlayer;
    const relevantPlayers = game.showdownState?.relevantPlayers || [];

    const attackingPlayer = focusPlayer || relevantPlayers[0] || '';
    const defendingPlayer = relevantPlayers.find(p => p !== attackingPlayer) || '';

    return { attackingPlayer, defendingPlayer };
  }

  /**
   * Check if combat should proceed
   */
  private shouldProceedToCombat(game: Game, battlefield: Battlefield): boolean {
    // Combat occurs if there are still units from multiple players
    const playersWithUnits = new Set<string>();
    battlefield.units.forEach(u => playersWithUnits.add(u.controllerId));

    return playersWithUnits.size > 1;
  }

  /**
   * Get relevant players for a battlefield
   */
  private getRelevantPlayersForBattlefield(game: Game, battlefield: Battlefield): string[] {
    const playersWithUnits = new Set<string>();
    battlefield.units.forEach(u => playersWithUnits.add(u.controllerId));

    return Array.from(playersWithUnits);
  }

  /**
   * Get unit Might value
   */
  private getUnitMight(unit: GameCard): number {
    // TODO: Get actual Might from card definition
    // For now, return placeholder
    return 3; // Placeholder
  }

  /**
   * Get unit keywords
   */
  private getUnitKeywords(unit: GameCard): Keyword[] {
    // TODO: Get actual keywords from card definition
    // For now, return empty array
    return [];
  }

  /**
   * Check if unit has a keyword
   */
  private hasKeyword(unit: GameCard, keyword: Keyword): boolean {
    const keywords = this.getUnitKeywords(unit);
    return keywords.includes(keyword);
  }

  /**
   * Get combat statistics
   */
  getCombatStats(game: Game): {
    isInCombat: boolean;
    isInShowdown: boolean;
    battlefieldId: string | undefined;
    attackTotal: number | undefined;
    defendTotal: number | undefined;
    combatStep: CombatStep | undefined;
  } {
    return {
      isInCombat: !!game.combatState,
      isInShowdown: !!game.showdownState,
      battlefieldId: game.combatState?.battlefield || game.showdownState?.battlefield,
      attackTotal: game.combatState?.totalAttackingMight,
      defendTotal: game.combatState?.totalDefendingMight,
      combatStep: game.combatState?.step
    };
  }
}
