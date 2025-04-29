import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../src/context/AuthContext';
import { NextPage } from 'next';
import logger from '../lib/logger';

/**
 * SignUpPage component for user registration
 * Using the blue gradient background styling for consistency
 */
const SignUpPage: NextPage = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Auth state
  const { signup, error: authError, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset form-specific errors
    setFormError(null);

    // Basic validation
    if (!email || !password) {
      setFormError('Email and password are required');
      return;
    }

    try {
      setIsSubmitting(true);
      logger.info('Processing sign-up submission');

      await signup(email, password);
      router.push('/signin');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.error('Sign-up error:', { error: errorMessage });
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="p-6 bg-slate-800/80 rounded-lg shadow-lg backdrop-blur-sm">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto animate-spin"></div>
          <p className="mt-3 text-center text-slate-300">Creating account...</p>
        </div>
      </div>
    );
  }

  // Main sign-up form
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Create your account</h2>
        </div>

        {(formError || authError) && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 rounded text-center">
            {formError || authError}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              className="form-input"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing up...
              </div>
            ) : (
              'Sign up'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
