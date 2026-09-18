/**
 * Application entry point
 *
 * This example uses an in-memory repository for development.
 * For production, replace InMemoryUserRepository with your actual
 * database implementation (PostgreSQL, MongoDB, etc.)
 *
 * Example with PostgreSQL + Kysely:
 *   ```
 *   import { PostgresUserRepository } from './repositories/postgres.repository.js';
 *   const userRepository = new PostgresUserRepository(db);
 *   startServer(userRepository);
 *   ```
 */

import { startServer } from './server.js';
import { InMemoryUserRepository } from './repositories/in-memory.repository.js';

// Create an in-memory repository for development
const userRepository = new InMemoryUserRepository();

// Start the server
startServer(userRepository).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
