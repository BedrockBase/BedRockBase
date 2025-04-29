import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../src/context/AuthContext';
import Loading from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Only proceed with redirect check once the auth state is determined
    if (!isLoading) {
      console.log('ProtectedRoute check - isAuthenticated:', isAuthenticated, 'user:', !!user);
      
      if (!isAuthenticated && !user) {
        // User is not authenticated, redirect to sign-in
        const currentPath = router.asPath;
        console.log('Redirecting unauthenticated user to signin from:', currentPath);
        
        router.push({
          pathname: '/signin',
          query: { returnUrl: currentPath }
        });
      }
      
      // Finished checking
      setIsChecking(false);
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Show loading state while checking auth or while router is transitioning
  if (isLoading || isChecking || router.isReady === false) {
    return <Loading message="Verifying authentication..." />;
  }

  // If we get here, user is authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
