'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApplicantAuth } from '@/lib/applicant-auth-context';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { MobileNavigation } from './MobileNavigation';

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
  const { user, displayName, isLoading: applicantLoading, signOut } = useApplicantAuth();
  const { isMobile, isTablet } = useMobileDetection();
  const isApplicantLoggedIn = !!user;

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  const mainLinks: NavLink[] = [
    { label: 'Home', href: '/', active: activeLink === 'home' },
    { label: 'Teachers Profile', href: '/teachers-profile', active: activeLink === 'teachers-profile' },
    { label: 'About', href: '/about', active: activeLink === 'about' },
    { label: 'Contact', href: '/contact', active: activeLink === 'contact' },
  ];

  // Show mobile navigation for mobile and tablet devices
  if (isMobile || isTablet) {
    return <MobileNavigation activeLink={activeLink} />;
  }

  // Desktop navigation
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-linear-to-br from-purple-600 via-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              🎓
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:opacity-90 transition">Echoverse</span>
              <span className="text-xs text-gray-500 font-medium">Online Tutorial Services</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 text-sm ${
                  link.active
                    ? 'text-white bg-linear-to-r from-purple-600 to-pink-600 font-semibold shadow-lg shadow-purple-500/25'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50 hover:shadow-sm'
                }`}
                aria-current={link.active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-6 pl-6 border-l border-gray-200 flex items-center gap-3">
              {!applicantLoading && isApplicantLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {(displayName || 'Applicant').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 truncate max-w-[120px]" title={user.email ?? ''}>
                        {displayName || 'Applicant'}
                      </span>
                      <span className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</span>
                    </div>
                  </div>
                  <Link
                    href="/applicant/profile"
                    className="px-4 py-2.5 rounded-xl font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 text-sm"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-5 py-2.5 rounded-xl font-semibold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/applicant/login"
                    className="px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/applicant/login"
                    className="px-5 py-2.5 rounded-xl font-semibold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
