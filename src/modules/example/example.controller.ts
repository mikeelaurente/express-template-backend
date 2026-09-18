import { Request, Response } from 'express';
import { exampleService } from './example.service.js';
import { GetExampleSchema } from './example.schema.js';

/**
 * Controller layer for the Example module
 *
 * Receives HTTP requests and delegates to services.
 * Handles request/response mapping.
 * Does not contain business logic.
 */
export class ExampleController {
  /**
   * GET /api/example
   */
  async getExample(req: Request, res: Response): Promise<void> {
    // Validate input (if needed)
    // const input = GetExampleSchema.parse(req.query);

    // Call service
    const result = exampleService.getExample();

    // Return response
    res.status(200).json(result);
  }

  // Add more controller methods as needed
}

// Export singleton instance or create a new instance per request depending on your needs
export const exampleController = new ExampleController();
