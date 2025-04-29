import React from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../src/context/AuthContext';
import MainLayout from '../components/MainLayout';

/**
 * Interface for user profile card props
 */
interface UserProfileCardProps {
  email: string;
  userId: string;
  lastSignIn: string;
  fullName?: string;
  role?: string;
}

/**
 * User profile card component displaying user information
 * 
 * @param {UserProfileCardProps} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const UserProfileCard: React.FC<UserProfileCardProps> = ({
  email,
  userId,
  lastSignIn,
  fullName,
  role
}) => {
  return (
    <div className="bg-slate-800/80 rounded-lg shadow-md p-6 border border-slate-700/50">
      <h3 className="text-xl font-semibold mb-4 text-white">User Profile</h3>
      
      <div className="space-y-4">
        {fullName && (
          <div className="flex flex-col">
            <span className="text-slate-400 text-sm">Full Name</span>
            <span className="text-white font-medium">{fullName}</span>
          </div>
        )}
        
        <div className="flex flex-col">
          <span className="text-slate-400 text-sm">Email</span>
          <span className="text-white font-medium">{email}</span>
        </div>
        
        {role && (
          <div className="flex flex-col">
            <span className="text-slate-400 text-sm">Role</span>
            <span className="text-white font-medium">{role}</span>
          </div>
        )}
        
        <div className="flex flex-col">
          <span className="text-slate-400 text-sm">User ID</span>
          <span className="text-slate-300 text-xs font-mono truncate" title={userId}>
            {userId}
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-slate-400 text-sm">Last Sign In</span>
          <span className="text-slate-300">
            {lastSignIn}
          </span>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-700">
        <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
          Update Profile
        </button>
      </div>
    </div>
  );
};

/**
 * Dashboard component displaying main application features
 * Uses the MainLayout for consistent styling across the application
 * 
 * @returns {JSX.Element | null} - Rendered component or null if not authenticated
 */
function Dashboard(): JSX.Element | null {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  
  if (!isAuthenticated || !user) {
    return null; // Will be handled by ProtectedRoute
  }
  
  // Format the last sign in time if available
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Extract user information
  const userInfo = {
    email: user.email || 'No email provided',
    userId: user.id,
    lastSignIn: formatDate(user.last_sign_in_at),
    fullName: user.user_metadata?.full_name || user.user_metadata?.name,
    role: user.user_metadata?.role || 'Standard User'
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information Section */}
        <div className="lg:col-span-1">
          <UserProfileCard {...userInfo} />
        </div>
        
        {/* Dashboard Content */}
        <div className="lg:col-span-2">
          <div className="p-6 bg-slate-800/40 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50">
            <h2 className="text-2xl font-bold text-white mb-6">Welcome to BedRockBase Dashboard</h2>
            <p className="text-slate-300 mb-8">Start managing your environmental data efficiently.</p>
            
            {/* Activity Summary Section */}
            <div className="p-6 bg-slate-800/80 rounded-lg shadow-md border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4 text-white">System Status</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Database Connection</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Online
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">API Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Operational
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Last System Update</span>
                  <span className="text-slate-300 text-sm">April 20, 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

/**
 * DashboardPage wrapped with ProtectedRoute to ensure authentication
 * 
 * @returns {JSX.Element} - Protected Dashboard component
 */
const DashboardPage = (): JSX.Element => (
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
);

export default DashboardPage;
