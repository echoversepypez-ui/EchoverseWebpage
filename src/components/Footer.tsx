'use client';

import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content - Mobile optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 py-12 sm:py-16 lg:py-20">
          {/* Brand Section */}
          <div className="sm:col-span-1">
            <Link href="/" className="flex items-center space-x-2 group mb-4 sm:mb-6">
              <div className="w-10 h-10 bg-linear-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-lg">🎓</div>
              <span className="text-lg sm:text-xl font-bold">Echoverse</span>
            </Link>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
              Connecting ESL educators with international students for meaningful work and flexible income.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-purple-500/20 hover:bg-purple-500 rounded-lg flex items-center justify-center transition text-white text-xs font-bold min-h-10 min-w-10">f</a>
              <a href="#" className="w-10 h-10 bg-purple-500/20 hover:bg-purple-500 rounded-lg flex items-center justify-center transition text-white text-xs font-bold min-h-10 min-w-10">𝕏</a>
              <a href="#" className="w-10 h-10 bg-purple-500/20 hover:bg-purple-500 rounded-lg flex items-center justify-center transition text-white text-xs font-bold min-h-10 min-w-10">in</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Quick Links</h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Teachers Profile', href: '/teachers-profile' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 min-h-10 flex items-center">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Resources</h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {[
                { label: 'FAQ', href: '#faq' },
                { label: 'Teaching Tips', href: '#' },
                { label: 'Student Reviews', href: '#' },
                { label: 'Blog', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base py-1 min-h-10 flex items-center">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter - Mobile optimized */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-6">Stay Updated</h3>
            <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
              Subscribe for the latest teaching opportunities and updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-l-lg text-gray-900 focus:outline-none text-sm min-h-10"
              />
              <button className="px-4 py-2.5 sm:py-2 bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 rounded-lg sm:rounded-r-lg font-semibold transition min-h-10 w-full sm:w-auto flex items-center justify-center">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section - Mobile optimized */}
        <div className="border-t border-purple-500/20 py-6 sm:py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
            © {currentYear} Echoverse. All rights reserved. | Made with ❤️ for educators
          </p>
          <div className="flex gap-6 sm:gap-8">
            <Link href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition py-1 px-2 min-h-10 flex items-center">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition py-1 px-2 min-h-10 flex items-center">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
