'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { RatingChart } from '@/components/charts/RatingChart';
import api from '@/lib/api';

export default function StudentDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/students/dashboard');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-foreground/10 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-foreground/10 rounded-xl" />
          <div className="h-48 bg-foreground/10 rounded-xl md:col-span-2" />
        </div>
      </div>
    );
  }

  if (!data) return <div>Failed to load dashboard</div>;

  const { profile, platformData } = data;
  const cf = platformData.codeforces;
  const lc = platformData.leetcode;
  const cc = platformData.codechef;

  return (
    <div className="space-y-8">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M45.7,-76.3C58.9,-69.3,69.1,-55.3,77.7,-40.8C86.3,-26.3,93.2,-11.3,91.8,3.1C90.3,17.5,80.4,31.2,70.1,43.3C59.7,55.5,48.9,66.1,35.5,73.5C22.1,80.9,6.1,85.1,-9.1,83.9C-24.3,82.7,-38.6,76.1,-50.7,66.6C-62.8,57.1,-72.6,44.7,-79.8,30.3C-87,15.9,-91.6,-0.5,-88.7,-15.8C-85.8,-31.1,-75.4,-45.3,-62.7,-53.4C-50,-61.5,-34.9,-63.5,-20.9,-68.8C-6.9,-74.1,6,-82.7,21.1,-83.4C36.2,-84.1,45.7,-76.3,45.7,-76.3Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold border-4 border-white/30">
            {profile.user.name.charAt(0)}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{profile.user.name}</h1>
            <p className="text-primary-100 mt-1">{profile.user.email}</p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              {profile.cfHandle && <Badge variant="primary" className="bg-white/20 hover:bg-white/30 text-white border-none">CF: {profile.cfHandle}</Badge>}
              {profile.lcHandle && <Badge variant="warning" className="bg-white/20 hover:bg-white/30 text-white border-none">LC: {profile.lcHandle}</Badge>}
              {profile.ccHandle && <Badge variant="success" className="bg-white/20 hover:bg-white/30 text-white border-none">CC: {profile.ccHandle}</Badge>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Badges */}
        <div className="space-y-8">
          <Card className="border-t-4 border-t-primary-500 shadow-md hover:shadow-lg transition-all animate-slideUp" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-foreground">Codeforces</h3>
              {cf && <span className="text-sm font-normal text-foreground/60">{cf.rank}</span>}
            </div>
            {cf ? (
              <div className="space-y-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-extrabold text-primary-500">{cf.rating}</span>
                  <span className="text-sm text-foreground/60">current rating</span>
                </div>
                <div className="text-sm text-foreground/60">
                  Max Rating: <span className="font-semibold text-foreground">{cf.maxRating}</span> ({cf.maxRank})
                </div>
              </div>
            ) : (
              <p className="text-foreground/60 text-sm">Not linked or no data</p>
            )}
          </Card>

          <Card className="border-t-4 border-t-warning-500 shadow-md hover:shadow-lg transition-all animate-slideUp" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-foreground">LeetCode</h3>
            </div>
            {lc ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <span className="text-foreground/60">Solved</span>
                  <span className="font-semibold text-foreground">{lc.submitStats?.acSubmissionNum[0]?.count || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <span className="text-foreground/60">Ranking</span>
                  <span className="font-semibold text-foreground">{lc.profile?.ranking || '-'}</span>
                </div>
              </div>
            ) : (
              <p className="text-foreground/60 text-sm">Not linked or no data</p>
            )}
          </Card>

          <Card className="border-t-4 border-t-success-500 shadow-md hover:shadow-lg transition-all animate-slideUp" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-foreground">CodeChef</h3>
              {cc && <span className="text-sm font-normal text-foreground/60">{cc.stars}</span>}
            </div>
            {cc ? (
              <div className="space-y-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-extrabold text-success">{cc.rating}</span>
                  <span className="text-sm text-foreground/60">current rating</span>
                </div>
                <div className="text-sm text-foreground/60">
                  Max Rating: <span className="font-semibold text-foreground">{cc.highestRating}</span>
                </div>
              </div>
            ) : (
              <p className="text-foreground/60 text-sm">Not linked or no data</p>
            )}
          </Card>

          <Card className="animate-slideUp" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-foreground">Badges & Achievements</h3>
            </div>
            {profile.badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.badges.map((b: any) => (
                  <div key={b.id} className="group relative hover:scale-105 transition-transform">
                    <Badge variant="success" className="cursor-default">
                      🏆 {b.badge.name}
                    </Badge>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-foreground text-background text-xs p-2 rounded z-10 text-center shadow-xl border border-border">
                      {b.badge.description}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground/60">No badges earned yet. Keep solving!</p>
            )}
          </Card>
        </div>

        {/* Right Column: Charts & Activity */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-md animate-slideUp" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-foreground">Codeforces Rating History</h3>
            </div>
            {/* In a real scenario, we'd fetch the user.rating array here. 
                For now, we pass empty array or mock if not fetched by controller. */}
            <RatingChart data={[]} />
            <p className="text-xs text-center text-foreground/60 mt-4">Chart data loads when historical rating is fetched.</p>
          </Card>

          <Card className="shadow-md animate-slideUp" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-foreground">Recent Camps</h3>
            </div>
            {profile.enrollments.length > 0 ? (
              <div className="space-y-4">
                {profile.enrollments.map((e: any) => (
                  <div key={e.id} className="flex justify-between items-center p-3 rounded-lg border border-border bg-foreground/5 hover:bg-foreground/10 transition-all hover:scale-[1.01]">
                    <div>
                      <p className="font-semibold text-foreground">{e.camp.name}</p>
                      <p className="text-xs text-foreground/60">Enrolled on {new Date(e.enrolledAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="primary">{e.camp.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground/60 text-sm">Not enrolled in any camps.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
