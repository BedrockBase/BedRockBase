/**
 * Authentication context that provides user authentication state and methods
 * throughout the application using React Context.
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { User, Session } from '@supabase/supabase-js';
import { 
  login as authLogin, 
  logout as authLogout, 
  resetPassword as authResetPassword 
} from '../../lib/authService';
import { getSupabaseClient } from '../../lib/authService';
import logger from '../../lib/logger';

/**
 * Authentication context interface defining available methods and properties
 */
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string, redirectPath?: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error: string | null }>;
  signup: (email: string, password: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider component that manages user sessions and auth state
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  // Initialize auth state on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const supabase = getSupabaseClient();
    logger.debug('Initializing auth state');

    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // Get current session and user
        const { data: { session } } = await supabase.auth.getSession();
        const { data: { user } } = await supabase.auth.getUser();
        
        // Update auth state
        setSession(session);
        setUser(user);
        setIsAuthenticated(!!session && !!user);
        
        if (session && user) {
          logger.info('Found existing session', { userId: user.id });
        } else {
          logger.info('No existing session found');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown authentication error';
        logger.error('Error during session initialization', { error: errorMessage });
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      logger.info('Auth state changed', { event: _event });
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session && !!session.user);
    });

    initializeAuth();

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Handle user login with email and password
   */
  const login = async (
    email: string,
    password: string,
    redirectPath: string = '/dashboard'
  ): Promise<{ success: boolean; error: string | null }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!email.trim() || !password.trim()) {
        setError('Email and password are required');
        return { success: false, error: 'Email and password are required' };
      }
      
      // Attempt login
      logger.info('Attempting login', { email, redirectPath });
      const { user, error } = await authLogin(email, password);
      
      // Handle login failure
      if (error || !user) {
        setError(error || 'Login failed');
        logger.warn('Login failed', { error });
        return { success: false, error: error || 'Login failed' };
      }
      
      // Login success - Supabase auth state change will update context
      logger.info('Login successful, preparing to redirect to', { redirectPath, userId: user.id });
      
      // Set the session-token cookie
      document.cookie = `session-token=${session?.access_token}; path=/; max-age=${session?.expires_in}`;

      // Use a direct window.location redirect which is more reliable
      // than router.push for auth redirects
      logger.info('Using direct navigation to', { redirectPath });
      window.location.href = redirectPath;

      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown login error';
      logger.error('Unexpected error during login', { error: errorMessage });
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user logout
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      logger.info('Attempting logout');
      const { error } = await authLogout();
      
      if (error) {
        setError(error);
        logger.warn('Logout failed', { error });
        return;
      }
      
      // Logout success - use direct navigation for consistency
      logger.info('Logout successful, redirecting to signin page');
      window.location.href = '/signin';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown logout error';
      logger.error('Error during logout', { error: errorMessage });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle password reset request
   */
  const resetPassword = async (email: string): Promise<{ success: boolean; error: string | null }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!email.trim()) {
        setError('Email is required');
        return { success: false, error: 'Email is required' };
      }
      
      const redirectTo = `${window.location.origin}/reset-password`;
      logger.info('Attempting password reset', { email });
      
      const { success, error } = await authResetPassword(email, redirectTo);
      
      if (!success) {
        setError(error || 'Password reset failed');
        logger.warn('Password reset failed', { error });
        return { success: false, error: error || 'Password reset failed' };
      }
      
      logger.info('Password reset email sent');
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during password reset';
      logger.error('Error during password reset', { error: errorMessage });
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
    resetPassword,
    signup: async (email, password) => {
      setIsLoading(true);
      setError(null);

      try {
        logger.info('Attempting signup with Supabase', { email });
        const { data, error } = await getSupabaseClient().auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/confirm`
          }
        });

        if (error) {
          setError(error.message);
          logger.warn('Supabase signup error', { email, error: error.message });
          return;
        }

        logger.info('Signup successful, confirmation email sent', { userId: data.user?.id });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown signup error';
        logger.error('Signup service error', error);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
