import React from 'react';
import { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../src/context/AuthContext';

/**
 * Custom App component to initialize pages
 * @param Component - The active page component
 * @param pageProps - Props for the page component
 */
function MyApp({ Component, pageProps }: AppProps): React.ReactNode {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}

export default MyApp;
