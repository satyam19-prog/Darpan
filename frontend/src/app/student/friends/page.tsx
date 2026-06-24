'use client';

import { useState, useEffect } from 'react';
import { Search, UserPlus, Users, Check, X } from 'lucide-react';
import api from '@/lib/api';

interface Friend {
  id: string;
  name: string;
  codeforcesRating: number;
  leetcodeRating: number;
  codechefRating: number;
  totalSolved: number;
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await api.get('/api/friends');
      setFriends(res.data.data);
    } catch (error) {
      console.error('Failed to fetch friends', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      // In a real app, we would search users first. Here we assume searchQuery is the exact student ID
      await api.post('/api/friends/request', { receiverId: searchQuery });
      setSearchQuery('');
      alert('Friend request sent!');
    } catch (error) {
      alert('Failed to send request');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Friends & Comparison</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-xl bg-surface-light border border-slate-700/50">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> Add Friend
            </h2>
            <form onSubmit={handleAddFriend} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Student ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-surface border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="p-6 rounded-xl bg-surface-light border border-slate-700/50 min-h-[400px]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" /> Your Friends
            </h2>
            
            {loading ? (
              <div className="text-slate-400">Loading friends...</div>
            ) : friends.length === 0 ? (
              <div className="text-slate-400">You haven't added any friends yet. Add some to compare ratings!</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium text-blue-400">Codeforces</th>
                      <th className="pb-3 font-medium text-orange-400">LeetCode</th>
                      <th className="pb-3 font-medium text-yellow-400">CodeChef</th>
                      <th className="pb-3 font-medium">Total Solved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {friends.map((friend) => (
                      <tr key={friend.id} className="border-b border-slate-700/50 last:border-0">
                        <td className="py-4">{friend.name}</td>
                        <td className="py-4 font-semibold">{friend.codeforcesRating}</td>
                        <td className="py-4 font-semibold">{friend.leetcodeRating}</td>
                        <td className="py-4 font-semibold">{friend.codechefRating}</td>
                        <td className="py-4">{friend.totalSolved}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
