import {
  Game,
  Player,
  ScoringMethod,
  ScoringEvent,
  BattlefieldControl
} from '@/types/game';
import { eventBus, GameEventFactory } from '../events';
import { logger } from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Handles Riftbound's victory condition system (Hold, Conquer, 8-point victory)
 */
export class ScoringManager {
  private battlefieldControls: Map<string, BattlefieldControl> = new Map();

  /**
   * Check for Hold scoring during Beginning Phase
   */
  async checkHoldScoring(game: Game, playerId: string, battlefieldId: string): Promise<void> {
    const battlefield = game.battlefields.find(b => b.id === battlefieldId);
    if (!battlefield) {
      logger.warn(`ScoringManager: Battlefield ${battlefieldId} not found`);
      return;
    }

    // Check if player controls the battlefield
    if (battlefield.controller !== playerId) {
      return; // Player doesn't control this battlefield
    }

    // Check if already scored this turn
    const control = this.getBattlefieldControl(battlefieldId);
    if (control.scoredThisTurn) {
      return; // Already scored this battlefield this turn
    }

    // Check if this is the player's Beginning Phase
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (currentPlayer?.id !== playerId) {
      return; // Not the player's turn
    }

    // Award Hold scoring
    await this.awardPoints(game, playerId, 1, ScoringMethod.HOLD, battlefieldId);

    logger.info(`ScoringManager: Player ${playerId} scored 1 point via Hold on battlefield ${battlefieldId}`);
  }

  /**
   * Check for Conquer scoring when gaining control
   */
  async checkConquerScoring(game: Game, playerId: string, battlefieldId: string): Promise<void> {
    const control = this.getBattlefieldControl(battlefieldId);

    // Check if player is gaining control (wasn't controlling before)
    if (control.controllerId === playerId) {
      return; // Player already controlled this battlefield
    }

    // Check if already scored this turn
    if (control.scoredThisTurn) {
      return; // Already scored this battlefield this turn
    }

    // Player is gaining control - award Conquer scoring
    await this.awardPoints(game, playerId, 1, ScoringMethod.CONQUER, battlefieldId);

    // Update control
    control.controllerId = playerId;

    logger.info(`ScoringManager: Player ${playerId} scored 1 point via Conquer on battlefield ${battlefieldId}`);
  }

  /**
   * Award points to a player
   */
  async awardPoints(
    game: Game,
    playerId: string,
    points: number,
    method: ScoringMethod,
    battlefieldId: string
  ): Promise<void> {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    const isFinalPoint = player.score === 7; // 8th point is the final point

    if (isFinalPoint) {
      await this.handleFinalPoint(game, playerId, method, battlefieldId);
    } else {
      // Normal scoring
      player.score += points;

      // Mark battlefield as scored this turn
      const control = this.getBattlefieldControl(battlefieldId);
      control.scoredThisTurn = true;

      // Create scoring event
      const scoringEvent: ScoringEvent = {
        id: uuidv4(),
        playerId,
        battlefieldId,
        scoringMethod: method,
        pointsAwarded: points,
        isFinalPoint: false,
        timestamp: new Date()
      };

      // Emit scoring event
      await eventBus.emit(GameEventFactory.createBattlefieldScoredEvent(
        game.id,
        playerId,
        battlefieldId,
        points,
        method
      ));

      logger.info(`ScoringManager: Awarded ${points} point(s) to player ${playerId}. Total: ${player.score}/8`);
    }

    // Check for victory
    await this.checkVictoryCondition(game);
  }

  /**
   * Handle special Final Point (8th point) rules
   */
  private async handleFinalPoint(
    game: Game,
    playerId: string,
    method: ScoringMethod,
    battlefieldId: string
  ): Promise<void> {
    const player = game.players.find(p => p.id === playerId);
    if (!player) return;

    if (method === ScoringMethod.HOLD) {
      // Hold: Player wins immediately
      player.score = 8;

      logger.info(`ScoringManager: Player ${playerId} wins with final point via Hold!`);

    } else if (method === ScoringMethod.CONQUER) {
      // Conquer: Check if ALL battlefields were scored this turn
      const allBattlefieldsScored = await this.checkAllBattlefieldsScored(game, playerId);

      if (allBattlefieldsScored) {
        // Player wins
        player.score = 8;

        logger.info(`ScoringManager: Player ${playerId} wins with final point via Conquer (all battlefields scored)!`);

      } else {
        // Draw 1 card instead of gaining the point
        await this.drawCardInsteadOfFinalPoint(game, playerId);

        logger.info(`ScoringManager: Player ${playerId} draws 1 card instead of final point (Conquer without all battlefields)`);
      }
    }

    // Mark battlefield as scored
    const control = this.getBattlefieldControl(battlefieldId);
    control.scoredThisTurn = true;

    // Emit final point event
    await eventBus.emit(GameEventFactory.createBattlefieldScoredEvent(
      game.id,
      playerId,
      battlefieldId,
      method === ScoringMethod.HOLD ? 1 : 0,
      method
    ));
  }

  /**
   * Check if all battlefields were scored by player this turn
   */
  private async checkAllBattlefieldsScored(game: Game, playerId: string): Promise<boolean> {
    for (const battlefield of game.battlefields) {
      const control = this.getBattlefieldControl(battlefield.id);

      // Check if this battlefield was scored by this player this turn
      if (!control.scoredThisTurn || control.controllerId !== playerId) {
        return false;
      }
    }

    return true;
  }

  /**
   * Draw card instead of awarding final point
   */
  private async drawCardInsteadOfFinalPoint(game: Game, playerId: string): Promise<void> {
    const player = game.players.find(p => p.id === playerId);
    if (!player) return;

    if (player.zones.mainDeck.length === 0) {
      // Handle Burn Out
      logger.warn(`ScoringManager: Player ${playerId} would draw but deck is empty`);
      // TODO: Implement Burn Out mechanics
      return;
    }

    const card = player.zones.mainDeck.shift();
    if (card) {
      player.zones.hand.push(card);

      await eventBus.emit(GameEventFactory.createCardDrawnEvent(
        game.id,
        playerId,
        card.cardId
      ));

      logger.debug(`ScoringManager: Player ${playerId} drew a card instead of final point`);
    }
  }

  /**
   * Check victory condition (8 points)
   */
  async checkVictoryCondition(game: Game): Promise<string | null> {
    for (const player of game.players) {
      if (player.score >= 8) {
        // Player wins!
        await eventBus.emit(GameEventFactory.createGameEndEvent(
          game.id,
          player.id,
          'Victory - 8 points reached'
        ));

        logger.info(`ScoringManager: Player ${player.name} wins with ${player.score} points!`);
        return player.id;
      }
    }

    return null; // No winner yet
  }

  /**
   * Check if a battlefield can be scored by a player
   */
  canScoreBattlefield(game: Game, battlefieldId: string, playerId: string): boolean {
    const control = this.getBattlefieldControl(battlefieldId);

    // Cannot score if already scored this turn
    if (control.scoredThisTurn) {
      return false;
    }

    // For Hold: Must control the battlefield
    // For Conquer: Must be gaining control
    const battlefield = game.battlefields.find(b => b.id === battlefieldId);
    if (!battlefield) {
      return false;
    }

    return battlefield.controller === playerId;
  }

  /**
   * Reset scoring flags for new turn
   */
  resetTurnScoring(): void {
    for (const control of this.battlefieldControls.values()) {
      control.scoredThisTurn = false;
    }

    logger.debug('ScoringManager: Reset turn scoring flags');
  }

  /**
   * Get or create battlefield control tracking
   */
  private getBattlefieldControl(battlefieldId: string): BattlefieldControl {
    let control = this.battlefieldControls.get(battlefieldId);

    if (!control) {
      control = {
        battlefieldId,
        contested: false,
        scoredThisTurn: false
      };
      this.battlefieldControls.set(battlefieldId, control);
    }

    return control;
  }

  /**
   * Update battlefield control when units move
   */
  updateBattlefieldControl(game: Game, battlefieldId: string): void {
    const battlefield = game.battlefields.find(b => b.id === battlefieldId);
    if (!battlefield) return;

    const control = this.getBattlefieldControl(battlefieldId);

    // Determine controller based on units present
    const playersWithUnits = new Set<string>();
    battlefield.units.forEach(unit => {
      playersWithUnits.add(unit.controllerId);
    });

    if (playersWithUnits.size === 0) {
      // No units - no controller
      delete battlefield.controller;
      control.contested = false;
    } else if (playersWithUnits.size === 1) {
      // Single player controls
      const controllerId = Array.from(playersWithUnits)[0];
      const previousController = battlefield.controller;

      if (controllerId) {
        battlefield.controller = controllerId;
      }
      control.contested = false;

      // Check for Conquer scoring if control changed
      if (previousController !== controllerId && controllerId) {
        this.checkConquerScoring(game, controllerId, battlefieldId);
      }
    } else {
      // Multiple players - contested
      control.contested = true;
      // Controller remains the same until combat resolves
    }

    logger.debug(`ScoringManager: Updated control for battlefield ${battlefieldId}. Controller: ${battlefield.controller}, Contested: ${control.contested}`);
  }

  /**
   * Get scoring statistics
   */
  getScoringStats(game: Game): {
    playerScores: Record<string, number>;
    battlefieldControls: Record<string, string | undefined>;
    scoringThisTurn: string[];
  } {
    const playerScores: Record<string, number> = {};
    game.players.forEach(player => {
      playerScores[player.id] = player.score;
    });

    const battlefieldControls: Record<string, string | undefined> = {};
    game.battlefields.forEach(battlefield => {
      battlefieldControls[battlefield.id] = battlefield.controller;
    });

    const scoringThisTurn: string[] = [];
    this.battlefieldControls.forEach((control, battlefieldId) => {
      if (control.scoredThisTurn) {
        scoringThisTurn.push(battlefieldId);
      }
    });

    return {
      playerScores,
      battlefieldControls,
      scoringThisTurn
    };
  }
}