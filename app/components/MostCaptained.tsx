interface Player {
  id: number;
  first_name: string;
  second_name: string;
  web_name: string;
  team: number;
  team_name?: string;
  code: number;
}

interface MostCaptainedProps {
  mostCaptained?: number;
  mostViceCaptained?: number;
  mostCaptainedCount?: number;
  mostViceCaptainedCount?: number;
  totalManagers?: number;
  players: Player[];
  eventNumber: number;
}

export default function MostCaptained({
  mostCaptained,
  mostViceCaptained,
  mostCaptainedCount = 0,
  mostViceCaptainedCount = 0,
  totalManagers = 12000000,
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
            <p className="text-xs text-gray-600 uppercase font-semibold mb-3">👑 Captain</p>
            <div className="flex items-center gap-4">
              <img
                src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${captainPlayer.code}.png`}
                alt={captainPlayer.web_name}
                className="w-16 h-20 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="flex-1">
                <p className="text-lg font-bold text-yellow-700">
                  {captainPlayer.web_name}
                </p>
                <p className="text-sm text-yellow-600 mt-2 font-semibold">
                  {captainPlayer.team_name || 'Unknown Team'}
                </p>
              </div>
            </div>
          </div>
        )}

        {viceCaptainPlayer && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 uppercase font-semibold mb-3">🔵 Vice Captain</p>
            <div className="flex items-center gap-4">
              <img
                src={`https://resources.premierleague.com/premierleague25/photos/players/110x140/${viceCaptainPlayer.code}.png`}
                alt={viceCaptainPlayer.web_name}
                className="w-16 h-20 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="flex-1">
                <p className="text-lg font-bold text-blue-700">
                  {viceCaptainPlayer.web_name}
                </p>
                <p className="text-sm text-blue-600 mt-2 font-semibold">
                  {viceCaptainPlayer.team_name || 'Unknown Team'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
