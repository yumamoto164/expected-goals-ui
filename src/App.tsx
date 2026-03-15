import { useCallback } from "react";
import { useGame } from "./context/GameContext";
import TeamEntry from "./components/TeamEntry/TeamEntry";
import SoccerPitch from "./components/Pitch/SoccerPitch";
import ShotControls from "./components/Controls/ShotControls";
import Scoreboard from "./components/Scoreboard";
import { downloadCsv } from "./utils/exportCsv";
import { isEmpty } from "lodash";

function GameView() {
  const { state, recordShot, resetGame } = useGame();

  const handleShotRecorded = useCallback(
    (params: { x: number; y: number; onTarget: boolean; isGoal: boolean }) => {
      void recordShot(params);
    },
    [recordShot],
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="grid grid-cols-3 items-center px-6 py-3 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white-400">Expected Goals</h1>
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm text-gray-400 text-right">
            {isEmpty(state.homeTeamName) ? "Home Team" : state.homeTeamName}
          </span>
          <span className="text-2xl font-bold">
            {state.homeStats.goals} – {state.awayStats.goals}
          </span>
          <span className="text-sm text-gray-400 text-left">
            {isEmpty(state.awayTeamName) ? "Away Team" : state.awayTeamName}
          </span>
        </div>
        <div className="flex justify-end">
          <button
            onClick={resetGame}
            className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            New Game
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] gap-4 p-4 pb-0">
        {/* Left: Controls */}
        <div>
          <ShotControls />
        </div>

        {/* Center: Pitch + Last xG */}
        <div>
          <SoccerPitch
            shots={state.shots}
            onShotRecorded={handleShotRecorded}
          />
          {state.lastXG !== null && (
            <div className="flex items-center justify-center gap-2 pt-3">
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Last xG
              </span>
              <span className="text-2xl font-bold text-emerald-400">
                {state.lastXG.toFixed(3)}
              </span>
            </div>
          )}
        </div>

        {/* Right: Scoreboard + Export */}
        <div className="h-full">
          <Scoreboard
            homeTeamName={state.homeTeamName}
            awayTeamName={state.awayTeamName}
            homeStats={state.homeStats}
            awayStats={state.awayStats}
            onExport={() => downloadCsv(state.shots, state.homeTeamName, state.awayTeamName)}
            exportDisabled={state.shots.length === 0}
          />
        </div>
      </div>

    </div>
  );
}

export default function App() {
  const { state } = useGame();

  return state.phase === "entry" ? <TeamEntry /> : <GameView />;
}
