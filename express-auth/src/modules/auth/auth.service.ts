import type { UserRepository } from '../users/user.repository.js';
import { toSafeUser, type SafeUser } from '../users/user.types.js';
import { AppError } from '../../shared/errors/app-error.js';
import { hashPassword, comparePassword } from '../../shared/auth/password.js';
import { generateToken } from '../../shared/auth/token.js';

/**
 * Authentication service
 *
 * Contains the business logic for:
 * - User registration
 * - User login
 * - User retrieval
 *
 * This service is database-agnostic. It receives a UserRepository
 * implementation and delegates data access to it.
 *
 * The service does not depend on Express request/response objects.
 */

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  /**
   * Register a new user
   *
   * @param name - User's full name
   * @param email - User's email address
   * @param password - User's plaintext password (will be hashed)
   * @returns Safe user information
   * @throws AppError if email is already registered
   */
  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<SafeUser> {
    // Check if user with this email already exists
    const existingUser = await this.userRepository.findUserByEmail(email);

    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create the user
    // Note: ID generation is handled by the repository implementation
    const user = await this.userRepository.createUser({
      name,
      email,
      passwordHash,
    });

    return toSafeUser(user);
  }

  /**
   * Login a user
   *
   * @param email - User's email address
   * @param password - User's plaintext password
   * @returns Safe user information and JWT token
   * @throws AppError if credentials are invalid
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ user: SafeUser; token: string }> {
    // Find user by email
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      // Don't reveal if email exists
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken(user.id);

    return {
      user: toSafeUser(user),
      token,
    };
  }

  /**
   * Get a user by ID
   *
   * Used after JWT verification to retrieve the authenticated user.
   *
   * @param userId - The user ID
   * @returns Safe user information
   * @throws AppError if user is not found
   */
  async getUserById(userId: string): Promise<SafeUser> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return toSafeUser(user);
  }
}
