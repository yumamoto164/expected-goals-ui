import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import type { Player, Shot, TeamStats, GamePhase } from "../types";
import { fetchXG } from "../hooks/useXG";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
interface GameState {
  phase: GamePhase;
  homeTeamName: string;
  awayTeamName: string;
  homePlayers: Player[];
  awayPlayers: Player[];
  shots: Shot[];
  homeStats: TeamStats;
  awayStats: TeamStats;
  selectedTeam: "home" | "away";
  selectedPlayer: Player | null;
  bodyPart: 0 | 1;
  assistType: 0 | 1 | 2 | 3 | 4;
  shotType: 0 | 1 | 2 | 3 | 4;
  lastXG: number | null;
}

const emptyStats = (): TeamStats => ({ goals: 0, shots: 0, sot: 0, xG: 0 });

const initialState: GameState = {
  phase: "entry",
  homeTeamName: "",
  awayTeamName: "",
  homePlayers: [],
  awayPlayers: [],
  shots: [],
  homeStats: emptyStats(),
  awayStats: emptyStats(),
  selectedTeam: "home",
  selectedPlayer: null,
  bodyPart: 0,
  assistType: 4,
  shotType: 4,
  lastXG: null,
};

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
type Action =
  | {
      type: "SET_ROSTER";
      homeTeamName: string;
      awayTeamName: string;
      homePlayers: Player[];
      awayPlayers: Player[];
    }
  | { type: "SET_PHASE"; phase: GamePhase }
  | { type: "SET_SELECTED_TEAM"; team: "home" | "away" }
  | { type: "SET_SELECTED_PLAYER"; player: Player | null }
  | { type: "SET_BODY_PART"; value: 0 | 1 }
  | { type: "SET_ASSIST_TYPE"; value: 0 | 1 | 2 | 3 | 4 }
  | { type: "SET_SHOT_TYPE"; value: 0 | 1 | 2 | 3 | 4 }
  | { type: "ADD_SHOT"; shot: Shot }
  | { type: "REMOVE_LAST_SHOT" }
  | { type: "RESET_GAME" };

// ---------------------------------------------------------------------------
// Stats helpers
// ---------------------------------------------------------------------------
function addShotToStats(stats: TeamStats, shot: Shot): TeamStats {
  return {
    goals: stats.goals + (shot.isGoal ? 1 : 0),
    shots: stats.shots + 1,
    sot: stats.sot + (shot.onTarget || shot.isGoal ? 1 : 0),
    xG: stats.xG + shot.xG,
  };
}

function rebuildStats(shots: Shot[]): {
  homeStats: TeamStats;
  awayStats: TeamStats;
} {
  const home = emptyStats();
  const away = emptyStats();
  for (const s of shots) {
    const target = s.team === "home" ? home : away;
    target.goals += s.isGoal ? 1 : 0;
    target.shots += 1;
    target.sot += s.onTarget || s.isGoal ? 1 : 0;
    target.xG += s.xG;
  }
  return { homeStats: home, awayStats: away };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------
function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SET_ROSTER":
      return {
        ...state,
        homeTeamName: action.homeTeamName,
        awayTeamName: action.awayTeamName,
        homePlayers: action.homePlayers,
        awayPlayers: action.awayPlayers,
        selectedPlayer: action.homePlayers[0] ?? null,
      };

    case "SET_PHASE":
      return { ...state, phase: action.phase };

    case "SET_SELECTED_TEAM": {
      const players =
        action.team === "home" ? state.homePlayers : state.awayPlayers;
      return {
        ...state,
        selectedTeam: action.team,
        selectedPlayer: players[0] ?? null,
      };
    }

    case "SET_SELECTED_PLAYER":
      return { ...state, selectedPlayer: action.player };

    case "SET_BODY_PART":
      return { ...state, bodyPart: action.value };

    case "SET_ASSIST_TYPE":
      return { ...state, assistType: action.value };

    case "SET_SHOT_TYPE":
      return { ...state, shotType: action.value };

    case "ADD_SHOT": {
      const shots = [...state.shots, action.shot];
      const homeStats =
        action.shot.team === "home"
          ? addShotToStats(state.homeStats, action.shot)
          : state.homeStats;
      const awayStats =
        action.shot.team === "away"
          ? addShotToStats(state.awayStats, action.shot)
          : state.awayStats;
      return { ...state, shots, homeStats, awayStats, lastXG: action.shot.xG };
    }

    case "REMOVE_LAST_SHOT": {
      if (state.shots.length === 0) return state;
      const shots = state.shots.slice(0, -1);
      return { ...state, shots, ...rebuildStats(shots), lastXG: null };
    }

    case "RESET_GAME":
      return { ...initialState };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
interface GameContextValue {
  state: GameState;
  setRoster: (
    homeTeamName: string,
    awayTeamName: string,
    homePlayers: Player[],
    awayPlayers: Player[],
  ) => void;
  startGame: () => void;
  setSelectedTeam: (team: "home" | "away") => void;
  setSelectedPlayer: (player: Player | null) => void;
  setBodyPart: (value: 0 | 1) => void;
  setAssistType: (value: 0 | 1 | 2 | 3 | 4) => void;
  setShotType: (value: 0 | 1 | 2 | 3 | 4) => void;
  recordShot: (params: {
    x: number;
    y: number;
    onTarget: boolean;
    isGoal: boolean;
  }) => Promise<void>;
  removeLastShot: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
let nextId = 1;

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Keep a ref to latest state so async callbacks always see fresh values
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  const setRoster = useCallback(
    (
      homeTeamName: string,
      awayTeamName: string,
      homePlayers: Player[],
      awayPlayers: Player[],
    ) => {
      dispatch({
        type: "SET_ROSTER",
        homeTeamName,
        awayTeamName,
        homePlayers,
        awayPlayers,
      });
    },
    [],
  );

  const startGame = useCallback(() => {
    dispatch({ type: "SET_PHASE", phase: "game" });
  }, []);

  const setSelectedTeam = useCallback((team: "home" | "away") => {
    dispatch({ type: "SET_SELECTED_TEAM", team });
  }, []);

  const setSelectedPlayer = useCallback((player: Player | null) => {
    dispatch({ type: "SET_SELECTED_PLAYER", player });
  }, []);

  const setBodyPart = useCallback((value: 0 | 1) => {
    dispatch({ type: "SET_BODY_PART", value });
  }, []);

  const setAssistType = useCallback((value: 0 | 1 | 2 | 3 | 4) => {
    dispatch({ type: "SET_ASSIST_TYPE", value });
  }, []);

  const setShotType = useCallback((value: 0 | 1 | 2 | 3 | 4) => {
    dispatch({ type: "SET_SHOT_TYPE", value });
  }, []);

  const recordShot = useCallback(
    async (params: {
      x: number;
      y: number;
      onTarget: boolean;
      isGoal: boolean;
    }) => {
      const { selectedPlayer, selectedTeam, bodyPart, assistType, shotType } =
        stateRef.current;

      let xG = 0;
      try {
        xG = await fetchXG({
          x: params.x,
          y: params.y,
          body_part: bodyPart,
          assist_type: assistType,
          shot_type: shotType,
        });
      } catch {
        // xG stays 0 if API is unavailable
      }

      const shot: Shot = {
        id: nextId++,
        team: selectedTeam,
        player: selectedPlayer ?? undefined,
        x: params.x,
        y: params.y,
        onTarget: params.onTarget,
        isGoal: params.isGoal,
        bodyPart,
        assistType,
        shotType,
        xG,
      };

      dispatch({ type: "ADD_SHOT", shot });
    },
    [],
  );

  const removeLastShot = useCallback(() => {
    dispatch({ type: "REMOVE_LAST_SHOT" });
  }, []);

  const resetGame = useCallback(() => {
    nextId = 1;
    dispatch({ type: "RESET_GAME" });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        setRoster,
        startGame,
        setSelectedTeam,
        setSelectedPlayer,
        setBodyPart,
        setAssistType,
        setShotType,
        recordShot,
        removeLastShot,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
