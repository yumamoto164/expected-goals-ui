import { memo, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import ToggleButton from './ToggleButton';
import type { Player } from '../../types';

const BODY_PART_OPTIONS: { label: string; value: 0 | 1 }[] = [
  { label: 'Foot', value: 0 },
  { label: 'Other', value: 1 },
];

const ASSIST_TYPE_OPTIONS: { label: string; value: 0 | 1 | 2 | 3 | 4 }[] = [
  { label: 'Pass', value: 0 },
  { label: 'Recovery', value: 1 },
  { label: 'Clearance', value: 2 },
  { label: 'Direct', value: 3 },
  { label: 'Open Play', value: 4 },
];

const SHOT_TYPE_OPTIONS: { label: string; value: 0 | 1 | 2 | 3 | 4 }[] = [
  { label: 'Free Kick', value: 0 },
  { label: 'Corner', value: 1 },
  { label: 'Throw In', value: 2 },
  { label: 'Set Piece', value: 3 },
  { label: 'Open Play', value: 4 },
];

const ShotControls = memo(function ShotControls() {
  const {
    state,
    setSelectedTeam,
    setSelectedPlayer,
    setBodyPart,
    setAssistType,
    setShotType,
    removeLastShot,
  } = useGame();

  const { selectedTeam, selectedPlayer, bodyPart, assistType, shotType, lastXG } =
    state;

  const players =
    selectedTeam === 'home' ? state.homePlayers : state.awayPlayers;

  const handleTeamToggle = useCallback(
    (team: 'home' | 'away') => () => setSelectedTeam(team),
    [setSelectedTeam]
  );

  const handlePlayerChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const player = players.find((p) => p.number === Number(e.target.value));
      setSelectedPlayer(player ?? null);
    },
    [players, setSelectedPlayer]
  );

  const handleBodyPart = useCallback(
    (value: 0 | 1) => () => setBodyPart(value),
    [setBodyPart]
  );

  const handleAssistType = useCallback(
    (value: 0 | 1 | 2 | 3 | 4) => () => setAssistType(value),
    [setAssistType]
  );

  const handleShotType = useCallback(
    (value: 0 | 1 | 2 | 3 | 4) => () => setShotType(value),
    [setShotType]
  );

  return (
    <div className="flex flex-col gap-5 p-4 bg-gray-800 rounded-lg h-full">
      {/* Team toggle */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Team</p>
        <div className="flex gap-2">
          <ToggleButton
            label={state.homeTeamName || 'Home'}
            active={selectedTeam === 'home'}
            onClick={handleTeamToggle('home')}
          />
          <ToggleButton
            label={state.awayTeamName || 'Away'}
            active={selectedTeam === 'away'}
            onClick={handleTeamToggle('away')}
          />
        </div>
      </div>

      {/* Player dropdown — hidden when no roster was entered */}
      {players.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Player</p>
          <select
            value={selectedPlayer?.number ?? ''}
            onChange={handlePlayerChange}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm border border-gray-600 focus:outline-none focus:border-emerald-500"
          >
            {players.map((p: Player) => (
              <option key={p.number} value={p.number}>
                #{p.number} {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Body Part */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Body Part</p>
        <div className="flex gap-2 flex-wrap">
          {BODY_PART_OPTIONS.map(({ label, value }) => (
            <ToggleButton
              key={value}
              label={label}
              active={bodyPart === value}
              onClick={handleBodyPart(value)}
            />
          ))}
        </div>
      </div>

      {/* Assist Type */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Assist Type</p>
        <div className="flex gap-2 flex-wrap">
          {ASSIST_TYPE_OPTIONS.map(({ label, value }) => (
            <ToggleButton
              key={value}
              label={label}
              active={assistType === value}
              onClick={handleAssistType(value)}
            />
          ))}
        </div>
      </div>

      {/* Shot Type */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Shot Type</p>
        <div className="flex gap-2 flex-wrap">
          {SHOT_TYPE_OPTIONS.map(({ label, value }) => (
            <ToggleButton
              key={value}
              label={label}
              active={shotType === value}
              onClick={handleShotType(value)}
            />
          ))}
        </div>
      </div>

      {/* Last xG */}
      {lastXG !== null && (
        <div className="bg-gray-700 rounded p-3 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Last xG</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {lastXG.toFixed(3)}
          </p>
        </div>
      )}

      {/* Remove Last Shot */}
      <button
        onClick={removeLastShot}
        disabled={state.shots.length === 0}
        className="mt-auto px-3 py-2 bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed rounded text-sm font-medium text-white transition-colors cursor-pointer"
      >
        Remove Last Shot
      </button>
    </div>
  );
});

export default ShotControls;
