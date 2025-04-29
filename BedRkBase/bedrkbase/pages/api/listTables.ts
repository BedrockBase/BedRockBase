import type { NextApiRequest, NextApiResponse } from 'next';
import { listSupabaseTables } from '../../lib/supabaseClient';
import { logMessage } from '../../lib/terminalLogger'; // Update to use logMessage

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Removed testSupabaseConnection, as it does not exist in lib/supabaseClient
    console.log('Attempting to list Supabase tables...');
    const result = await listSupabaseTables();
    console.log('Supabase tables listed successfully.');
    
    if (result.error) {
      console.error('Error listing Supabase tables:', result.error);
      res.status(500).json({
        error: result.error,
        details: result.details || 'No additional details available'
      });
      return;
    }

    if (!result.data || result.data.length === 0) {
      res.status(404).json({ message: 'No tables found' });
      return;
    }

    res.status(200).json({ tables: result.data });
  } catch (err) { // Ensure err is defined here
    const errorMessage = (err as Error).message; // Define errorMessage here
    logMessage(`Unexpected error in listTables API: ${errorMessage}`); // Use logMessage
    res.status(500).json({ 
      error: 'Internal server error',
      details: errorMessage
    });
  } // Closing brace for the handler function
}
