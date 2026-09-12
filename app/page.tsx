'use client';

import { useState } from 'react';
import TeamForm from './components/TeamForm';
import TeamInfo from './components/TeamInfo';
import LeagueStandings from './components/LeagueStandings';

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

interface LeagueData {
  league: {
    name: string;
    id: number;
  };
  standings: {
    results: Array<{
      rank: number;
      entry_name: string;
      event_total: number;
      total: number;
      player_name: string;
    }>;
  };
}

export default function Home() {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [leaguesData, setLeaguesData] = useState<LeagueData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (entryId: string, leagueIds: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch team data
      const teamRes = await fetch(`/api/team?id=${entryId}`);
      if (!teamRes.ok) {
        throw new Error('Failed to fetch team data');
      }
      const team = await teamRes.json();
      setTeamData(team);

      // Fetch league data
      if (leagueIds.length > 0) {
        const leagues = await Promise.all(
          leagueIds.map(async (id) => {
            const res = await fetch(`/api/league?id=${id}`);
            if (!res.ok) throw new Error(`Failed to fetch league ${id}`);
            return res.json();
          })
        );
        setLeaguesData(leagues);
      } else {
        setLeaguesData([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTeamData(null);
      setLeaguesData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-blue-600 text-white py-8 shadow">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold">FPL Analysis</h1>
          <p className="text-blue-100 mt-2">Fantasy Premier League Team & League Analyzer</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-12">
          <TeamForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-8">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {teamData && (
          <div className="space-y-8">
            <TeamInfo data={teamData} />

            {leaguesData.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">League Standings</h2>
                {leaguesData.map((league) => (
                  <LeagueStandings key={league.league.id} data={league} />
                ))}
              </div>
            )}
          </div>
        )}

        {!teamData && !isLoading && (
          <div className="text-center text-gray-600 py-12">
            <p className="text-lg">Enter your team ID and league IDs to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}
