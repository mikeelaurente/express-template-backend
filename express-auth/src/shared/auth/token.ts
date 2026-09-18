import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

/**
 * JWT token generation and verification utilities
 *
 * Tokens are kept minimal and only contain the user ID.
 * No refresh tokens are implemented in this template.
 */

/**
 * JWT payload interface
 */
export interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT access token for a user
 *
 * @param userId - The unique user identifier
 * @returns A signed JWT token
 */
export function generateToken(userId: string): string {
  const payload: TokenPayload = { userId };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode a JWT token
 *
 * @param token - The JWT token to verify
 * @returns The decoded token payload if valid
 * @throws Error if the token is invalid or expired
 */
export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
