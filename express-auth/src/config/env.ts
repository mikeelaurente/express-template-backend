import 'dotenv/config';

/**
 * Environment variable configuration
 *
 * Centralized access to all environment variables used by the application.
 * Validates that required variables are present at startup.
 */

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  PORT: parseInt(getEnv('PORT', '3000'), 10),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '15m'),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
};

/**
 * Validate all required environment variables on startup
 */
export function validateEnv(): void {
  try {
    // Access all env values to trigger validation
    env.PORT;
    env.JWT_SECRET;
    env.JWT_EXPIRES_IN;
  } catch (error) {
    console.error('Environment configuration error:', error);
    process.exit(1);
  }
}
