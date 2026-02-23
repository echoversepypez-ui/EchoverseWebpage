'use client';

import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-b from-slate-950 to-slate-900 text-white border-t border-purple-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Footer - Two Row Layout */}
        <div className="py-8 sm:py-10">
          {/* Top Row - Logo and Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Brand */}
            <div className="sm:col-span-1">
              <Link href="/" className="flex items-center space-x-2 group mb-3 hover:opacity-80 transition">
                <div className="w-8 h-8 bg-linear-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-sm">🎓</div>
                <span className="text-sm font-bold">Echoverse</span>
              </Link>
            </div>

            {/* Quick Links - Compact */}
            <div className="sm:col-span-1">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-300 mb-2">Links</h4>
              <ul className="space-y-1.5">
                <li><Link href="/" className="text-gray-400 hover:text-white text-xs transition">Home</Link></li>
                <li><Link href="/teachers-profile" className="text-gray-400 hover:text-white text-xs transition">Teach</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white text-xs transition">About</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="sm:col-span-1">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-300 mb-2">Help</h4>
              <ul className="space-y-1.5">
                <li><Link href="#faq" className="text-gray-400 hover:text-white text-xs transition">FAQ</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-xs transition">Contact</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-xs transition">Blog</Link></li>
              </ul>
            </div>

            {/* Socials */}
            <div className="sm:col-span-1">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-300 mb-2">Follow</h4>
              <div className="flex gap-2">
                <a href="#" className="w-7 h-7 bg-purple-600/30 hover:bg-purple-600 rounded flex items-center justify-center text-xs transition" title="Facebook">f</a>
                <a href="#" className="w-7 h-7 bg-purple-600/30 hover:bg-purple-600 rounded flex items-center justify-center text-xs transition" title="Twitter">𝕏</a>
                <a href="#" className="w-7 h-7 bg-purple-600/30 hover:bg-purple-600 rounded flex items-center justify-center text-xs transition" title="LinkedIn">in</a>
              </div>
            </div>

            {/* Newsletter - Compact */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-300 mb-2">Updates</h4>
              <div className="flex gap-1">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-2 py-1.5 rounded text-gray-900 text-xs focus:outline-none"
                />
                <button className="px-2 py-1.5 bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 rounded font-semibold transition text-xs">→</button>
              </div>
            </div>
          </div>

          {/* Bottom Row - Copyright */}
          <div className="border-t border-purple-600/10 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
            <p>© {currentYear} Echoverse. Made with ❤️ for educators</p>
            <div className="flex gap-4 sm:gap-6">
              <Link href="#" className="hover:text-white transition">Privacy</Link>
              <Link href="#" className="hover:text-white transition">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
