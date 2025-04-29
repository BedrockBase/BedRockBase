import { createClient } from '@supabase/supabase-js';

/**
 * Get the current origin for redirect URLs, handling development and production environments
 * This makes authentication work regardless of which port is being used
 */
export const getOrigin = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Fallback for SSR or when window is not available
  return process.env.REACT_APP_PUBLIC_URL || 'http://localhost:3000';
};

// Get Supabase URL and anon key from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

import logger from './logger';

// Log configuration during initialization to help with debugging
logger.info(`Initializing Supabase client with URL: ${supabaseUrl}`);
logger.info(`Current origin detected as: ${getOrigin()}`);

if (!supabaseUrl || !supabaseAnonKey) {
  logger.error('Missing Supabase environment variables. Authentication will not work properly.');
}

/**
 * Supabase client instance configured with environment variables
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
    // Use dynamic origin for redirects to ensure it works on any port
    redirectTo: `${getOrigin()}/auth/callback`
  }
});

/**
 * Check if a user is authenticated
 * @returns {Promise<boolean>} Whether the user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      logger.error('Error checking authentication:', error);
      return false;
    }
    return !!data.session;
  } catch (error) {
    logger.error('Unexpected error during authentication check:', error);
    return false;
  }
};
