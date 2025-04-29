import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Authentication debugging utility to help troubleshoot login issues
 */
export class AuthDebugger {
  private _supabase: SupabaseClient;
  
  /**
   * Creates a new instance of the authentication debugger
   * @param supabaseUrl The Supabase project URL
   * @param supabaseAnonKey The Supabase anonymous key
   */
  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this._supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  /**
   * Tests the connection to Supabase
   * @returns True if connection is successful, false otherwise
   */
  public async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this._supabase.auth.getSession();
      
      if (error) {
        console.error('Supabase connection error:', error.message);
        return false;
      }
      
      console.log('Supabase connection successful');
      return true;
    } catch (err) {
      console.error('Exception during Supabase connection test:', err);
      return false;
    }
  }

  /**
   * Attempts login without actually logging in to test credentials
   * @param email User's email
   * @returns Object containing validation result and any error message
   */
  public async validateEmail(email: string): Promise<{ valid: boolean; message: string }> {
    try {
      // Check if email is in the correct format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { valid: false, message: 'Invalid email format' };
      }

      // Check if the user exists by trying a password reset
      // This doesn't expose security details but helps diagnose if the email exists
      const { error } = await this._supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error && error.message.includes('User not found')) {
        return { valid: false, message: 'Email not registered in the system' };
      }
      
      return { valid: true, message: 'Email appears to be registered' };
    } catch (err) {
      return { 
        valid: false, 
        message: err instanceof Error ? err.message : 'Unknown error validating email' 
      };
    }
  }
}

/**
 * Creates a pre-configured auth debugger instance
 */
export function createAuthDebugger(): AuthDebugger {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return new AuthDebugger(supabaseUrl, supabaseAnonKey);
}
