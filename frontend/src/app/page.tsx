import Link from 'next/link';
import { ArrowRight, Trophy, Users, LayoutDashboard, ShieldAlert } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full max-w-7xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500/20 border border-primary-500/50 flex items-center justify-center">
            <span className="font-bold text-primary-400">D</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Darpan</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link href="/register" className="text-sm font-medium px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl px-6 py-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium mb-8">
          <Trophy className="w-3.5 h-3.5" />
          The Ultimate CP Tracker
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          Track, Analyze, and <br />
          <span className="gradient-text">Conquer Competitions</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
          Darpan is the definitive platform for managing competitive programming camps. Sync your Codeforces, LeetCode, and CodeChef profiles in one unified dashboard.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white text-lg font-medium rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 glass border border-slate-700/50 hover:bg-white/5 text-white text-lg font-medium rounded-xl flex items-center justify-center transition-colors">
            Mentor Login
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 text-left w-full">
          <div className="glass p-8 rounded-2xl border border-slate-700/50 hover:border-primary-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
              <LayoutDashboard className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Unified Dashboards</h3>
            <p className="text-slate-400">View real-time ratings, topic-wise progress, and upsolving status across all major platforms in one place.</p>
          </div>
          
          <div className="glass p-8 rounded-2xl border border-slate-700/50 hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Camp Management</h3>
            <p className="text-slate-400">Admins and mentors can seamlessly organize summer/winter camps, track attendance, and monitor overall student progress.</p>
          </div>
          
          <div className="glass p-8 rounded-2xl border border-slate-700/50 hover:border-amber-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Integrity Tracking</h3>
            <p className="text-slate-400">Integrated tools for mentors to flag suspicious code similarities and ensure fair play in private contests.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
