'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/api';

interface ImportSheetFormProps {
  campId: string;
  onSuccess: () => void;
}

export function ImportSheetForm({ campId, onSuccess }: ImportSheetFormProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post(`/camps/${campId}/import-students`, { sheetUrl: url });
      if (res.data.success) {
        setResult(res.data.data);
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to import students');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card gradientBorder>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Import Students from Google Sheet</h3>
      </div>
      <form onSubmit={handleImport} className="space-y-4">
        <div>
          <Input 
            label="Google Sheet URL"
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="https://docs.google.com/spreadsheets/d/..." 
            required
            helperText="Ensure the sheet is 'Anyone with the link can view' and contains columns: Name, Email, CF Handle."
          />
        </div>

        {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
        
        {result && (
          <div className="text-green-400 text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20">
            <p className="font-semibold">Import Successful!</p>
            <ul className="list-disc pl-5 mt-1 text-slate-600 dark:text-slate-300">
              <li>New users created: {result.added}</li>
              <li>Existing users updated: {result.updated}</li>
              <li>Successfully enrolled: {result.enrolled}</li>
            </ul>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Importing...' : 'Import Students'}
        </Button>
      </form>
    </Card>
  );
}
