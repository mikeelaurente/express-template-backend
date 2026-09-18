import bcrypt from 'bcrypt';

/**
 * Password hashing and verification utilities
 *
 * Uses bcrypt for secure password hashing.
 * Never expose password hashes to clients.
 * Never log passwords or password hashes.
 */

const SALT_ROUNDS = 10;

/**
 * Hash a plaintext password using bcrypt
 *
 * @param password - The plaintext password to hash
 * @returns A hashed and salted password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a plaintext password against a bcrypt hash
 *
 * @param password - The plaintext password to verify
 * @param hash - The bcrypt hash to verify against
 * @returns True if the password matches the hash, false otherwise
 */
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
