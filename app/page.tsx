'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TeamForm from './components/TeamForm';
import TeamInfo from './components/TeamInfo';
import LeagueStandings from './components/LeagueStandings';
import LeagueHighlights from './components/LeagueHighlights';
import TeamSquad from './components/TeamSquad';
import ChipStats from './components/ChipStats';
import MostCaptained from './components/MostCaptained';
import Transfers from './components/Transfers';
import TransferAnalysis from './components/TransferAnalysis';
import GameweekPointsChart from './components/GameweekPointsChart';
import DreamTeam from './components/DreamTeam';

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
  web_name: string;
  team: number;
  code: number;
}

export default function Home() {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [leaguesData, setLeaguesData] = useState<LeagueData[]>([]);
  const [rankChanges, setRankChanges] = useState<Record<string, Record<string, number>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gwStatus, setGwStatus] = useState<string | null>(null);
  const [entryId, setEntryId] = useState<string>('');
  const [chipPlays, setChipPlays] = useState<ChipPlay[]>([]);
  const [currentEvent, setCurrentEvent] = useState<number>(0);
  const [mostCaptained, setMostCaptained] = useState<number | undefined>();
  const [mostViceCaptained, setMostViceCaptained] = useState<number | undefined>();
  const [mostCaptainedCount, setMostCaptainedCount] = useState<number>(0);
  const [mostViceCaptainedCount, setMostViceCaptainedCount] = useState<number>(0);
  const [totalManagers, setTotalManagers] = useState<number>(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeView, setActiveView] = useState<'overview' | 'squad' | 'leagues' | 'points' | 'transfers' | 'dream_team'>('overview');
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [selectedGw, setSelectedGw] = useState<number>(0);

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

      // Store all events and find last finished GW
      setAllEvents(bootstrap.events);
      const lastFinishedGw = [...bootstrap.events]
        .reverse()
        .find((e: any) => e.finished)?.id || currentGw;

      setSelectedGw(lastFinishedGw);
      setCurrentEvent(currentGw);

      const gwData = bootstrap.events.find((e: any) => e.id === lastFinishedGw);
      const isFinished = gwData?.finished || false;
      const gwName = gwData?.name || `GW${lastFinishedGw}`;

      console.log(`Last finished GW: ${lastFinishedGw}, Current GW: ${currentGw}`);
      setGwStatus(gwData?.status);

      // Set chip plays data
      if (gwData?.chip_plays) {
        setChipPlays(gwData.chip_plays);
      }

      // Set most captained data and fetch live captain statistics
      const totalManagers = (gwData as any).ranked_count || 12000000;
      setTotalManagers(totalManagers);

      // Fetch live data to get captain counts
      try {
        const liveRes = await fetch(`/api/event-live?event=${lastFinishedGw}`);
        if (liveRes.ok) {
          const liveData = await liveRes.json();

          if (gwData?.most_captained && liveData.captainStats) {
            const captainPlayer = liveData.captainStats[gwData.most_captained];
            if (captainPlayer?.selected_by_type) {
              // Type 1 is usually captain selection in FPL
              const captainCount = captainPlayer.selected_by_type['1'] || 0;
              setMostCaptainedCount(captainCount);
              console.log('Captain count:', captainCount, 'from type 1');
            }
          }

          if (gwData?.most_vice_captained && liveData.captainStats) {
            const viceCaptainPlayer = liveData.captainStats[gwData.most_vice_captained];
            if (viceCaptainPlayer?.selected_by_type) {
              // Type 2 is usually vice captain selection
              const viceCaptainCount = viceCaptainPlayer.selected_by_type['2'] || 0;
              setMostViceCaptainedCount(viceCaptainCount);
              console.log('Vice captain count:', viceCaptainCount, 'from type 2');
            }
          }
        }
      } catch (err) {
        console.log('Could not fetch live captain data:', err);
      }

      if (gwData?.most_captained) {
        setMostCaptained(gwData.most_captained);
      }
      if (gwData?.most_vice_captained) {
        setMostViceCaptained(gwData.most_vice_captained);
      }

      // Set players data with team names
      if (bootstrap.elements && bootstrap.teams) {
        const teamMap = new Map<number, string>();
        bootstrap.teams.forEach((team: any) => {
          teamMap.set(team.id, team.name);
        });

        setPlayers(
          bootstrap.elements.map((p: any) => ({
            id: p.id,
            first_name: p.first_name,
            second_name: p.second_name,
            web_name: p.web_name,
            team: p.team,
            team_name: teamMap.get(p.team),
            code: p.code,
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
            console.log('Loaded previous data from localStorage:', previousData);
          }
        }

        // If we don't have previous GW data, fetch it from entry history
        if (!previousData || previousData.gameweek !== currentGw - 1) {
          console.log('Attempting to fetch historical data for GW', currentGw - 1);
          try {
            // For each entry in the leagues, fetch their history
            const allEntries = new Set<number>();
            leagues.forEach((league) => {
              league.standings.results.forEach((result: any) => {
                allEntries.add(result.entry);
              });
            });

            // Fetch history for all entries
            const historicalRanks: StoredLeagueRanks = {
              gameweek: currentGw - 1,
              ranks: {},
            };

            for (const entry of allEntries) {
              try {
                const historyRes = await fetch(`/api/entry-history?id=${entry}`);
                if (historyRes.ok) {
                  const historyData = await historyRes.json();
                  const prevGwData = historyData.current?.find((h: any) => h.event === currentGw - 1);
                  if (prevGwData) {
                    leagues.forEach((league) => {
                      const leagueId = String(league.league.id);
                      if (!historicalRanks.ranks[leagueId]) {
                        historicalRanks.ranks[leagueId] = {};
                      }

                      const entryData = league.standings.results.find((r: any) => r.entry === entry);
                      if (entryData) {
                        historicalRanks.ranks[leagueId][entryData.entry_name] = prevGwData.rank;
                      }
                    });
                  }
                }
              } catch (err) {
                // Skip if entry history fails
              }
            }

            if (Object.keys(historicalRanks.ranks).length > 0) {
              previousData = historicalRanks;
              console.log('Fetched historical data for GW', currentGw - 1);
              if (typeof window !== 'undefined') {
                localStorage.setItem('fpl_league_ranks', JSON.stringify(historicalRanks));
              }
            }
          } catch (err) {
            console.log('Could not fetch historical data:', err);
          }
        }

        // Calculate rank changes if stored data is from previous GW (or same GW for initial tracking)
        const changes: Record<string, Record<string, number>> = {};
        if (previousData) {
          // Show changes if stored data is from previous GW or same GW (tracking same round)
          if (previousData.gameweek === currentGw - 1 || (previousData.gameweek === currentGw && isFinished)) {
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

  // Update data when selected GW changes
  useEffect(() => {
    if (selectedGw === 0 || allEvents.length === 0) return;

    const gwData = allEvents.find((e: any) => e.id === selectedGw);
    if (!gwData) return;

    // Update chip plays
    if (gwData.chip_plays) {
      setChipPlays(gwData.chip_plays);
    } else {
      setChipPlays([]);
    }

    // Update most captained data
    const totalManagers = gwData.ranked_count || 12000000;
    setTotalManagers(totalManagers);

    if (gwData.most_captained) {
      setMostCaptained(gwData.most_captained);
    } else {
      setMostCaptained(undefined);
    }

    if (gwData.most_vice_captained) {
      setMostViceCaptained(gwData.most_vice_captained);
    } else {
      setMostViceCaptained(undefined);
    }

    // Fetch live data to get captain counts
    const fetchLiveData = async () => {
      try {
        const liveRes = await fetch(`/api/event-live?event=${selectedGw}`);
        if (liveRes.ok) {
          const liveData = await liveRes.json();

          if (gwData?.most_captained && liveData.captainStats) {
            const captainPlayer = liveData.captainStats[gwData.most_captained];
            if (captainPlayer?.selected_by_type) {
              const captainCount = captainPlayer.selected_by_type['1'] || 0;
              setMostCaptainedCount(captainCount);
            }
          }

          if (gwData?.most_vice_captained && liveData.captainStats) {
            const viceCaptainPlayer = liveData.captainStats[gwData.most_vice_captained];
            if (viceCaptainPlayer?.selected_by_type) {
              const viceCaptainCount = viceCaptainPlayer.selected_by_type['2'] || 0;
              setMostViceCaptainedCount(viceCaptainCount);
            }
          }
        }
      } catch (err) {
        console.log('Could not fetch live captain data:', err);
      }
    };

    fetchLiveData();
  }, [selectedGw, allEvents]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="bg-blue-600 text-white py-8 shadow">
        <div className="max-w-full mx-auto px-4">
          <h1 className="text-4xl font-bold">FPL Analysis</h1>
          <p className="text-blue-100 mt-2">Fantasy Premier League Team & League Analyzer</p>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-white shadow-lg">
          <nav className="p-6 space-y-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-6 px-2">Meny</h3>
            <button
              onClick={() => setActiveView('overview')}
              className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                activeView === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Oversikt
            </button>
            <button
              onClick={() => setActiveView('squad')}
              className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                activeView === 'squad'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Lag
            </button>
            {leaguesData.length > 0 && (
              <button
                onClick={() => setActiveView('leagues')}
                className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                  activeView === 'leagues'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Ligastillinger
              </button>
            )}
            {teamData && (
              <button
                onClick={() => setActiveView('points')}
                className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                  activeView === 'points'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Poeng per runde
              </button>
            )}
            {teamData && (
              <button
                onClick={() => setActiveView('transfers')}
                className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                  activeView === 'transfers'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Transfer analyse
              </button>
            )}
            <button
              onClick={() => setActiveView('dream_team')}
              className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                activeView === 'dream_team'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dream Team
            </button>
            <Link
              href="/fixtures"
              className="w-full text-left px-4 py-3 rounded-lg transition font-medium text-gray-700 hover:bg-gray-100 block"
            >
              Fixture Difficulty
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-center mb-12">
            <TeamForm onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* GW Selector */}
          {allEvents.length > 0 && (
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg shadow p-4">
                <label className="text-sm font-semibold text-gray-700 mr-4">
                  Velg Gameweek:
                </label>
                <select
                  value={selectedGw}
                  onChange={(e) => setSelectedGw(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {allEvents
                    .filter((e: any) => e.finished || e.id === currentEvent)
                    .map((event: any) => (
                      <option key={event.id} value={event.id}>
                        GW{event.id} {event.finished ? '(Finished)' : '(Current)'}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}

          {activeView !== 'dream_team' && chipPlays.length > 0 && (
            <div className="mb-8">
              <ChipStats chipPlays={chipPlays} eventNumber={currentEvent} />
            </div>
          )}

          {activeView !== 'dream_team' && (mostCaptained || mostViceCaptained) && players.length > 0 && (
            <div className="mb-8">
              <MostCaptained
                mostCaptained={mostCaptained}
                mostViceCaptained={mostViceCaptained}
                mostCaptainedCount={mostCaptainedCount}
                mostViceCaptainedCount={mostViceCaptainedCount}
                totalManagers={totalManagers}
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
            <div>
              {activeView === 'overview' && (
                <div className="space-y-8">
                  <TeamInfo data={teamData} />
                </div>
              )}

              {activeView === 'squad' && entryId && (
                <div className="space-y-6">
                  <TeamInfo data={teamData} />
                  <Transfers entryId={entryId} currentEvent={teamData.current_event} />
                  <TeamSquad entryId={entryId} event={selectedGw || teamData.current_event} />
                </div>
              )}

              {activeView === 'leagues' && leaguesData.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-gray-900">Ligastillinger</h2>
                  {leaguesData.map((league) => (
                    <div key={league.league.id} className="space-y-4">
                      <LeagueHighlights
                        leagueId={league.league.id}
                        leagueName={league.league.name}
                        standings={league.standings.results}
                      />
                      <LeagueStandings
                        data={league}
                        rankChanges={rankChanges[String(league.league.id)]}
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeView === 'points' && entryId && (
                <GameweekPointsChart entryId={entryId} />
              )}

              {activeView === 'transfers' && entryId && (
                <TransferAnalysis entryId={entryId} />
              )}

              {activeView === 'dream_team' && (
                <DreamTeam />
              )}
            </div>
          )}

            {!teamData && !isLoading && (
              <div className="text-center text-gray-600 py-12">
                <p className="text-lg">Enter your team ID and league IDs to get started</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
