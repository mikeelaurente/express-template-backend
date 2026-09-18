import { Request, Response, NextFunction } from 'express';

/**
 * Request logger middleware
 *
 * Logs HTTP requests with method, path, status code, and duration.
 * Does NOT log sensitive information like:
 * - Request bodies (may contain passwords, tokens)
 * - Authorization headers
 * - Query parameters (may contain sensitive data)
 * - Response bodies
 */

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Record start time
  const startTime = Date.now();

  // Capture the original res.json to log after response
  const originalJson = res.json.bind(res);

  res.json = function (body: any) {
    // Calculate duration
    const duration = Date.now() - startTime;

    // Log the request
    logRequest(req, res, duration);

    // Send the response
    return originalJson(body);
  };

  next();
}

/**
 * Log a completed request
 *
 * Format: METHOD PATH ---- status ---- Xms
 * Example: POST /api/auth/login ---- 200 ---- 18ms
 */
function logRequest(req: Request, res: Response, duration: number): void {
  const method = req.method.padEnd(6);
  const path = req.path.padEnd(25);
  const status = String(res.statusCode).padStart(3);

  console.log(`${method} ${path} ---- ${status} ---- ${duration}ms`);
}
