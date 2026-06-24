'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import api from '@/lib/api';
import Link from 'next/link';

interface Camp {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  _count: {
    enrollments: number;
    mentors: number;
    privateContests: number;
  };
}

export default function AdminCampsPage() {
  const [camps, setCamps] = useState<Camp[]>([]);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Camp Management</h1>
        <Button onClick={() => alert('TODO: Implement Create Camp Modal')}>
          + Create New Camp
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse h-48 bg-gray-200 dark:bg-gray-800">
              <div />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {camps.map((camp) => (
            <Link key={camp.id} href={`/admin/camps/${camp.id}`}>
              <Card hover className="h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{camp.name}</h3>
                  <Badge variant={camp.type === 'SUMMER' ? 'warning' : 'primary'}>
                    {camp.type}
                  </Badge>
                </div>
                <div className="text-sm text-slate-400 space-y-2">
                  <p>
                    {new Date(camp.startDate).toLocaleDateString()} - {new Date(camp.endDate).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-4 pt-2">
                    <div>
                      <span className="block font-semibold text-white">{camp._count.enrollments}</span>
                      <span className="text-xs uppercase">Students</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-white">{camp._count.mentors}</span>
                      <span className="text-xs uppercase">Mentors</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          
          {camps.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              No camps found. Create one to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
