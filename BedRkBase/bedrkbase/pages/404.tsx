import Link from 'next/link';
import { NextPage } from 'next';

/**
 * Custom 404 page with consistent app styling
 */
const Custom404: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-800/50 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <div className="w-16 h-1 bg-blue-500 mx-auto mb-6"></div>
        <p className="text-slate-300 mb-6">The page you are looking for does not exist or has been moved.</p>
        <Link href="/" className="btn-primary inline-block">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Custom404;