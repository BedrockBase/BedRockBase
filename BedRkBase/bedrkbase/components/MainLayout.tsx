import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../src/context/AuthContext';

/**
 * Interface for sidebar navigation items
 */
interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
  isCollapsible?: boolean;
  subItems?: NavItem[];
}

/**
 * Props for the MainLayout component
 */
interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout component - provides a consistent layout with sidebar navigation
 * Used as the main layout wrapper for authenticated pages
 * 
 * @param {MainLayoutProps} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    '/areas': true, // Default to expanded
  });
  
  // User's display name or email
  const displayName = user?.user_metadata?.name || user?.email || 'Username';
  const userInitial = displayName[0]?.toUpperCase() || 'U';
  
  /**
   * Handle user sign out
   */
  const handleSignOut = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  /**
   * Toggle expanded state of a collapsible menu item
   * @param path - Path of the menu item to toggle
   */
  const toggleExpand = (path: string): void => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  /**
   * Navigation items with icons
   */
  const navItems: NavItem[] = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      path: '/areas',
      label: 'Areas',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
      isCollapsible: true,
      subItems: [
        {
          path: '/establishments',
          label: 'Establishments',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
          ),
        },
      ],
    },
  ];

  /**
   * Check if navigation item is active based on current path
   */
  const isActiveRoute = (path: string): boolean => {
    return router.pathname === path;
  };

  /**
   * Check if a parent menu should be highlighted (when child is active)
   */
  const isParentActive = (item: NavItem): boolean => {
    if (isActiveRoute(item.path)) return true;
    if (item.subItems && item.subItems.some(subItem => isActiveRoute(subItem.path))) return true;
    return false;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Sidebar */}
      <div className="w-56 bg-slate-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-slate-800">
          <Link href="/dashboard" className="text-xl font-bold text-white">
            BedRockBase
          </Link>
        </div>

        {/* User profile */}
        <div className="flex items-center justify-center py-6 border-b border-slate-800">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold mb-2">
              {userInitial}
            </div>
            <span className="text-sm text-slate-300">{displayName}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <React.Fragment key={item.path}>
                {/* Menu Item */}
                {item.isCollapsible ? (
                  <li>
                    <button
                      onClick={() => toggleExpand(item.path)}
                      className={`w-full flex items-center px-6 py-3 text-slate-300 hover:bg-slate-800 ${
                        isParentActive(item)
                          ? "bg-slate-800 text-blue-400 border-l-4 border-blue-400 pl-5"
                          : ""
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-auto transition-transform ${
                          expandedItems[item.path] ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    
                    {/* Submenu Items */}
                    {expandedItems[item.path] && item.subItems && (
                      <ul className="mt-1 ml-7 space-y-1 border-l border-slate-800 pl-4">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.path}>
                            <Link
                              href={subItem.path}
                              className={`flex items-center py-2 pl-2 pr-4 text-sm text-slate-300 hover:bg-slate-800 rounded-r-md ${
                                isActiveRoute(subItem.path)
                                  ? "bg-slate-800/50 text-blue-400 border-l-2 border-blue-400 -ml-[1px] pl-[9px]"
                                  : ""
                              }`}
                            >
                              <span className="mr-2 text-[0.9em]">{subItem.icon}</span>
                              <span>{subItem.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : (
                  <li>
                    <Link
                      href={item.path}
                      className={`flex items-center px-6 py-3 text-slate-300 hover:bg-slate-800 ${
                        isActiveRoute(item.path)
                          ? "bg-slate-800 text-blue-400 border-l-4 border-blue-400 pl-5"
                          : ""
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-900/70 backdrop-blur-sm shadow-md h-14 flex justify-end items-center px-6">
          <div className="flex items-center">
            <span className="text-white mr-4">{displayName}</span>
            <button
              onClick={handleSignOut}
              className="text-white px-3 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;