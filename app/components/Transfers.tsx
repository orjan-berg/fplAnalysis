'use client';

import { useState, useEffect } from 'react';

interface Transfer {
  element_in: number;
  element_out: number;
  event: number;
  entry_history?: {
    event: number;
    value: number;
    bank: number;
  };
}

interface Player {
  id: number;
  first_name: string;
  second_name: string;
  web_name: string;
  element_type: number;
  team: number;
  event_points: number;
}

interface ElementType {
  id: number;
  singular_name: string;
}

interface TransfersProps {
  entryId: string;
  currentEvent: number;
}

const POSITION_COLORS = {
  1: 'bg-yellow-100 text-yellow-800',
  2: 'bg-blue-100 text-blue-800',
  3: 'bg-purple-100 text-purple-800',
  4: 'bg-red-100 text-red-800',
};

export default function Transfers({ entryId, currentEvent }: TransfersProps) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [players, setPlayers] = useState<Map<number, Player>>(new Map());
  const [elementTypes, setElementTypes] = useState<Map<number, ElementType>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch transfers
        const transfersRes = await fetch(`/api/transfers?id=${entryId}`);
        if (!transfersRes.ok) throw new Error('Failed to fetch transfers');
        const transfersData = await transfersRes.json();
        setTransfers(transfersData);

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
            web_name: p.web_name,
            element_type: p.element_type,
            team: p.team,
            event_points: p.event_points || 0,
          });
        });
        setPlayers(playerMap);

        const typeMap = new Map<number, ElementType>();
        playersData.element_types.forEach((t: any) => {
          typeMap.set(t.id, {
            id: t.id,
            singular_name: t.singular_name,
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
  }, [entryId]);

  if (isLoading) return <div className="text-center py-4 text-gray-600">Loading transfers...</div>;
  if (error) return <div className="text-red-600 text-center py-4">Error: {error}</div>;

  // Filter transfers for current gameweek
  const gwTransfers = transfers.filter((t) => t.event === currentEvent);

  if (gwTransfers.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-600">
        <p>No transfers in GW{currentEvent}</p>
      </div>
    );
  }

  const getPositionColor = (elementType: number): string => {
    return POSITION_COLORS[elementType as keyof typeof POSITION_COLORS] || 'bg-gray-100 text-gray-800';
  };

  const getPositionName = (elementType: number): string => {
    const type = elementTypes.get(elementType);
    return type?.singular_name || '?';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Transfers - GW{currentEvent}</h3>

      <div className="space-y-4">
        {gwTransfers.map((transfer, idx) => {
          const playerOut = players.get(transfer.element_out);
          const playerIn = players.get(transfer.element_in);
          const pointsOut = playerOut?.event_points || 0;
          const pointsIn = playerIn?.event_points || 0;
          const netChange = pointsIn - pointsOut;
          const isPositive = netChange > 0;

          return (
            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              {/* Player Out */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">❌</span>
                  <div>
                    <p className="font-semibold text-gray-900">{playerOut?.web_name || 'Unknown'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getPositionColor(playerOut?.element_type || 0)}`}>
                        {getPositionName(playerOut?.element_type || 0)}
                      </span>
                      <span className="text-sm text-gray-600">{pointsOut} pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Change */}
              <div className="text-center">
                <div className={`px-3 py-2 rounded-lg font-bold text-sm ${
                  isPositive
                    ? 'bg-green-100 text-green-800'
                    : netChange < 0
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {isPositive ? '+' : ''}{netChange}
                </div>
              </div>

              {/* Player In */}
              <div className="flex-1">
                <div className="flex items-center gap-2 justify-end">
                  <div>
                    <p className="font-semibold text-gray-900 text-right">{playerIn?.web_name || 'Unknown'}</p>
                    <div className="flex items-center gap-2 mt-1 justify-end">
                      <span className="text-sm text-gray-600">{pointsIn} pts</span>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getPositionColor(playerIn?.element_type || 0)}`}>
                        {getPositionName(playerIn?.element_type || 0)}
                      </span>
                    </div>
                  </div>
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
