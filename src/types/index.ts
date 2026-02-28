export interface Player {
  team: 'home' | 'away';
  number: number;
  name: string;
}

export interface Shot {
  id: number;
  team: 'home' | 'away';
  player?: Player;
  x: number;
  y: number;
  onTarget: boolean;
  isGoal: boolean;
  bodyPart: 0 | 1;
  assistType: 0 | 1 | 2 | 3 | 4;
  shotType: 0 | 1 | 2 | 3 | 4;
  xG: number;
}

export interface TeamStats {
  goals: number;
  shots: number;
  sot: number;
  xG: number;
}

export type GamePhase = 'entry' | 'game';

export interface ShotPayload {
  x: number;
  y: number;
  on_target: boolean;
  body_part: 0 | 1;
  assist_type: 0 | 1 | 2 | 3 | 4;
  shot_type: 0 | 1 | 2 | 3 | 4;
}
