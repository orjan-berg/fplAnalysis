'use client';

import { useState, useEffect } from 'react';

interface Player {
  id: number;
  web_name: string;
  element_type: number;
  team: number;
  team_name?: string;
  code: number;
  event_points: number;
  total_points: number;
}

interface ElementType {
  id: number;
  singular_name: string;
}

interface Team {
  id: number;
  name: string;
  short_name: string;
  code: number;
}

const TEAM_COLORS: Record<string, string> = {
  ARS: 'bg-red-600',
  AVL: 'bg-blue-900',
  BOU: 'bg-red-600',
  BRE: 'bg-orange-600',
  CHE: 'bg-blue-600',
  CRY: 'bg-blue-700',
  EVE: 'bg-blue-600',
  FUL: 'bg-black',
  IPS: 'bg-cyan-400',
  LEI: 'bg-blue-600',
  LIV: 'bg-red-600',
  MCI: 'bg-sky-400',
  MUN: 'bg-red-700',
  NEW: 'bg-black',
  NFO: 'bg-red-600',
  SOU: 'bg-white border-2 border-black',
  TOT: 'bg-white border-2 border-gray-400',
  WHU: 'bg-purple-700',
  WOL: 'bg-yellow-600',
};

export default function DreamTeam() {
  const [dreamTeamPlayers, setDreamTeamPlayers] = useState<(Player & { typeName: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Map<number, Team>>(new Map());
  const [elementTypes, setElementTypes] = useState<Map<number, ElementType>>(new Map());

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const bootstrapRes = await fetch('/api/bootstrap');
        if (!bootstrapRes.ok) throw new Error('Failed to fetch bootstrap data');
        const bootstrap = await bootstrapRes.json();

        // Create maps
        const teamMap = new Map<number, Team>();
        bootstrap.teams.forEach((team: Team) => {
          teamMap.set(team.id, team);
        });
        setTeams(teamMap);

        const typeMap = new Map<number, ElementType>();
        bootstrap.element_types.forEach((type: ElementType) => {
          typeMap.set(type.id, type);
        });
        setElementTypes(typeMap);

        // Filter and organize dream team players
        const dreamTeam = bootstrap.elements
          .filter((p: any) => p.in_dreamteam === true)
          .map((p: any) => ({
            id: p.id,
            web_name: p.web_name,
            element_type: p.element_type,
            team: p.team,
            team_name: teamMap.get(p.team)?.name,
            code: p.code,
            event_points: p.event_points || 0,
            total_points: p.total_points || 0,
            typeName: typeMap.get(p.element_type)?.singular_name || 'Unknown',
          }))
          .sort((a, b) => {
            // Sort by position first, then by points descending
            if (a.element_type !== b.element_type) {
              return a.element_type - b.element_type;
            }
            return b.event_points - a.event_points;
          });

        setDreamTeamPlayers(dreamTeam);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div className="text-center py-8">Loading dream team...</div>;
  if (error) return <div className="text-red-600 text-center py-8">Error: {error}</div>;
  if (dreamTeamPlayers.length === 0) return <div className="text-center py-8">No dream team players</div>;

  // Organize by position
  const byPosition: Record<string, (Player & { typeName: string })[]> = {
    Goalkeeper: [],
    Defender: [],
    Midfielder: [],
    Forward: [],
  };

  dreamTeamPlayers.forEach((p) => {
    if (p.typeName in byPosition) {
      byPosition[p.typeName].push(p);
    }
  });

  const totalPoints = dreamTeamPlayers.reduce((sum, p) => sum + p.event_points, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">⭐ Dream Team</h2>
        <p className="text-lg text-gray-600 mt-2">Total Players: {dreamTeamPlayers.length} | Combined Points: <span className="font-bold text-blue-600">{totalPoints}</span></p>
      </div>

      {/* Formation Overview */}
      <div className="bg-gray-100 rounded p-3 text-center text-sm font-mono">
        <p>
          GK: {byPosition['Goalkeeper'].length} | DEF: {byPosition['Defender'].length} | MID:{' '}
          {byPosition['Midfielder'].length} | FWD: {byPosition['Forward'].length}
        </p>
      </div>

      {/* Goalkeepers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Goalkeeper ({byPosition['Goalkeeper'].length})</h3>
        {byPosition['Goalkeeper'].length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {byPosition['Goalkeeper'].map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No players</p>
        )}
      </div>

      {/* Defenders */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Defender ({byPosition['Defender'].length})</h3>
        {byPosition['Defender'].length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {byPosition['Defender'].map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No players</p>
        )}
      </div>

      {/* Midfielders */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Midfielder ({byPosition['Midfielder'].length})</h3>
        {byPosition['Midfielder'].length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {byPosition['Midfielder'].map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No players</p>
        )}
      </div>

      {/* Forwards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Forward ({byPosition['Forward'].length})</h3>
        {byPosition['Forward'].length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {byPosition['Forward'].map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No players</p>
        )}
      </div>
    </div>
  );
}

function PlayerCard({ player }: { player: Player & { typeName: string } }) {
  const isGoalkeeper = player.element_type === 1;
  const shirtUrl = isGoalkeeper
    ? `https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`
    : `https://resources.premierleague.com/premierleague25/photos/players/110x140/${player.code}.png`;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-2 w-20 h-24 sm:w-24 sm:h-28 flex items-center justify-center">
        <img
          src={shirtUrl}
          alt={player.web_name}
          className="h-full object-contain drop-shadow-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23999%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E';
          }}
        />
      </div>
      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
        {player.web_name}
      </p>
      <div className="text-xs text-gray-600 space-y-1">
        <p>GW: <span className={`font-bold ${player.event_points >= 0 ? 'text-green-600' : 'text-red-600'}`}>{player.event_points}</span></p>
        <p>Total: <span className="font-bold text-blue-600">{player.total_points}</span></p>
      </div>
    </div>
  );
}
