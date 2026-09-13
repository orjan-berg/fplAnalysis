interface Player {
  id: number;
  first_name: string;
  second_name: string;
  team: number;
}

interface MostCaptainedProps {
  mostCaptained?: number;
  mostViceCaptained?: number;
  players: Player[];
  eventNumber: number;
}

export default function MostCaptained({
  mostCaptained,
  mostViceCaptained,
  players,
  eventNumber,
}: MostCaptainedProps) {
  const captainPlayer = players.find((p) => p.id === mostCaptained);
  const viceCaptainPlayer = players.find((p) => p.id === mostViceCaptained);

  if (!captainPlayer && !viceCaptainPlayer) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">GW {eventNumber} Most Captained</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {captainPlayer && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 uppercase font-semibold mb-2">👑 Captain</p>
            <p className="text-xl font-bold text-yellow-700">
              {captainPlayer.first_name} {captainPlayer.second_name}
            </p>
            <p className="text-sm text-gray-600 mt-1">ID: {captainPlayer.id}</p>
          </div>
        )}

        {viceCaptainPlayer && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 uppercase font-semibold mb-2">🔵 Vice Captain</p>
            <p className="text-xl font-bold text-blue-700">
              {viceCaptainPlayer.first_name} {viceCaptainPlayer.second_name}
            </p>
            <p className="text-sm text-gray-600 mt-1">ID: {viceCaptainPlayer.id}</p>
          </div>
        )}
      </div>
    </div>
  );
}
