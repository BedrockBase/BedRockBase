import React from 'react';
import Link from 'next/link';
import { useAuth } from '../src/context/AuthContext';

/**
 * Navigation bar component with consistent styling
 * Displays on authenticated pages and provides navigation links
 */
const Navbar: React.FC = () => {
  const { logout } = useAuth();
  
  const handleSignOut = async () => {
    await logout();
  };

  return (
    <nav className="bg-slate-800/70 backdrop-blur-sm border-b border-slate-700/50 text-white py-4 px-6 flex justify-between items-center shadow-lg">
      <div className="flex space-x-6">
        <Link 
          href="/dashboard" 
          className="text-slate-200 hover:text-blue-400 transition-colors duration-200"
        >
          Dashboard
        </Link>
        <Link 
          href="/areas" 
          className="text-slate-200 hover:text-blue-400 transition-colors duration-200"
        >
          Areas
        </Link>
        <Link 
          href="/establishments" 
          className="text-slate-200 hover:text-blue-400 transition-colors duration-200"
        >
          Establishments
        </Link>
      </div>
      <button 
        onClick={handleSignOut}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Sign Out
      </button>
    </nav>
  );
};

export default Navbar;