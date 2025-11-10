import { Router } from 'express';
import authRoutes from './routes/auth.routes.js';
import { createGameRoutes } from './routes/game.routes.js';
import type { GameManager } from '@/engine/managers/GameManager.js';

/**
 * Create API v1 router with all routes
 * @param gameManager - Shared GameManager instance
 */
export function createApiV1Router(gameManager: GameManager): Router {
  const router = Router();

  // Mount auth routes
  router.use('/auth', authRoutes);

  // Mount game routes (requires gameManager)
  router.use('/games', createGameRoutes(gameManager));

  return router;
}
