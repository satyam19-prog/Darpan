'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Key } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { post } from '@/lib/api';
import { ApiResponse } from '@/types';
import { showSuccess, showError } from '@/components/ui/Toast';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showError('Reset token is missing');
      return;
    }
    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await post<ApiResponse<void>>('/auth/reset-password', { 
        token, 
        newPassword: password 
      });
      
      if (res.success) {
        showSuccess('Password reset successfully!');
        router.push('/login');
      } else {
        showError(res.message || 'Failed to reset password');
      }
    } catch (error: any) {
      showError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-medium text-white mb-2">Invalid Link</h3>
        <p className="text-slate-400 text-sm mb-6">
          This password reset link is invalid or has expired.
        </p>
        <Link href="/forgot-password">
          <Button variant="secondary">Request new link</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleReset} className="space-y-4">
      <div className="relative">
        <Input
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="pl-10"
        />
        <Lock className="absolute left-3 top-[34px] w-5 h-5 text-slate-400" />
      </div>

      <div className="relative">
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="pl-10"
        />
        <Key className="absolute left-3 top-[34px] w-5 h-5 text-slate-400" />
      </div>

      <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
        Reset Password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold mb-2 text-center text-white">Create New Password</h2>
      <p className="text-slate-400 text-center mb-6 text-sm">
        Enter your new password below.
      </p>
      
      <Suspense fallback={<div className="text-center text-slate-400">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>

      <p className="mt-6 text-center text-sm text-slate-400">
        <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          Back to Login
        </Link>
      </p>
    </Card>
  );
}
