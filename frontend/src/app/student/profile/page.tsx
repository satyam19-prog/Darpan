'use client';

import { useState, useEffect } from 'react';
import { UserCircle, Save } from 'lucide-react';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { showSuccess, showError } from '@/components/ui/Toast';

interface ProfileData {
  cfHandle: string;
  lcHandle: string;
  ccHandle: string;
}

export default function ProfilePage() {
  const [formData, setFormData] = useState<ProfileData>({
    cfHandle: '',
    lcHandle: '',
    ccHandle: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/students/dashboard');
      const profile = res.data.data.profile;
      setFormData({
        cfHandle: profile.cfHandle || '',
        lcHandle: profile.lcHandle || '',
        ccHandle: profile.ccHandle || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile', error);
      showError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/students/profile', formData);
      showSuccess('Profile updated successfully!');
    } catch (error) {
      showError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-slate-500 dark:text-slate-400">Loading profile...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <UserCircle className="w-8 h-8 text-primary-400" />
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </div>

      <Card className="p-8">
        <h2 className="text-xl font-semibold mb-6">Competitive Programming Handles</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Codeforces Handle" 
            name="cfHandle" 
            value={formData.cfHandle} 
            onChange={handleChange} 
            placeholder="e.g. tourist" 
          />
          <Input 
            label="LeetCode Handle" 
            name="lcHandle" 
            value={formData.lcHandle} 
            onChange={handleChange} 
            placeholder="e.g. awice" 
          />
          <Input 
            label="CodeChef Handle" 
            name="ccHandle" 
            value={formData.ccHandle} 
            onChange={handleChange} 
            placeholder="e.g. genings" 
          />
          
          <Button type="submit" isLoading={saving} className="flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Handles
          </Button>
        </form>
      </Card>
    </div>
  );
}
