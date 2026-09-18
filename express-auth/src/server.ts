import { env, validateEnv } from './config/env.js';
import { createApp } from './app.js';
import type { UserRepository } from './modules/users/user.repository.js';

/**
 * Start the HTTP server
 *
 * This is the entry point for the application.
 * The consuming project must provide a UserRepository implementation.
 *
 * Example:
 *   ```
 *   import { startServer } from './server.js';
 *   import { PostgresUserRepository } from './database/repositories/postgres-user.repository.js';
 *
 *   const userRepository = new PostgresUserRepository();
 *   startServer(userRepository);
 *   ```
 */

export async function startServer(
  userRepository: UserRepository,
): Promise<void> {
  try {
    // Validate environment variables
    validateEnv();

    // Create app
    const app = createApp(userRepository);

    // Start server
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
      console.log(`📝 Environment: ${env.NODE_ENV}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
