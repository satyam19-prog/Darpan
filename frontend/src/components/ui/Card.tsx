'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  gradientBorder?: boolean;
  onClick?: () => void;
}

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
  gradientBorder = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        glass rounded-2xl
        ${paddingStyles[padding]}
        ${hover ? 'hover:-translate-y-1 hover:shadow-glow cursor-pointer' : ''}
        ${gradientBorder ? 'gradient-border' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-300 ease-out
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Stat Card Variant
interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <Card hover className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <p
              className={`text-xs mt-2 font-medium ${
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
