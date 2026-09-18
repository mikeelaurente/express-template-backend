import { UserRepository } from '../modules/users/user.repository.js';
import type { User } from '../modules/users/user.types.js';

/**
 * In-memory user repository implementation
 *
 * This is for development and testing purposes only.
 * Replace this with your actual database implementation for production.
 *
 * Example usage:
 *   ```
 *   import { startServer } from './server.js';
 *   import { InMemoryUserRepository } from './repositories/in-memory.repository.js';
 *
 *   const userRepository = new InMemoryUserRepository();
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
    const id = Math.random().toString(36).substring(2, 15);

    // Create the user
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date(),
    };

    // Store it
    this.users.set(id, newUser);

    return newUser;
  }
}
