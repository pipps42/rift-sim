import { Game, Player, Deck, GameStatus, GamePhase, TurnState } from '@/types/game';
import { eventBus, GameEventFactory } from '../events';
import { DeckValidator } from '../validators/DeckValidator';
import { GameSetup } from '../setup/GameSetup';
import { logger } from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { CardStorage } from '../storage/CardStorage';
import { HistoryQueryAPI } from '../history/HistoryQueryAPI';

/**
 * Central orchestrator for all Riftbound game operations
 * Manages game lifecycle, validation, and coordination between systems
 */
export class GameManager {
  private games: Map<string, Game> = new Map();
  private deckValidator: DeckValidator;
  private gameSetup: GameSetup;

  constructor() {
    this.deckValidator = new DeckValidator();
    this.gameSetup = new GameSetup();
  }

  /**
   * Create a new Riftbound game
   */
  async createGame(players: Player[], decks: Deck[]): Promise<Game> {
    // Validate inputs
    if (players.length !== 2) {
      throw new Error('Riftbound games require exactly 2 players');
    }

    if (decks.length !== 2) {
      throw new Error('Must provide exactly 2 decks');
    }

    // Validate each deck
    for (let i = 0; i < decks.length; i++) {
      const validation = await this.deckValidator.validateDeck(decks[i]!);
      if (!validation.isValid) {
        throw new Error(`Deck ${i + 1} is invalid: ${validation.errors.join(', ')}`);
      }
    }

    // Initialize card storage system
    const storage = new CardStorage();

    // Create game instance (temporarily without historyQuery to avoid circular ref)
    const game: Game = {
      id: uuidv4(),
      players: [players[0]!, players[1]!],
      currentPlayerIndex: 0, // Will be randomized during setup
      phase: GamePhase.AWAKEN,
      turnState: TurnState.NEUTRAL_OPEN,
      round: 0,
      status: GameStatus.SETUP,
      battlefields: [],
      chain: [],
      storage, // Card storage for sharing data between cards
      history: [], // Game event history
      historyQuery: null as any, // Will be set below
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Initialize history query API (needs game reference)
    game.historyQuery = new HistoryQueryAPI(game);

    // Store game
    this.games.set(game.id, game);

    logger.info(`GameManager: Created game ${game.id} with players ${players.map(p => p.name).join(', ')}`);

    // Emit game creation event
    await eventBus.emit(GameEventFactory.createGameStartEvent(
      game.id,
      players.map(p => p.id)
    ));

    return game;
  }

  /**
   * Join an existing game (placeholder for multiplayer expansion)
   */
  async joinGame(gameId: string, player: Player): Promise<void> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error(`Game ${gameId} not found`);
    }

    if (game.status !== GameStatus.SETUP) {
      throw new Error(`Cannot join game ${gameId}: game already started`);
    }

    // For now, Riftbound is 1v1 only
    throw new Error('Game joining not implemented - Riftbound is currently 1v1 only');
  }

  /**
   * Start a created game
   */
  async startGame(gameId: string): Promise<void> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error(`Game ${gameId} not found`);
    }

    if (game.status !== GameStatus.SETUP) {
      throw new Error(`Cannot start game ${gameId}: game status is ${game.status}`);
    }

    logger.info(`GameManager: Starting game ${gameId}`);

    try {
      // Perform game setup
      await this.gameSetup.setupGame(game);

      // Update game status
      game.status = GameStatus.IN_PROGRESS;
      game.updatedAt = new Date();

      logger.info(`GameManager: Game ${gameId} started successfully`);

    } catch (error) {
      logger.error(`GameManager: Failed to start game ${gameId}:`, error);
      game.status = GameStatus.ABANDONED;
      throw error;
    }
  }

  /**
   * End a game
   */
  async endGame(gameId: string, reason: string, winnerId?: string): Promise<void> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error(`Game ${gameId} not found`);
    }

    if (game.status === GameStatus.FINISHED) {
      logger.warn(`GameManager: Game ${gameId} already finished`);
      return;
    }

    game.status = GameStatus.FINISHED;
    if (winnerId) {
      game.winner = winnerId;
    }
    game.updatedAt = new Date();

    logger.info(`GameManager: Game ${gameId} ended. Winner: ${winnerId || 'None'}, Reason: ${reason}`);

    // Emit game end event
    await eventBus.emit(GameEventFactory.createGameEndEvent(gameId, winnerId || '', reason));

    // Clean up game after some time (placeholder for proper cleanup)
    setTimeout(() => {
      this.games.delete(gameId);
      logger.debug(`GameManager: Cleaned up game ${gameId}`);
    }, 300000); // 5 minutes
  }

  /**
   * Get a game by ID
   */
  getGame(gameId: string): Game | undefined {
    return this.games.get(gameId);
  }

  /**
   * Get all active games
   */
  getActiveGames(): Game[] {
    return Array.from(this.games.values()).filter(
      game => game.status === GameStatus.IN_PROGRESS
    );
  }

  /**
   * Get games for a specific player
   */
  getPlayerGames(playerId: string): Game[] {
    return Array.from(this.games.values()).filter(
      game => game.players.some(p => p.id === playerId)
    );
  }

  /**
   * Validate a deck for Riftbound rules
   */
  async validateDeck(deck: Deck): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    return await this.deckValidator.validateDeck(deck);
  }

  /**
   * Surrender a player from a game
   */
  async surrender(gameId: string, playerId: string): Promise<void> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error(`Game ${gameId} not found`);
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error(`Cannot surrender from game ${gameId}: game not in progress`);
    }

    const playerIndex = game.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      throw new Error(`Player ${playerId} not found in game ${gameId}`);
    }

    // Determine winner (the other player)
    const opponentIndex = playerIndex === 0 ? 1 : 0;
    const winnerId = game.players[opponentIndex]!.id;

    await this.endGame(gameId, 'Surrender', winnerId);

    logger.info(`GameManager: Player ${playerId} surrendered from game ${gameId}`);
  }

  /**
   * Get game statistics
   */
  getStatistics(): {
    totalGames: number;
    activeGames: number;
    finishedGames: number;
    abandonedGames: number;
  } {
    const games = Array.from(this.games.values());

    return {
      totalGames: games.length,
      activeGames: games.filter(g => g.status === GameStatus.IN_PROGRESS).length,
      finishedGames: games.filter(g => g.status === GameStatus.FINISHED).length,
      abandonedGames: games.filter(g => g.status === GameStatus.ABANDONED).length
    };
  }

  /**
   * Check if a player can perform an action in a game
   */
  canPlayerAct(gameId: string, playerId: string): boolean {
    const game = this.games.get(gameId);
    if (!game || game.status !== GameStatus.IN_PROGRESS) {
      return false;
    }

    // Check if it's the player's turn (simplified for now)
    const currentPlayer = game.players[game.currentPlayerIndex];
    return currentPlayer?.id === playerId;
  }

  /**
   * Update game state (for internal use by other managers)
   */
  updateGame(gameId: string, updates: Partial<Game>): void {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error(`Game ${gameId} not found`);
    }

    Object.assign(game, updates, { updatedAt: new Date() });
  }
}

// Global game manager instance
export const gameManager = new GameManager();