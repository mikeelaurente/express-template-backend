import { z } from 'zod';

/**
 * Request validation schemas for the Example module
 *
 * Use Zod to validate incoming request data at runtime.
 * Zod provides both validation and TypeScript type inference.
 */

export const GetExampleSchema = z.object({
  // Query parameters (if needed)
  // name: z.string().optional(),
});

export type GetExampleInput = z.infer<typeof GetExampleSchema>;

// Add more schemas as needed for other endpoints
// Example:
// export const CreateExampleSchema = z.object({
//   name: z.string().min(1),
//   description: z.string().optional(),
// });
