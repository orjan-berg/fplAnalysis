'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import TeamSquad from '@/app/components/TeamSquad';

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
  const params = useParams();
  const entryId = params.entryId as string;
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/team?id=${entryId}`);
        if (!res.ok) throw new Error('Failed to fetch team');
        const data = await res.json();
        setTeamData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (entryId) fetchTeam();
  }, [entryId]);

  if (isLoading) return <div className="text-center py-8">Loading team...</div>;
  if (error) return <div className="text-red-600 text-center py-8">Error: {error}</div>;
  if (!teamData) return <div className="text-center py-8">No team data</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-blue-600 text-white py-8 shadow">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/" className="text-blue-100 hover:text-white mb-4 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold">{teamData.name}</h1>
          <p className="text-blue-100 mt-2">
            {teamData.player_first_name} {teamData.player_last_name}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
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

        {/* Squad */}
        {entryId && (
          <TeamSquad entryId={entryId} event={teamData.current_event} />
        )}
      </main>
    </div>
  );
}
