import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../types/errors';
import { ApiError } from '../types/errors';
import logger from '../utils/logger';

/**
 * Global error handling middleware
 * Processes all errors thrown in the application and formats appropriate responses
 * 
 * @param err - Error object that was thrown
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const errorMiddleware = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error('Error occurred', {
    url: req.url,
    method: req.method,
    error: err.message,
    stack: err.stack
  });

  // Default status code and message
  let statusCode = 500;
  let message = 'Internal server error';
  let details: unknown = undefined;

  // If it's our custom API error, use its status code and message
  if ('statusCode' in err) {
    statusCode = err.statusCode;
    message = err.message;
    
    // Include validation errors if present
    if ('errors' in err) {
      details = (err as ValidationError).errors;
    }
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    details,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};

/**
 * 404 Not Found middleware for undefined routes
 * 
 * @param req - Express request object
 * @param res - Express response object
 */
export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.url}`
  });
};
