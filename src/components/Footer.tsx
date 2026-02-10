'use client';

import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 py-20">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center space-x-2 group mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-lg">🎓</div>
              <span className="text-xl font-bold">Echoverse</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Connecting ESL educators with international students for meaningful work and flexible income.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 bg-purple-500/20 hover:bg-purple-500 rounded-lg flex items-center justify-center transition text-white">f</a>
              <a href="#" className="w-10 h-10 bg-purple-500/20 hover:bg-purple-500 rounded-lg flex items-center justify-center transition text-white">𝕏</a>
              <a href="#" className="w-10 h-10 bg-purple-500/20 hover:bg-purple-500 rounded-lg flex items-center justify-center transition text-white">in</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Teaching Accounts', href: '/courses' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-6">Resources</h3>
            <ul className="space-y-3">
              {[
                { label: 'FAQ', href: '#faq' },
                { label: 'Teaching Tips', href: '#' },
                { label: 'Student Reviews', href: '#' },
                { label: 'Blog', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-6">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe for the latest teaching opportunities and updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 rounded-r-lg font-semibold transition">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-purple-500/20 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} Echoverse. All rights reserved. | Made with ❤️ for educators
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
