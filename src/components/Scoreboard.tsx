import { memo } from 'react';
import type { TeamStats } from '../types';

interface ScoreboardProps {
  homeTeamName: string;
  awayTeamName: string;
  homeStats: TeamStats;
  awayStats: TeamStats;
}

interface StatRowProps {
  label: string;
  home: string | number;
  away: string | number;
}

const StatRow = memo(function StatRow({ label, home, away }: StatRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
      <span className="text-lg font-bold text-white w-12 text-center">{home}</span>
      <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-lg font-bold text-white w-12 text-center">{away}</span>
    </div>
  );
});

const Scoreboard = memo(function Scoreboard({
  homeTeamName,
  awayTeamName,
  homeStats,
  awayStats,
}: ScoreboardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {/* Team names header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-center flex-1">
          <p className="text-sm font-semibold text-emerald-400 truncate">{homeTeamName || 'Home'}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-sm font-semibold text-blue-400 truncate">{awayTeamName || 'Away'}</p>
        </div>
      </div>

      {/* Stats */}
      <StatRow
        label="Goals"
        home={homeStats.goals}
        away={awayStats.goals}
      />
      <StatRow
        label="Shots"
        home={homeStats.shots}
        away={awayStats.shots}
      />
      <StatRow
        label="SOT"
        home={homeStats.sot}
        away={awayStats.sot}
      />
      <StatRow
        label="xG"
        home={homeStats.xG.toFixed(2)}
        away={awayStats.xG.toFixed(2)}
      />

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-gray-700 flex flex-col gap-1.5">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Legend</p>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          <span className="text-xs text-gray-300">Goal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
          <span className="text-xs text-gray-300">On Target</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
          <span className="text-xs text-gray-300">Off Target</span>
        </div>
      </div>

      {/* Click guide */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Controls</p>
        <div className="text-xs text-gray-400 space-y-1">
          <p><span className="text-white">Left click</span> — on target</p>
          <p><span className="text-white">Right click</span> — off target</p>
          <p><span className="text-white">Shift + click</span> — goal</p>
        </div>
      </div>
    </div>
  );
});

export default Scoreboard;
