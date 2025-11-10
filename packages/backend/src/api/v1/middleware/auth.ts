import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors.js';
import type { JwtPayload } from '../controllers/AuthController.js';

/**
 * Extend Express Request to include userId
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      username?: string;
      isGuest?: boolean;
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 * Extracts token from Authorization header and verifies it
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('No authorization token provided');
    }

    // Extract Bearer token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedError('Invalid authorization header format');
    }

    const token = parts[1]!; // Safe: we checked parts.length === 2

    // Verify token
    const secret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, secret);
    const payload = decoded as JwtPayload;

    // Attach user info to request
    req.userId = payload.userId;
    req.username = payload.username;
    req.isGuest = payload.isGuest;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
}

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't fail if missing
 */
export function optionalAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }

    const token = parts[1]!; // Safe: we checked parts.length === 2
    const secret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, secret);
    const payload = decoded as JwtPayload;

    req.userId = payload.userId;
    req.username = payload.username;
    req.isGuest = payload.isGuest;

    next();
  } catch (error) {
    // Silently ignore authentication errors in optional mode
    next();
  }
}
