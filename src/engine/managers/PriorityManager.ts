import {
  Game,
  PriorityState,
  PriorityReason,
  TurnState,
  GamePhase
} from '@/types/game';
import { eventBus, GameEventFactory } from '../events';
import { logger } from '@/utils/logger';

/**
 * Manages Priority, Focus, and Relevant Players according to Riftbound rules
 *
 * Priority Rules:
 * - Permission to take Discretionary Actions
 * - During Action Phase (Neutral Open): Turn Player has priority
 * - During Showdown: Player with Focus has priority
 * - During Closed State: Player who controls next chain item or next Relevant Player
 *
 * Focus Rules:
 * - Special permission during Showdown Open
 * - Player with Focus also has Priority
 * - Passing Priority maintains Focus
 * - Focus passes to next Relevant Player when passing
 */
export class PriorityManager {
  private priorityState: PriorityState = {
    currentPlayer: '',
    relevantPlayers: [],
    passedPlayers: []
  };

  /**
   * Assign priority to a player
   */
  async assignPriority(game: Game, playerId: string, reason: PriorityReason): Promise<void> {
    logger.info(`PriorityManager: Assigning priority to ${playerId} (reason: ${reason})`);

    this.priorityState.currentPlayer = playerId;
    this.priorityState.passedPlayers = []; // Reset passed players

    // Emit priority change event (would need to add to GameEventFactory)
    logger.debug(`PriorityManager: Priority assigned to ${playerId}`);
  }

  /**
   * Assign focus to a player during Showdown
   */
  async assignFocus(game: Game, playerId: string): Promise<void> {
    if (game.turnState !== TurnState.SHOWDOWN_OPEN && game.turnState !== TurnState.SHOWDOWN_CLOSED) {
      logger.warn('PriorityManager: Cannot assign focus outside of Showdown');
      return;
    }

    logger.info(`PriorityManager: Assigning focus to ${playerId}`);

    this.priorityState.focusPlayer = playerId;
    this.priorityState.currentPlayer = playerId; // Focus player also has priority

    logger.debug(`PriorityManager: Focus assigned to ${playerId}`);
  }

  /**
   * Handle player passing priority
   */
  async passPriority(game: Game, playerId: string): Promise<void> {
    if (!this.hasPriority(game, playerId)) {
      throw new Error(`Player ${playerId} does not have priority`);
    }

    logger.info(`PriorityManager: Player ${playerId} passed priority`);

    // Add to passed players
    if (!this.priorityState.passedPlayers.includes(playerId)) {
      this.priorityState.passedPlayers.push(playerId);
    }

    // Check if all relevant players have passed
    const allPassed = this.allRelevantPlayersPassed(game);

    if (allPassed) {
      logger.info('PriorityManager: All relevant players passed');
      // Return control to the turn system to proceed
      return;
    }

    // Pass priority to next relevant player
    await this.passToNextRelevantPlayer(game, playerId);
  }

  /**
   * Determine relevant players for current game context
   */
  async determineRelevantPlayers(game: Game): Promise<string[]> {
    const relevantPlayers: string[] = [];

    // If in combat, only combat participants are relevant
    if (game.combatState) {
      relevantPlayers.push(game.combatState.attackingPlayer);
      relevantPlayers.push(game.combatState.defendingPlayer);
    }
    // If in showdown, use showdown's relevant players
    else if (game.showdownState) {
      relevantPlayers.push(...game.showdownState.relevantPlayers);
    }
    // Otherwise, all players are relevant (for 1v1, both players)
    else {
      relevantPlayers.push(...game.players.map(p => p.id));
    }

    this.priorityState.relevantPlayers = relevantPlayers;

    logger.debug(`PriorityManager: Relevant players: ${relevantPlayers.join(', ')}`);

    return relevantPlayers;
  }

  /**
   * Check if a player has priority
   */
  hasPriority(game: Game, playerId: string): boolean {
    return this.priorityState.currentPlayer === playerId;
  }

  /**
   * Check if a player has focus (during Showdown)
   */
  hasFocus(game: Game, playerId: string): boolean {
    if (game.turnState !== TurnState.SHOWDOWN_OPEN && game.turnState !== TurnState.SHOWDOWN_CLOSED) {
      return false; // Focus only exists during Showdowns
    }

    return this.priorityState.focusPlayer === playerId;
  }

  /**
   * Check if a player can take action
   */
  canTakeAction(game: Game, playerId: string): boolean {
    // Must have priority
    if (!this.hasPriority(game, playerId)) {
      return false;
    }

    // During Showdown Open, must also have Focus
    if (game.turnState === TurnState.SHOWDOWN_OPEN) {
      return this.hasFocus(game, playerId);
    }

    // During Closed State, special rules apply (must be responding to chain)
    if (game.turnState === TurnState.NEUTRAL_CLOSED || game.turnState === TurnState.SHOWDOWN_CLOSED) {
      // Can only play Reaction timing cards/abilities
      return true;
    }

    // During Open State, normal priority rules
    return true;
  }

  /**
   * Invite a player to become relevant (allows them to respond)
   */
  async invitePlayer(game: Game, playerId: string): Promise<void> {
    if (!this.priorityState.relevantPlayers.includes(playerId)) {
      this.priorityState.relevantPlayers.push(playerId);
      logger.info(`PriorityManager: Invited player ${playerId} to become relevant`);
    }
  }

  /**
   * Get current priority state
   */
  getPriorityState(): Readonly<PriorityState> {
    return { ...this.priorityState };
  }

  /**
   * Reset priority state for new turn
   */
  resetForNewTurn(game: Game): void {
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) return;

    this.priorityState = {
      currentPlayer: currentPlayer.id,
      relevantPlayers: game.players.map(p => p.id),
      passedPlayers: []
    };

    logger.debug(`PriorityManager: Reset for new turn. Current player: ${currentPlayer.name}`);
  }

  /**
   * Reset priority state for Action Phase
   */
  resetForActionPhase(game: Game): void {
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer) return;

    this.priorityState = {
      currentPlayer: currentPlayer.id,
      relevantPlayers: game.players.map(p => p.id),
      passedPlayers: []
    };

    logger.debug('PriorityManager: Reset for Action Phase');
  }

  /**
   * Reset priority state for Showdown
   */
  resetForShowdown(game: Game, focusPlayerId: string, relevantPlayers: string[]): void {
    this.priorityState = {
      currentPlayer: focusPlayerId,
      focusPlayer: focusPlayerId,
      relevantPlayers,
      passedPlayers: []
    };

    logger.debug(`PriorityManager: Reset for Showdown. Focus player: ${focusPlayerId}`);
  }

  /**
   * Check if all relevant players have passed
   */
  private allRelevantPlayersPassed(game: Game): boolean {
    return this.priorityState.relevantPlayers.every(playerId =>
      this.priorityState.passedPlayers.includes(playerId)
    );
  }

  /**
   * Pass priority to next relevant player
   */
  private async passToNextRelevantPlayer(game: Game, currentPlayerId: string): Promise<void> {
    const relevantPlayers = this.priorityState.relevantPlayers;
    const currentIndex = relevantPlayers.indexOf(currentPlayerId);

    if (currentIndex === -1) {
      logger.error(`PriorityManager: Current player ${currentPlayerId} not in relevant players`);
      return;
    }

    // Find next player who hasn't passed
    let nextIndex = (currentIndex + 1) % relevantPlayers.length;
    let attempts = 0;

    while (attempts < relevantPlayers.length) {
      const nextPlayerId = relevantPlayers[nextIndex];

      if (nextPlayerId && !this.priorityState.passedPlayers.includes(nextPlayerId)) {
        // Found next player who hasn't passed
        await this.assignPriority(game, nextPlayerId, PriorityReason.RELEVANT_PLAYER);

        // During Showdown, also transfer Focus if in Open state
        if (game.turnState === TurnState.SHOWDOWN_OPEN) {
          await this.assignFocus(game, nextPlayerId);
        }

        return;
      }

      nextIndex = (nextIndex + 1) % relevantPlayers.length;
      attempts++;
    }

    logger.warn('PriorityManager: No next relevant player found (all passed)');
  }

  /**
   * Get priority transition info for display
   */
  getPriorityInfo(game: Game): {
    currentPlayer: string;
    focusPlayer: string | undefined;
    relevantPlayers: string[];
    passedPlayers: string[];
    canAct: Record<string, boolean>;
  } {
    const canAct: Record<string, boolean> = {};

    for (const player of game.players) {
      canAct[player.id] = this.canTakeAction(game, player.id);
    }

    return {
      currentPlayer: this.priorityState.currentPlayer,
      focusPlayer: this.priorityState.focusPlayer,
      relevantPlayers: this.priorityState.relevantPlayers,
      passedPlayers: this.priorityState.passedPlayers,
      canAct
    };
  }
}

// Global priority manager instance
export const priorityManager = new PriorityManager();
