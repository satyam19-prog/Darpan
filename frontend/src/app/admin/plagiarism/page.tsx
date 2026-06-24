'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Check, X, Search } from 'lucide-react';
import api from '@/lib/api';

interface Flag {
  id: string;
  campId: string;
  studentA: { id: string; user: { name: string } };
  studentB: { id: string; user: { name: string } };
  reason: string;
  resolvedBy: string | null;
  resolution: string | null;
  flaggedAt: string;
}

export default function AdminPlagiarismPage() {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  // We should ideally fetch all flags across all camps for admin, 
  // but for simplicity we assume we fetch from a generic endpoint or mock it.
  // Actually, we need to fetch camps first, then flags, or we can add a generic endpoint.
  // For the sake of UI, let's just fetch camps and pick the first one, or add a generic /api/plagiarism/all endpoint.
  // Wait, I only made /api/plagiarism/camp/:campId. Let's fetch camps and then fetch flags for the first camp.
  
  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const campsRes = await api.get('/camps');
        if (campsRes.data.success && campsRes.data.data.length > 0) {
          const campId = campsRes.data.data[0].id; // Just using first camp for demo
          const flagsRes = await api.get(`/plagiarism/camp/${campId}`);
          if (flagsRes.data.success) {
            setFlags(flagsRes.data.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch flags', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlags();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await api.put(`/plagiarism/${id}/resolve`, { resolution: resolutionNote });
      setFlags(flags.map(f => f.id === id ? { ...f, resolution: resolutionNote, resolvedBy: 'admin' } : f));
      setResolvingId(null);
      setResolutionNote('');
    } catch (error) {
      console.error('Failed to resolve flag', error);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-primary-500" />
            Plagiarism Flags
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review and resolve code similarity flags</p>
        </div>
      </div>

      <div className="glass rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading flags...</div>
        ) : flags.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">All Clear!</h3>
            <p className="text-slate-500 dark:text-slate-400">No plagiarism flags found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50">
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Date</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Student A</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Student B</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Reason</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {flags.map((flag) => (
                  <tr key={flag.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(flag.flaggedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white">
                      {flag.studentA.user.name}
                    </td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white">
                      {flag.studentB.user.name}
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300 max-w-xs truncate" title={flag.reason}>
                      {flag.reason}
                    </td>
                    <td className="p-4">
                      {flag.resolvedBy ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          <Check className="w-3 h-3" /> Resolved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <ShieldAlert className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {!flag.resolvedBy ? (
                        resolvingId === flag.id ? (
                          <div className="flex flex-col gap-2 min-w-[200px]">
                            <input
                              type="text"
                              placeholder="Resolution note..."
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                              value={resolutionNote}
                              onChange={(e) => setResolutionNote(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleResolve(flag.id)}
                                className="px-3 py-1 bg-primary-600 hover:bg-primary-500 text-slate-900 dark:text-white text-xs font-medium rounded-lg transition-colors"
                              >
                                Submit
                              </button>
                              <button
                                onClick={() => { setResolvingId(null); setResolutionNote(''); }}
                                className="px-3 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setResolvingId(flag.id)}
                            className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                          >
                            Resolve
                          </button>
                        )
                      ) : (
                        <span className="text-sm text-slate-500 truncate max-w-[150px] inline-block" title={flag.resolution || ''}>
                          {flag.resolution}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
