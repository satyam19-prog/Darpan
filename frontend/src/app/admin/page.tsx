'use client';

import Card from '@/components/ui/Card';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 border-l-4 border-l-primary-500">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Students</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">0</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-accent-500">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Camps</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">0</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-success">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Contests</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">0</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-warning">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Plagiarism Flags</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">0</p>
        </Card>
      </div>

      <Card className="p-6 min-h-[400px] flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">More widgets coming soon in Phase 2!</p>
      </Card>
    </div>
  );
}
