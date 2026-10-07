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

interface TransferAnalysisProps {
  entryId: string;
}

const POSITION_COLORS = {
  1: 'bg-yellow-100 text-yellow-800',
  2: 'bg-blue-100 text-blue-800',
  3: 'bg-purple-100 text-purple-800',
  4: 'bg-red-100 text-red-800',
};

export default function TransferAnalysis({ entryId }: TransferAnalysisProps) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [players, setPlayers] = useState<Map<number, Player>>(new Map());
  const [elementTypes, setElementTypes] = useState<Map<number, ElementType>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalTransfers: 0,
    positiveTransfers: 0,
    negativeTransfers: 0,
    totalNetPoints: 0,
  });

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

        // Calculate statistics
        let positiveCount = 0;
        let negativeCount = 0;
        let totalPoints = 0;

        transfersData.forEach((transfer: Transfer) => {
          const playerOut = playerMap.get(transfer.element_out);
          const playerIn = playerMap.get(transfer.element_in);

          if (playerOut && playerIn) {
            const pointsOut = playerOut.event_points || 0;
            const pointsIn = playerIn.event_points || 0;
            const netChange = pointsIn - pointsOut;

            totalPoints += netChange;
            if (netChange > 0) positiveCount++;
            if (netChange < 0) negativeCount++;
          }
        });

        setStats({
          totalTransfers: transfersData.length,
          positiveTransfers: positiveCount,
          negativeTransfers: negativeCount,
          totalNetPoints: totalPoints,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [entryId]);

  if (isLoading) return <div className="text-center py-8">Loading transfers...</div>;
  if (error) return <div className="text-red-600 text-center py-8">Error: {error}</div>;
  if (transfers.length === 0) return <div className="text-center py-8">No transfers</div>;

  const getPositionName = (elementType: number): string => {
    const type = elementTypes.get(elementType);
    return type?.singular_name || '?';
  };

  const getPositionColor = (elementType: number): string => {
    return POSITION_COLORS[elementType as keyof typeof POSITION_COLORS] || 'bg-gray-100 text-gray-800';
  };

  // Sort transfers by gameweek descending (newest first)
  const sortedTransfers = [...transfers].sort((a, b) => b.event - a.event);

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 uppercase font-semibold">Total Transfers</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalTransfers}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 uppercase font-semibold">Positive</p>
          <p className="text-3xl font-bold text-green-600">{stats.positiveTransfers}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 uppercase font-semibold">Negative</p>
          <p className="text-3xl font-bold text-red-600">{stats.negativeTransfers}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 uppercase font-semibold">Total Net Points</p>
          <p className={`text-3xl font-bold ${stats.totalNetPoints >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.totalNetPoints > 0 ? '+' : ''}{stats.totalNetPoints}
          </p>
        </div>
      </div>

      {/* Transfers List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="space-y-2">
          {sortedTransfers.map((transfer, idx) => {
            const playerOut = players.get(transfer.element_out);
            const playerIn = players.get(transfer.element_in);
            const pointsOut = playerOut?.event_points || 0;
            const pointsIn = playerIn?.event_points || 0;
            const netChange = pointsIn - pointsOut;
            const isPositive = netChange > 0;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-4 border-l-4 ${
                  isPositive
                    ? 'bg-green-50 border-green-500'
                    : netChange < 0
                    ? 'bg-red-50 border-red-500'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                {/* GW Badge */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center font-bold text-gray-700">
                  GW{transfer.event}
                </div>

                {/* Player Out */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">❌</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{playerOut?.web_name || 'Unknown'}</p>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded ${getPositionColor(playerOut?.element_type || 0)}`}>
                        {getPositionName(playerOut?.element_type || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm text-gray-600">{pointsOut} pts</p>
                </div>

                {/* Net Change */}
                <div className="flex-shrink-0">
                  <div className={`px-3 py-1 rounded font-bold text-sm ${
                    isPositive
                      ? 'bg-green-600 text-white'
                      : netChange < 0
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-400 text-white'
                  }`}>
                    {isPositive ? '+' : ''}{netChange}
                  </div>
                </div>

                {/* Points */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm text-gray-600">{pointsIn} pts</p>
                </div>

                {/* Player In */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{playerIn?.web_name || 'Unknown'}</p>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded ${getPositionColor(playerIn?.element_type || 0)}`}>
                        {getPositionName(playerIn?.element_type || 0)}
                      </span>
                    </div>
                    <span className="text-lg">✅</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
