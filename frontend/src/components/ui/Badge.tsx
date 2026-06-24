'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-primary-500/15 text-primary-300 border-primary-500/20',
  success: 'bg-green-500/15 text-green-300 border-green-500/20',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  error: 'bg-red-500/15 text-red-300 border-red-500/20',
  neutral: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/20',
};

const dotColors: Record<string, string> = {
  primary: 'bg-primary-400',
  success: 'bg-green-400',
  warning: 'bg-amber-400',
  error: 'bg-red-400',
  neutral: 'bg-slate-400',
};

export default function Badge({
  children,
  variant = 'primary',
  dot = false,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-0.5 rounded-full
        text-xs font-medium
        border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
