import { useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import PlayerRow from './PlayerRow';
import { MAX_PLAYERS } from '../../constants';
import type { Player } from '../../types';

interface PlayerDraft {
  number: string;
  name: string;
}

const emptyDraft = (): PlayerDraft => ({ number: '', name: '' });

function buildDrafts(count: number): PlayerDraft[] {
  return Array.from({ length: count }, emptyDraft);
}

export default function TeamEntry() {
  const { setRoster, startGame } = useGame();

  const handleSkip = useCallback(() => {
    startGame();
  }, [startGame]);

  const [homeTeamName, setHomeTeamName] = useState('');
  const [awayTeamName, setAwayTeamName] = useState('');
  const [homeDrafts, setHomeDrafts] = useState<PlayerDraft[]>(buildDrafts(MAX_PLAYERS));
  const [awayDrafts, setAwayDrafts] = useState<PlayerDraft[]>(buildDrafts(MAX_PLAYERS));
  const [error, setError] = useState('');

  const handleHomeNumber = useCallback((index: number, value: string) => {
    setHomeDrafts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index]!, number: value };
      return next;
    });
  }, []);

  const handleHomeName = useCallback((index: number, value: string) => {
    setHomeDrafts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index]!, name: value };
      return next;
    });
  }, []);

  const handleAwayNumber = useCallback((index: number, value: string) => {
    setAwayDrafts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index]!, number: value };
      return next;
    });
  }, []);

  const handleAwayName = useCallback((index: number, value: string) => {
    setAwayDrafts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index]!, name: value };
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    setError('');

    // Validate: no partial entries
    const hasPartialHome = homeDrafts.some(
      (d) => (d.number && !d.name) || (!d.number && d.name)
    );
    const hasPartialAway = awayDrafts.some(
      (d) => (d.number && !d.name) || (!d.number && d.name)
    );

    if (hasPartialHome || hasPartialAway) {
      setError('Each player entry must have both a jersey number and a name.');
      return;
    }

    const toPlayers = (drafts: PlayerDraft[], team: 'home' | 'away'): Player[] =>
      drafts
        .filter((d) => d.number && d.name)
        .map((d) => ({ team, number: Number(d.number), name: d.name.trim() }));

    const homePlayers = toPlayers(homeDrafts, 'home');
    const awayPlayers = toPlayers(awayDrafts, 'away');

    if (homePlayers.length === 0 || awayPlayers.length === 0) {
      setError('Each team must have at least one player.');
      return;
    }

    if (!homeTeamName.trim() || !awayTeamName.trim()) {
      setError('Both team names are required.');
      return;
    }

    setRoster(homeTeamName.trim(), awayTeamName.trim(), homePlayers, awayPlayers);
    startGame();
  }, [homeDrafts, awayDrafts, homeTeamName, awayTeamName, setRoster, startGame]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2 text-emerald-400">Expected Goals</h1>
      <p className="text-gray-400 mb-8 text-sm">Enter team rosters to start tracking</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Home Team */}
        <div className="bg-gray-800 rounded-xl p-5">
          <input
            type="text"
            placeholder="Home Team Name"
            value={homeTeamName}
            onChange={(e) => setHomeTeamName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white font-semibold text-lg mb-4 focus:outline-none focus:border-emerald-500"
          />
          <div className="flex gap-2 text-xs text-gray-400 uppercase tracking-wider mb-2 px-1">
            <span className="w-16">Jersey #</span>
            <span>Name</span>
          </div>
          <div className="flex flex-col gap-1.5 max-h-96 overflow-y-auto pr-1">
            {homeDrafts.map((draft, i) => (
              <PlayerRow
                key={i}
                index={i}
                number={draft.number}
                name={draft.name}
                onNumberChange={handleHomeNumber}
                onNameChange={handleHomeName}
              />
            ))}
          </div>
        </div>

        {/* Away Team */}
        <div className="bg-gray-800 rounded-xl p-5">
          <input
            type="text"
            placeholder="Away Team Name"
            value={awayTeamName}
            onChange={(e) => setAwayTeamName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white font-semibold text-lg mb-4 focus:outline-none focus:border-emerald-500"
          />
          <div className="flex gap-2 text-xs text-gray-400 uppercase tracking-wider mb-2 px-1">
            <span className="w-16">Jersey #</span>
            <span>Name</span>
          </div>
          <div className="flex flex-col gap-1.5 max-h-96 overflow-y-auto pr-1">
            {awayDrafts.map((draft, i) => (
              <PlayerRow
                key={i}
                index={i}
                number={draft.number}
                name={draft.name}
                onNumberChange={handleAwayNumber}
                onNameChange={handleAwayName}
              />
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-red-400 text-sm">{error}</p>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          onClick={handleSubmit}
          className="px-10 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-semibold text-lg transition-colors cursor-pointer"
        >
          Start Game
        </button>
        <button
          onClick={handleSkip}
          className="text-sm text-gray-400 hover:text-gray-200 transition-colors cursor-pointer underline underline-offset-2"
        >
          Skip — play without rosters
        </button>
      </div>
    </div>
  );
}
