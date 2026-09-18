import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../shared/auth/token.js';
import { AppError } from '../shared/errors/app-error.js';

/**
 * Authentication middleware
 *
 * Verifies JWT tokens from the Authorization header.
 * Attaches the authenticated user ID to the request.
 *
 * Format expected:
 *   Authorization: Bearer <token>
 */

export class AuthMiddleware {
  /**
   * Authenticate request using JWT from Authorization header
   *
   * @throws AppError with status 401 if token is missing, malformed, or invalid
   */
  authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
      // Get Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new AppError('Missing authorization header', 401);
      }

      // Parse Bearer token
      const parts = authHeader.split(' ');

      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw new AppError('Invalid authorization header format', 401);
      }

      const token = parts[1];

      if (!token) {
        throw new AppError('Missing token', 401);
      }

      // Verify token
      let payload;
      try {
        payload = verifyToken(token);
      } catch (error) {
        throw new AppError('Invalid or expired token', 401);
      }

      // Attach user info to request
      // This makes req.user available in route handlers
      (req as any).user = payload;

      next();
    } catch (error) {
      next(error);
    }
  }
}

/**
 * Convenience function to create auth middleware
 */
export function createAuthMiddleware(): AuthMiddleware {
  return new AuthMiddleware();
}
