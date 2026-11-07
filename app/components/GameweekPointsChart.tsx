'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HistoryRecord {
  event: number;
  points: number;
  total_points: number;
  rank: number;
  rank_sort: number;
  overall_rank: number;
  bank: number;
  value: number;
  event_transfers: number;
  event_transfers_cost: number;
  points_on_bench: number;
}

interface GameweekPointsChartProps {
  entryId: string;
}

export default function GameweekPointsChart({ entryId }: GameweekPointsChartProps) {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalPoints: 0,
    averagePoints: 0,
    maxPoints: 0,
    minPoints: 0,
  });

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/entry-history?id=${entryId}`);
        if (!res.ok) throw new Error('Failed to fetch entry history');
        const data = await res.json();

        if (data.current) {
          const records = data.current.map((record: HistoryRecord) => ({
            event: record.event,
            points: record.points,
            total_points: record.total_points,
            rank: record.rank,
            overall_rank: record.overall_rank,
            points_on_bench: record.points_on_bench,
          }));

          setHistory(records);

          // Calculate stats
          if (records.length > 0) {
            const points = records.map((r: HistoryRecord) => r.points);
            const total = points.reduce((a: number, b: number) => a + b, 0);
            const avg = Math.round(total / points.length);
            const max = Math.max(...points);
            const min = Math.min(...points);

            setStats({
              totalPoints: total,
              averagePoints: avg,
              maxPoints: max,
              minPoints: min,
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [entryId]);

  if (isLoading) return <div className="text-center py-8">Loading gameweek history...</div>;
  if (error) return <div className="text-red-600 text-center py-8">Error: {error}</div>;
  if (history.length === 0) return <div className="text-center py-8">No history data</div>;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 uppercase font-semibold">Total Points</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalPoints}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 uppercase font-semibold">Average per GW</p>
          <p className="text-3xl font-bold text-green-600">{stats.averagePoints}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 uppercase font-semibold">Best GW</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.maxPoints}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-600 uppercase font-semibold">Worst GW</p>
          <p className="text-3xl font-bold text-orange-600">{stats.minPoints}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Poeng per Gameweek</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={history}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="event"
              label={{ value: 'Gameweek', position: 'insideBottomRight', offset: -10 }}
            />
            <YAxis label={{ value: 'Points', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              formatter={(value: any) => [`${value} pts`, 'Points']}
              labelFormatter={(label) => `GW ${label}`}
            />
            <Legend />
            <Bar
              dataKey="points"
              fill="#3b82f6"
              name="Gameweek Points"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">GW</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900">Points</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900">Rank</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900">Overall Rank</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900">Bench Points</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record, idx) => (
              <tr key={record.event} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-semibold text-gray-900">GW{record.event}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-bold ${
                    record.points >= stats.averagePoints
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {record.points}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-600">#{record.rank}</td>
                <td className="px-4 py-3 text-right text-gray-600">#{record.overall_rank}</td>
                <td className="px-4 py-3 text-right text-gray-500">{record.points_on_bench}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
