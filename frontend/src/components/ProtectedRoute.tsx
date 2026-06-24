'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getRedirectPath } from '@/lib/auth';
import type { Role } from '@/types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({
  children,
  requiredRole,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, isHydrated } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    // Check role access
    const roles = allowedRoles || (requiredRole ? [requiredRole] : []);
    if (roles.length > 0 && !roles.includes(user.role)) {
      router.replace(getRedirectPath(user.role));
      return;
    }

    setIsAuthorized(true);
  }, [isAuthenticated, user, isHydrated, requiredRole, allowedRoles, router]);

  if (!isHydrated || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-primary-500/20 border-t-primary-500 animate-spin" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
