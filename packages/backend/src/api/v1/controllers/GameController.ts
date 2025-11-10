import { Request, Response, NextFunction } from 'express';
import { GameManager } from '@/engine/managers/GameManager.js';
import { GameSerializer } from '../utils/GameSerializer.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import { TestDecks } from '../utils/TestDecks.js';
import { Player, CardType, Rarity, Domain, AbilityType, AbilityTiming } from '@/types/game.js';
import { PrismaClient } from '@/generated/prisma/index.js';

const prisma = new PrismaClient();

/**
 * GameController handles game-related HTTP endpoints
 * Wraps GameManager methods and serializes responses
 */
export class GameController {
  private gameManager: GameManager;

  constructor(gameManager: GameManager) {
    this.gameManager = gameManager;
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
   */
  private getUserId(req: Request): string {
    const userId = req.userId;
    if (!userId) {
      throw new BadRequestError('User not authenticated');
    }
    return userId;
  }

  /**
   * Create a new game (2 players)
   * POST /api/v1/games
   * Body: { player2Id?: string } (optional - if not provided, creates a guest opponent)
   */
  createGame = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const player1Id = this.getUserId(req);
      const { player2Id } = req.body;

      // Get player 1 info from database
      const player1User = await prisma.user.findUnique({
        where: { id: player1Id },
      });

      if (!player1User) {
        throw new BadRequestError('Player 1 not found');
      }

      // Get or create player 2
      let player2User;
      if (player2Id) {
        player2User = await prisma.user.findUnique({
          where: { id: player2Id },
        });
        if (!player2User) {
          throw new BadRequestError('Player 2 not found');
        }
      } else {
        // Create a temporary guest opponent
        player2User = await prisma.user.create({
          data: {
            username: `Opponent_${Date.now()}`,
            email: `opponent_${Date.now()}@guest.riftbound.local`,
            passwordHash: '',
          },
        });
      }

      // Create test decks for both players
      const deck1 = TestDecks.createBasicDeck(player1User.id, player1User.username);
      const deck2 = TestDecks.createBasicDeck(player2User.id, player2User.username);

      // Create Player objects for the game
      const players: [Player, Player] = [
        {
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
        },
        {
          id: player2User.id,
          name: player2User.username,
          score: 0,
          championLegend: {
            id: 'test-legend-1',
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
        },
      ];

      // Create the game
      const game = await this.gameManager.createGame(players, [deck1, deck2]);

      // Start the game automatically
      await this.gameManager.startGame(game.id);

      // Get updated game state
      const updatedGame = this.gameManager.getGame(game.id);
      if (!updatedGame) {
        throw new NotFoundError('Game was created but not found');
      }

      const serializedGame = GameSerializer.toJSON(updatedGame);

      res.status(201).json({
        success: true,
        data: {
          game: serializedGame,
          player1Id: player1User.id,
          player2Id: player2User.id,
          message: 'Game created and started successfully',
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
      const userId = this.getUserId(req);
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
      const userId = this.getUserId(req);
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
      const userId = this.getUserId(req);
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
      const userId = this.getUserId(req);

      const result = await this.gameManager.passPriority(gameId, userId);

      if (!result.success) {
        throw new BadRequestError(result.error || 'Failed to pass priority');
      }

      const game = this.gameManager.getGame(gameId);
      if (!game) {
        throw new NotFoundError(`Game ${gameId} not found`);
      }

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
      const userId = this.getUserId(req);

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
      const userId = this.getUserId(req);

      const activatableCards = this.gameManager.getActivatableCards(gameId, userId);

      res.json({
        success: true,
        data: { activatableCards },
      });
    } catch (error) {
      next(error);
    }
  };
}
