import { Router } from 'express';
import type { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import type { AuthMiddleware } from '../../middlewares/auth.middleware.js';

/**
 * Create authentication routes
 *
 * @param authService - The authentication service instance
 * @param authMiddleware - The authentication middleware instance
 * @returns Express router with auth routes
 */
export function createAuthRoutes(
  authService: AuthService,
  authMiddleware: AuthMiddleware,
): Router {
  const router = Router();
  const controller = new AuthController(authService);

  /**
   * POST /api/auth/register
   * Register a new user
   */
  router.post('/register', (req, res, next) =>
    controller.register(req, res, next),
  );

  /**
   * POST /api/auth/login
   * Login a user and receive JWT
   */
  router.post('/login', (req, res, next) => controller.login(req, res, next));

  /**
   * GET /api/auth/me
   * Get the current authenticated user (requires valid JWT)
   */
  router.get(
    '/me',
    authMiddleware.authenticate.bind(authMiddleware),
    (req, res, next) => controller.getCurrentUser(req, res, next),
  );

  return router;
}
