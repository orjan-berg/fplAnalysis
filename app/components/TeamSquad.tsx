'use client';

import { useState, useEffect } from 'react';

interface Pick {
  element: number;
  position: number;
  multiplier: number;
  is_captain: boolean;
  is_vice_captain: boolean;
}

interface Player {
  id: number;
  first_name: string;
  second_name: string;
  element_type: number;
  event_points: number;
  photo: string;
  team: number;
}

interface Team {
  id: number;
  name: string;
  short_name: string;
}

interface ElementType {
  id: number;
  singular_name: string;
  plural_name: string;
}

interface TeamSquadProps {
  entryId: string;
  event: number;
}

export default function TeamSquad({ entryId, event }: TeamSquadProps) {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [players, setPlayers] = useState<Map<number, Player>>(new Map());
  const [elementTypes, setElementTypes] = useState<Map<number, ElementType>>(new Map());
  const [teams, setTeams] = useState<Map<number, Team>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch picks
        const picksRes = await fetch(`/api/picks?id=${entryId}&event=${event}`);
        if (!picksRes.ok) throw new Error('Failed to fetch picks');
        const picksData = await picksRes.json();
        setPicks(picksData.picks);

        // Fetch players
        const playersRes = await fetch('/api/players');
        if (!playersRes.ok) throw new Error('Failed to fetch players');
        const playersData = await playersRes.json();

        const playerMap = new Map<number, Player>();
        playersData.elements.forEach((p: any) => {
          playerMap.set(p.id, {
            id: p.id,
            first_name: p.first_name,
            second_name: p.second_name,
            element_type: p.element_type,
            event_points: p.event_points || 0,
            photo: p.photo,
            team: p.team,
          });
        });
        setPlayers(playerMap);

        const typeMap = new Map<number, ElementType>();
        playersData.element_types.forEach((t: any) => {
          typeMap.set(t.id, {
            id: t.id,
            singular_name: t.singular_name,
            plural_name: t.plural_name,
          });
        });
        setElementTypes(typeMap);

        const teamMap = new Map<number, Team>();
        playersData.teams.forEach((tm: any) => {
          teamMap.set(tm.id, {
            id: tm.id,
            name: tm.name,
            short_name: tm.short_name,
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
  }, [entryId, event]);

  if (isLoading) return <div className="text-center py-8">Loading squad...</div>;
  if (error) return <div className="text-red-600 text-center py-8">Error: {error}</div>;
  if (picks.length === 0) return <div className="text-center py-8">No squad data</div>;

  // Organize players by position
  const squadByPosition: Record<string, (Pick & { player: Player; typeName: string })[]> = {
    Goalkeeper: [],
    Defender: [],
    Midfielder: [],
    Forward: [],
    SUB: [],
  };

  picks.forEach((pick) => {
    const player = players.get(pick.element);
    if (!player) return;

    const type = elementTypes.get(player.element_type);
    if (!type) return;

    const positionKey = type.singular_name;
    const isStarter = pick.position <= 11;

    if (isStarter) {
      if (positionKey in squadByPosition) {
        squadByPosition[positionKey].push({
          ...pick,
          player,
          typeName: positionKey,
        });
      }
    } else {
      squadByPosition.SUB.push({
        ...pick,
        player,
        typeName: positionKey,
      });
    }
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold mb-8 text-gray-900">Squad - Gameweek {event}</h3>

      <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
        <p className="font-mono">
          GK: {squadByPosition['Goalkeeper']?.length || 0} | DEF:{' '}
          {squadByPosition['Defender']?.length || 0} | MID: {squadByPosition['Midfielder']?.length || 0} | FWD:{' '}
          {squadByPosition['Forward']?.length || 0} | SUB: {squadByPosition['SUB']?.length || 0}
        </p>
      </div>

      {/* Starting XI */}
      <div className="mb-12">
        <h4 className="text-lg font-semibold text-gray-700 mb-6">Starting XI</h4>
        <div className="space-y-6">
          {['Goalkeeper', 'Defender', 'Midfielder', 'Forward'].map((pos) => {
            const players = squadByPosition[pos] || [];
            return (
              <div key={pos}>
                <p className="text-sm font-semibold text-gray-600 mb-3">
                  {pos} ({players.length})
                </p>
                {players.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {players.map((pick) => (
                      <PlayerCard key={pick.element} pick={pick} team={teams.get(pick.player.team)} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No players</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Substitutes */}
      {squadByPosition.SUB.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Substitutes</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {squadByPosition.SUB.map((pick) => (
              <PlayerCard key={pick.element} pick={pick} team={teams.get(pick.player.team)} isSub />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerCard({
  pick,
  team,
  isSub = false,
}: {
  pick: Pick & { player: Player; typeName: string };
  team?: Team;
  isSub?: boolean;
}) {
  const TEAM_COLORS: Record<string, string> = {
    ARS: 'bg-red-600',
    AVL: 'bg-blue-900',
    BOU: 'bg-red-600',
    BRE: 'bg-orange-600',
    CHE: 'bg-blue-600',
    CRY: 'bg-blue-700',
    EVE: 'bg-blue-600',
    FUL: 'bg-black',
    IPS: 'bg-cyan-400',
    LEI: 'bg-blue-600',
    LIV: 'bg-red-600',
    MCI: 'bg-sky-400',
    MUN: 'bg-red-700',
    NEW: 'bg-black',
    NFO: 'bg-red-600',
    SOU: 'bg-white border-2 border-black',
    TOT: 'bg-white border-2 border-gray-400',
    WHU: 'bg-purple-700',
    WOL: 'bg-yellow-600',
  };

  // Goalkeeper (element_type 1) uses different shirt format
  const isGoalkeeper = pick.player.element_type === 1;
  const shirtUrl = isGoalkeeper
    ? `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${pick.player.team}_1-110.webp`
    : `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${pick.player.team}-110.webp`;
  const teamShort = team?.short_name || '?';

  return (
    <div className={`flex flex-col items-center text-center ${isSub ? 'opacity-75' : ''}`}>
      <div className="relative mb-2 w-20 h-24 sm:w-24 sm:h-28 flex items-center justify-center">
        <img
          src={shirtUrl}
          alt={`${team?.name} shirt`}
          className="h-full object-contain drop-shadow-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23999%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E';
          }}
        />
        {pick.is_captain && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white">
            C
          </div>
        )}
        {pick.is_vice_captain && (
          <div className="absolute -top-2 -right-2 bg-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-white border-2 border-white">
            V
          </div>
        )}
      </div>
      <p className="text-xs sm:text-sm font-medium text-gray-900">
        {pick.player.first_name.charAt(0)}. {pick.player.second_name}
      </p>
      <p className={`text-sm font-bold ${pick.player.event_points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {pick.player.event_points}
      </p>
      {pick.multiplier > 1 && (
        <p className="text-xs text-purple-600 font-semibold">×{pick.multiplier}</p>
      )}
    </div>
  );
}
