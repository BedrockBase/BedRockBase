/**
 * Utility functions for extracting and validating query parameters (e.g., pagination).
 */

import { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Extracts pagination parameters from the request query.
 * Provides defaults and ensures valid numbers.
 * @param req Express request object
 * @param defaultLimit Default items per page (default: 10)
 * @returns PaginationParams
 */
export function getPaginationParams(req: Request, defaultLimit = 10): PaginationParams {
  const page = req.query.page ? Math.max(1, parseInt(String(req.query.page), 10)) : 1;
  const limit = req.query.limit ? Math.max(1, parseInt(String(req.query.limit), 10)) : defaultLimit;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
