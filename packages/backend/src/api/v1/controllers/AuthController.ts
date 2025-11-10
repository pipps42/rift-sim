import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@/generated/prisma/index.js';
import { BadRequestError } from '../utils/errors.js';

const prisma = new PrismaClient();

/**
 * JWT payload interface
 */
export interface JwtPayload {
  userId: string;
  username: string;
  isGuest: boolean;
}

/**
 * AuthController handles authentication endpoints
 */
export class AuthController {
  /**
   * Create a guest user for single-player mode
   * POST /api/v1/auth/guest
   */
  static async createGuestUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username } = req.body;

      if (!username || typeof username !== 'string') {
        throw new BadRequestError('Username is required');
      }

      // Generate unique guest username
      const guestUsername = `Guest_${username}_${Date.now()}`;

      // Create guest user in database
      const user = await prisma.user.create({
        data: {
          username: guestUsername,
          email: `${guestUsername}@guest.riftbound.local`,
          passwordHash: '', // No password for guest users
        },
      });

      // Generate JWT token
      const payload: JwtPayload = {
        userId: user.id,
        username: user.username,
        isGuest: true,
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            isGuest: true,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify JWT token and return user info
   * GET /api/v1/auth/me
   */
  static async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // User should be attached by auth middleware
      const userId = (req as Request & { userId?: string }).userId;

      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new BadRequestError('User not found');
      }

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}
