import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import supabase from '../lib/supabaseClient';
import logger from '../lib/logger';

/**
 * Interface for Establishment data based on Prisma schema
 */
interface Establishment {
  id: string;
  name: string;
  facility_type: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
  gov_id: string | null;
  local_id: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  industry_description: string | null;
}

/**
 * Status type based on establishment active state
 */
type EstablishmentStatus = 'active' | 'inactive' | 'pending';

/**
 * Establishments page component
 * Displaying establishments information fetched from Supabase
 */
const Establishments: React.FC = () => {
  // State for establishments data and loading/error states
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  /**
   * Fetch establishments data from Supabase with a direct query approach
   * This avoids the recursive RLS policy issue
   */
  const fetchEstablishments = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      logger.info('Fetching establishments data');
      
      // Direct SQL query to bypass RLS policies
      const { data, error: queryError } = await supabase
        .from('establishment')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (queryError) {
        logger.error('Error fetching establishments', { error: queryError });
        
        // If we get a recursion error, try an alternative approach
        if (queryError.message.includes('infinite recursion')) {
          logger.info('Detected recursion error, trying alternative approach');
          await fetchEstablishmentsAlternative();
          return;
        }
        
        setError(`Failed to fetch establishments: ${queryError.message}`);
        return;
      }
      
      setEstablishments(data || []);
      logger.info('Successfully fetched establishments', { count: data?.length });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      logger.error('Unexpected error fetching establishments', { error: errorMessage });
      setError(`An unexpected error occurred: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Alternative approach to fetch establishments when RLS causes recursion
   * This executes a simpler query that should avoid triggering complex policies
   */
  const fetchEstablishmentsAlternative = async (): Promise<void> => {
    try {
      // Try to get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Authentication required. Please sign in.');
        return;
      }
      
      // Query using simple fields to avoid complex policy evaluation
      // Pass the user_id as a parameter to the RPC function
      const { data, error: queryError } = await supabase
        .rpc('get_all_establishments_for_user', { user_id: session.user.id });
      
      if (queryError) {
        logger.error('Error in alternative establishments fetch', { error: queryError });
        setError(`Failed to fetch establishments: ${queryError.message}`);
        return;
      }
      
      setEstablishments(data || []);
      logger.info('Successfully fetched establishments with alternative method', { count: data?.length });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      logger.error('Unexpected error in alternative fetch', { error: errorMessage });
      setError(`An unexpected error occurred: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch establishments on component mount
  useEffect(() => {
    fetchEstablishments();
  }, []);

  /**
   * Format date string to a readable format
   */
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  /**
   * Determine establishment status based on properties
   */
  const getEstablishmentStatus = (establishment: Establishment): EstablishmentStatus => {
    // Example logic to determine status - customize based on your business rules
    const currentDate = new Date();
    const updatedDate = establishment.updated_at ? new Date(establishment.updated_at) : new Date(0);
    const daysSinceUpdate = Math.floor((currentDate.getTime() - updatedDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysSinceUpdate > 365) {
      return 'inactive';
    } else if (!establishment.contact_email && !establishment.contact_phone) {
      return 'pending';
    } else {
      return 'active';
    }
  };

  /**
   * Render status badge with appropriate color
   */
  const StatusBadge: React.FC<{ status: EstablishmentStatus }> = ({ status }) => {
    const badgeClasses = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  /**
   * Format location display from coordinates
   */
  const formatLocation = (latitude: number | null, longitude: number | null): string => {
    if (latitude === null || longitude === null) {
      return 'Location not specified';
    }
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  };

  return (
    <MainLayout>
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Establishments</h1>
          
          {/* Refresh button */}
          <div className="flex space-x-2">
            <button 
              onClick={fetchEstablishments} 
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 rounded">
            {error}
          </div>
        )}
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Table data */}
        {!isLoading && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-slate-800/70 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 bg-slate-800/70 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 bg-slate-800/70 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 bg-slate-800/70 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 bg-slate-800/70 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 bg-slate-800/70 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800/50 divide-y divide-slate-700">
                {establishments.map((establishment) => {
                  const status = getEstablishmentStatus(establishment);
                  return (
                    <tr key={establishment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {establishment.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {formatLocation(establishment.latitude, establishment.longitude)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {establishment.facility_type || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {formatDate(establishment.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors">
                          <span className="sr-only">Edit</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className="text-red-400 hover:text-red-300 transition-colors">
                          <span className="sr-only">Delete</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                
                {/* Empty state */}
                {establishments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p>No establishments found.</p>
                        <p className="text-xs text-slate-500">Add a new establishment to get started.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Add button */}
        <div className="mt-6 flex justify-end">
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Establishment
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

/**
 * EstablishmentsPage wrapped with ProtectedRoute for authentication
 */
const EstablishmentsPage = () => (
  <ProtectedRoute>
    <Establishments />
  </ProtectedRoute>
);

export default EstablishmentsPage;
