import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { createAuthDebugger } from '../../lib/auth-debug';
import styles from './SignInForm.module.css';

interface SignInFormProps {
  redirectTo?: string;
}

const SignInForm: React.FC<SignInFormProps> = ({ redirectTo = '/' }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Check connection on component mount if in debug mode
  useEffect(() => {
    if (debugMode) {
      checkConnection();
    }
  }, [debugMode]);

  const checkConnection = async () => {
    setConnectionStatus('Checking connection...');
    try {
      const authDebugger = createAuthDebugger();
      const isConnected = await authDebugger.testConnection();
      setConnectionStatus(isConnected ? 
        '✅ Connection to Supabase successful' : 
        '❌ Connection to Supabase failed');
    } catch (err) {
      setConnectionStatus('❌ Error checking connection');
      console.error(err);
    }
  };

  const validateEmail = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);
      const authDebugger = createAuthDebugger();
      const result = await authDebugger.validateEmail(email);
      
      if (result.valid) {
        setError(`Email validation: ${result.message}`);
      } else {
        setError(`Email issue: ${result.message}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error validating email');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Auth error details:', error);
        setError(error.message || 'Invalid login credentials');
      } else if (data?.user) {
        // Redirect on success
        window.location.href = redirectTo;
      }
    } catch (err) {
      console.error('Sign in exception:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Sign in to your account</h1>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="your@email.com"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              onChange={() => {}} // Handle remember me feature
            />
            Remember me
          </label>
          <a href="/forgot-password">Forgot your password?</a>
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className={styles.signInButton}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        
        <div className={styles.signupPrompt}>
          Don't have an account? <a href="/signup">Sign up</a>
        </div>

        <div className={styles.debugSection}>
          <button 
            type="button"
            onClick={() => setDebugMode(!debugMode)}
            className={styles.debugButton}
          >
            {debugMode ? 'Hide Debug Tools' : 'Show Debug Tools'}
          </button>
          
          {debugMode && (
            <div className={styles.debugTools}>
              <h4>Debug Tools</h4>
              <button 
                type="button" 
                onClick={checkConnection}
                className={styles.debugActionButton}
              >
                Test Supabase Connection
              </button>
              <button 
                type="button" 
                onClick={validateEmail}
                className={styles.debugActionButton}
              >
                Test Email Validity
              </button>
              {connectionStatus && (
                <div className={styles.connectionStatus}>
                  {connectionStatus}
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
