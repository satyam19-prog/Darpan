'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { post } from '@/lib/api';
import { AuthResponse } from '@/types';
import { showSuccess, showError } from '@/components/ui/Toast';
import { getRedirectPath } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await post<AuthResponse>('/auth/login', { email, password });
      if (res.success && res.data) {
        setAuth(res.data.user, res.data.accessToken);
        showSuccess('Logged in successfully!');
        router.push(getRedirectPath(res.data.user.role));
      } else {
        showError(res.message || 'Login failed');
      }
    } catch (error: any) {
      showError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">Welcome Back</h2>
      
      <form onSubmit={handleLogin} className="space-y-4">
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
        
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="pl-10 pr-10"
          />
          <Lock className="absolute left-3 top-[34px] w-5 h-5 text-slate-400" />
          <button
            type="button"
            className="absolute right-3 top-[34px] text-slate-400 hover:text-white transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
          Login
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don't have an account?{' '}
        <Link href="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          Register
        </Link>
      </p>
    </Card>
  );
}
