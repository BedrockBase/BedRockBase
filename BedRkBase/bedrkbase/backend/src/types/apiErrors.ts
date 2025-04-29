/**
 * Standardized API error codes and messages for BedRkBase.
 * Use these codes in all error responses for consistency and easier client-side handling.
 */

export const API_ERRORS = {
  VALIDATION_FAILED: {
    code: 'VALIDATION_FAILED',
    message: 'Validation failed',
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'Resource not found',
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Unauthorized access',
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'Forbidden',
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'Internal server error',
  },
  DB_ERROR: {
    code: 'DB_ERROR',
    message: 'Database error',
  },
  // Add more as needed
};

export type ApiErrorCode = keyof typeof API_ERRORS;

/**
 * ApiError class for consistent error handling
 * Usage: throw new ApiError('NOT_FOUND', 'Custom message', 404, details)
 */
export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(
    errorCode: ApiErrorCode,
    message?: string,
    statusCode: number = 400,
    details?: any
  ) {
    super(message || API_ERRORS[errorCode].message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = API_ERRORS[errorCode].code;
    this.details = details;
  }
}
