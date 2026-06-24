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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center transition-colors duration-300">
      {/* Navbar */}
      <nav className="w-full max-w-7xl px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">Darpan</span>
        </div>
        <div className="flex items-center gap-6">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="text-foreground/50 hover:text-foreground transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          <Link href="/login" className="text-sm font-medium hover:text-primary-500 transition-colors">
            Log in
          </Link>
          <Link href="/register" className="text-sm font-medium px-5 py-2.5 bg-foreground text-background rounded-xl transition-all hover:scale-105 hover:shadow-glow">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-5xl px-8 py-32 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 animate-slideUp">
          <span className="gradient-text">Simple.</span> Minimal. <br />
          Competitive Tracking.
        </h1>
        
        <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mb-12 animate-slideUp" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          Manage your competitive programming journey without the clutter. Sync Codeforces, LeetCode, and CodeChef instantly.
        </p>
        
        <div className="flex items-center gap-4 animate-slideUp" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <Link href="/register" className="px-8 py-4 bg-foreground text-background text-lg font-medium rounded-2xl flex items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-glow-lg">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Minimal Feature List */}
        <div className="grid md:grid-cols-3 gap-12 mt-32 text-left w-full border-t border-border pt-16 animate-slideUp" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          <div className="group cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Unified Dashboard</h3>
            <p className="text-foreground/60 leading-relaxed">All your platforms in one place. Ratings, upsolving, and submissions tracked automatically.</p>
          </div>
          <div className="group cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Camp Management</h3>
            <p className="text-foreground/60 leading-relaxed">Mentors can easily manage summer/winter camps, track attendance, and monitor progress.</p>
          </div>
          <div className="group cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Integrity & Reports</h3>
            <p className="text-foreground/60 leading-relaxed">Built-in plagiarism flags, automated PDF/Excel reports, and peer comparison tools.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
