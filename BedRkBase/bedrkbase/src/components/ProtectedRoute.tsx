import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

/**
 * Protected route component that redirects unauthenticated users to login
 * using port-agnostic paths
 * @param {ProtectedRouteProps} props - Component props
 * @returns {JSX.Element} The component
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Log current protection state for debugging
  console.log('ProtectedRoute check: ', { 
    path: location.pathname,
    isAuthenticated, 
    isLoading, 
    userEmail: user?.email 
  });

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="loading">Loading authentication status...</div>;
  }

  // If not authenticated, redirect to login with the requested URL as state
  if (!isAuthenticated) {
    console.log(`Access to ${location.pathname} denied - redirecting to login`);
    
    // Use relative paths to avoid hardcoded ports
    return (
      <Navigate 
        to={`/login?redirectTo=${encodeURIComponent(location.pathname)}`}
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If a specific role is required, check if the user has it
  if (requiredRole && user?.app_metadata?.role !== requiredRole) {
    console.log(`User lacks required role: ${requiredRole}`);
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has the required role, render the protected component
  console.log(`Access to ${location.pathname} granted for ${user?.email}`);
  return <>{children}</>;
};

export default ProtectedRoute;
