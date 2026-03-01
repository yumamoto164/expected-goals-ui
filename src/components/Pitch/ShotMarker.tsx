import { memo } from 'react';
import { SHOT_COLORS, PITCH_HEIGHT } from '../../constants';
import type { Shot } from '../../types';

interface ShotMarkerProps {
  shot: Shot;
}

const ShotMarker = memo(function ShotMarker({ shot }: ShotMarkerProps) {
  const color = shot.isGoal
    ? SHOT_COLORS.goal
    : shot.onTarget
      ? SHOT_COLORS.on_target
      : SHOT_COLORS.off_target;

  return (
    <circle
      cx={shot.x}
      cy={PITCH_HEIGHT - shot.y}
      r={0.8}
      fill={color}
      opacity={0.85}
      stroke="white"
      strokeWidth={0.15}
    />
  );
});

export default ShotMarker;
