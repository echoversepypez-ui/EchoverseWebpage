'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

interface NavigationProps {
  activeLink?: string;
}

export const Navigation = ({ activeLink = '' }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          </div>
        )}
      </div>
    </nav>
  );
};
