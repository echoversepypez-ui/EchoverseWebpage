'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApplicantAuth } from '@/lib/applicant-auth-context';

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

interface NavigationProps {
  activeLink?: string;
}

export const Navigation = ({ activeLink = '' }: NavigationProps) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, displayName, isLoading: applicantLoading, signOut } = useApplicantAuth();
  const isApplicantLoggedIn = !!user;

  const handleLogout = () => {
    signOut();
    setMobileMenuOpen(false);
    router.push('/');
  };

  const mainLinks: NavLink[] = [
    { label: 'Home', href: '/', active: activeLink === 'home' },
    { label: 'Teachers Profile', href: '/teachers-profile', active: activeLink === 'teachers-profile' },
    { label: 'About', href: '/about', active: activeLink === 'about' },
    { label: 'Contact', href: '/contact', active: activeLink === 'contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-lg shadow-lg">🎓</div>
            <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:opacity-80 transition">Echoverse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 items-center">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  link.active
                    ? 'text-white bg-linear-to-r from-purple-600 to-pink-600 font-semibold shadow-lg'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-gray-100'
                }`}
                aria-current={link.active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            {/* Applicant: profile + dashboard + logout, or Login / Sign up */}
            <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-2">
              {!applicantLoading && isApplicantLoggedIn ? (
                <>
                  <span className="text-sm text-gray-600 truncate max-w-[120px]" title={user.email ?? ''}>
                    Hi, {displayName || 'Applicant'}
                  </span>
                  <Link
                    href="/applicant/dashboard"
                    className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-100 transition-all duration-300"
                  >
                    My applications
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg font-semibold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/applicant/login"
                    className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-100 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/applicant/login"
                    className="px-4 py-2 rounded-lg font-semibold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className={`w-6 h-6 transition-transform ${mobileMenuOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 space-y-2 bg-gray-50">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg transition-all duration-300 ${
                  link.active
                    ? 'text-white bg-linear-to-r from-purple-600 to-pink-600 font-semibold'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-gray-200 flex flex-col gap-2 px-4">
              {!applicantLoading && isApplicantLoggedIn ? (
                <>
                  <p className="text-sm text-gray-600 truncate px-1">Hi, {displayName || 'Applicant'}</p>
                  <Link
                    href="/applicant/dashboard"
                    className="py-2.5 text-center rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My applications
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="py-2.5 rounded-lg font-semibold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/applicant/login"
                    className="flex-1 py-2.5 text-center rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/applicant/login"
                    className="flex-1 py-2.5 text-center rounded-lg font-semibold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
