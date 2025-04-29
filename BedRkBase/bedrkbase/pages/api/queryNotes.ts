import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, testConnection } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await testConnection(); // Test the connection before querying
    console.log('Attempting to query notes...');
    const { data, error } = await supabase.from('notes').select('*');
    console.log('Notes queried successfully.');

    if (error) {
      console.error('Error querying notes table:', error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ notes: data });
  } catch (err) {
    console.error('Unexpected error:', (err as Error).message);
    res.status(500).json({ error: (err as Error).message });
  }
}
