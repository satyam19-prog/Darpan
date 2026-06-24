'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';

export default function UpsolvingPage() {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpsolving();
  }, []);

  const fetchUpsolving = async () => {
    try {
      const res = await api.get('/students/upsolving');
      if (res.data.success) {
        setAttendances(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch upsolving status', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-900 dark:text-white">Upsolving Tracker</h1>
        <Badge variant="warning" className="px-3 py-1 text-sm">
          Strict Mode: Active
        </Badge>
      </div>
      <p className="text-slate-500 dark:text-slate-400">Track your performance in past contests and manage pending upsolve tasks to stay in camps.</p>

      {loading ? (
        <Card className="h-64 animate-pulse bg-gray-200 dark:bg-gray-800">
          <div />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {attendances.length > 0 ? (
            attendances.map((a: any) => (
              <Card key={a.id} className="border-l-4 border-l-primary-500">
                <div className="mb-4 flex justify-between">
                  <h3 className="text-lg font-bold">{a.contest.name}</h3>
                  <Badge variant={a.upsolved ? 'success' : 'error'}>
                    {a.upsolved ? 'Upsolved' : 'Pending'}
                  </Badge>
                </div>
                <div className="text-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">Rank</p>
                      <p className="font-medium text-slate-900 dark:text-white">{a.rank || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">Solved</p>
                      <p className="font-medium text-slate-900 dark:text-white">{a.solvedCount}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">Platform</p>
                      <p className="font-medium text-slate-900 dark:text-white">{a.contest.platform}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">Deadline</p>
                      <p className="font-medium text-red-400">{a.upsolveDeadline ? new Date(a.upsolveDeadline).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-surface-light/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400">No contest attendances found. Your future contests will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
