/**
 * Application entry point
 *
 * This entry point demonstrates how to wire the authentication system.
 *
 * Currently uses InMemoryUserRepository (for development/demo only).
 *
 * To switch to a real database:
 *   1. Create a repository implementing UserRepository interface
 *   2. Replace the import below
 *   3. Instantiate and pass to startServer()
 *
 * Example with PostgreSQL:
 *   ```
 *   import { PostgresUserRepository } from './infrastructure/postgres/postgres-user.repository.js';
 *   import { db } from './database/connection.js';
 *
 *   const userRepository = new PostgresUserRepository(db);
 *   startServer(userRepository);
 *   ```
 */

import { startServer } from './server.js';
import { InMemoryUserRepository } from './infrastructure/in-memory/in-memory-user.repository.js';

// Create an in-memory repository for development
// Replace this with your actual database repository for production
const userRepository = new InMemoryUserRepository();

// Start the server
startServer(userRepository).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
