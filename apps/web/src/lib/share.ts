import type { Difficulty } from "@moviguessr/shared";
import type { ScoreBreakdown } from "./gameLogic";
import { GENRE_MAP } from "@moviguessr/shared";

export interface SharePayload {
  correct: boolean;
  correctTitle: string;
  correctYear: number;
  genres: number[];
  score: ScoreBreakdown;
  streak: number;
  difficulty: Difficulty;
}

const DIFF_EMOJI: Record<Difficulty, string> = {
  easy: "🟢",
  medium: "🟡",
  hard: "🔴",
};

const DIFF_LABEL: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

function speedLabel(speedBonus: number): string | null {
  if (speedBonus >= 500) return "⚡ Lightning fast";
  if (speedBonus >= 200) return "🏃 Quick";
  if (speedBonus >= 50)  return "🎯 Steady";
  return null;
}

function buildText({ correct, correctTitle, correctYear, genres, score, streak, difficulty }: SharePayload): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "moviguessr.vercel.app";
  const genre = GENRE_MAP[genres[0]] ?? "Movie";

  const movieLine = correct
    ? `✅ ${correctTitle} (${correctYear})`
    : `❌ It was ${correctTitle} (${correctYear})`;

  const metaLine = `${genre} · ${DIFF_EMOJI[difficulty]} ${DIFF_LABEL[difficulty]}`;

  const lines = ["moviguessr 🎬", "", movieLine, metaLine];

  if (correct) {
    const speed = speedLabel(score.speedBonus);
    const streakPart = streak >= 2 ? `🔥 ${streak} streak` : null;
    const statParts = [speed, streakPart].filter(Boolean);
    if (statParts.length > 0) lines.push(statParts.join(" · "));
    lines.push(`${score.total.toLocaleString()} pts`);
  }

  lines.push("", correct ? "Can you beat me?" : "Can you do better?", origin);

  return lines.join("\n");
}

export interface ClassicSharePayload {
  totalScore: number;
  correctAnswers: number;
}

function classicGrade(correct: number): string {
  if (correct === 20) return "🎭 Perfect score — you ARE the Academy";
  if (correct >= 18)  return "🎬 Cinema Maestro";
  if (correct >= 15)  return "🎥 Film Buff";
  if (correct >= 10)  return "🍿 Casual Viewer";
  return "🎞️ Still learning the ropes";
}

function buildClassicText({ totalScore, correctAnswers }: ClassicSharePayload): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "moviguessr.vercel.app";
  const blocks = correctAnswers > 0
    ? Array.from({ length: 20 }, (_, i) => i < correctAnswers ? "🟨" : "⬛").join("")
    : "⬛".repeat(20);

  return [
    "🏆 moviguessr Classic",
    "",
    `${correctAnswers}/20 correct · ${totalScore.toLocaleString()} pts`,
    classicGrade(correctAnswers),
    "",
    blocks,
    "",
    origin,
  ].join("\n");
}

export async function shareClassicResult(payload: ClassicSharePayload): Promise<"shared" | "copied"> {
  const text = buildClassicText(payload);
  if (typeof navigator !== "undefined" && navigator.share) {
    try { await navigator.share({ text }); return "shared"; } catch { /* fall through */ }
  }
  await navigator.clipboard.writeText(text);
  return "copied";
}

export async function shareResult(payload: SharePayload): Promise<"shared" | "copied"> {
  const text = buildText(payload);

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ text });
      return "shared";
    } catch {
      // user cancelled or API failed — fall through to clipboard
    }
  }

  await navigator.clipboard.writeText(text);
  return "copied";
}
