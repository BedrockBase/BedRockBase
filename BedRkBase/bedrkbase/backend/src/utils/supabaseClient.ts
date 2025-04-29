import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from './logger';

// Load environment variables
dotenv.config();

// Define environment variables with fallbacks
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  logger.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Test Supabase connection
export async function testConnection() {
  try {
    logger.info('Testing Supabase connection...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      logger.error('Supabase connection test failed', { error });
      return { success: false, error };
    }

    logger.info('Supabase connection test successful', {
      hasSession: !!session,
      url: supabaseUrl
    });
    return { success: true, session };
  } catch (err) {
    logger.error('Unexpected error testing Supabase connection', { error: err });
    return { success: false, error: err };
  }
}

export default supabase;
