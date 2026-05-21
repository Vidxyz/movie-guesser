import type { Round } from "@moviguessr/shared";
import type { Difficulty } from "./settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export async function fetchRound(difficulty: Difficulty = "medium"): Promise<Round> {
  const res = await fetch(`${API_URL}/api/round?difficulty=${difficulty}`);
  if (!res.ok) throw new Error(`Failed to fetch round: ${res.status}`);
  return res.json() as Promise<Round>;
}
