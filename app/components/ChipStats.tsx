interface ChipPlay {
  chip_name: string;
  num_played: number;
}

interface ChipStatsProps {
  chipPlays: ChipPlay[];
  eventNumber: number;
}

const CHIP_NAMES: Record<string, string> = {
  bboost: '🎯 Bench Boost',
  freehit: '⚡ Free Hit',
  wildcard: '🃏 Wildcard',
  '3xc': '👑 Triple Captain',
};

const CHIP_COLORS: Record<string, string> = {
  bboost: 'bg-purple-100 border-purple-300',
  freehit: 'bg-yellow-100 border-yellow-300',
  wildcard: 'bg-blue-100 border-blue-300',
  '3xc': 'bg-red-100 border-red-300',
};

export default function ChipStats({ chipPlays, eventNumber }: ChipStatsProps) {
  if (!chipPlays || chipPlays.length === 0) {
    return null;
  }

  const totalPlays = chipPlays.reduce((sum, chip) => sum + chip.num_played, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">GW {eventNumber} Chip Usage</h3>
      <div className="space-y-3">
        {chipPlays.map((chip) => {
          const percentage = ((chip.num_played / totalPlays) * 100).toFixed(1);
          return (
            <div key={chip.chip_name}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {CHIP_NAMES[chip.chip_name] || chip.chip_name}
                </span>
                <span className="text-sm font-semibold text-gray-600">
                  {chip.num_played.toLocaleString()} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${CHIP_COLORS[chip.chip_name]?.split(' ')[0]}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
