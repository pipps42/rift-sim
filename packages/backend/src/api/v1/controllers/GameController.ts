import { Request, Response, NextFunction } from 'express';
import { GameManager } from '@/engine/managers/GameManager.js';
import { GameSerializer } from '../utils/GameSerializer.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import { TestDecks } from '../utils/TestDecks.js';
import { Player, CardType, Rarity, Domain, AbilityType, AbilityTiming, EventType } from '@/types/game.js';
import { PrismaClient } from '@/generated/prisma/index.js';

const prisma = new PrismaClient();

/**
 * SSE client connection tracking
 */
interface SSEClient {
  gameId: string;
  playerId: string;
  response: Response;
}

/**
 * GameController handles game-related HTTP endpoints
 * Wraps GameManager methods and serializes responses
 */
export class GameController {
  private gameManager: GameManager;
  private sseClients: Map<string, SSEClient[]>; // gameId -> clients

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
    this.sseClients = new Map();
  }

  /**
   * Helper to validate and get gameId from params
   */
  private getGameId(req: Request): string {
    const gameId = req.params.gameId;
    if (!gameId) {
      throw new BadRequestError('gameId is required');
    }
    return gameId;
  }

  /**
   * Helper to validate and get userId from request
   * TEMP: Creates guest user if no authentication
   */
  private async getUserId(req: Request, res?: Response): Promise<string> {
    // 1. Check if user is authenticated via JWT
    const userId = req.userId;
    if (userId) {
      return userId;
    }

    // 2. Check for guest user ID in cookies
    const guestUserId = req.cookies?.guestUserId;
    if (guestUserId) {
      // Verify this guest user exists in database
      const existingGuest = await prisma.user.findUnique({
        where: { id: guestUserId },
      });
      if (existingGuest) {
        return existingGuest.id;
      }
      // If cookie has invalid ID, fall through to create new guest
    }

    // 3. Create new guest user and set cookie
    const guestUser = await prisma.user.create({
      data: {
        username: `Guest_${Date.now()}`,
        email: `guest_${Date.now()}@riftbound.local`,
        passwordHash: '',
      },
    });

    // Set cookie to persist guest user across requests (expires in 24 hours)
    if (res) {
      res.cookie('guestUserId', guestUser.id, {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        sameSite: 'lax',
      });
    }

    return guestUser.id;
  }

  /**
   * Helper: Create a placeholder player for lobby
   */
  private createPlaceholderPlayer(): Player {
    return {
      id: 'PLACEHOLDER',
      name: 'Waiting for opponent...',
      score: 0,
      championLegend: {
        id: 'placeholder-legend',
        name: 'Placeholder Legend',
        energyCost: 0,
        powerCost: [],
        description: 'Placeholder',
        cardType: CardType.LEGEND,
        rarity: Rarity.MYTHIC,
        domains: [Domain.UNIVERSAL],
        keywords: [],
        tags: [],
        domainIdentity: [Domain.UNIVERSAL],
        championTag: 'placeholder',
        legendaryAbility: {
          id: 'placeholder-ability',
          name: 'Placeholder',
          description: 'Placeholder',
          type: AbilityType.STATIC,
          timing: AbilityTiming.NORMAL,
          effects: [],
        },
      },
      zones: {
        base: [],
        runes: [],
        hand: [],
        mainDeck: [],
        runeDeck: [],
        championZone: [],
        trash: [],
        banishment: [],
      },
      runePool: {
        energy: 0,
        power: [],
      },
      hasPlayedCard: false,
      turnsPassed: 0,
    };
  }

  /**
   * Create a new game lobby (waiting for player 2)
   * POST /api/v1/games
   */
  createGame = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const player1Id = await this.getUserId(req, res);

      // Get player 1 info from database
      const player1User = await prisma.user.findUnique({
        where: { id: player1Id },
      });

      if (!player1User) {
        throw new BadRequestError('Player 1 not found');
      }

      // Create test deck for player 1
      const deck1 = TestDecks.createBasicDeck(player1User.id, player1User.username);
      const placeholderDeck = TestDecks.createBasicDeck('PLACEHOLDER', 'Placeholder');

      // Create player 1 object
      const player1: Player = {
        id: player1User.id,
        name: player1User.username,
        score: 0,
        championLegend: {
          id: 'test-legend-1',
          name: `${player1User.username}'s Legend`,
          energyCost: 0,
          powerCost: [],
          description: 'A test champion legend',
          cardType: CardType.LEGEND,
          rarity: Rarity.MYTHIC,
          domains: [Domain.UNIVERSAL],
          keywords: [],
          tags: [],
          domainIdentity: [Domain.UNIVERSAL],
          championTag: 'test-champion',
          legendaryAbility: {
            id: 'test-legendary-ability',
            name: 'Test Ability',
            description: 'A placeholder legendary ability',
            type: AbilityType.STATIC,
            timing: AbilityTiming.NORMAL,
            effects: [],
          },
        },
        zones: {
          base: [],
          runes: [],
          hand: [],
          mainDeck: [],
          runeDeck: [],
          championZone: [],
          trash: [],
          banishment: [],
        },
        runePool: {
          energy: 0,
          power: [],
        },
        hasPlayedCard: false,
        turnsPassed: 0,
      };

      // Create placeholder player 2
      const player2 = this.createPlaceholderPlayer();

      // Create the game (not started yet)
      const game = await this.gameManager.createGame([player1, player2], [deck1, placeholderDeck]);

      // Mark game as waiting for players (do NOT start game)
      game.status = 'waiting_for_players' as any;

      const serializedGame = GameSerializer.toJSON(game);

      res.status(201).json({
        success: true,
        data: {
          gameId: game.id,
          game: serializedGame,
          player1Id: player1User.id,
          message: 'Game lobby created. Waiting for player 2 to join.',
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Join an existing game lobby
   * POST /api/v1/games/:gameId/join
   */
  joinGame = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const gameId = this.getGameId(req);
      const player2Id = await this.getUserId(req, res);

      const game = this.gameManager.getGame(gameId);
      if (!game) {
        throw new NotFoundError(`Game ${gameId} not found`);
      }

      // Check if game is waiting for players
      if (game.status !== 'waiting_for_players') {
        throw new BadRequestError('Game is not waiting for players');
      }

      // Check if player 2 slot is still available
      const player2 = game.players[1];
      if (!player2 || player2.id !== 'PLACEHOLDER') {
        throw new BadRequestError('Game already has 2 players');
      }

      // Get player 2 info from database
      const player2User = await prisma.user.findUnique({
        where: { id: player2Id },
      });

      if (!player2User) {
        throw new BadRequestError('Player not found');
      }

      // Create test deck for player 2
      const deck2 = TestDecks.createBasicDeck(player2User.id, player2User.username);

      // Create player 2 object
      const newPlayer2: Player = {
        id: player2User.id,
        name: player2User.username,
        score: 0,
        championLegend: {
          id: 'test-legend-2',
          name: `${player2User.username}'s Legend`,
          energyCost: 0,
          powerCost: [],
          description: 'A test champion legend',
          cardType: CardType.LEGEND,
          rarity: Rarity.MYTHIC,
          domains: [Domain.UNIVERSAL],
          keywords: [],
          tags: [],
          domainIdentity: [Domain.UNIVERSAL],
          championTag: 'test-champion',
          legendaryAbility: {
            id: 'test-legendary-ability-2',
            name: 'Test Ability',
            description: 'A placeholder legendary ability',
            type: AbilityType.STATIC,
            timing: AbilityTiming.NORMAL,
            effects: [],
          },
        },
        zones: {
          base: [],
          runes: [],
          hand: [],
          mainDeck: [],
          runeDeck: [],
          championZone: [],
          trash: [],
          banishment: [],
        },
        runePool: {
          energy: 0,
          power: [],
        },
        hasPlayedCard: false,
        turnsPassed: 0,
      };

      // Load deck cards into player 2's zones BEFORE replacing placeholder
      await this.gameManager.loadDeckCards(deck2, newPlayer2);

      // Replace placeholder with real player
      game.players[1] = newPlayer2;

      // Update deck in GameManager (player index 1 is player 2)
      this.gameManager.updatePlayerDeck(gameId, 1, deck2);

      // Start the game (this will load cards from the updated deck)
      await this.gameManager.startGame(gameId);

      // Get updated game state
      const updatedGame = this.gameManager.getGame(gameId);
      if (!updatedGame) {
        throw new NotFoundError('Game was joined but not found');
      }

      // Broadcast state change to SSE clients
      this.broadcastGameStateChange(gameId);

      const serializedGame = GameSerializer.toJSON(updatedGame);

      res.json({
        success: true,
        data: {
          game: serializedGame,
          player1Id: game.players[0]!.id,
          player2Id: player2User.id,
          message: 'Successfully joined game. Game is starting!',
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get game by ID
   * GET /api/v1/games/:gameId
   */
  getGame = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const gameId = this.getGameId(req);

      const game = this.gameManager.getGame(gameId);
      if (!game) {
        throw new NotFoundError(`Game ${gameId} not found`);
      }

      const serializedGame = GameSerializer.toJSON(game);

      res.json({
        success: true,
        data: { game: serializedGame },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all active games
   * GET /api/v1/games
   */
  getActiveGames = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const games = this.gameManager.getActiveGames();
      const serializedGames = games.map((g) => GameSerializer.toJSON(g));

      res.json({
        success: true,
        data: { games: serializedGames },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Start a game
   * POST /api/v1/games/:gameId/start
   */
  startGame = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const gameId = this.getGameId(req);

      await this.gameManager.startGame(gameId);

      const game = this.gameManager.getGame(gameId);
      if (!game) {
        throw new NotFoundError(`Game ${gameId} not found`);
      }

      const serializedGame = GameSerializer.toJSON(game);

      res.json({
        success: true,
        data: { game: serializedGame },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * End a game
   * POST /api/v1/games/:gameId/end
   * Body: { reason: string, winnerId?: string }
   */
  endGame = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const gameId = this.getGameId(req);
      const { reason, winnerId } = req.body;

      await this.gameManager.endGame(gameId, reason, winnerId);

      const game = this.gameManager.getGame(gameId);
      if (!game) {
        throw new NotFoundError(`Game ${gameId} not found`);
      }

      const serializedGame = GameSerializer.toJSON(game);

      res.json({
        success: true,
        data: { game: serializedGame },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Play a card
   * POST /api/v1/games/:gameId/actions/play-card
   * Body: { cardInstanceId: string, targets?: Target[] }
   */
  playCard = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const gameId = this.getGameId(req);
      const userId = await this.getUserId(req, res);
      const { cardInstanceId, targets } = req.body;

      if (!cardInstanceId) {
        throw new BadRequestError('cardInstanceId is required');
      }

      const result = await this.gameManager.playCard(
        gameId,
        userId,
        cardInstanceId,
        targets
      );

      if (!result.success) {
        throw new BadRequestError(result.error || 'Failed to play card');
      }

      const game = this.gameManager.getGame(gameId);
      if (!game) {
        throw new NotFoundError(`Game ${gameId} not found`);
      }

      // Broadcast state change to SSE clients
      this.broadcastGameStateChange(gameId);

      const serializedGame = GameSerializer.toJSON(game);

      res.json({
        success: true,
        data: {
          game: serializedGame,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Move a unit to another battlefield
   * POST /api/v1/games/:gameId/actions/move-unit
   * Body: { unitInstanceId: string, toBattlefieldId: string }
   */
  moveUnit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const gameId = this.getGameId(req);
      const userId = await this.getUserId(req, res);
      const { unitInstanceId, toBattlefieldId } = req.body;

      if (!unitInstanceId || !toBattlefieldId) {
        throw new BadRequestError('unitInstanceId and toBattlefieldId are required');
      }

      const result = await this.gameManager.standardMove(
        gameId,
        userId,
        unitInstanceId,
        toBattlefieldId
      );

      if (!result.success) {
        throw new BadRequestError(result.error || 'Failed to move unit');
      }

      const game = this.gameManager.getGame(gameId);
      if (!game) {
        throw new NotFoundError(`Game ${gameId} not found`);
      }

      // Broadcast state change to SSE clients
      this.broadcastGameStateChange(gameId);

      const serializedGame = GameSerializer.toJSON(game);

      res.json({
        success: true,
        data: {
          game: serializedGame,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Activate a card ability
   * POST /api/v1/games/:gameId/actions/activate-ability
   * Body: { cardInstanceId: string, abilityId: string, targets?: Target[] }
   */
  activateAbility = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const gameId = this.getGameId(req);
      const userId = await this.getUserId(req, res);
      const { cardInstanceId, abilityId, targets } = req.body;

      if (!cardInstanceId || !abilityId) {
        throw new BadRequestError('cardInstanceId and abilityId are required');
      }

      const result = await this.gameManager.activateAbility(
        gameId,
        userId,
        cardInstanceId,
        abilityId,
        targets
      );

      if (!result.success) {
        throw new BadRequestError(result.error || 'Failed to activate ability');
      }

      const game = this.gameManager.getGame(gameId);
      if (!game) {
        throw new NotFoundError(`Game ${gameId} not found`);
      }

      // Broadcast state change to SSE clients
      this.broadcastGameStateChange(gameId);

      const serializedGame = GameSerializer.toJSON(game);

      res.json({
        success: true,
        data: {
          game: serializedGame,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Pass priority
   * POST /api/v1/games/:gameId/actions/pass-priority
   */
  passPriority = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const gameId = this.getGameId(req);
      const userId = await this.getUserId(req, res);

      const result = await this.gameManager.passPriority(gameId, userId);

      if (!result.success) {
        throw new BadRequestError(result.error || 'Failed to pass priority');
      }

      const game = this.gameManager.getGame(gameId);
      if (!game) {
        throw new NotFoundError(`Game ${gameId} not found`);
      }

      // Broadcast state change to SSE clients
      this.broadcastGameStateChange(gameId);

      const serializedGame = GameSerializer.toJSON(game);

      res.json({
        success: true,
        data: {
          game: serializedGame,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get playable cards for current player
   * GET /api/v1/games/:gameId/playable-cards
   */
  getPlayableCards = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const gameId = this.getGameId(req);
      const userId = await this.getUserId(req, res);

      const playableCards = this.gameManager.getPlayableCards(gameId, userId);

      res.json({
        success: true,
        data: { playableCards },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get activatable abilities for current player
   * GET /api/v1/games/:gameId/activatable-abilities
   */
  getActivatableAbilities = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const gameId = this.getGameId(req);
      const userId = await this.getUserId(req, res);

      const activatableCards = this.gameManager.getActivatableCards(gameId, userId);

      res.json({
        success: true,
        data: { activatableCards },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Stream game state changes via Server-Sent Events (SSE)
   * GET /api/v1/games/:gameId/events
   *
   * Establishes a persistent connection that pushes game state updates to clients
   */
  streamGameEvents = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const gameId = this.getGameId(req);
      const userId = await this.getUserId(req, res);

      const game = this.gameManager.getGame(gameId);
      if (!game) {
        throw new NotFoundError(`Game ${gameId} not found`);
      }

      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

      // Register client
      if (!this.sseClients.has(gameId)) {
        this.sseClients.set(gameId, []);
      }
      const clients = this.sseClients.get(gameId)!;
      const client: SSEClient = {
        gameId,
        playerId: userId,
        response: res,
      };
      clients.push(client);

      // Send initial game state
      const serializedGame = GameSerializer.toJSON(game);
      res.write(`event: game-state\n`);
      res.write(`data: ${JSON.stringify({ game: serializedGame })}\n\n`);

      // Handle client disconnect
      req.on('close', () => {
        const clientIndex = clients.indexOf(client);
        if (clientIndex !== -1) {
          clients.splice(clientIndex, 1);
        }
        // Clean up empty game entries
        if (clients.length === 0) {
          this.sseClients.delete(gameId);
        }
      });

      // Keep connection alive with periodic heartbeat
      const heartbeat = setInterval(() => {
        res.write(`:heartbeat\n\n`);
      }, 15000); // Every 15 seconds

      req.on('close', () => {
        clearInterval(heartbeat);
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * Broadcast game state change to all connected SSE clients for a game
   * Called after any game action (play card, move unit, etc.)
   */
  broadcastGameStateChange(gameId: string): void {
    const clients = this.sseClients.get(gameId);
    if (!clients || clients.length === 0) {
      return;
    }

    const game = this.gameManager.getGame(gameId);
    if (!game) {
      return;
    }

    const serializedGame = GameSerializer.toJSON(game);
    const data = JSON.stringify({ game: serializedGame });

    // Send to all connected clients
    for (const client of clients) {
      try {
        client.response.write(`event: game-state\n`);
        client.response.write(`data: ${data}\n\n`);
      } catch (error) {
        console.error(`Failed to send SSE to client ${client.playerId}:`, error);
      }
    }
  }
}
