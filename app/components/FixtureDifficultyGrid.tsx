'use client';

import { useState, useEffect } from 'react';

interface Fixture {
  id: number;
  event: number;
  team_h: number;
  team_a: number;
  team_h_difficulty: number;
  team_a_difficulty: number;
  finished: boolean;
  team_h_score: number | null;
  team_a_score: number | null;
  kickoff_time: string | null;
}

interface Team {
  id: number;
  name: string;
  short_name: string;
  code: number;
}

interface FixtureDifficultyGridProps {
  startEvent: number;
}

interface TeamFixtures {
  teamId: number;
  teamName: string;
  shortName: string;
  fixtures: Array<{
    event: number;
    difficulty: number;
    opponent: string;
    isHome: boolean;
    finished: boolean;
  }>;
}

const DIFFICULTY_COLORS = {
  1: 'bg-green-500',
  2: 'bg-lime-500',
  3: 'bg-yellow-500',
  4: 'bg-orange-500',
  5: 'bg-red-500',
};

const DIFFICULTY_LABELS = {
  1: 'VL',
  2: 'L',
  3: 'M',
  4: 'H',
  5: 'VH',
};

export default function FixtureDifficultyGrid({ startEvent }: FixtureDifficultyGridProps) {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Map<number, Team>>(new Map());
  const [teamFixtures, setTeamFixtures] = useState<TeamFixtures[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all fixtures
        const fixturesRes = await fetch('/api/fixtures');
        if (!fixturesRes.ok) throw new Error('Failed to fetch fixtures');
        const fixturesData = await fixturesRes.json();
        setFixtures(fixturesData);

        // Fetch teams
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

        // Determine events to show (current event + next 9)
        const events: number[] = [];
        for (let i = 0; i < 10; i++) {
          events.push(startEvent + i);
        }
        setSelectedEvents(events);

        // Build team fixtures grid
        const teamFixturesMap = new Map<number, TeamFixtures>();

        fixturesData.forEach((fixture: Fixture) => {
          // Home team
          if (!teamFixturesMap.has(fixture.team_h)) {
            const team = teamMap.get(fixture.team_h);
            if (team) {
              teamFixturesMap.set(fixture.team_h, {
                teamId: fixture.team_h,
                teamName: team.name,
                shortName: team.short_name,
                fixtures: [],
              });
            }
          }

          const homeTeamFixtures = teamFixturesMap.get(fixture.team_h);
          if (homeTeamFixtures) {
            const opponent = teamMap.get(fixture.team_a);
            homeTeamFixtures.fixtures.push({
              event: fixture.event,
              difficulty: fixture.team_h_difficulty,
              opponent: opponent?.short_name || '?',
              isHome: true,
              finished: fixture.finished,
            });
          }

          // Away team
          if (!teamFixturesMap.has(fixture.team_a)) {
            const team = teamMap.get(fixture.team_a);
            if (team) {
              teamFixturesMap.set(fixture.team_a, {
                teamId: fixture.team_a,
                teamName: team.name,
                shortName: team.short_name,
                fixtures: [],
              });
            }
          }

          const awayTeamFixtures = teamFixturesMap.get(fixture.team_a);
          if (awayTeamFixtures) {
            const opponent = teamMap.get(fixture.team_h);
            awayTeamFixtures.fixtures.push({
              event: fixture.event,
              difficulty: fixture.team_a_difficulty,
              opponent: opponent?.short_name || '?',
              isHome: false,
              finished: fixture.finished,
            });
          }
        });

        // Convert to array and sort by team name
        const teamFixturesArray = Array.from(teamFixturesMap.values()).sort((a, b) =>
          a.shortName.localeCompare(b.shortName)
        );

        setTeamFixtures(teamFixturesArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startEvent]);

  if (isLoading) return <div className="text-center py-8">Loading fixtures...</div>;
  if (error) return <div className="text-red-600 text-center py-8">Error: {error}</div>;
  if (teamFixtures.length === 0) return <div className="text-center py-8">No fixtures found</div>;

  const getDifficultyColor = (difficulty: number): string => {
    return DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS] || 'bg-gray-400';
  };

  const getDifficultyLabel = (difficulty: number): string => {
    return DIFFICULTY_LABELS[difficulty as keyof typeof DIFFICULTY_LABELS] || '?';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Difficulty Ratings Legend</h3>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((diff) => (
            <div key={diff} className="text-center">
              <div className={`${getDifficultyColor(diff)} text-white font-bold py-2 rounded mb-2`}>
                {getDifficultyLabel(diff)}
              </div>
              <p className="text-xs text-gray-600">
                {diff === 1 && 'Very Light'}
                {diff === 2 && 'Light'}
                {diff === 3 && 'Medium'}
                {diff === 4 && 'Hard'}
                {diff === 5 && 'Very Hard'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-4 py-3 text-left font-bold text-gray-900 w-32">Team</th>
                {selectedEvents.map((event) => (
                  <th key={event} className="px-2 py-3 text-center font-bold text-gray-900 text-xs bg-gray-50">
                    GW{event}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamFixtures.map((teamData, idx) => {
                const fixtures = new Map(teamData.fixtures.map((f) => [f.event, f]));

                return (
                  <tr key={teamData.teamId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-semibold text-gray-900">{teamData.shortName}</td>
                    {selectedEvents.map((event) => {
                      const fixture = fixtures.get(event);

                      return (
                        <td key={event} className="px-2 py-3 text-center">
                          {fixture ? (
                            <div
                              className={`${getDifficultyColor(
                                fixture.difficulty
                              )} text-white font-bold py-2 rounded text-center text-xs cursor-pointer hover:opacity-80 transition`}
                              title={`vs ${fixture.opponent} (${fixture.isHome ? 'Home' : 'Away'}) - Difficulty: ${getDifficultyLabel(fixture.difficulty)}`}
                            >
                              {fixture.opponent}
                            </div>
                          ) : (
                            <div className="text-gray-300 text-xs">—</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-semibold mb-2">Information:</p>
        <p>
          Each cell shows the opponent team abbreviation with color indicating difficulty. Hover for details. Green = Easy, Red = Hard.
        </p>
      </div>
    </div>
  );
}
