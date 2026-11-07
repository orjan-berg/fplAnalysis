interface TeamData {
  player_first_name: string;
  player_last_name: string;
  name: string;
  summary_overall_points: number;
  summary_overall_rank: number;
  summary_event_points: number;
  summary_event_rank: number;
  current_event: number;
  last_deadline_bank: number;
  last_deadline_total_transfers: number;
}

interface GwStats {
  event: number;
  points: number;
  rank: number;
}

interface TeamInfoProps {
  data: TeamData;
  gwStats?: GwStats | null;
}

export default function TeamInfo({ data, gwStats }: TeamInfoProps) {
  const gwEvent = gwStats?.event ?? data.current_event;
  const gwPoints = gwStats?.points ?? data.summary_event_points;
  const gwRank = gwStats?.rank ?? data.summary_event_rank;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
        <p className="text-gray-600">
          {data.player_first_name} {data.player_last_name}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-xs text-gray-600 uppercase font-semibold">Overall Points</p>
          <p className="text-3xl font-bold text-blue-600">{data.summary_overall_points}</p>
          <p className="text-xs text-gray-500">Rank: #{data.summary_overall_rank}</p>
        </div>

        <div className="bg-green-50 p-4 rounded">
          <p className="text-xs text-gray-600 uppercase font-semibold">Gameweek {gwEvent} Points</p>
          <p className="text-3xl font-bold text-green-600">{gwPoints}</p>
          <p className="text-xs text-gray-500">Rank: #{gwRank}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded">
          <p className="text-xs text-gray-600 uppercase font-semibold">Bank</p>
          <p className="text-2xl font-bold text-purple-600">£{(data.last_deadline_bank / 10).toFixed(1)}m</p>
        </div>

        <div className="bg-orange-50 p-4 rounded">
          <p className="text-xs text-gray-600 uppercase font-semibold">Transfers</p>
          <p className="text-2xl font-bold text-orange-600">{data.last_deadline_total_transfers}</p>
          <p className="text-xs text-gray-500">Denne sesongen</p>
        </div>
      </div>
    </div>
  );
}
