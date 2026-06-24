'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface RatingChartProps {
  data: { ratingUpdateTimeSeconds: number; newRating: number }[];
}

export function RatingChart({ data }: RatingChartProps) {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No rating history available</div>;
  }

  // Format data for Recharts
  const chartData = data.map((d) => ({
    date: new Date(d.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
    rating: d.newRating,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={['dataMin - 100', 'dataMax + 100']} tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px', border: 'none' }}
            itemStyle={{ color: '#3b82f6' }}
          />
          {/* Ranks background markers */}
          <ReferenceLine y={1200} stroke="#4ade80" strokeDasharray="3 3" opacity={0.5} label={{ value: 'Pupil', position: 'insideTopLeft', fill: '#4ade80', fontSize: 12 }} />
          <ReferenceLine y={1400} stroke="#60a5fa" strokeDasharray="3 3" opacity={0.5} label={{ value: 'Specialist', position: 'insideTopLeft', fill: '#60a5fa', fontSize: 12 }} />
          <ReferenceLine y={1600} stroke="#a78bfa" strokeDasharray="3 3" opacity={0.5} label={{ value: 'Expert', position: 'insideTopLeft', fill: '#a78bfa', fontSize: 12 }} />
          
          <Line 
            type="monotone" 
            dataKey="rating" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
