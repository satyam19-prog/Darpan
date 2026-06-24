'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { post } from '@/lib/api';
import { ApiResponse } from '@/types';
import { showSuccess, showError } from '@/components/ui/Toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const res = await post<ApiResponse<void>>('/auth/forgot-password', { email });
      if (res.success) {
        showSuccess('Reset link sent to your email!');
        setIsSent(true);
      } else {
        showError(res.message || 'Failed to send reset link');
      }
    } catch (error: any) {
      showError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold mb-2 text-center text-white">Reset Password</h2>
      <p className="text-slate-400 text-center mb-6 text-sm">
        Enter your email to receive a password reset link.
      </p>
      
      {!isSent ? (
        <form onSubmit={handleSendLink} className="space-y-4">
          <div className="relative">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="pl-10"
            />
            <Mail className="absolute left-3 top-[34px] w-5 h-5 text-slate-400" />
          </div>

          <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
            Send Reset Link
          </Button>
        </form>
      ) : (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 text-success mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Check your email</h3>
          <p className="text-slate-400 text-sm mb-6">
            We've sent a password reset link to <br/>
            <span className="text-white">{email}</span>
          </p>
          <Button variant="secondary" className="w-full" onClick={() => setIsSent(false)}>
            Try another email
          </Button>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-slate-400">
        Remember your password?{' '}
        <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          Back to Login
        </Link>
      </p>
    </Card>
  );
}
