import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch establishments for a given user_id using the Supabase RPC function.
 * @param user_id - The UUID of the user
 * @returns Array of establishments or error
 */
export async function fetchEstablishments(user_id: string) {
  const { data, error } = await supabase.rpc('get_all_establishments_for_user', { user_id });
  if (error) {
    throw new Error('Failed to fetch establishments: ' + error.message);
  }
  return data;
}
