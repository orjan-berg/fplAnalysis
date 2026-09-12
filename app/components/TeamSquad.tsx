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

const POSITION_ORDER = ['GK', 'DEF', 'MID', 'FWD'];
const POSITION_LIMIT: Record<string, number> = { GK: 1, DEF: 4, MID: 5, FWD: 3 };

export default function TeamSquad({ entryId, event }: TeamSquadProps) {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [players, setPlayers] = useState<Map<number, Player>>(new Map());
  const [elementTypes, setElementTypes] = useState<Map<number, ElementType>>(new Map());
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
    GK: [],
    DEF: [],
    MID: [],
    FWD: [],
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
      if (squadByPosition[positionKey]) {
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

      {/* Starting XI */}
      <div className="mb-12">
        <h4 className="text-lg font-semibold text-gray-700 mb-6">Starting XI</h4>
        <div className="space-y-6">
          {POSITION_ORDER.map((pos) => (
            <div key={pos}>
              <p className="text-sm font-semibold text-gray-600 mb-3">{pos}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {squadByPosition[pos]?.map((pick) => (
                  <PlayerCard key={pick.element} pick={pick} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Substitutes */}
      {squadByPosition.SUB.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Substitutes</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {squadByPosition.SUB.map((pick) => (
              <PlayerCard key={pick.element} pick={pick} isSub />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerCard({
  pick,
  isSub = false,
}: {
  pick: Pick & { player: Player; typeName: string };
  isSub?: boolean;
}) {
  const imageUrl = `https://resources.premierleague.com/premierleague/photos/players/40x40/${pick.player.photo}`;

  return (
    <div
      className={`flex flex-col items-center text-center ${isSub ? 'opacity-75' : ''}`}
    >
      <div className="relative mb-2 w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300">
        <img
          src={imageUrl}
          alt={`${pick.player.first_name} ${pick.player.second_name}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E';
          }}
        />
        {pick.is_captain && (
          <div className="absolute top-0 right-0 bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            C
          </div>
        )}
        {pick.is_vice_captain && (
          <div className="absolute top-0 right-0 bg-blue-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-white">
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
