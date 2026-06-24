'use client';

import Link from 'next/link';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useEffect, useState } from 'react';

export default function Home() {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-slate-900 dark:text-white flex flex-col items-center transition-colors duration-300">
      {/* Navbar */}
      <nav className="w-full max-w-7xl px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">Darpan</span>
        </div>
        <div className="flex items-center gap-6">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-slate-900 dark:text-white transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Log in
          </Link>
          <Link href="/register" className="text-sm font-medium px-5 py-2.5 bg-black text-slate-900 dark:text-white dark:bg-white dark:text-black rounded-lg transition-transform hover:scale-105">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-5xl px-8 py-32 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          Simple. Minimal. <br />
          Competitive Tracking.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-12">
          Manage your competitive programming journey without the clutter. Sync Codeforces, LeetCode, and CodeChef instantly.
        </p>
        
        <div className="flex items-center gap-4">
          <Link href="/register" className="px-8 py-4 bg-black text-slate-900 dark:text-white dark:bg-white dark:text-black text-lg font-medium rounded-xl flex items-center gap-2 transition-transform hover:-translate-y-1">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Minimal Feature List */}
        <div className="grid md:grid-cols-3 gap-12 mt-32 text-left w-full border-t border-gray-200 dark:border-gray-800 pt-16">
          <div>
            <h3 className="text-xl font-semibold mb-2">Unified Dashboard</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">All your platforms in one place. Ratings, upsolving, and submissions tracked automatically.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Camp Management</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Mentors can easily manage summer/winter camps, track attendance, and monitor progress.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Integrity & Reports</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Built-in plagiarism flags, automated PDF/Excel reports, and peer comparison tools.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
