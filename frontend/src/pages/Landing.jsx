import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-pulse duration-[4000ms]"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-pulse duration-[5000ms]"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-pulse duration-[6000ms]"></div>

      {/* Header with Theme Toggle */}
      <div className="absolute top-0 w-full p-6 flex justify-end z-20">
        <ThemeToggle />
      </div>

      <div className="z-10 text-center max-w-3xl px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 drop-shadow-sm">
          Roxler System
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
            Assessment
          </span>
        </h1>
        
        <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
          The premier platform for transparent, secure, and authenticated store evaluations.
          Join our ecosystem to rate experiences or manage your business reputation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/register"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-purple-600 border border-transparent rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 dark:focus:ring-offset-slate-950 hover:shadow-lg hover:shadow-purple-500/30 w-full sm:w-auto"
          >
            Get Started
            <svg className="w-5 h-5 ml-2 -mr-1 transition-transform duration-200 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </Link>
          
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-slate-700 dark:text-slate-200 transition-all duration-200 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-950 backdrop-blur-sm w-full sm:w-auto hover:shadow-md"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="z-10 mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl px-6 text-left">
        <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-4">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Secure & Verified</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Role-based access controls ensure that only authenticated customers can leave ratings.</p>
        </div>
        
        <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Transparent Ratings</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Aggregated scores and robust anti-spam mechanisms keep store ratings clean and reliable.</p>
        </div>

        <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300 shadow-sm">
          <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002-2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Powerful Analytics</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Store owners get detailed telemetry and customer review feeds directly in their dashboards.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
