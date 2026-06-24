'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative p-2.5 rounded-xl
        bg-surface-light/50 hover:bg-surface-lighter/50
        border border-slate-700/50
        text-slate-400 hover:text-white
        transition-all duration-300 ease-out
        hover:shadow-glow
        group
      "
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`
            w-5 h-5 absolute inset-0
            transition-all duration-500
            ${theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}
          `}
        />
        <Moon
          className={`
            w-5 h-5 absolute inset-0
            transition-all duration-500
            ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
          `}
        />
      </div>
    </button>
  );
}
