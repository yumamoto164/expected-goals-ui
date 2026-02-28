import { memo, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { downloadCsv } from '../utils/exportCsv';

const ExportButton = memo(function ExportButton() {
  const { state } = useGame();

  const handleExport = useCallback(() => {
    downloadCsv(state.shots, state.homeTeamName, state.awayTeamName);
  }, [state.shots, state.homeTeamName, state.awayTeamName]);

  return (
    <button
      onClick={handleExport}
      disabled={state.shots.length === 0}
      className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded font-medium text-sm text-white transition-colors cursor-pointer"
    >
      Export CSV
    </button>
  );
});

export default ExportButton;
