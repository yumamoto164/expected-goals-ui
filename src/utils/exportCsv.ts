import Papa from "papaparse";
import type { Shot } from "../types";

const BODY_PART_LABELS: Record<number, string> = { 0: "foot", 1: "other" };
const ASSIST_TYPE_LABELS: Record<number, string> = {
  0: "pass",
  1: "recovery",
  2: "clearance",
  3: "direct",
  4: "open play",
};
const SHOT_TYPE_LABELS: Record<number, string> = {
  0: "free kick",
  1: "corner",
  2: "throw in",
  3: "set piece",
  4: "open play",
};

export function downloadCsv(shots: Shot[], homeTeam: string, awayTeam: string) {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  const filename = `${homeTeam}_vs_${awayTeam}_${month}-${day}-${year}.csv`;

  const rows = shots.map((s) => ({
    id: s.id,
    team: s.team,
    player_number: s.player?.number ?? "",
    player_name: s.player?.name ?? "",
    x: s.x.toFixed(2),
    y: s.y.toFixed(2),
    on_target: s.onTarget,
    is_goal: s.isGoal,
    body_part: BODY_PART_LABELS[s.bodyPart],
    assist_type: ASSIST_TYPE_LABELS[s.assistType],
    shot_type: SHOT_TYPE_LABELS[s.shotType],
    xG: s.xG.toFixed(4),
  }));

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
