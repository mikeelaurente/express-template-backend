import { Request, Response, NextFunction } from 'express';
import { isAppError } from '../shared/errors/app-error.js';

/**
 * Error handling middleware
 *
 * Should be registered LAST, after all other middleware and routes.
 * Catches errors from async route handlers and passes them here.
 */
export function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Log error (but don't expose sensitive details)
  if (error instanceof Error) {
    console.error('[Error]', error.message);
  }

  // Handle known application errors
  if (isAppError(error)) {
    res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
    });
    return;
  }

  // Handle unexpected errors
  res.status(500).json({
    statusCode: 500,
    message: 'Internal server error',
  });
}
