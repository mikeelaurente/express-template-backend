import type { User } from '../../modules/users/user.types.js';
import type { UserRepository } from '../../modules/users/user.repository.js';

/**
 * In-memory user repository implementation
 *
 * ⚠️ DEMO/DEVELOPMENT ONLY - NOT FOR PRODUCTION
 *
 * This is a minimal in-memory implementation for development and testing.
 * It stores users in a JavaScript Map and loses all data when the process stops.
 *
 * For production, replace this with a real database implementation that
 * implements the UserRepository interface using:
 *
 *   - PostgreSQL + Kysely, Prisma, or raw SQL
 *   - MongoDB + Mongoose or native driver
 *   - MySQL + Drizzle, Prisma, or raw SQL
 *   - SQLite + any query builder
 *   - Any other persistence technology
 *
 * The AuthService and all other authentication components remain completely
 * unchanged regardless of which database you choose, because they depend
 * only on the UserRepository abstraction, not on this implementation.
 *
 * Example: Replacing with PostgreSQL
 *   ```typescript
 *   // In src/index.ts, replace:
 *   // import { InMemoryUserRepository } from './infrastructure/in-memory/in-memory-user.repository.js';
 *   // const userRepository = new InMemoryUserRepository();
 *
 *   // With:
 *   import { PostgresUserRepository } from './infrastructure/postgres/postgres-user.repository.js';
 *   const userRepository = new PostgresUserRepository(db);
 *
 *   startServer(userRepository);
 *   ```
 */

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async findUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findUserById(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    // Generate a simple ID for demo purposes
    // In production, this would be handled by your database
    const id = Math.random().toString(36).substring(2, 15);

    // Create the user with timestamp
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date(),
    };

    // Store in memory
    this.users.set(id, newUser);

    return newUser;
  }
}
