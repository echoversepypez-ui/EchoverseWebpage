'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface AdminHeaderProps {
  title: string;
  showBackButton?: boolean;
  backHref?: string;
  subtitle?: string;
}

export function AdminHeader({ 
  title, 
  showBackButton = true, 
  backHref = '/admin/dashboard',
  subtitle 
}: AdminHeaderProps) {
  const router = useRouter();
  const { logout } = useAuth();

  // Add keyboard shortcut for back (ESC key)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showBackButton) {
        router.push(backHref);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router, backHref, showBackButton]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-purple-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center mb-4">
          {/* Left Section: Logo & Back Button */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={() => router.push(backHref)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-all duration-200 border border-gray-400 hover:border-gray-500 group"
                title="Go back (ESC)"
              >
                <span className="text-lg group-hover:translate-x-[-4px] transition-transform">←</span>
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            <Link 
              href="/" 
              className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition"
            >
              🎓 Echoverse
            </Link>
          </div>

          {/* Right Section: Logout */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-linear-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Title Section */}
        <div className="border-t border-gray-200 pt-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
          )}
        </div>

        {/* Keyboard Hint */}
        {showBackButton && (
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
            <span>💡 Press</span>
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700 font-mono">ESC</kbd>
            <span>to go back</span>
          </div>
        )}
      </div>
    </nav>
  );
}
