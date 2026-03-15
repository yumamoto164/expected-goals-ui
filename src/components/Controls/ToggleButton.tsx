import { memo } from 'react';

interface ToggleButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const ToggleButton = memo(function ToggleButton({
  label,
  active,
  onClick,
}: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-2 lg:px-3 py-1 lg:py-1.5 rounded text-xs lg:text-sm font-medium transition-colors cursor-pointer ${
        active
          ? 'bg-emerald-500 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );
});

export default ToggleButton;
