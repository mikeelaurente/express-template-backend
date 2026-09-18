import { z } from 'zod';

// Define validation schema for environment variables
const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

// Parse and validate environment variables
export const env = EnvSchema.parse(process.env);

export type Env = z.infer<typeof EnvSchema>;
