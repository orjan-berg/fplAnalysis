'use client';

import { useState, useEffect } from 'react';

interface Fixture {
  id: number;
  event: number;
  team_h: number;
  team_a: number;
  team_h_difficulty: number;
  team_a_difficulty: number;
  team_h_name?: string;
  team_a_name?: string;
  kickoff_time: string | null;
  finished: boolean;
  team_h_score: number | null;
  team_a_score: number | null;
}

interface Team {
  id: number;
  name: string;
  short_name: string;
  code: number;
}

interface FixtureDifficultyProps {
  event: number;
}

const DIFFICULTY_COLORS = {
  1: 'bg-green-100 text-green-800',
  2: 'bg-lime-100 text-lime-800',
  3: 'bg-yellow-100 text-yellow-800',
  4: 'bg-orange-100 text-orange-800',
  5: 'bg-red-100 text-red-800',
};

export default function FixtureDifficulty({ event }: FixtureDifficultyProps) {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Map<number, Team>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch fixtures for the event
        const fixturesRes = await fetch(`/api/fixtures?event=${event}`);
        if (!fixturesRes.ok) throw new Error('Failed to fetch fixtures');
        const fixturesData = await fixturesRes.json();
        setFixtures(fixturesData);

        // Fetch teams to map IDs to names
        const playersRes = await fetch('/api/players');
        if (!playersRes.ok) throw new Error('Failed to fetch teams');
        const playersData = await playersRes.json();

        const teamMap = new Map<number, Team>();
        playersData.teams.forEach((tm: any) => {
          teamMap.set(tm.id, {
            id: tm.id,
            name: tm.name,
            short_name: tm.short_name,
            code: tm.code,
          });
        });
        setTeams(teamMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [event]);

  if (isLoading) return <div className="text-center py-8">Loading fixtures...</div>;
  if (error) return <div className="text-red-600 text-center py-8">Error: {error}</div>;
  if (fixtures.length === 0) return <div className="text-center py-8">No fixtures found</div>;

  // Group fixtures by team
  const fixturesByTeam: Record<number, Array<Fixture & { isHome: boolean }>> = {};

  fixtures.forEach((fixture) => {
    if (!fixturesByTeam[fixture.team_h]) {
      fixturesByTeam[fixture.team_h] = [];
    }
    fixturesByTeam[fixture.team_h].push({ ...fixture, isHome: true });

    if (!fixturesByTeam[fixture.team_a]) {
      fixturesByTeam[fixture.team_a] = [];
    }
    fixturesByTeam[fixture.team_a].push({ ...fixture, isHome: false });
  });

  const getDifficultyColor = (difficulty: number): string => {
    return DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS] || 'bg-gray-100 text-gray-800';
  };

  const sortedTeamIds = Object.keys(fixturesByTeam)
    .map(Number)
    .sort((a, b) => {
      const nameA = teams.get(a)?.short_name || '';
      const nameB = teams.get(b)?.short_name || '';
      return nameA.localeCompare(nameB);
    });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Fixture Difficulty - GW {event}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTeamIds.map((teamId) => {
          const team = teams.get(teamId);
          if (!team) return null;

          const teamFixtures = fixturesByTeam[teamId];

          return (
            <div key={teamId} className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-4">{team.name}</h4>

              {teamFixtures.map((fixture) => {
                const opponent = fixture.isHome ? teams.get(fixture.team_a) : teams.get(fixture.team_h);
                const difficulty = fixture.isHome ? fixture.team_h_difficulty : fixture.team_a_difficulty;

                return (
                  <div key={fixture.id} className="mb-3 pb-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600">
                          {fixture.isHome ? '🏠' : '🏃'} vs {opponent?.short_name}
                        </p>
                        {fixture.finished && fixture.team_h_score !== null && (
                          <p className="text-xs text-gray-500 mt-1">
                            {fixture.team_h_score} - {fixture.team_a_score}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold flex-shrink-0 ${getDifficultyColor(
                          difficulty
                        )}`}
                      >
                        {difficulty}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Difficulty Rating:</span> 1 = Easiest, 5 = Hardest
        </p>
      </div>
    </div>
  );
}
