interface Standing {
  rank: number;
  entry_name: string;
  event_total: number;
  total: number;
  player_name: string;
}

interface LeagueData {
  league: {
    name: string;
    id: number;
  };
  standings: {
    results: Standing[];
  };
}

interface LeagueStandingsProps {
  data: LeagueData;
  rankChanges?: Record<string, number>;
}

function RankChange({ change }: { change?: number }) {
  if (change === undefined) return null;
  if (change === 0) return <span className="text-gray-400 text-xs">—</span>;
  if (change > 0) {
    return <span className="text-red-600 font-semibold text-sm">↓ {change}</span>;
  }
  return <span className="text-green-600 font-semibold text-sm">↑ {Math.abs(change)}</span>;
}

export default function LeagueStandings({ data, rankChanges }: LeagueStandingsProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 className="text-xl font-bold text-white">{data.league.name}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Change</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Team</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Manager</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">GW Points</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.standings.results.map((result) => (
              <tr key={result.entry_name} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{result.rank}</td>
                <td className="px-4 py-3 text-sm">
                  <RankChange change={rankChanges?.[result.entry_name]} />
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{result.entry_name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{result.player_name}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">{result.event_total}</td>
                <td className="px-4 py-3 text-sm text-right text-blue-600 font-semibold">{result.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
