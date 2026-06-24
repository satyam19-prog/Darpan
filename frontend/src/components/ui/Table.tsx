'use client';

import React from 'react';

// Table Types
interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  keyExtractor?: (item: T) => string;
  skeletonRows?: number;
}

export default function Table<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'Koi data nahi mila 🤷',
  onRowClick,
  keyExtractor,
  skeletonRows = 5,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: skeletonRows }).map((_, rowIdx) => (
                <tr key={rowIdx} className="border-b border-slate-800/30">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      <div className="skeleton h-4 rounded-lg w-3/4" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-slate-400 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr
                key={keyExtractor ? keyExtractor(item) : idx}
                onClick={() => onRowClick?.(item)}
                className={`
                  border-b border-slate-800/30 last:border-b-0
                  ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}
                  ${onRowClick ? 'cursor-pointer' : ''}
                  hover:bg-primary-500/5 transition-colors duration-150
                `}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-6 py-4 text-sm text-slate-300 ${col.className || ''}`}
                  >
                    {col.render
                      ? col.render(item, idx)
                      : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
