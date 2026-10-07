interface Standing {
  rank: number;
  last_rank: number;
  entry_name: string;
  event_total: number;
  total: number;
  player_name: string;
  entry: number;
}

interface LeagueHighlightsProps {
  leagueId: number;
  leagueName: string;
  standings: Standing[];
}

export default function LeagueHighlights({ leagueName, standings }: LeagueHighlightsProps) {
  if (!standings || standings.length === 0) {
    return null;
  }

  // Calculate rank changes for all teams
  const teamsWithChanges = standings.map((team) => ({
    ...team,
    rankChange: team.rank - team.last_rank,
  }));

  // Find biggest climber (most negative change = biggest climb)
  const biggestClimber = teamsWithChanges.reduce((prev, current) =>
    current.rankChange < prev.rankChange ? current : prev
  );

  // Find biggest faller (most positive change = biggest fall)
  const biggestFaller = teamsWithChanges.reduce((prev, current) =>
    current.rankChange > prev.rankChange ? current : prev
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Biggest Climber */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">📈</span>
          <h4 className="font-bold text-gray-900">Største Klatrer</h4>
        </div>
        <div className="bg-white rounded p-3">
          <a
            href={`/team/${biggestClimber.entry}`}
            className="text-lg font-bold text-green-700 hover:text-green-900 hover:underline block mb-1"
          >
            {biggestClimber.entry_name}
          </a>
          <p className="text-sm text-gray-600 mb-2">{biggestClimber.player_name}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">
              ↑ {Math.abs(biggestClimber.rankChange)}
            </span>
            <span className="text-sm text-gray-500">
              (Rang {biggestClimber.last_rank} → {biggestClimber.rank})
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Poeng denne runden: {biggestClimber.event_total} | Totalt: {biggestClimber.total}
          </p>
        </div>
      </div>

      {/* Biggest Faller */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">📉</span>
          <h4 className="font-bold text-gray-900">Største Fall</h4>
        </div>
        <div className="bg-white rounded p-3">
          <a
            href={`/team/${biggestFaller.entry}`}
            className="text-lg font-bold text-red-700 hover:text-red-900 hover:underline block mb-1"
          >
            {biggestFaller.entry_name}
          </a>
          <p className="text-sm text-gray-600 mb-2">{biggestFaller.player_name}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-red-600">
              ↓ {biggestFaller.rankChange}
            </span>
            <span className="text-sm text-gray-500">
              (Rang {biggestFaller.last_rank} → {biggestFaller.rank})
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Poeng denne runden: {biggestFaller.event_total} | Totalt: {biggestFaller.total}
          </p>
        </div>
      </div>
    </div>
  );
}
