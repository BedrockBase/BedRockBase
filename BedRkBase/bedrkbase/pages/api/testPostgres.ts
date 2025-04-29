import { NextApiRequest, NextApiResponse } from 'next';
import logger from '../../lib/logger';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Always use mock data since we've moved database functionality to the backend
    logger.info('Using mock database response');
    return res.status(200).json({ 
      success: true, 
      result: [{ '?column?': 1 }],
      message: 'Mock database connection successful (Database functionality moved to backend)'
    });
    
    // Note: The actual database connection is now handled by the backend service
    // You can test the real database connection by accessing the backend API:
    // GET http://localhost:8000/api/health/db
  } catch (error: any) {
    logger.error('Database mock failed', { error });
    
    res.status(500).json({ 
      error: 'Database mock failed', 
      details: error.message || String(error),
      message: 'Database functionality has been moved to the backend service'
    });
  }
}
