'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import { ImportSheetForm } from '@/components/forms/ImportSheetForm';

export default function AdminCampDetailsPage({ params }: { params: { id: string } }) {
  const [camp, setCamp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCamp = async () => {
    try {
      const res = await api.get(`/camps/${params.id}`);
      if (res.data.success) {
        setCamp(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch camp details', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamp();
  }, [params.id]);

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />;
  if (!camp) return <div>Camp not found</div>;

  return (
    <div className="space-y-8">
      {/* Camp Header Info */}
      <div className="bg-white dark:bg-surface-light/30 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{camp.name}</h1>
            <p className="text-slate-500 dark:text-slate-400">{camp.description || 'No description provided.'}</p>
          </div>
          <Badge variant={camp.type === 'SUMMER' ? 'warning' : 'primary'} className="text-lg px-4 py-1">
            {camp.type}
          </Badge>
        </div>
        <div className="mt-6 flex space-x-8 text-sm">
          <div>
            <span className="block text-slate-500 uppercase tracking-wider text-xs font-semibold">Start Date</span>
            <span className="font-medium text-slate-900 dark:text-white">{new Date(camp.startDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="block text-slate-500 uppercase tracking-wider text-xs font-semibold">End Date</span>
            <span className="font-medium text-slate-900 dark:text-white">{new Date(camp.endDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="block text-slate-500 uppercase tracking-wider text-xs font-semibold">Total Students</span>
            <span className="font-medium text-slate-900 dark:text-white">{camp.enrollments.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Enrolled Students Table */}
          <Card>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enrolled Students</h3>
            </div>
            {camp.enrollments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Codeforces</th>
                    </tr>
                  </thead>
                  <tbody>
                    {camp.enrollments.map((e: any) => (
                      <tr key={e.id} className="border-b border-slate-200 dark:border-slate-700">
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{e.student.user.name}</td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{e.student.user.email}</td>
                        <td className="px-4 py-3">
                          {e.student.cfHandle ? (
                            <a href={`https://codeforces.com/profile/${e.student.cfHandle}`} target="_blank" rel="noreferrer" className="text-primary-400 hover:underline">
                              {e.student.cfHandle}
                            </a>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center py-4">No students enrolled yet.</p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          {/* Actions / Imports */}
          <ImportSheetForm campId={camp.id} onSuccess={fetchCamp} />

          {/* Assigned Mentors */}
          <Card>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Assigned Mentors</h3>
            </div>
            {camp.mentors.length > 0 ? (
              <ul className="space-y-3">
                {camp.mentors.map((m: any) => (
                  <li key={m.id} className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold">
                      {m.mentor.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{m.mentor.user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{m.mentor.user.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm">No mentors assigned.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
