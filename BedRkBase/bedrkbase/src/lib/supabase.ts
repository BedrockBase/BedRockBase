import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Authentication will not work properly.');
}

/**
 * Supabase client instance for authentication and database operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
