'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Plus, CheckCircle2, X } from 'lucide-react';
import api from '@/lib/api';

interface Session {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  attendances: { studentId: string; present: boolean }[];
}

export default function MentorSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [campId, setCampId] = useState<string | null>(null);

  // New session form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('60');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const campsRes = await api.get('/camps');
        if (campsRes.data.success && campsRes.data.data.length > 0) {
          const cId = campsRes.data.data[0].id;
          setCampId(cId);
          fetchSessions(cId);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch camps', error);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchSessions = async (cId: string) => {
    try {
      const res = await api.get(`/offline-sessions/camp/${cId}`);
      if (res.data.success) {
        setSessions(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch sessions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campId) return;

    try {
      const res = await api.post('/offline-sessions', {
        campId,
        title,
        date,
        durationMinutes: parseInt(duration, 10),
      });

      if (res.data.success) {
        setSessions([res.data.data, ...sessions]);
        setShowForm(false);
        setTitle('');
        setDate('');
        setDuration('60');
      }
    } catch (error) {
      console.error('Failed to create session', error);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-8 h-8 text-primary-500" />
            Offline Sessions
          </h1>
          <p className="text-slate-400 mt-1">Schedule sessions and track attendance</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl flex items-center gap-2 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Session'}
        </button>
      </div>

      {showForm && (
        <div className="glass p-6 rounded-2xl border border-slate-700/50 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-semibold text-white mb-4">Schedule New Session</h2>
          <form onSubmit={handleCreateSession} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1 w-full">
              <label className="text-sm text-slate-400">Title / Topic</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
                placeholder="e.g., Dynamic Programming Intro"
              />
            </div>
            <div className="w-full md:w-48 space-y-1">
              <label className="text-sm text-slate-400">Date & Time</label>
              <input
                type="datetime-local"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <div className="w-full md:w-32 space-y-1">
              <label className="text-sm text-slate-400">Duration (mins)</label>
              <input
                type="number"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors"
            >
              Schedule
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="col-span-full p-12 glass rounded-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Sessions Yet</h3>
            <p className="text-slate-400">Click "New Session" to schedule your first offline meeting.</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="glass p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-colors flex flex-col">
              <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{session.title}</h3>
              <div className="flex items-center gap-2 text-sm text-primary-400 mb-4">
                <Calendar className="w-4 h-4" />
                {new Date(session.date).toLocaleString()} ({session.durationMinutes}m)
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Users className="w-4 h-4" />
                  {session.attendances?.length || 0} Attended
                </div>
                <button className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
                  Mark Attendance &rarr;
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
