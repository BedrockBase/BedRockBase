import { Router, Request, Response } from 'express';
import prisma from '../src/utils/prisma';
import logger from '../src/utils/logger';

const router = Router();

// GET /api/establishments with query params using built-in generics
router.get('/', async (req: Request<{}, any, any, { page?: string; limit?: string }>, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const establishments = await prisma.establishment.findMany({
      skip,
      take: limit,
    });

    res.json(establishments);
  } catch (error) {
    logger.error('Failed to fetch establishments', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    res.status(500).json({
      message: 'Failed to fetch establishments',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/establishments/:id using built-in generic for params
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = req.params.id;

    const establishment = await prisma.establishment.findUnique({
      where: { id },
    });

    if (!establishment) {
      return res.status(404).json({ message: 'Establishment not found' });
    }

    res.json(establishment);
  } catch (error) {
    logger.error('Failed to fetch establishment', {
      error: error instanceof Error ? error.message : 'Unknown error',
      establishmentId: req.params.id,
    });
    res.status(500).json({
      message: 'Failed to fetch establishment',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/establishments using generics for the request body
router.post('/', async (req: Request<{}, any, { name: string }>, res: Response) => {
  try {
    const establishment = await prisma.establishment.create({
      data: req.body,
    });

    res.status(201).json(establishment);
  } catch (error) {
    logger.error('Failed to create establishment', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    res.status(500).json({
      message: 'Failed to create establishment',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
