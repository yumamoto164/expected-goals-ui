import { memo } from 'react';

interface PlayerRowProps {
  index: number;
  number: string;
  name: string;
  onNumberChange: (index: number, value: string) => void;
  onNameChange: (index: number, value: string) => void;
}

const PlayerRow = memo(function PlayerRow({
  index,
  number,
  name,
  onNumberChange,
  onNameChange,
}: PlayerRowProps) {
  return (
    <div className="flex gap-2">
      <input
        type="number"
        min={1}
        max={99}
        placeholder="#"
        value={number}
        onChange={(e) => onNumberChange(index, e.target.value)}
        className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-emerald-500"
      />
      <input
        type="text"
        placeholder={`Player ${index + 1}`}
        value={name}
        onChange={(e) => onNameChange(index, e.target.value)}
        className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-emerald-500"
      />
    </div>
  );
});

export default PlayerRow;
