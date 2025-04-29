import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';
import logger from '../utils/logger';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response';
import { API_ERRORS } from '../types/apiErrors';

// Create router
const router = Router();

/**
 * Schema for basic health check response
 * @example
 * {
 *   "status": "ok",
 *   "timestamp": "2023-05-12T08:12:34.567Z",
 *   "service": "BedRkBase API"
 * }
 */
const HealthResponseSchema = z.object({
  status: z.enum(['ok', 'error'], {
    description: 'Current service status (ok or error)'
  }),
  timestamp: z.string().datetime({
    message: 'Must be a valid ISO datetime string'
  }),
  service: z.string({
    description: 'Name of the service'
  })
});

/**
 * Schema for database health check response
 * @example
 * {
 *   "status": "ok",
 *   "timestamp": "2023-05-12T08:12:34.567Z",
 *   "service": "BedRkBase API",
 *   "database": "connected",
 *   "result": [{ "connection_test": 1 }]
 * }
 */
const DbHealthResponseSchema = HealthResponseSchema.extend({
  database: z.enum(['connected', 'disconnected', 'mock'], {
    description: 'Database connection status'
  }),
  result: z.array(
    z.object({ 
      connection_test: z.number({
        description: 'Database connection test result'
      })
    })
  ).optional().describe('Result of test query, omitted in error responses'),
  error: z.string().optional().describe('Error message if database connection failed')
});

// Type definitions derived from schemas
type HealthResponse = z.infer<typeof HealthResponseSchema>;
type DbHealthResponse = z.infer<typeof DbHealthResponseSchema>;

/**
 * @route GET /api/health
 * @desc Basic health check endpoint
 * @access Public
 * @returns {Object} Status information including service name and timestamp
 */
router.get('/', (_req: Request, res: Response) => {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'BedRkBase API'
  };
  return sendSuccessResponse(res, response);
});

/**
 * @route GET /api/health/db
 * @desc Database connection health check
 * @access Public
 * @returns {Object} Database connection status with test query result
 * @throws {500} If database connection fails
 */
router.get('/db', async (_req: Request, res: Response) => {
  try {
    // Define the expected type of the query result
    type QueryResult = Array<{ connection_test: number }>;
    
    // Execute a simple query to verify database connectivity
    const result = await prisma.$queryRaw<QueryResult>`
      SELECT 1 as connection_test
    `;
    
    // Log successful database check
    logger.info('Database health check succeeded');
    
    // Return successful database connection status
    const response: DbHealthResponse = {
      status: 'ok',
      database: 'connected',
      result,
      timestamp: new Date().toISOString(),
      service: 'BedRkBase API'
    };
    
    return sendSuccessResponse(res, response);
  } catch (error) {
    logger.error('Database health check failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return sendErrorResponse(res, 500, API_ERRORS.DB_ERROR.message, error, 'DB_ERROR');
  }
});

/**
 * @route GET /api/health/mock
 * @desc Mock database check for development environments
 * @access Public
 * @returns {Object} Mock database status
 */
router.get('/mock', (_req: Request, res: Response) => {
  const response: DbHealthResponse = {
    status: 'ok',
    database: 'mock',
    result: [{ connection_test: 1 }],
    timestamp: new Date().toISOString(),
    service: 'BedRkBase API'
  };
  return sendSuccessResponse(res, response);
});

export default router;
