import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, testConnection } from '../../lib/supabaseClient';
import logger from '../../lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await testConnection(); // Test the connection before querying
    logger.info('Attempting to query establishments...');
    const { data, error } = await supabase.from('establishments').select('*');

    if (error) {
      logger.error('Error querying establishments table:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }

    logger.info('Establishments queried successfully.');
    return res.status(200).json({ 
      success: true, 
      data: { establishments: data } 
    });
  } catch (err) {
    logger.error('Unexpected error:', err);
    return res.status(500).json({ 
      success: false, 
      error: (err as Error).message 
    });
  }
}
