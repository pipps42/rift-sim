import { Router } from 'express';
import { GameController } from '../controllers/GameController.js';
import { authenticate } from '../middleware/auth.js';
import type { GameManager } from '@/engine/managers/GameManager.js';

/**
 * Create game routes
 * @param gameManager - Shared GameManager instance
 */
export function createGameRoutes(gameManager: GameManager): Router {
  const router = Router();
  const controller = new GameController(gameManager);

  // All game routes require authentication
  // TEMP: Disabled for testing frontend integration
  // router.use(authenticate);

  /**
   * GET /api/v1/games
   * Get all active games
   */
  router.get('/', controller.getActiveGames);

  /**
   * POST /api/v1/games
   * Create a new game vs AI
   */
  router.post('/', controller.createGame);

  /**
   * GET /api/v1/games/:gameId
   * Get game state by ID
   */
  router.get('/:gameId', controller.getGame);

  /**
   * POST /api/v1/games/:gameId/start
   * Start a game
   */
  router.post('/:gameId/start', controller.startGame);

  /**
   * POST /api/v1/games/:gameId/end
   * End a game
   */
  router.post('/:gameId/end', controller.endGame);

  /**
   * GET /api/v1/games/:gameId/playable-cards
   * Get playable cards for current player
   */
  router.get('/:gameId/playable-cards', controller.getPlayableCards);

  /**
   * GET /api/v1/games/:gameId/activatable-abilities
   * Get activatable abilities for current player
   */
  router.get('/:gameId/activatable-abilities', controller.getActivatableAbilities);

  // === PLAYER ACTIONS ===

  /**
   * POST /api/v1/games/:gameId/actions/play-card
   * Play a card from hand
   */
  router.post('/:gameId/actions/play-card', controller.playCard);

  /**
   * POST /api/v1/games/:gameId/actions/move-unit
   * Move a unit between battlefields
   */
  router.post('/:gameId/actions/move-unit', controller.moveUnit);

  /**
   * POST /api/v1/games/:gameId/actions/activate-ability
   * Activate a card ability
   */
  router.post('/:gameId/actions/activate-ability', controller.activateAbility);

  /**
   * POST /api/v1/games/:gameId/actions/pass-priority
   * Pass priority to opponent
   */
  router.post('/:gameId/actions/pass-priority', controller.passPriority);

  return router;
}
