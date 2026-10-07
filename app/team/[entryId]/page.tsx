'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TeamSquad from '@/app/components/TeamSquad';
import Transfers from '@/app/components/Transfers';

interface TeamData {
  player_first_name: string;
  player_last_name: string;
  name: string;
  summary_overall_points: number;
  summary_overall_rank: number;
  summary_event_points: number;
  summary_event_rank: number;
  current_event: number;
  bank: number;
  free_transfers: number;
  transfers_on_bank: number;
}

export default function TeamPage() {
  const router = useRouter();
  const [entryId, setEntryId] = useState<string | null>(null);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get entryId from URL path
    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[2]; // /team/123 -> [0]='', [1]='team', [2]='123'
    if (id) {
      setEntryId(id);
    }
  }, []);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!entryId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/team?id=${entryId}`);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch team');
        }

        const data = await res.json();
        setTeamData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, [entryId]);

  if (isLoading) return <div className="text-center py-8">Loading team...</div>;
  if (error) return <div className="text-red-600 text-center py-8">Error: {error}</div>;
  if (!teamData) return <div className="text-center py-8">No team data</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="bg-blue-600 text-white py-8 shadow">
        <div className="max-w-full mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="text-blue-100 hover:text-white mb-4 inline-block cursor-pointer font-medium"
          >
            ← Tilbake
          </button>
          <h1 className="text-4xl font-bold">{teamData.name}</h1>
          <p className="text-blue-100 mt-2">
            {teamData.player_first_name} {teamData.player_last_name}
          </p>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-white shadow-lg">
          <nav className="p-6 space-y-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-6 px-2">Meny</h3>
            <button
              onClick={() => router.back()}
              className="w-full text-left px-4 py-3 rounded-lg transition font-medium text-gray-700 hover:bg-gray-100"
            >
              ← Tilbake til Ligaer
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 uppercase font-semibold">Overall Points</p>
            <p className="text-3xl font-bold text-blue-600">{teamData.summary_overall_points}</p>
            <p className="text-xs text-gray-500">Rank: #{teamData.summary_overall_rank}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 uppercase font-semibold">GW {teamData.current_event} Points</p>
            <p className="text-3xl font-bold text-green-600">{teamData.summary_event_points}</p>
            <p className="text-xs text-gray-500">Rank: #{teamData.summary_event_rank}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 uppercase font-semibold">Bank</p>
            <p className="text-2xl font-bold text-purple-600">£{(teamData.bank / 10).toFixed(1)}m</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-600 uppercase font-semibold">Transfers</p>
            <p className="text-2xl font-bold text-orange-600">{teamData.free_transfers}</p>
            <p className="text-xs text-gray-500">In bank: {teamData.transfers_on_bank}</p>
          </div>
        </div>

            {/* Transfers and Squad */}
            {entryId && (
              <div className="space-y-6">
                <Transfers entryId={entryId} currentEvent={teamData.current_event} />
                <TeamSquad entryId={entryId} event={teamData.current_event} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
