/**
 * ResponseBuilder Utility for Consistent API Responses
 * 
 * Usage:
 *   return sendSuccessResponse(res, data, 200, { pagination });
 *   return sendErrorResponse(res, 400, 'Validation failed', details, 'VALIDATION_FAILED');
 * 
 * @see [Checklist 5, 8] and snippets.md
 */

import { Response } from 'express';

export function sendSuccessResponse(
  res: Response,
  data: any,
  status: number = 200,
  meta?: Record<string, any>
) {
  return res.status(status).json({
    success: true,
    data,
    ...(meta ? { meta } : {})
  });
}

export function sendErrorResponse(
  res: Response,
  status: number,
  error: string,
  details?: any,
  code?: string
) {
  return res.status(status).json({
    success: false,
    error,
    ...(code ? { code } : {}),
    ...(details ? { details } : {})
  });
}
