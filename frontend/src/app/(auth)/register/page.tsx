'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Key } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { post } from '@/lib/api';
import { AuthResponse } from '@/types';
import { showSuccess, showError } from '@/components/ui/Toast';
import { getRedirectPath } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    cfHandle: '',
    lcHandle: '',
    ccHandle: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await post<AuthResponse>('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        cfHandle: formData.cfHandle,
        lcHandle: formData.lcHandle,
        ccHandle: formData.ccHandle,
      });

      if (res.success && res.data) {
        setAuth(res.data.user, res.data.accessToken);
        showSuccess('Registered successfully!');
        router.push(getRedirectPath(res.data.user.role));
      } else {
        showError(res.message || 'Registration failed');
      }
    } catch (error: any) {
      showError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 w-full max-w-xl mx-auto max-h-[80vh] overflow-y-auto custom-scrollbar">
      <h2 className="text-2xl font-semibold mb-6 text-center text-slate-900 dark:text-white">Create Account</h2>
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Input label="Name" name="name" value={formData.name} onChange={handleChange} required className="pl-10" />
            <User className="absolute left-3 top-[34px] w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
          
          <div className="relative">
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required className="pl-10" />
            <Mail className="absolute left-3 top-[34px] w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>

          <div className="relative">
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required className="pl-10" />
            <Lock className="absolute left-3 top-[34px] w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>

          <div className="relative">
            <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="pl-10" />
            <Key className="absolute left-3 top-[34px] w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Role</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            className="w-full bg-white dark:bg-surface-lighter border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="STUDENT">Student</option>
            <option value="MENTOR">Mentor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {formData.role === 'STUDENT' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700/50 mt-4">
            <Input label="Codeforces Handle" name="cfHandle" value={formData.cfHandle} onChange={handleChange} placeholder="Optional" />
            <Input label="LeetCode Handle" name="lcHandle" value={formData.lcHandle} onChange={handleChange} placeholder="Optional" />
            <Input label="CodeChef Handle" name="ccHandle" value={formData.ccHandle} onChange={handleChange} placeholder="Optional" />
          </div>
        )}

        <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
          Register
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          Login
        </Link>
      </p>
    </Card>
  );
}
