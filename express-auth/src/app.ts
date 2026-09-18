import express from 'express';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { createAuthRoutes } from './modules/auth/auth.routes.js';
import { AuthService } from './modules/auth/auth.service.js';
import { createAuthMiddleware } from './middlewares/auth.middleware.js';
import type { UserRepository } from './modules/users/user.repository.js';

/**
 * Create and configure the Express application
 *
 * @param userRepository - The user repository implementation
 * @returns Configured Express app
 */
export function createApp(
  userRepository: UserRepository,
): ReturnType<typeof express> {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLoggerMiddleware);

  // Services and middleware
  const authService = new AuthService(userRepository);
  const authMiddleware = createAuthMiddleware();

  // Routes
  app.use('/api/auth', createAuthRoutes(authService, authMiddleware));

  // Not found middleware
  app.use(notFoundMiddleware);

  // Error handling middleware (must be last)
  app.use(errorMiddleware);

  return app;
}
