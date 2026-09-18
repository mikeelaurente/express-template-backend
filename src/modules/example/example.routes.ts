import { Router } from 'express';
import { exampleController } from './example.controller.js';
import { asyncHandler } from '../../middlewares/error.middleware.js';

/**
 * Routes for the Example module
 *
 * Maps HTTP endpoints to controller methods.
 * Should contain minimal logic.
 */
export const exampleRouter = Router();

/**
 * GET /api/example
 * Returns example data
 */
exampleRouter.get(
  '/',
  asyncHandler((req, res) => exampleController.getExample(req, res)),
);

// Add more routes as needed
