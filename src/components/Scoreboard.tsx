import { memo } from "react";
import type { TeamStats } from "../types";

interface ScoreboardProps {
  homeTeamName: string;
  awayTeamName: string;
  homeStats: TeamStats;
  awayStats: TeamStats;
  onExport: () => void;
  exportDisabled: boolean;
}

interface StatRowProps {
  label: string;
  home: string | number;
  away: string | number;
}

const StatRow = memo(function StatRow({ label, home, away }: StatRowProps) {
  return (
    <div className="flex items-center justify-between py-2 lg:py-3 border-b border-gray-700 last:border-0">
      <span className="text-base lg:text-xl font-bold text-white w-10 lg:w-12 text-center">
        {home}
      </span>
      <span className="text-xs lg:text-sm text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-base lg:text-xl font-bold text-white w-10 lg:w-12 text-center">
        {away}
      </span>
    </div>
  );
});

const Scoreboard = memo(function Scoreboard({
  homeTeamName,
  awayTeamName,
  homeStats,
  awayStats,
  onExport,
  exportDisabled,
}: ScoreboardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-3 lg:p-4 h-full flex flex-col">
      {/* Team names header */}
      <div className="flex justify-between items-center mb-3 lg:mb-4">
        <div className="text-center flex-1">
          <p className="text-sm lg:text-base font-semibold text-emerald-400 break-words">
            {homeTeamName || "Home"}
          </p>
        </div>
        <div className="text-center flex-1">
          <p className="text-sm lg:text-base font-semibold text-blue-400 break-words">
            {awayTeamName || "Away"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <StatRow label="Goals" home={homeStats.goals} away={awayStats.goals} />
      <StatRow label="Shots" home={homeStats.shots} away={awayStats.shots} />
      <StatRow label="On Target" home={homeStats.sot} away={awayStats.sot} />
      <StatRow
        label="xG"
        home={homeStats.xG.toFixed(2)}
        away={awayStats.xG.toFixed(2)}
      />

      {/* Legend */}
      <div className="mt-3 flex flex-col gap-3">
        <p className="text-xs lg:text-sm text-gray-400 uppercase tracking-wider mb-1">
          Legend
        </p>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-green-500 inline-block" />
          <span className="text-xs lg:text-sm text-gray-300">Goal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-orange-500 inline-block" />
          <span className="text-xs lg:text-sm text-gray-300">On Target</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-blue-500 inline-block" />
          <span className="text-xs lg:text-sm text-gray-300">Off Target</span>
        </div>
      </div>

      {/* Click guide */}
      <div className="mt-5 mb-6 pt-3 border-t border-gray-700">
        <p className="text-xs lg:text-sm text-gray-400 uppercase tracking-wider mb-2">
          Controls
        </p>
        <div className="text-xs lg:text-sm text-gray-400 space-y-3">
          <p>
            <span className="text-white">Left click</span> — on target
          </p>
          <p>
            <span className="text-white">Right click</span> — off target
          </p>
          <p>
            <span className="text-white">Shift + click</span> — goal
          </p>
        </div>
      </div>

      {/* Export */}
      <div className="mt-auto pt-4 border-t border-gray-700">
      <button
        onClick={onExport}
        disabled={exportDisabled}
        className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer"
      >
        Export CSV
      </button>
      </div>
    </div>
  );
});

export default Scoreboard;
