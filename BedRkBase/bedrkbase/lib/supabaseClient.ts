/**
 * Supabase Client for BedRkBase Frontend
 * 
 * Handles authentication and other Supabase interactions
 */
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import logger from './logger';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Type for connection test result
interface ConnectionTestResult {
  success: boolean;
  error?: any;
  session?: Session | null;
}

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const message = 'Missing Supabase environment variables';
  logger.error(message);
  
  if (typeof window !== 'undefined') {
    console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
}

// Create Supabase client
export const supabase: SupabaseClient = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  }
);

/**
 * Tests the connection to Supabase
 * 
 * @returns Promise with the test result
 */
export async function testConnection(): Promise<ConnectionTestResult> {
  try {
    logger.info('Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      logger.error('Supabase connection test failed', { error });
      return { success: false, error };
    }

    logger.info('Supabase connection test successful', {
      hasSession: !!data.session,
      url: supabaseUrl
    });
    
    return { success: true, session: data.session };
  } catch (error) {
    logger.error('Unexpected error testing Supabase connection', { error });
    return { success: false, error };
  }
}

export default supabase;
