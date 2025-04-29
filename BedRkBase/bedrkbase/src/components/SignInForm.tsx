import React, { useState, FormEvent, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrigin } from '../lib/supabaseClient';

/**
 * Sign-in form component with proper port-agnostic redirection
 * @returns {JSX.Element} The sign-in form component
 */
const SignInForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const { login, isLoading, isAuthenticated, error: authError } = useAuth();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if already authenticated and redirect if needed
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = getRedirectUrl();
      console.log('User is already authenticated, redirecting to:', redirectTo);
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate]);
  
  // Log current context on mount for debugging
  useEffect(() => {
    console.log('SignInForm mounted');
    console.log('Current origin:', getOrigin());
    console.log('Current location:', location);
  }, [location]);
  
  /**
   * Get the redirect URL from various possible sources
   * @returns {string} The URL to redirect to after login
   */
  const getRedirectUrl = (): string => {
    // Check for redirectTo in query parameters
    const params = new URLSearchParams(location.search);
    const redirectTo = params.get('redirectTo');
    if (redirectTo) {
      console.log('Found redirectTo in query params:', redirectTo);
      return redirectTo;
    }
    
    // Check for redirect in location state
    const state = location.state as { from?: { pathname: string } } | null;
    if (state?.from?.pathname) {
      console.log('Found redirect path in location state:', state.from.pathname);
      return state.from.pathname;
    }
    
    // Default redirect
    return '/dashboard';
  };

  /**
   * Handle form submission
   * @param {FormEvent} e - The form event
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setFormError(null);
    
    // Form validation
    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }
    
    if (!password.trim()) {
      setFormError('Password is required');
      return;
    }
    
    try {
      // Get the redirect URL
      const redirectUrl = getRedirectUrl();
      
      console.log('Attempting login with redirect to:', redirectUrl);
      
      // Attempt login
      const { success, error } = await login(email, password, redirectUrl);
      
      if (!success && error) {
        setFormError(error);
        console.error('Login failed:', error);
      } else {
        console.log('Login successful, redirecting handled by AuthContext');
        // The redirect is handled in the AuthContext after successful login
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setFormError(errorMessage);
      console.error('Sign-in error:', errorMessage);
    }
  };

  return (
    <div className="sign-in-container">
      <h2>Sign In</h2>
      
      {/* Display form errors */}
      {(formError || authError) && (
        <div className="error-message">
          {formError || authError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="current-password"
          />
        </div>
        
        <button 
          type="submit" 
          className="sign-in-button"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="links">
        <a href="/forgot-password">Forgot password?</a>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
