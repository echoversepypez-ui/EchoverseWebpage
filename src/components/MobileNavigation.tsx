'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { useApplicantAuth } from '@/lib/applicant-auth-context';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
  icon?: string;
}

interface MobileNavigationProps {
  activeLink?: string;
}

export const MobileNavigation = ({ activeLink = '' }: MobileNavigationProps) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, displayName, isLoading: applicantLoading, signOut } = useApplicantAuth();
  const { isMobile, isTablet } = useMobileDetection();
  const isApplicantLoggedIn = !!user;
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    signOut();
    setMobileMenuOpen(false);
    router.push('/');
  };

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const mainLinks: NavLink[] = [
    { label: 'Home', href: '/', active: activeLink === 'home', icon: '🏠' },
    { label: 'Teachers', href: '/teachers-profile', active: activeLink === 'teachers-profile', icon: '👥' },
    { label: 'About', href: '/about', active: activeLink === 'about', icon: 'ℹ️' },
    { label: 'Contact', href: '/contact', active: activeLink === 'contact', icon: '📧' },
  ];

  // Only show mobile navigation on mobile/tablet devices
  if (!isMobile && !isTablet) {
    return null;
  }

  return (
    <>
      {/* Mobile Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className={`flex justify-between items-center ${isMobile ? 'h-14' : 'h-16'}`}>
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className={`${
                isMobile ? 'w-9 h-9 text-lg' : 'w-10 h-10 text-xl'
              } bg-linear-to-br from-purple-600 via-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                🎓
              </div>
              <div className="flex flex-col">
                <span className={`${
                  isMobile ? 'text-lg' : 'text-xl'
                } font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:opacity-90 transition`}>
                  Echoverse
                </span>
                {!isMobile && (
                  <span className="text-xs text-gray-500 font-medium">Online Tutorial Services</span>
                )}
              </div>
            </Link>

            {/* User Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {!applicantLoading && isApplicantLoggedIn ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-6 h-6 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {(displayName || 'Applicant').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[80px]">
                      {displayName || 'Applicant'}
                    </span>
                  </div>
                  <Link
                    href="/applicant/profile"
                    className="p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                    title="Profile"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <Link
                  href="/applicant/login"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm"
                >
                  {isMobile ? 'Login' : 'Get Started'}
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                  mobileMenuOpen ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-50 text-gray-600'
                }`}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-start justify-center z-40 pt-10">
            <div 
              ref={menuRef}
              className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-100 m-4"
            >
              {/* User Profile Section */}
              {!applicantLoading && isApplicantLoggedIn && (
                <div className="mb-6 p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {(displayName || 'Applicant').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{displayName || 'Applicant'}</p>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href="/applicant/profile"
                      className="flex-1 py-2 text-center rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-2">
                  {mainLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                        link.active
                          ? 'text-white bg-linear-to-r from-purple-600 to-pink-600 shadow-lg'
                          : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="text-sm sm:text-base">{link.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/privacy-policy"
                      className="py-2 px-3 text-center rounded-lg bg-gray-50 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Privacy
                    </Link>
                    <Link
                      href="/terms"
                      className="py-2 px-3 text-center rounded-lg bg-gray-50 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Terms
                    </Link>
                  </div>
                </div>
              </div>
            </div>
        )}
      </nav>
    </>
  );
};
