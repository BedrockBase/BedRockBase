/**
 * Utility functions for standardized API responses.
 * Use these helpers to ensure consistent error and success responses across all routes.
 */

import { Response } from 'express';
import { ApiErrorCode, API_ERRORS } from '../types/apiErrors';

/**
 * Sends a standardized error response.
 * @param res Express response object
 * @param status HTTP status code
 * @param message Error message
 * @param error Optional error details
 * @param code Optional error code (from API_ERRORS)
 */
export function sendErrorResponse(
  res: Response,
  status: number,
  message: string,
  error?: unknown,
  code?: ApiErrorCode
) {
  return res.status(status).json({
    success: false,
    code: code ? API_ERRORS[code].code : undefined,
    message,
    error: error instanceof Error ? error.message : error || undefined,
  });
}

/**
 * Sends a standardized success response.
 * @param res Express response object
 * @param data Response data
 * @param status HTTP status code (default: 200)
 */
export function sendSuccessResponse<T>(
  res: Response,
  data: T,
  status = 200
) {
  return res.status(status).json({
    success: true,
    data,
  });
}
