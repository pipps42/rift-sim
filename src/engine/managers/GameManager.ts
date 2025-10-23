import { Game, Player, Deck, GameStatus, GamePhase, TurnState, GameCard } from '@/types/game';
import { eventBus, GameEventFactory } from '../events';
import { DeckValidator } from '../validators/DeckValidator';
import { GameSetup } from '../setup/GameSetup';
import { logger } from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { CardStorage } from '../storage/CardStorage';
import { HistoryQueryAPI } from '../history/HistoryQueryAPI';
import { CardStateScanner } from '../scanning/CardStateScanner';
import { CardScriptRuntime } from '../scripting/CardScriptRuntime';
import { ModifierRegistry } from '../actions/ModifierRegistry';
import type { ScanDelta, ActivatedAbilityInfo } from '../scanning/types/ScanTypes';

/**
 * Central orchestrator for all Riftbound game operations
 * Manages game lifecycle, validation, and coordination between systems
 */
export class GameManager {
  private games: Map<string, Game> = new Map();
  private deckValidator: DeckValidator;
  private gameSetup: GameSetup;

  // ⭐ NEW: Scanner system for card state tracking
  private cardScriptRuntime: CardScriptRuntime;
  private modifierRegistry: ModifierRegistry;
  private scanners: Map<string, CardStateScanner> = new Map(); // One scanner per game

  constructor() {
    this.deckValidator = new DeckValidator();
    this.gameSetup = new GameSetup();

    // Initialize card script runtime
    this.cardScriptRuntime = new CardScriptRuntime({
      scriptsDir: 'src/cards',
      hotReload: false,
      debug: false,
      timeout: 5000,
    });

    // Initialize modifier registry (global for now, could be per-game)
    this.modifierRegistry = new ModifierRegistry();
  }

  /**
   * Initialize the runtime (load scripts)
   */
  async initialize(): Promise<void> {
    await this.cardScriptRuntime.initialize();
    logger.info('GameManager: CardScriptRuntime initialized');
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
      currentTurn: 1, // Absolute turn counter, starts at 1
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

    // ⭐ NEW: Create scanner for this game
    const scanner = new CardStateScanner(this.cardScriptRuntime, this.modifierRegistry);
    this.scanners.set(game.id, scanner);

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

    // ⭐ Clean up scanner
    this.scanners.delete(gameId);

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

    // ⭐ Trigger state scan after update
    this.onStateChanged(game).catch(err => {
      logger.error(`GameManager: Error scanning state after update:`, err);
    });
  }

  // ============================================================================
  // ⭐ NEW: CardStateScanner Integration
  // ============================================================================

  /**
   * Called after any state change to scan cards and notify UI
   */
  private async onStateChanged(game: Game): Promise<void> {
    const scanner = this.scanners.get(game.id);
    if (!scanner) {
      logger.warn(`GameManager: No scanner found for game ${game.id}`);
      return;
    }

    try {
      const delta = await scanner.scanGameState(game);

      if (delta.changed && delta.changes) {
        logger.debug(`GameManager: State scan found ${delta.changes.length} changes in game ${game.id}`);

        // TODO: Notify UI/clients about changes
        // For now, just log
        for (const change of delta.changes) {
          logger.debug(`  - ${change.type}: ${change.card.name}`);
        }
      }
    } catch (error) {
      logger.error(`GameManager: Error during state scan:`, error);
    }
  }

  /**
   * Get scanner for a game (for external queries)
   */
  getScanner(gameId: string): CardStateScanner | undefined {
    return this.scanners.get(gameId);
  }

  /**
   * Query which cards are playable for a player
   */
  getPlayableCards(gameId: string, playerId: string): GameCard[] {
    const scanner = this.scanners.get(gameId);
    if (!scanner) {
      return [];
    }

    const results = scanner.getPlayableCards(playerId);
    return results.map(r => r.card);
  }

  /**
   * Query which cards have activatable abilities for a player
   */
  getActivatableCards(gameId: string, playerId: string): Array<{
    card: GameCard;
    abilities: ActivatedAbilityInfo[];
  }> {
    const scanner = this.scanners.get(gameId);
    if (!scanner) {
      return [];
    }

    const results = scanner.getActivatableCards(playerId);
    return results.map(r => ({
      card: r.card,
      abilities: r.abilities,
    }));
  }

  /**
   * ⭐ NEW: Activate an ability on a card
   *
   * This is called by the UI/controller when a player wants to activate an ability
   * (e.g., HIDDEN keyword, Phoenix resurrection, etc.)
   */
  async activateAbility(
    gameId: string,
    playerId: string,
    cardInstanceId: string,
    abilityId: string,
  ): Promise<{ success: boolean; error?: string }> {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: `Game ${gameId} not found` };
    }

    const scanner = this.scanners.get(gameId);
    if (!scanner) {
      return { success: false, error: 'Scanner not initialized' };
    }

    try {
      // Find the card in game
      const card = this.findCardInGame(game, cardInstanceId);
      if (!card) {
        return { success: false, error: `Card ${cardInstanceId} not found` };
      }

      // Get card state from scanner
      const cardState = scanner.getCardState(cardInstanceId);
      if (!cardState) {
        return { success: false, error: 'Card state not found' };
      }

      // Find the ability
      const ability = cardState.abilities.find(a => a.id === abilityId);
      if (!ability) {
        return { success: false, error: `Ability ${abilityId} not found on card` };
      }

      // Check if ability can be activated
      if (!ability.canActivate) {
        return { success: false, error: ability.reason ?? 'Cannot activate ability' };
      }

      // Verify player ownership
      if (card.ownerId !== playerId) {
        return { success: false, error: 'You do not own this card' };
      }

      // Pay costs
      const player = game.players.find(p => p.id === playerId);
      if (!player) {
        return { success: false, error: 'Player not found' };
      }

      if (ability.costs) {
        // Check and pay energy cost
        if (ability.costs.energy !== undefined) {
          if (player.runePool.energy < ability.costs.energy) {
            return { success: false, error: `Not enough energy (need ${ability.costs.energy})` };
          }
          player.runePool.energy -= ability.costs.energy;
        }

        // Check and pay power costs
        if (ability.costs.power) {
          for (const pc of ability.costs.power) {
            const pool = player.runePool.power.find(p => p.domain === pc.domain);
            if (!pool || pool.amount < pc.amount) {
              return { success: false, error: `Not enough ${pc.domain} power (need ${pc.amount})` };
            }
            pool.amount -= pc.amount;
          }
        }
      }

      // Execute ability
      // TODO: Build proper CardContext and execute ability.onActivate()
      logger.info(`GameManager: Activated ability ${abilityId} on card ${card.name} for player ${playerId}`);

      // Trigger state change
      game.updatedAt = new Date();
      await this.onStateChanged(game);

      return { success: true };
    } catch (error) {
      logger.error(`GameManager: Error activating ability:`, error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Find a card anywhere in the game by instance ID
   */
  private findCardInGame(game: Game, instanceId: string): GameCard | undefined {
    // Check all player zones
    for (const player of game.players) {
      const zones = [
        player.zones.hand,
        player.zones.mainDeck,
        player.zones.trash,
        player.zones.runeDeck,
        player.zones.runes,
        player.zones.base,
        player.zones.championZone,
        player.zones.banishment,
      ];

      for (const zone of zones) {
        const found = zone.find(c => c.instanceId === instanceId);
        if (found) return found;
      }
    }

    // Check battlefields
    for (const bf of game.battlefields) {
      if (bf.units) {
        const found = bf.units.find(c => c.instanceId === instanceId);
        if (found) return found;
      }

      if (bf.sides) {
        for (const side of Object.values(bf.sides)) {
          const found = side.find(c => c.instanceId === instanceId);
          if (found) return found;
        }
      }

      if (bf.facedownCards) {
        const found = bf.facedownCards.find(c => c.instanceId === instanceId);
        if (found) return found;
      }
    }

    // Check chain
    for (const item of game.chain) {
      if (item.sourceCard?.instanceId === instanceId) {
        return item.sourceCard;
      }
    }

    return undefined;
  }
}

// Global game manager instance
export const gameManager = new GameManager();