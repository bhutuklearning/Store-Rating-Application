import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Landing = () => {
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getDashboardRoute = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'STORE_OWNER') return '/owner/dashboard';
    return '/stores';
  };

  const dashboardRoute = getDashboardRoute();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300 relative overflow-hidden">
      {/* Background Decor Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 pointer-events-none animate-pulse duration-[4000ms]"></div>
      <div className="absolute top-[30%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 pointer-events-none animate-pulse duration-[5000ms]"></div>
      <div className="absolute bottom-[10%] left-[10%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 pointer-events-none animate-pulse duration-[6000ms]"></div>

      {/* Sticky Header Navigation */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
                StoreRate
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex space-x-8 text-sm font-medium">
              <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Features
              </a>
              <a href="#about" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                About
              </a>
            </nav>

            {/* Header Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Signed in as <strong className="text-slate-700 dark:text-slate-200">{user?.name}</strong>
                  </span>
                  <Link
                    to={dashboardRoute}
                    className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-full shadow-md transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none"
                aria-label="Toggle Menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3 shadow-lg">
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Features
            </a>
            <a
              href="#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              About System
            </a>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-3 text-xs text-slate-500 dark:text-slate-400">
                    Signed in as <strong className="text-slate-700 dark:text-slate-200">{user?.name}</strong>
                  </div>
                  <Link
                    to={dashboardRoute}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 text-sm font-medium border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-6 py-20 min-h-[80vh] z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
          Roxler System
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
            Assessment
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
          The premier platform for transparent, secure, and authenticated store evaluations.
          Join our ecosystem to rate experiences or manage your business reputation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
          {isAuthenticated ? (
            <Link
              to={dashboardRoute}
              className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-full hover:bg-indigo-700 focus:outline-none hover:shadow-lg hover:shadow-indigo-500/30 w-full sm:w-auto"
            >
              Go to Dashboard
              <svg className="w-5 h-5 ml-2 -mr-1 transition-transform duration-200 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-purple-600 border border-transparent rounded-full hover:bg-purple-700 focus:outline-none hover:shadow-lg hover:shadow-purple-500/30 w-full sm:w-auto"
              >
                Get Started
                <svg className="w-5 h-5 ml-2 -mr-1 transition-transform duration-200 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-slate-700 dark:text-slate-200 transition-all duration-200 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none backdrop-blur-sm w-full sm:w-auto hover:shadow-md"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="relative max-w-5xl mx-auto px-6 py-24 border-t border-slate-200/50 dark:border-slate-800/50 z-10 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Engineered for Reliability</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">A high-integrity feedback cycle linking consumers, operators, and sysadmins.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-8 rounded-3xl hover:-translate-y-1 transition-transform duration-300 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Secure & Verified</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Role-based access controls ensure that only authenticated customers can leave ratings.</p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-8 rounded-3xl hover:-translate-y-1 transition-transform duration-300 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Transparent Ratings</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Aggregated scores and robust anti-spam mechanisms keep store ratings clean and reliable.</p>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-8 rounded-3xl hover:-translate-y-1 transition-transform duration-300 shadow-sm">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002-2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Powerful Analytics</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Store owners get detailed telemetry and customer review feeds directly in their dashboards.</p>
          </div>
        </div>
      </section>

      {/* About System Section */}
      <section id="about" className="relative max-w-5xl mx-auto px-6 py-24 border-t border-slate-200/50 dark:border-slate-800/50 z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">How StoreRate Works</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">Register Securely</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Register using strict validators, identifying your intent as either a Customer reviewer or Store Owner.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">Rate Stores Honestly</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Submit rating scores securely. The database ensures a strictly unique limit of one score submission per store.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">Analyze Dashboard</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Owners watch scores adjust in real time, and administrators manage entries and seed associations from standard consoles.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 relative overflow-hidden shadow-inner">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Relational Integrity</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Our schema leverages composite unique index rules (`[userId, storeId]`) within Prisma/PostgreSQL, hard-coding a strict safety boundary against spam rating schemes.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              With full cascade safety rules, if a user profile or store is removed, all corresponding dependent review ratings are cleaned automatically to maintain zero-garbage statistics.
            </p>
            <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Simple structured Footer */}
      <footer className="relative bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-10 w-full transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and tag line */}
            <div className="md:col-span-2 space-y-4">
              <Link to="/" className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
                StoreRate
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                Empowering trust and accountability in local retail. A state-of-the-art secure rating solution connecting consumers and businesses.
              </p>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
                </li>
                <li>
                  <a href="#about" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About System</a>
                </li>
                <li>
                  <Link to="/login" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sign In</Link>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-slate-500 dark:text-slate-400 cursor-not-allowed">Privacy Policy</span>
                </li>
                <li>
                  <span className="text-slate-500 dark:text-slate-400 cursor-not-allowed">Terms of Service</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 dark:text-slate-500">
            <p>&copy; {new Date().getFullYear()} StoreRate Application. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <span className="hover:text-indigo-600 cursor-pointer">Twitter</span>
              <span className="hover:text-indigo-600 cursor-pointer">GitHub</span>
              <span className="hover:text-indigo-600 cursor-pointer">LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
