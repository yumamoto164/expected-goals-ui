export const PITCH_WIDTH = 105;
export const PITCH_HEIGHT = 68;

export const BODY_PARTS = { foot: 0, other: 1 } as const;
export const ASSIST_TYPES = {
  pass: 0,
  recovery: 1,
  clearance: 2,
  direct: 3,
  rebound: 4,
} as const;
export const SHOT_TYPES = {
  free_kick: 0,
  corner: 1,
  throw_in: 2,
  dir_set_piece: 3,
  open_play: 4,
} as const;

export const SHOT_COLORS = {
  goal: "#ef4444",
  on_target: "#f97316",
  off_target: "#3b82f6",
} as const;

export const MAX_PLAYERS = 20;
