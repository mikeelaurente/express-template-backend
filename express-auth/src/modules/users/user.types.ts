/**
 * User domain types
 *
 * Represents the user information needed by the authentication system.
 * This is separate from request/response DTOs.
 */

/**
 * Internal user representation
 *
 * This is what the application works with internally.
 * Database implementations will map their schema to this type.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

/**
 * Safe user information for API responses
 *
 * Never includes passwords, password hashes, or sensitive credentials.
 */
export interface SafeUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

/**
 * Convert an internal User to a safe API response
 */
export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}
