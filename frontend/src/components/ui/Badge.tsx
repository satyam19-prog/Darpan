'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-primary-500/10 text-primary-700 dark:text-primary-300 border-primary-500/20',
  success: 'bg-success/10 text-green-700 dark:text-green-400 border-success/20',
  warning: 'bg-warning/10 text-amber-700 dark:text-amber-400 border-warning/20',
  error: 'bg-error/10 text-red-700 dark:text-red-400 border-error/20',
  neutral: 'bg-foreground/5 text-foreground/70 border-border',
};

const dotColors: Record<string, string> = {
  primary: 'bg-primary-500',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  neutral: 'bg-foreground/50',
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
