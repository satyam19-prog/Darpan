'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import Link from 'next/link';

export default function MentorDashboard() {
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    try {
      const res = await api.get('/camps');
      if (res.data.success) {
        setCamps(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch camps', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-900 dark:text-white">Mentor Dashboard</h1>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Assigned Camps</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="animate-pulse h-48 bg-gray-200 dark:bg-gray-800">
              <div />
            </Card>
          </div>
        ) : camps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {camps.map((camp) => (
              <Link key={camp.id} href={`/mentor/camps/${camp.id}`}>
                <Card hover className="h-full">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{camp.name}</h3>
                    <Badge variant="primary" className="mt-2">{camp.type}</Badge>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    <p>{camp._count.enrollments} Students Enrolled</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You are not assigned to any camps yet.</p>
        )}
      </div>
    </div>
  );
}
