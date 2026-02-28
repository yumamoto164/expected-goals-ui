import type { ShotPayload } from "../types";

const XG_MODEL_API_URL =
  import.meta.env.VITE_XG_MODEL_API_URL || "http://localhost:5000";

export async function fetchXG(payload: ShotPayload): Promise<number> {
  const res = await fetch(`${XG_MODEL_API_URL}/expected-goals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`xG API error: ${res.status}`);
  }
  const data = (await res.json()) as { prediction: number };
  return data.prediction;
}
