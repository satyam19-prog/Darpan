'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  helperText?: string;
  inputSize?: 'sm' | 'md' | 'lg';
}

const sizeStyles: Record<string, string> = {
  sm: 'py-2 text-xs',
  md: 'py-2.5 text-sm',
  lg: 'py-3.5 text-base',
};

export default function Input({
  label,
  error,
  leftIcon,
  helperText,
  inputSize = 'md',
  type,
  className = '',
  id,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground/80 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          type={inputType}
          className={`
            w-full rounded-xl
            bg-background border border-border
            text-foreground placeholder-foreground/40
            focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20
            transition-all duration-200
            ${leftIcon ? 'pl-10' : 'pl-4'}
            ${isPassword ? 'pr-10' : 'pr-4'}
            ${sizeStyles[inputSize]}
            ${error ? 'border-error/50 focus:border-error/50 focus:ring-error/20' : ''}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground/80 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-error flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-error" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-foreground/60">{helperText}</p>
      )}
    </div>
  );
}
