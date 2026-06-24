'use client';

import React from 'react';
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
}

interface RadarChartProps {
  data: RadarData[];
}

export default function RadarChart({ data }: RadarChartProps) {
  // Use generic data if none is provided
  const chartData = data.length > 0 ? data : [
    { subject: 'Math', A: 120, fullMark: 150 },
    { subject: 'DP', A: 98, fullMark: 150 },
    { subject: 'Graphs', A: 86, fullMark: 150 },
    { subject: 'Greedy', A: 99, fullMark: 150 },
    { subject: 'Strings', A: 85, fullMark: 150 },
    { subject: 'Data Structs', A: 65, fullMark: 150 },
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
            itemStyle={{ color: '#3b82f6' }}
          />
          <Radar name="Student" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
