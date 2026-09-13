'use client';

import { useState, useEffect } from 'react';
import TeamForm from './components/TeamForm';
import TeamInfo from './components/TeamInfo';
import LeagueStandings from './components/LeagueStandings';
import TeamSquad from './components/TeamSquad';
import ChipStats from './components/ChipStats';
import MostCaptained from './components/MostCaptained';

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

interface StoredLeagueRanks {
  gameweek: number;
  ranks: {
    [leagueId: string]: {
      [entryName: string]: number;
    };
  };
}

interface ChipPlay {
  chip_name: string;
  num_played: number;
}

interface Player {
  id: number;
  first_name: string;
  second_name: string;
  team: number;
}

export default function Home() {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [leaguesData, setLeaguesData] = useState<LeagueData[]>([]);
  const [rankChanges, setRankChanges] = useState<Record<string, Record<string, number>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gwStatus, setGwStatus] = useState<string | null>(null);
  const [showSquad, setShowSquad] = useState(false);
  const [entryId, setEntryId] = useState<string>('');
  const [chipPlays, setChipPlays] = useState<ChipPlay[]>([]);
  const [currentEvent, setCurrentEvent] = useState<number>(0);
  const [mostCaptained, setMostCaptained] = useState<number | undefined>();
  const [mostViceCaptained, setMostViceCaptained] = useState<number | undefined>();
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('fpl_league_ranks');
        if (stored) {
          setRankChanges(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load stored ranks:', e);
      }
    }
  }, []);

  const handleSearch = async (inputEntryId: string, leagueIds: string[]) => {
    setIsLoading(true);
    setError(null);
    setGwStatus(null);
    setEntryId(inputEntryId);

    try {
      // Fetch team data
      const teamRes = await fetch(`/api/team?id=${inputEntryId}`);
      if (!teamRes.ok) {
        throw new Error('Failed to fetch team data');
      }
      const team = await teamRes.json();
      setTeamData(team);

      // Fetch bootstrap data to check GW status
      const bootstrapRes = await fetch('/api/bootstrap');
      if (!bootstrapRes.ok) {
        throw new Error('Failed to fetch bootstrap data');
      }
      const bootstrap = await bootstrapRes.json();
      const currentGw = team.current_event;
      const gwData = bootstrap.events.find((e: any) => e.id === currentGw);
      const isFinished = gwData?.finished || false;
      const gwName = gwData?.name || `GW${currentGw}`;

      console.log(`GW ${currentGw} status:`, gwData?.status, 'Finished:', isFinished);
      setGwStatus(gwData?.status);
      setCurrentEvent(currentGw);

      // Set chip plays data
      if (gwData?.chip_plays) {
        setChipPlays(gwData.chip_plays);
      }

      // Set most captained data
      if (gwData?.most_captained) {
        setMostCaptained(gwData.most_captained);
      }
      if (gwData?.most_vice_captained) {
        setMostViceCaptained(gwData.most_vice_captained);
      }

      // Set players data
      if (bootstrap.elements) {
        setPlayers(
          bootstrap.elements.map((p: any) => ({
            id: p.id,
            first_name: p.first_name,
            second_name: p.second_name,
            team: p.team,
          }))
        );
      }

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

        // Load previous ranks from localStorage
        let previousData: StoredLeagueRanks | null = null;
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('fpl_league_ranks');
          if (stored) {
            previousData = JSON.parse(stored);
            console.log('Loaded previous data:', previousData);
          }
        }

        // Calculate rank changes only if stored data is from same GW
        const changes: Record<string, Record<string, number>> = {};
        if (previousData && previousData.gameweek === currentGw) {
          leagues.forEach((league) => {
            const leagueId = String(league.league.id);
            changes[leagueId] = {};

            league.standings.results.forEach((result) => {
              const previousRank = previousData!.ranks[leagueId]?.[result.entry_name];
              if (previousRank !== undefined) {
                const change = result.rank - previousRank;
                changes[leagueId][result.entry_name] = change;
                console.log(`${result.entry_name}: ${previousRank} → ${result.rank} (${change > 0 ? '+' : ''}${change})`);
              }
            });
          });
        }

        // Only show rank changes if GW is finished
        if (isFinished) {
          setRankChanges(changes);
        } else {
          setRankChanges({});
          console.log('GW not finished, rank changes hidden');
        }

        // Always save current ranks to localStorage (for all GW statuses)
        const currentRanks: StoredLeagueRanks = {
          gameweek: currentGw,
          ranks: {},
        };
        leagues.forEach((league) => {
          const leagueId = String(league.league.id);
          currentRanks.ranks[leagueId] = {};

          league.standings.results.forEach((result) => {
            currentRanks.ranks[leagueId][result.entry_name] = result.rank;
          });
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem('fpl_league_ranks', JSON.stringify(currentRanks));
          console.log('Saved ranks for GW', currentGw);
        }
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

        {chipPlays.length > 0 && (
          <div className="mb-8">
            <ChipStats chipPlays={chipPlays} eventNumber={currentEvent} />
          </div>
        )}

        {(mostCaptained || mostViceCaptained) && players.length > 0 && (
          <div className="mb-8">
            <MostCaptained
              mostCaptained={mostCaptained}
              mostViceCaptained={mostViceCaptained}
              players={players}
              eventNumber={currentEvent}
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-8">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {gwStatus && gwStatus !== 'finished' && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-8">
            <p className="font-semibold">⏳ Gameweek in progress</p>
            <p>Rank changes will be tracked once results are official.</p>
          </div>
        )}

        {teamData && (
          <div className="space-y-8">
            <div className="flex gap-4">
              <TeamInfo data={teamData} />
              <button
                onClick={() => setShowSquad(!showSquad)}
                className="h-fit px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                {showSquad ? 'Hide Squad' : 'View Squad'}
              </button>
            </div>

            {showSquad && entryId && (
              <TeamSquad entryId={entryId} event={teamData.current_event} />
            )}

            {leaguesData.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">League Standings</h2>
                {leaguesData.map((league) => (
                  <LeagueStandings
                    key={league.league.id}
                    data={league}
                    rankChanges={rankChanges[String(league.league.id)]}
                  />
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
