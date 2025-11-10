import { Router, type IRouter } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { authenticate } from '../middleware/auth.js';

const router: IRouter = Router();

/**
 * POST /api/v1/auth/guest
 * Create a guest user for single-player mode
 *
 * Body: { username: string }
 * Returns: { success: true, data: { user, token } }
 */
router.post('/guest', AuthController.createGuestUser);

/**
 * GET /api/v1/auth/me
 * Get current authenticated user
 *
 * Headers: Authorization: Bearer <token>
 * Returns: { success: true, data: { user } }
 */
router.get('/me', authenticate, AuthController.getCurrentUser);

export default router;
