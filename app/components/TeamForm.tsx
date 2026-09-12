'use client';

import { FormEvent, useState } from 'react';

interface TeamFormProps {
  onSearch: (entryId: string, leagueIds: string[]) => void;
  isLoading?: boolean;
}

export default function TeamForm({ onSearch, isLoading = false }: TeamFormProps) {
  const [entryId, setEntryId] = useState('');
  const [leagueIds, setLeagueIds] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (entryId.trim()) {
      const ids = leagueIds
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id);
      onSearch(entryId.trim(), ids);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="entryId" className="block text-sm font-medium text-gray-700 mb-2">
          Team ID (Entry ID)
        </label>
        <input
          id="entryId"
          type="text"
          value={entryId}
          onChange={(e) => setEntryId(e.target.value)}
          placeholder="e.g. 12345"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="leagueIds" className="block text-sm font-medium text-gray-700 mb-2">
          League IDs (comma-separated)
        </label>
        <input
          id="leagueIds"
          type="text"
          value={leagueIds}
          onChange={(e) => setLeagueIds(e.target.value)}
          placeholder="e.g. 123456, 789012, 345678"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Leave empty if you only want to see your team</p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
      >
        {isLoading ? 'Loading...' : 'Search'}
      </button>
    </form>
  );
}
