import { Request, Response, NextFunction } from 'express';
import type { AuthService } from './auth.service.js';
import {
  registerSchema,
  loginSchema,
  type RegisterSchemaType,
  type LoginSchemaType,
} from './auth.schema.js';
import type {
  RegisterResponse,
  LoginResponse,
  CurrentUserResponse,
} from './auth.types.js';
import { AppError } from '../../shared/errors/app-error.js';

/**
 * Authentication controller
 *
 * Handles HTTP concerns:
 * - Request parsing
 * - Validation
 * - Calling services
 * - HTTP responses and status codes
 *
 * Does not contain authentication business logic.
 */

export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /api/auth/register
   *
   * Register a new user
   */
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Validate request body
      let validatedData: RegisterSchemaType;
      try {
        validatedData = registerSchema.parse(req.body);
      } catch (error) {
        throw new AppError('Validation failed', 400);
      }

      // Call service
      const user = await this.authService.register(
        validatedData.name,
        validatedData.email,
        validatedData.password,
      );

      // Return response
      const response: RegisterResponse = {
        user,
        message: 'User registered successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   *
   * Login a user and return JWT token
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      let validatedData: LoginSchemaType;
      try {
        validatedData = loginSchema.parse(req.body);
      } catch (error) {
        throw new AppError('Validation failed', 400);
      }

      // Call service
      const result = await this.authService.login(
        validatedData.email,
        validatedData.password,
      );

      // Return response
      const response: LoginResponse = {
        user: result.user,
        token: result.token,
        message: 'Login successful',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   *
   * Get the current authenticated user
   *
   * Requires auth.middleware to have verified the JWT and attached req.user
   */
  async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Get user ID from authenticated request
      // auth.middleware ensures this is set
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      // Call service to get user
      const user = await this.authService.getUserById(userId);

      // Return response
      const response: CurrentUserResponse = {
        user,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
