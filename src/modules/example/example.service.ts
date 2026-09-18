import { GetExampleResponse } from './example.types.js';

/**
 * Service layer for the Example module
 *
 * Contains all business logic.
 * Does not depend on Express request/response objects.
 * Can be reused from different contexts (routes, jobs, etc.).
 */
export class ExampleService {
  /**
   * Get example data
   */
  getExample(): GetExampleResponse {
    return {
      message: 'Welcome to the Node.js backend starter template!',
      timestamp: new Date().toISOString(),
    };
  }

  // Add more service methods as needed
}

// Export singleton instance or create a new instance per request depending on your needs
export const exampleService = new ExampleService();
