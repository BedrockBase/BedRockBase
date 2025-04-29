import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';
import logger from '../utils/logger';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response';
import { API_ERRORS } from '../types/apiErrors';
import { getPaginationParams } from '../utils/query';
import { authMiddleware } from '../middleware/auth.middleware'; // [Checklist 1, 6] - See snippets.md for pattern
import { publicRateLimiter, authRateLimiter } from '../middleware/rateLimit.middleware'; // [Checklist 8] - See snippets.md

// Create router
const router = Router();

// Add schema for create
const CreateEstablishmentSchema = z.object({
  name: z.string().min(1, 'Name is required')
  // Add other fields as needed
});

/**
 * @route GET /api/establishments
 * @desc Get all establishments with optional filtering
 * @access Public
 */
router.get(
  '/',
  publicRateLimiter, // Apply public rate limiting to GET /api/establishments
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { skip, limit } = getPaginationParams(req);
      const userId = req.user?.id;

      if (!userId) {
        return sendErrorResponse(res, 401, API_ERRORS.UNAUTHORIZED.message, undefined, 'UNAUTHORIZED');
      }

      const establishments = await prisma.$queryRaw`SELECT * FROM public.get_all_establishments_for_user(${userId}::uuid) OFFSET ${skip} LIMIT ${limit}`;

      return sendSuccessResponse(res, establishments);
    } catch (error) {
      logger.error('Failed to fetch establishments', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return sendErrorResponse(res, 500, API_ERRORS.INTERNAL_ERROR.message, error, 'INTERNAL_ERROR');
    }
  }
);

/**
 * @route GET /api/establishments/:id
 * @desc Get a single establishment by ID
 * @access Public
 */
router.get(
  '/:id',
  publicRateLimiter, // Apply public rate limiting to GET /api/establishments/:id
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const establishment = await prisma.establishment.findUnique({
        where: { id: String(id) }
      });

      if (!establishment) {
        return sendErrorResponse(res, 404, API_ERRORS.NOT_FOUND.message, undefined, 'NOT_FOUND');
      }

      return sendSuccessResponse(res, establishment);
    } catch (error) {
      logger.error('Failed to fetch establishment', {
        error: error instanceof Error ? error.message : 'Unknown error',
        establishmentId: req.params.id
      });
      return sendErrorResponse(res, 500, API_ERRORS.INTERNAL_ERROR.message, error, 'INTERNAL_ERROR');
    }
  }
);

/**
 * @route POST /api/establishments
 * @desc Create a new establishment
 * @access Private (Requires authentication)
 * @see [Checklist 1, 6] and snippets.md for auth pattern
 */
router.post(
  '/',
  authMiddleware, // Require authentication
  authRateLimiter, // Apply stricter rate limiting for authenticated users
  async (req: Request, res: Response) => {
    // Validate input
    const parseResult = CreateEstablishmentSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendErrorResponse(res, 400, API_ERRORS.VALIDATION_FAILED.message, parseResult.error.format(), 'VALIDATION_FAILED');
    }
    const validData = parseResult.data;

    try {
      const establishment = await prisma.establishment.create({
        data: validData
      });

      return sendSuccessResponse(res, establishment, 201);
    } catch (error) {
      logger.error('Failed to create establishment', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return sendErrorResponse(res, 500, API_ERRORS.INTERNAL_ERROR.message, error, 'INTERNAL_ERROR');
    }
  }
);

export default router;

async function createFunction() {
  try {
    await prisma.$executeRawUnsafe(sql);
    console.log('Function created successfully');
  } catch (error) {
    console.error('Failed to create function', error);
  }
}

const sql = `
CREATE OR REPLACE FUNCTION public.get_all_establishments_for_user(user_id UUID)
RETURNS TABLE (
    id UUID,
    parent_id UUID,
    name VARCHAR,
    description VARCHAR,
    utm_zone SMALLINT,
    latitude DECIMAL,
    longitude DECIMAL,
    utm_x DECIMAL,
    utm_y DECIMAL,
    datum VARCHAR,
    long_calc DECIMAL,
    lat_calc DECIMAL,
    geom GEOGRAPHY,
    gov_id VARCHAR,
    local_id VARCHAR,
    alt_id VARCHAR,
    operating_permit_id VARCHAR,
    facility_type VARCHAR,
    naics_code VARCHAR,
    nace_code VARCHAR,
    sector_code VARCHAR,
    industry_description VARCHAR,
    capacity_mw DECIMAL,
    employees_total INTEGER,
    contact_name VARCHAR,
    contact_email VARCHAR,
    contact_phone VARCHAR,
    website_url VARCHAR,
    program_acronym VARCHAR,
    pollutant_release JSON,
    usr_defined_01 VARCHAR,
    usr_defined_02 VARCHAR,
    usr_defined_03 VARCHAR,
    usr_defined_04 VARCHAR,
    usr_defined_05 VARCHAR,
    usr_defined_06 VARCHAR,
    usr_defined_07 VARCHAR,
    usr_defined_08 VARCHAR,
    usr_defined_09 VARCHAR,
    usr_defined_10 VARCHAR,
    usr_json_defined JSON,
    upload VARCHAR,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    owner_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.parent_id,
        e.name,
        e.description,
        e.utm_zone,
        e.latitude,
        e.longitude,
        e.utm_x,
        e.utm_y,
        e.datum,
        e.long_calc,
        e.lat_calc,
        e.geom,
        e.gov_id,
        e.local_id,
        e.alt_id,
        e.operating_permit_id,
        e.facility_type,
        e.naics_code,
        e.nace_code,
        e.sector_code,
        e.industry_description,
        e.capacity_mw,
        e.employees_total,
        e.contact_name,
        e.contact_email,
        e.contact_phone,
        e.website_url,
        e.program_acronym,
        e.pollutant_release,
        e.usr_defined_01,
        e.usr_defined_02,
        e.usr_defined_03,
        e.usr_defined_04,
        e.usr_defined_05,
        e.usr_defined_06,
        e.usr_defined_07,
        e.usr_defined_08,
        e.usr_defined_09,
        e.usr_defined_10,
        e.usr_json_defined,
        e.upload,
        e.created_at,
        e.updated_at,
        e.owner_id
    FROM
        public.establishment e
    WHERE
        e.owner_id = user_id
        OR EXISTS (
            SELECT 1
            FROM public.establishment_access ea
        );
END;
$$ LANGUAGE plpgsql;
`;
