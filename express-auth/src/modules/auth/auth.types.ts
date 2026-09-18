import type { SafeUser } from '../users/user.types.js';

/**
 * Authentication request/response types (DTOs)
 *
 * Separate from user domain types to maintain clear separation
 * between API contracts and internal domain models.
 */

/**
 * Registration request payload
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Registration response payload
 */
export interface RegisterResponse {
  user: SafeUser;
  message: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response payload
 */
export interface LoginResponse {
  user: SafeUser;
  token: string;
  message: string;
}

/**
 * Current user response payload
 */
export interface CurrentUserResponse {
  user: SafeUser;
}
