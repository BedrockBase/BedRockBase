/**
 * Custom API error class with status code
 */
export class ApiError extends Error {
  statusCode: number;
  
  /**
   * Create a new API error
   * @param message - Error message
   * @param statusCode - HTTP status code
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error for request data validation failures
 */
export class ValidationError extends ApiError {
  errors: Record<string, unknown>;
  
  /**
   * Create a new validation error
   * @param message - Error message
   * @param errors - Validation error details
   */
  constructor(message: string, errors: Record<string, unknown>) {
    super(message, 400);
    this.errors = errors;
  }
}

/**
 * Not found error for missing resources
 */
export class NotFoundError extends ApiError {
  /**
   * Create a new not found error
   * @param message - Error message
   */
  constructor(message: string) {
    super(message, 404);
  }
}

/**
 * Unauthorized error for authentication failures
 */
export class UnauthorizedError extends ApiError {
  /**
   * Create a new unauthorized error
   * @param message - Error message
   */
  constructor(message: string) {
    super(message, 401);
  }
}

/**
 * Forbidden error for authorization failures
 */
export class ForbiddenError extends ApiError {
  /**
   * Create a new forbidden error
   * @param message - Error message
   */
  constructor(message: string) {
    super(message, 403);
  }
}
