'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

// Base Skeleton
export default function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

// Text Skeleton - single or multi-line
export function SkeletonText({
  lines = 1,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton h-4 rounded-lg ${
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

// Card Skeleton
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass rounded-2xl p-6 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="skeleton h-4 w-24 rounded-lg" />
        <div className="skeleton h-8 w-8 rounded-lg" />
      </div>
      <div className="skeleton h-8 w-32 rounded-lg" />
      <div className="skeleton h-3 w-20 rounded-lg" />
    </div>
  );
}

// Circle Skeleton (Avatar)
export function SkeletonCircle({
  size = 40,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`skeleton rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

// Table Skeleton
export function SkeletonTable({
  rows = 5,
  columns = 4,
  className = '',
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={`glass rounded-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-700/50">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="skeleton h-4 rounded-lg flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex gap-4 px-6 py-4 border-b border-slate-800/30 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={colIdx} className="skeleton h-4 rounded-lg flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
