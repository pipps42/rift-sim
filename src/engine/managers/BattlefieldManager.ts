import {
  Game,
  Battlefield,
  GameCard,
  UnitCard,
  Keyword
} from '@/types/game';
import { eventBus, GameEventFactory } from '../events';
import { logger } from '@/utils/logger';

/**
 * Manages battlefield control, unit movement, and hidden cards
 *
 * Battlefield Rules:
 * - Battlefield is controlled by player with sole presence
 * - Contested when units from different players arrive
 * - Standard Move: Base ↔ Battlefield (exhausts unit)
 * - Ganking: Battlefield → Battlefield (exhausts unit, requires Ganking keyword)
 * - Hidden cards: face-down cards at battlefields (requires Hidden keyword)
 */
export class BattlefieldManager {

  /**
   * Move a unit using Standard Move
   */
  async standardMove(
    game: Game,
    playerId: string,
    unitId: string,
    toBattlefieldId: string
  ): Promise<void> {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    // Find the unit
    const unit = this.findUnit(game, unitId);
    if (!unit) {
      throw new Error(`Unit ${unitId} not found`);
    }

    // Validate ownership
    if (unit.controllerId !== playerId) {
      throw new Error('Cannot move unit you do not control');
    }

    // Validate unit is ready
    if (!unit.ready) {
      throw new Error('Cannot move exhausted unit');
    }

    // Determine source location
    const fromLocation = this.getUnitLocation(game, unitId);
    if (!fromLocation) {
      throw new Error('Cannot determine unit location');
    }

    // Validate movement is legal Standard Move
    if (!this.isValidStandardMove(game, fromLocation, toBattlefieldId)) {
      throw new Error('Invalid Standard Move: must be Base ↔ Battlefield');
    }

    // Find target battlefield
    const toBattlefield = game.battlefields.find(b => b.id === toBattlefieldId);
    if (!toBattlefield) {
      throw new Error(`Battlefield ${toBattlefieldId} not found`);
    }

    // Check battlefield restrictions
    if (!this.canMoveToOccupiedBattlefield(game, toBattlefield, playerId)) {
      throw new Error('Cannot move to battlefield with units from 2+ other players');
    }

    // Perform the move
    await this.executeMove(game, unit, fromLocation, toBattlefield);

    // Exhaust the unit
    unit.ready = false;

    logger.info(`BattlefieldManager: Unit ${unitId} moved from ${fromLocation.type} to battlefield ${toBattlefieldId}`);

    // Update battlefield control
    this.updateBattlefieldControl(game, toBattlefield);

    // Emit movement event
    await eventBus.emit(GameEventFactory.createUnitMovedEvent(
      game.id,
      playerId,
      unitId,
      fromLocation.id || 'base',
      toBattlefieldId
    ));
  }

  /**
   * Move a unit using Ganking (battlefield to battlefield)
   */
  async gankingMove(
    game: Game,
    playerId: string,
    unitId: string,
    toBattlefieldId: string
  ): Promise<void> {
    const unit = this.findUnit(game, unitId);
    if (!unit) {
      throw new Error(`Unit ${unitId} not found`);
    }

    // Validate unit has Ganking keyword
    // TODO: Get actual card data to check keywords
    // For now, assume we have a way to check keywords
    logger.debug(`BattlefieldManager: Checking Ganking keyword for unit ${unitId} (placeholder)`);

    // Validate unit is on a battlefield
    const fromBattlefield = this.getUnitBattlefield(game, unitId);
    if (!fromBattlefield) {
      throw new Error('Ganking move requires unit to be on a battlefield');
    }

    // Validate unit is ready
    if (!unit.ready) {
      throw new Error('Cannot move exhausted unit');
    }

    // Find target battlefield
    const toBattlefield = game.battlefields.find(b => b.id === toBattlefieldId);
    if (!toBattlefield) {
      throw new Error(`Battlefield ${toBattlefieldId} not found`);
    }

    // Check battlefield restrictions
    if (!this.canMoveToOccupiedBattlefield(game, toBattlefield, playerId)) {
      throw new Error('Cannot gank to battlefield with units from 2+ other players');
    }

    // Remove from source battlefield
    const unitIndex = fromBattlefield.units.findIndex(u => u.instanceId === unitId);
    if (unitIndex !== -1) {
      fromBattlefield.units.splice(unitIndex, 1);
    }

    // Add to target battlefield
    toBattlefield.units.push(unit);

    // Exhaust the unit
    unit.ready = false;

    logger.info(`BattlefieldManager: Unit ${unitId} ganked from battlefield ${fromBattlefield.id} to ${toBattlefieldId}`);

    // Update control for both battlefields
    this.updateBattlefieldControl(game, fromBattlefield);
    this.updateBattlefieldControl(game, toBattlefield);

    // Emit movement event
    await eventBus.emit(GameEventFactory.createUnitMovedEvent(
      game.id,
      playerId,
      unitId,
      fromBattlefield.id,
      toBattlefieldId
    ));
  }

  /**
   * Hide a card at a battlefield (face-down)
   */
  async hideCard(
    game: Game,
    playerId: string,
    cardId: string,
    battlefieldId: string
  ): Promise<void> {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    // Find the card in hand
    const cardIndex = player.zones.hand.findIndex(c => c.instanceId === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in hand');
    }

    const card = player.zones.hand[cardIndex]!;

    // Validate card has Hidden keyword
    // TODO: Check actual card keywords
    logger.debug(`BattlefieldManager: Checking Hidden keyword for card ${cardId} (placeholder)`);

    // Find battlefield
    const battlefield = game.battlefields.find(b => b.id === battlefieldId);
    if (!battlefield) {
      throw new Error(`Battlefield ${battlefieldId} not found`);
    }

    // Remove from hand
    player.zones.hand.splice(cardIndex, 1);

    // Add to battlefield's facedown zone
    battlefield.facedownCards.push(card);

    logger.info(`BattlefieldManager: Card ${cardId} hidden at battlefield ${battlefieldId}`);
  }

  /**
   * Reveal a hidden card
   */
  async revealHiddenCard(
    game: Game,
    battlefieldId: string,
    cardId: string
  ): Promise<void> {
    const battlefield = game.battlefields.find(b => b.id === battlefieldId);
    if (!battlefield) {
      throw new Error(`Battlefield ${battlefieldId} not found`);
    }

    const cardIndex = battlefield.facedownCards.findIndex(c => c.instanceId === cardId);
    if (cardIndex === -1) {
      throw new Error('Hidden card not found at battlefield');
    }

    const card = battlefield.facedownCards[cardIndex]!;

    // Remove from facedown zone
    battlefield.facedownCards.splice(cardIndex, 1);

    // Add to battlefield units (if it's a unit)
    battlefield.units.push(card);

    logger.info(`BattlefieldManager: Card ${cardId} revealed at battlefield ${battlefieldId}`);

    // Update battlefield control
    this.updateBattlefieldControl(game, battlefield);
  }

  /**
   * Update battlefield control based on units present
   */
  updateBattlefieldControl(game: Game, battlefield: Battlefield): void {
    const playersWithUnits = new Set<string>();

    battlefield.units.forEach(unit => {
      playersWithUnits.add(unit.controllerId);
    });

    const previousController = battlefield.controller;

    if (playersWithUnits.size === 0) {
      // No units - no controller
      delete battlefield.controller;
      battlefield.contested = false;
      logger.debug(`BattlefieldManager: Battlefield ${battlefield.id} is now uncontrolled`);
    } else if (playersWithUnits.size === 1) {
      // Single player controls
      const controllerId = Array.from(playersWithUnits)[0];
      if (controllerId) {
        battlefield.controller = controllerId;
        battlefield.contested = false;

        if (previousController !== controllerId) {
          logger.info(`BattlefieldManager: Battlefield ${battlefield.id} control changed to ${controllerId}`);
        }
      }
    } else {
      // Multiple players - contested
      battlefield.contested = true;
      // Controller remains unchanged until combat resolves
      logger.info(`BattlefieldManager: Battlefield ${battlefield.id} is now contested`);
    }
  }

  /**
   * Check if a battlefield should trigger a Showdown
   */
  shouldTriggerShowdown(game: Game, battlefield: Battlefield): boolean {
    // Showdown triggers when:
    // 1. Battlefield becomes contested (units from multiple players)
    // 2. A unit arrives at an enemy-controlled battlefield

    if (battlefield.contested) {
      return true;
    }

    // Check if there are units from different players
    const playersWithUnits = new Set<string>();
    battlefield.units.forEach(unit => {
      playersWithUnits.add(unit.controllerId);
    });

    return playersWithUnits.size > 1;
  }

  /**
   * Get all contested battlefields
   */
  getContestedBattlefields(game: Game): Battlefield[] {
    return game.battlefields.filter(b => b.contested);
  }

  /**
   * Get battlefields controlled by a player
   */
  getControlledBattlefields(game: Game, playerId: string): Battlefield[] {
    return game.battlefields.filter(b => b.controller === playerId);
  }

  /**
   * Get units at a battlefield
   */
  getUnitsAtBattlefield(game: Game, battlefieldId: string): GameCard[] {
    const battlefield = game.battlefields.find(b => b.id === battlefieldId);
    return battlefield?.units || [];
  }

  /**
   * Find a unit in the game
   */
  private findUnit(game: Game, unitId: string): GameCard | undefined {
    // Check all battlefields
    for (const battlefield of game.battlefields) {
      const unit = battlefield.units.find(u => u.instanceId === unitId);
      if (unit) return unit;
    }

    // Check all player zones
    for (const player of game.players) {
      // Check base
      const baseUnit = player.zones.base.find(u => u.instanceId === unitId);
      if (baseUnit) return baseUnit;

      // Check champion zone
      const championUnit = player.zones.championZone.find(u => u.instanceId === unitId);
      if (championUnit) return championUnit;
    }

    return undefined;
  }

  /**
   * Get unit location
   */
  private getUnitLocation(game: Game, unitId: string): { type: string; id?: string } | null {
    // Check battlefields
    for (const battlefield of game.battlefields) {
      if (battlefield.units.some(u => u.instanceId === unitId)) {
        return { type: 'battlefield', id: battlefield.id };
      }
    }

    // Check player bases
    for (const player of game.players) {
      if (player.zones.base.some(u => u.instanceId === unitId)) {
        return { type: 'base', id: player.id };
      }
    }

    return null;
  }

  /**
   * Get battlefield where unit is located
   */
  private getUnitBattlefield(game: Game, unitId: string): Battlefield | null {
    for (const battlefield of game.battlefields) {
      if (battlefield.units.some(u => u.instanceId === unitId)) {
        return battlefield;
      }
    }
    return null;
  }

  /**
   * Validate if movement is a valid Standard Move
   */
  private isValidStandardMove(game: Game, from: { type: string; id?: string }, toBattlefieldId: string): boolean {
    // Standard Move must be Base ↔ Battlefield
    if (from.type === 'base') {
      // Base → Battlefield is always valid
      return true;
    }

    if (from.type === 'battlefield') {
      // Battlefield → another location requires Ganking (handled separately)
      // Standard Move from battlefield must be back to base
      return false; // This would be a return to base, which is not typically allowed in Riftbound
    }

    return false;
  }

  /**
   * Check if unit can move to occupied battlefield
   */
  private canMoveToOccupiedBattlefield(game: Game, battlefield: Battlefield, playerId: string): boolean {
    const playersWithUnits = new Set<string>();

    battlefield.units.forEach(unit => {
      playersWithUnits.add(unit.controllerId);
    });

    // Cannot move if battlefield has units from 2+ OTHER players
    const otherPlayers = Array.from(playersWithUnits).filter(id => id !== playerId);

    return otherPlayers.length < 2;
  }

  /**
   * Execute the movement
   */
  private async executeMove(
    game: Game,
    unit: GameCard,
    from: { type: string; id?: string },
    toBattlefield: Battlefield
  ): Promise<void> {
    // Remove from source
    if (from.type === 'base') {
      const player = game.players.find(p => p.id === from.id);
      if (player) {
        const unitIndex = player.zones.base.findIndex(u => u.instanceId === unit.instanceId);
        if (unitIndex !== -1) {
          player.zones.base.splice(unitIndex, 1);
        }
      }
    } else if (from.type === 'battlefield') {
      const fromBattlefield = game.battlefields.find(b => b.id === from.id);
      if (fromBattlefield) {
        const unitIndex = fromBattlefield.units.findIndex(u => u.instanceId === unit.instanceId);
        if (unitIndex !== -1) {
          fromBattlefield.units.splice(unitIndex, 1);
        }
      }
    }

    // Add to target battlefield
    toBattlefield.units.push(unit);
  }

  /**
   * Remove hidden cards from uncontrolled battlefields (Cleanup step)
   */
  async cleanupHiddenCards(game: Game): Promise<void> {
    for (const battlefield of game.battlefields) {
      // If battlefield is not controlled, remove all hidden cards
      if (!battlefield.controller) {
        for (const card of battlefield.facedownCards) {
          // Return to owner's trash
          const owner = game.players.find(p => p.id === card.ownerId);
          if (owner) {
            owner.zones.trash.push(card);
          }
        }

        if (battlefield.facedownCards.length > 0) {
          logger.info(`BattlefieldManager: Removed ${battlefield.facedownCards.length} hidden cards from uncontrolled battlefield ${battlefield.id}`);
          battlefield.facedownCards = [];
        }
      }
    }
  }

  /**
   * Get battlefield statistics
   */
  getBattlefieldStats(game: Game): {
    total: number;
    contested: number;
    controlled: Record<string, number>;
    unitsPerBattlefield: Record<string, number>;
  } {
    const stats = {
      total: game.battlefields.length,
      contested: 0,
      controlled: {} as Record<string, number>,
      unitsPerBattlefield: {} as Record<string, number>
    };

    for (const battlefield of game.battlefields) {
      if (battlefield.contested) {
        stats.contested++;
      }

      if (battlefield.controller) {
        stats.controlled[battlefield.controller] = (stats.controlled[battlefield.controller] || 0) + 1;
      }

      stats.unitsPerBattlefield[battlefield.id] = battlefield.units.length;
    }

    return stats;
  }
}

// Global battlefield manager instance
export const battlefieldManager = new BattlefieldManager();
