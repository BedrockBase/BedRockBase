import type { NextApiRequest, NextApiResponse } from 'next';
import { testConnection } from '../../lib/supabaseClient';
import logger from '../../lib/logger';
import { logMessage } from '../../lib/terminalLogger';

/**
 * API route to test the connection to Supabase
 * 
 * @param req - The request object
 * @param res - The response object
 * @returns Connection status response
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test the connection to Supabase
    const result = await testConnection();
    
    if (result.success) {
      const message = 'Supabase connection successful';
      logMessage(message);
      logger.info(message);
      
      return res.status(200).json({ 
        success: true, 
        message,
        hasSession: !!result.session
      });
    } else {
      const message = `Supabase connection failed: ${result.error || 'Unknown error'}`;
      logMessage(message);
      logger.error(message);
      
      return res.status(500).json({ 
        success: false, 
        message,
        error: result.error
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    logMessage(`Unexpected error testing connection: ${errorMessage}`);
    logger.error('Unexpected error in testConnection API route', { error });
    
    return res.status(500).json({ 
      success: false, 
      message: 'Unexpected error testing connection',
      error: errorMessage
    });
  }
}
