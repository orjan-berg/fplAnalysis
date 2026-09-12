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

interface TeamInfoProps {
  data: TeamData;
}

export default function TeamInfo({ data }: TeamInfoProps) {
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
          <p className="text-xs text-gray-600 uppercase font-semibold">Gameweek {data.current_event} Points</p>
          <p className="text-3xl font-bold text-green-600">{data.summary_event_points}</p>
          <p className="text-xs text-gray-500">Rank: #{data.summary_event_rank}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded">
          <p className="text-xs text-gray-600 uppercase font-semibold">Bank</p>
          <p className="text-2xl font-bold text-purple-600">£{(data.bank / 10).toFixed(1)}m</p>
        </div>

        <div className="bg-orange-50 p-4 rounded">
          <p className="text-xs text-gray-600 uppercase font-semibold">Transfers</p>
          <p className="text-2xl font-bold text-orange-600">{data.free_transfers}</p>
          <p className="text-xs text-gray-500">In bank: {data.transfers_on_bank}</p>
        </div>
      </div>
    </div>
  );
}
