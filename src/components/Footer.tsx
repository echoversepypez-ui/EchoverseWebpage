'use client';

import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-b from-slate-950 to-slate-900 text-white border-t border-purple-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 sm:py-10 lg:py-12">
          {/* Top Row - Brand & Grid */}
          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:justify-between mb-6 sm:mb-8 lg:mb-10">
            {/* Brand & mini tagline */}
            <div className="max-w-sm">
              <Link
                href="/"
                className="inline-flex items-center gap-2 group mb-3 hover:opacity-90 transition"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-base shadow-md shadow-purple-500/40">
                  🎓
                </div>
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-semibold tracking-tight">
                    Echoverse
                  </span>
                  <span className="text-[11px] sm:text-xs text-gray-400">
                    Where educators and learners meet in sync.
                  </span>
                </div>
              </Link>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-xs">
                Build rich, interactive learning experiences without fighting the tech.
                Echoverse helps you focus on teaching while we handle the rest.
              </p>
            </div>

            {/* Link grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm">
              {/* Product */}
              <div>
                <h4 className="font-semibold text-[11px] sm:text-xs uppercase tracking-[0.14em] text-gray-300 mb-2">
                  Product
                </h4>
                <ul className="space-y-1.5">
                  <li>
                    <Link
                      href="/"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/teachers-profile"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Teach on Echoverse
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold text-[11px] sm:text-xs uppercase tracking-[0.14em] text-gray-300 mb-2">
                  Support
                </h4>
                <ul className="space-y-1.5">
                  <li>
                    <Link
                      href="#faq"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Guides
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold text-[11px] sm:text-xs uppercase tracking-[0.14em] text-gray-300 mb-2">
                  Company
                </h4>
                <ul className="space-y-1.5">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Press
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Middle Row - Newsletter & Social */}
          <div className="border-t border-purple-600/10 pt-4 sm:pt-5 mb-4 sm:mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Newsletter */}
            <div className="w-full sm:w-auto max-w-md">
              <p className="text-xs sm:text-sm text-gray-300 mb-2">
                Stay in the loop.
                <span className="text-gray-400"> Occasional product updates, no spam.</span>
              </p>
              <form
                className="flex gap-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <label className="sr-only" htmlFor="footer-email">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 px-3 py-2 rounded-md bg-slate-900/80 text-xs sm:text-sm text-gray-100 placeholder:text-gray-500 border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-transparent shadow-sm"
                />
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 hover:brightness-110 rounded-md font-semibold text-xs sm:text-sm transition shadow-md shadow-purple-500/40"
                >
                  Join
                </button>
              </form>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-gray-400">
                Follow
              </span>
              <div className="flex gap-2 sm:gap-3">
                <a
                  href="#"
                  aria-label="Visit our Facebook"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-purple-500/40 bg-slate-900/70 hover:bg-purple-600 hover:border-purple-400 flex items-center justify-center text-xs sm:text-sm transition-colors shadow-sm"
                >
                  f
                </a>
                <a
                  href="#"
                  aria-label="Visit our X (Twitter)"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-purple-500/40 bg-slate-900/70 hover:bg-purple-600 hover:border-purple-400 flex items-center justify-center text-xs sm:text-sm transition-colors shadow-sm"
                >
                  𝕏
                </a>
                <a
                  href="#"
                  aria-label="Visit our LinkedIn"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-purple-500/40 bg-slate-900/70 hover:bg-purple-600 hover:border-purple-400 flex items-center justify-center text-xs sm:text-sm transition-colors shadow-sm"
                >
                  in
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Row - Copyright */}
          <div className="border-t border-purple-600/10 pt-4 sm:pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] sm:text-xs text-gray-400">
            <p className="text-center sm:text-left">
              © {currentYear} Echoverse. Made with ❤️ for educators everywhere.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <span className="hidden sm:inline text-gray-600">•</span>
              <Link href="#" className="hover:text-white transition-colors">
                Terms
              </Link>
              <span className="hidden sm:inline text-gray-600">•</span>
              <Link href="#" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
