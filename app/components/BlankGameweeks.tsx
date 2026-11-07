'use client';

import { useState, useEffect, useMemo } from 'react';

interface BlankPlayer {
  id: number;
  web_name: string;
  team: string;
  element_type: number;
  price: number;
  total_points: number;
  played: number;
  blankGws: number[];
}

const POSITIONS: Record<number, string> = { 1: 'GK', 2: 'DEF', 3: 'MID', 4: 'FWD' };

export default function BlankGameweeks() {
  const [players, setPlayers] = useState<BlankPlayer[]>([]);
  const [finishedGws, setFinishedGws] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<number>(0);
  const [order, setOrder] = useState<'fewest' | 'most'>('fewest');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/blank-gameweeks');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch blank gameweek data');
        setPlayers(data.players);
        setFinishedGws(data.finishedGws);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const rows = useMemo(() => {
    const filtered = players.filter((p) => position === 0 || p.element_type === position);
    return filtered.sort((a, b) => {
      const diff = order === 'fewest'
        ? a.blankGws.length - b.blankGws.length
        : b.blankGws.length - a.blankGws.length;
      return diff || b.total_points - a.total_points;
    });
  }, [players, position, order]);

  if (isLoading) return <div className="text-center py-8">Laster blanke gameweeks...</div>;
  if (error) return <div className="text-red-600 text-center py-8">Feil: {error}</div>;

  const buttonClass = (active: boolean) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Blanke gameweeks</h2>
        <p className="text-gray-600 mt-2">
          Gameweeks der spilleren bare fikk poeng for spilte minutter. Basert på {finishedGws.length} ferdige gameweeks.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button className={buttonClass(position === 0)} onClick={() => setPosition(0)}>Alle</button>
          {Object.entries(POSITIONS).map(([id, label]) => (
            <button key={id} className={buttonClass(position === Number(id))} onClick={() => setPosition(Number(id))}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button className={buttonClass(order === 'fewest')} onClick={() => setOrder('fewest')}>Færrest blanke</button>
          <button className={buttonClass(order === 'most')} onClick={() => setOrder('most')}>Flest blanke</button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-center text-gray-400">Ingen spillere</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2 pr-4">Spiller</th>
                <th className="py-2 pr-4">Lag</th>
                <th className="py-2 pr-4">Pos</th>
                <th className="py-2 pr-4 text-right">Pris</th>
                <th className="py-2 pr-4 text-right">Poeng</th>
                <th className="py-2 pr-4 text-right">Blanke</th>
                <th className="py-2 pr-4">Blanke GW</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-2 pr-4 font-medium text-gray-900">{p.web_name}</td>
                  <td className="py-2 pr-4 text-gray-700">{p.team}</td>
                  <td className="py-2 pr-4 text-gray-700">{POSITIONS[p.element_type]}</td>
                  <td className="py-2 pr-4 text-right text-gray-700">£{p.price.toFixed(1)}m</td>
                  <td className="py-2 pr-4 text-right font-bold text-blue-600">{p.total_points}</td>
                  <td className="py-2 pr-4 text-right">
                    <span className={p.blankGws.length === 0 ? 'text-green-600 font-bold' : 'font-bold text-red-600'}>
                      {p.blankGws.length}
                    </span>
                    <span className="text-gray-400"> / {p.played}</span>
                  </td>
                  <td className="py-2 pr-4 text-gray-600">
                    {p.blankGws.length === 0 ? '-' : p.blankGws.map((gw) => `GW${gw}`).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
