import { Request, Response, NextFunction } from 'express';

/**
 * 404 Not Found middleware
 *
 * Should be registered after all other routes.
 * Handles requests to endpoints that don't exist.
 */
export function notFoundMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.status(404).json({
    statusCode: 404,
    message: 'Not found',
  });
}
