'use client';

import Sidebar from '@/components/ui/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="STUDENT">
      <div className="flex h-screen bg-surface overflow-hidden">
        <Sidebar role="STUDENT" />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
