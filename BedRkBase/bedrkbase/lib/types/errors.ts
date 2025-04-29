/**
 * Custom error types for the BedRkBase application
 * 
 * These error types help provide consistent error handling throughout the application
 */

/**
 * Base error class for application errors
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    
    // Capturing stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Authentication errors
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, true);
  }
}

/**
 * Authorization errors
 */
export class AuthorizationError extends AppError {
  constructor(message = 'Not authorized to perform this action') {
    super(message, 403, true);
  }
}

/**
 * Validation errors
 */
export class ValidationError extends AppError {
  public readonly details: Record<string, string>;

  constructor(message = 'Validation failed', details: Record<string, string> = {}) {
    super(message, 400, true);
    this.details = details;
  }
}

/**
 * Not found errors
 */
export class NotFoundError extends AppError {
  constructor(entity = 'Resource', id?: string) {
    const message = id 
      ? `${entity} with ID ${id} not found` 
      : `${entity} not found`;
    super(message, 404, true);
  }
}

/**
 * Database errors
 */
export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500, true);
  }
}

/**
 * External service errors
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, message = 'External service failed') {
    super(`${service}: ${message}`, 502, true);
  }
}

/**
 * Maps any unknown error to an AppError
 * Ensures consistent error objects throughout the application
 */
export function mapError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    return new AppError(error.message, 500, false);
  }

  // Handle string errors
  if (typeof error === 'string') {
    return new AppError(error, 500, false);
  }

  // Handle other cases
  return new AppError('An unknown error occurred', 500, false);
}
