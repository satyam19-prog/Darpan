'use client';

import React from 'react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  className?: string;
}

const sizeMap: Record<string, { container: string; text: string; dot: string }> = {
  sm: { container: 'w-8 h-8', text: 'text-xs', dot: 'w-2.5 h-2.5' },
  md: { container: 'w-10 h-10', text: 'text-sm', dot: 'w-3 h-3' },
  lg: { container: 'w-14 h-14', text: 'text-lg', dot: 'w-3.5 h-3.5' },
  xl: { container: 'w-20 h-20', text: 'text-2xl', dot: 'w-4 h-4' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({
  src,
  alt,
  name = '?',
  size = 'md',
  online,
  className = '',
}: AvatarProps) {
  const { container, text, dot } = sizeMap[size];

  return (
    <div className={`relative inline-flex ${className}`}>
      <div
        className={`
          ${container} rounded-full overflow-hidden
          bg-gradient-to-br from-primary-500 to-accent-500
          flex items-center justify-center
          ring-2 ring-primary-500/20
        `}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className={`font-semibold text-slate-900 dark:text-white ${text}`}>
            {getInitials(name)}
          </span>
        )}
      </div>
      {online !== undefined && (
        <span
          className={`
            absolute bottom-0 right-0
            ${dot} rounded-full
            border-2 border-surface
            ${online ? 'bg-green-400' : 'bg-slate-500'}
          `}
        />
      )}
    </div>
  );
}
