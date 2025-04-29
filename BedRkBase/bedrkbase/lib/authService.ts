import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import logger from './logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let _supabase: SupabaseClient;

/**
 * Returns a singleton Supabase client instance.
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      logger.error('Supabase credentials are missing');
      throw new Error('Supabase credentials are missing');
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    });
  }
  return _supabase;
};

/**
 * Sign in a user with email and password.
 * @param email User's email
 * @param password User's password
 * @returns Object containing user data or error
 */
export const login = async (email: string, password: string) => {
  const supabase = getSupabaseClient();
  try {
    logger.info('Attempting login with Supabase', { email });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      logger.warn('Supabase login error', { email, error: error.message });
      return { user: null, error: error.message };
    }
    logger.info('Login successful', { userId: data.user?.id });
    return { user: data.user, error: null };
  } catch (error) {
    logger.error('Login service error', error);
    return {
      user: null,
      error: error instanceof Error
        ? error.message
        : 'An unexpected error occurred during login'
    };
  }
};

/**
 * Sign out the current user.
 * @returns Object with error if sign out fails
 */
export const logout = async () => {
  const supabase = getSupabaseClient();
  try {
    logger.info('Attempting logout');
    const { error } = await supabase.auth.signOut();
    if (error) {
      logger.warn('Logout error', { error: error.message });
      return { error: error.message };
    }
    logger.info('Logout successful');
    return { error: null };
  } catch (error) {
    logger.error('Logout service error', error);
    return { error: error instanceof Error ? error.message : 'Unexpected logout error' };
  }
};

/**
 * Get the current session.
 * @returns Current session if exists
 */
export const getCurrentSession = async (): Promise<Session | null> => {
  const supabase = getSupabaseClient();
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      logger.warn('Get session error', { error: error.message });
      return null;
    }
    return data.session;
  } catch (error) {
    logger.error('Get session service error', error);
    return null;
  }
};

/**
 * Get the current user.
 * @returns Current user if authenticated
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const supabase = getSupabaseClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      logger.warn('Get user error', { error: error.message });
      return null;
    }
    return data.user;
  } catch (error) {
    logger.error('Get user service error', error);
    return null;
  }
};

/**
 * Send a password reset email.
 * @param email User's email
 * @param redirectTo Redirect URL after reset
 * @returns Object with success and error
 */
export const resetPassword = async (email: string, redirectTo: string): Promise<{ success: boolean; error: string | null }> => {
  const supabase = getSupabaseClient();
  try {
    logger.info('Attempting password reset', { email });
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      logger.warn('Password reset error', { email, error: error.message });
      return { success: false, error: error.message };
    }
    logger.info('Password reset email sent', { email });
    return { success: true, error: null };
  } catch (error) {
    logger.error('Reset password service error', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unexpected error during password reset' };
  }
};
