import { useRef, useCallback, memo } from 'react';
import { PITCH_WIDTH, PITCH_HEIGHT } from '../../constants';
import type { Shot } from '../../types';
import ShotMarker from './ShotMarker';

interface SoccerPitchProps {
  shots: Shot[];
  onShotRecorded: (params: {
    x: number;
    y: number;
    onTarget: boolean;
    isGoal: boolean;
  }) => void;
}

// Pitch geometry constants (UEFA standard)
const PENALTY_BOX_LENGTH = 16.5;
const PENALTY_BOX_WIDTH = 40.32;
const GOAL_BOX_LENGTH = 5.5;
const GOAL_BOX_WIDTH = 18.32;
const GOAL_WIDTH = 7.32;
const GOAL_DEPTH = 2.44;
const CENTER_CIRCLE_R = 9.15;
const PENALTY_SPOT_X = 11;
const CORNER_ARC_R = 1;

const SoccerPitch = memo(function SoccerPitch({ shots, onShotRecorded }: SoccerPitchProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const getCoords = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * PITCH_WIDTH;
    const y = PITCH_HEIGHT - ((e.clientY - rect.top) / rect.height) * PITCH_HEIGHT;
    return { x, y };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (e.button !== 0) return;
      const { x, y } = getCoords(e);
      const isGoal = e.shiftKey;
      onShotRecorded({ x, y, isGoal, onTarget: !isGoal });
    },
    [getCoords, onShotRecorded]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      e.preventDefault();
      const { x, y } = getCoords(e);
      onShotRecorded({ x, y, isGoal: false, onTarget: false });
    },
    [getCoords, onShotRecorded]
  );

  // Derived values
  const cx = PITCH_WIDTH / 2;
  const cy = PITCH_HEIGHT / 2;
  const penBoxY = (PITCH_HEIGHT - PENALTY_BOX_WIDTH) / 2;
  const goalBoxY = (PITCH_HEIGHT - GOAL_BOX_WIDTH) / 2;
  const goalY = (PITCH_HEIGHT - GOAL_WIDTH) / 2;

  const lineStyle = { stroke: 'white', strokeWidth: 0.5, fill: 'none' };
  const spotStyle = { fill: 'white' };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${PITCH_WIDTH} ${PITCH_HEIGHT}`}
      className="w-full cursor-crosshair select-none"
      style={{ background: '#2d8a4e' }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {/* Outer boundary */}
      <rect x={0} y={0} width={PITCH_WIDTH} height={PITCH_HEIGHT} {...lineStyle} />

      {/* Halfway line */}
      <line x1={cx} y1={0} x2={cx} y2={PITCH_HEIGHT} {...lineStyle} />

      {/* Center circle */}
      <circle cx={cx} cy={cy} r={CENTER_CIRCLE_R} {...lineStyle} />

      {/* Center spot */}
      <circle cx={cx} cy={cy} r={0.4} {...spotStyle} />

      {/* --- Left penalty area --- */}
      <rect
        x={0}
        y={penBoxY}
        width={PENALTY_BOX_LENGTH}
        height={PENALTY_BOX_WIDTH}
        {...lineStyle}
      />

      {/* Left goal area */}
      <rect
        x={0}
        y={goalBoxY}
        width={GOAL_BOX_LENGTH}
        height={GOAL_BOX_WIDTH}
        {...lineStyle}
      />

      {/* Left goal */}
      <rect
        x={-GOAL_DEPTH}
        y={goalY}
        width={GOAL_DEPTH}
        height={GOAL_WIDTH}
        {...lineStyle}
      />

      {/* Left penalty spot */}
      <circle cx={PENALTY_SPOT_X} cy={cy} r={0.4} {...spotStyle} />

      {/* Left penalty arc */}
      <path
        d={`M ${PENALTY_BOX_LENGTH} ${cy - 7.5} A 9.15 9.15 0 0 1 ${PENALTY_BOX_LENGTH} ${cy + 7.5}`}
        {...lineStyle}
      />

      {/* --- Right penalty area --- */}
      <rect
        x={PITCH_WIDTH - PENALTY_BOX_LENGTH}
        y={penBoxY}
        width={PENALTY_BOX_LENGTH}
        height={PENALTY_BOX_WIDTH}
        {...lineStyle}
      />

      {/* Right goal area */}
      <rect
        x={PITCH_WIDTH - GOAL_BOX_LENGTH}
        y={goalBoxY}
        width={GOAL_BOX_LENGTH}
        height={GOAL_BOX_WIDTH}
        {...lineStyle}
      />

      {/* Right goal */}
      <rect
        x={PITCH_WIDTH}
        y={goalY}
        width={GOAL_DEPTH}
        height={GOAL_WIDTH}
        {...lineStyle}
      />

      {/* Right penalty spot */}
      <circle cx={PITCH_WIDTH - PENALTY_SPOT_X} cy={cy} r={0.4} {...spotStyle} />

      {/* Right penalty arc */}
      <path
        d={`M ${PITCH_WIDTH - PENALTY_BOX_LENGTH} ${cy - 7.5} A 9.15 9.15 0 0 0 ${PITCH_WIDTH - PENALTY_BOX_LENGTH} ${cy + 7.5}`}
        {...lineStyle}
      />

      {/* Corner arcs */}
      <path d={`M ${CORNER_ARC_R} 0 A ${CORNER_ARC_R} ${CORNER_ARC_R} 0 0 1 0 ${CORNER_ARC_R}`} {...lineStyle} />
      <path d={`M ${PITCH_WIDTH - CORNER_ARC_R} 0 A ${CORNER_ARC_R} ${CORNER_ARC_R} 0 0 0 ${PITCH_WIDTH} ${CORNER_ARC_R}`} {...lineStyle} />
      <path d={`M 0 ${PITCH_HEIGHT - CORNER_ARC_R} A ${CORNER_ARC_R} ${CORNER_ARC_R} 0 0 0 ${CORNER_ARC_R} ${PITCH_HEIGHT}`} {...lineStyle} />
      <path d={`M ${PITCH_WIDTH} ${PITCH_HEIGHT - CORNER_ARC_R} A ${CORNER_ARC_R} ${CORNER_ARC_R} 0 0 1 ${PITCH_WIDTH - CORNER_ARC_R} ${PITCH_HEIGHT}`} {...lineStyle} />

      {/* Shot markers */}
      {shots.map((shot) => (
        <ShotMarker key={shot.id} shot={shot} />
      ))}
    </svg>
  );
});

export default SoccerPitch;
