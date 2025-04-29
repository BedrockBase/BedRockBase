import React from 'react';
import MainLayout from '../components/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';

/**
 * Areas page component
 * Displaying areas information with consistent styling
 */
const Areas: React.FC = () => {
  return (
    <MainLayout>
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 p-6">
        <h1 className="text-2xl font-bold mb-6 text-white">Areas</h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-slate-800/70 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Column 1
                </th>
                <th className="px-6 py-3 bg-slate-800/70 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Column 2
                </th>
                <th className="px-6 py-3 bg-slate-800/70 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Column 3
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/50 divide-y divide-slate-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  Data 1
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  Data 2
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  Data 3
                </td>
              </tr>
              {/* Example of empty state */}
              {Array.from({ length: 0 }).length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-400">
                    No areas found. Add a new area to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="btn-primary">
            Add New Area
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

/**
 * AreasPage wrapped with ProtectedRoute for authentication
 */
const AreasPage = () => (
  <ProtectedRoute>
    <Areas />
  </ProtectedRoute>
);

export default AreasPage;