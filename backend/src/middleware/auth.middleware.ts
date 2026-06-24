// ========================================
// Darpan CP Tracker - Auth Middleware
// JWT token verify karta hai aur request mein user payload attach karta hai
// Protected routes ke liye yeh middleware lagana zaroori hai
// ========================================

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthRequest, JwtPayload } from '../types';
import { logger } from '../utils/logger';

/**
 * JWT Authentication middleware — Bearer token verify karta hai
 * Authorization header se token nikalke verify karta hai JWT_ACCESS_SECRET se
 * Verify hone pe req.user mein { userId, role } attach kar deta hai
 *
 * Agar token nahi hai → 401 Unauthorized
 * Agar token invalid ya expired hai → 403 Forbidden
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Auth: Token nahi mila request mein — unauthorized access attempt');
      res.status(401).json({
        success: false,
        error: 'Authentication required — Bearer token provide karo Authorization header mein',
      });
      return;
    }

    // "Bearer <token>" se actual token nikalo
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Token format galat hai — "Bearer <token>" format mein bhejo',
      });
      return;
    }

    // JWT verify karo
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

    // Decoded payload ko request mein attach karo
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    logger.debug(`Auth: User ${decoded.userId} (${decoded.role}) authenticated successfully`);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Auth: Token expired ho gaya hai — refresh token use karo');
      res.status(403).json({
        success: false,
        error: 'Token expired — refresh token use karke naya access token lo',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn(`Auth: Invalid token — ${error.message}`);
      res.status(403).json({
        success: false,
        error: 'Invalid token — dobara login karo',
      });
      return;
    }

    logger.error(`Auth: Unexpected error — ${(error as Error).message}`);
    res.status(500).json({
      success: false,
      error: 'Authentication mein internal error aaya',
    });
  }
};
