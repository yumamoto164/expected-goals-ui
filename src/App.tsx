import { useCallback } from 'react';
import { useGame } from './context/GameContext';
import TeamEntry from './components/TeamEntry/TeamEntry';
import SoccerPitch from './components/Pitch/SoccerPitch';
import ShotControls from './components/Controls/ShotControls';
import Scoreboard from './components/Scoreboard';
import ExportButton from './components/ExportButton';

function GameView() {
  const { state, recordShot, resetGame } = useGame();

  const handleShotRecorded = useCallback(
    (params: { x: number; y: number; onTarget: boolean; isGoal: boolean }) => {
      void recordShot(params);
    },
    [recordShot]
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-bold text-emerald-400">Expected Goals</h1>
        <div className="text-center">
          <span className="text-2xl font-bold">
            {state.homeStats.goals} – {state.awayStats.goals}
          </span>
          <p className="text-xs text-gray-400">
            {state.homeTeamName} vs {state.awayTeamName}
          </p>
        </div>
        <button
          onClick={resetGame}
          className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          New Game
        </button>
      </header>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 p-4">
        {/* Left: Controls */}
        <div className="lg:w-56 xl:w-64 shrink-0">
          <ShotControls />
        </div>

        {/* Center: Pitch */}
        <div className="flex-1 flex items-start justify-center">
          <div className="w-full max-w-3xl">
            <SoccerPitch shots={state.shots} onShotRecorded={handleShotRecorded} />
          </div>
        </div>

        {/* Right: Scoreboard + Export */}
        <div className="lg:w-52 xl:w-60 shrink-0 flex flex-col gap-4">
          <Scoreboard
            homeTeamName={state.homeTeamName}
            awayTeamName={state.awayTeamName}
            homeStats={state.homeStats}
            awayStats={state.awayStats}
          />
          <ExportButton />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { state } = useGame();

  return state.phase === 'entry' ? <TeamEntry /> : <GameView />;
}
