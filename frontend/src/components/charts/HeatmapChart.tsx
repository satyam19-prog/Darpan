'use client';

import React from 'react';

// A simple mock heatmap for Github-style contributions
export default function HeatmapChart() {
  const weeks = 52;
  const daysPerWeek = 7;

  // Generate random data for demonstration
  const generateData = () => {
    const grid = [];
    for (let w = 0; w < weeks; w++) {
      const week = [];
      for (let d = 0; d < daysPerWeek; d++) {
        // Random intensity 0-4
        week.push(Math.floor(Math.random() * 5));
      }
      grid.push(week);
    }
    return grid;
  };

  const grid = generateData();

  const getColor = (intensity: number) => {
    switch (intensity) {
      case 1: return 'bg-green-900/40 dark:bg-green-900/60';
      case 2: return 'bg-green-700/60 dark:bg-green-700';
      case 3: return 'bg-green-500/80 dark:bg-green-500';
      case 4: return 'bg-green-400 dark:bg-green-400';
      default: return 'bg-slate-100 dark:bg-slate-800'; // 0 intensity
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-[700px]">
        <div className="flex gap-1">
          {grid.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1">
              {week.map((day, dIndex) => (
                <div
                  key={`${wIndex}-${dIndex}`}
                  className={`w-3 h-3 rounded-[2px] ${getColor(day)} transition-colors hover:ring-1 hover:ring-slate-400`}
                  title={`${day} submissions`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>
      </div>
    </div>
  );
}
