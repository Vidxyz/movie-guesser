import type { Difficulty } from "@moviguessr/shared";

export interface ScoreBreakdown {
  base: number;
  speedBonus: number;
  streakMultiplier: number;
  difficultyMultiplier: number;
  total: number;
}

const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  easy:   0.75,
  medium: 1.0,
  hard:   1.5,
};

export function calculateScore(
  correct: boolean,
  progress: number,
  streak: number,
  difficulty: Difficulty = "medium",
): ScoreBreakdown {
  if (!correct) {
    return { base: 0, speedBonus: 0, streakMultiplier: 1, difficultyMultiplier: DIFFICULTY_MULTIPLIER[difficulty], total: 0 };
  }

  const base = 1000;

  let speedBonus = 0;
  if (progress < 0.20)      speedBonus = 500;
  else if (progress < 0.50) speedBonus = 200;
  else if (progress < 0.80) speedBonus = 50;

  const streakMultiplier    = streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1;
  const difficultyMultiplier = DIFFICULTY_MULTIPLIER[difficulty];

  const total = Math.round((base + speedBonus) * streakMultiplier * difficultyMultiplier);
  return { base, speedBonus, streakMultiplier, difficultyMultiplier, total };
}

// Single source of truth for blur — used by both classic and infinite modes.
// All modes use ease-out (exponent < 1) so unblur is always perceptibly progressing.
// Tuned so blur reaches ~0.5 px (sharp on retina) at:
//   easy   t=0.60 (18 s) — last 40% clear
//   medium t=0.80 (24 s) — last 20% clear
//   hard   t=0.90 (27 s) — last 10% clear
export const BLUR_CONFIG: Record<Difficulty, { initialBlurPx: number; easingExponent: number }> = {
  easy:   { initialBlurPx: 4, easingExponent: 0.26 },
  medium: { initialBlurPx: 7, easingExponent: 0.33 },
  hard:   { initialBlurPx: 9, easingExponent: 0.54 },
};

export function getClassicDifficulty(questionNum: number): Difficulty {
  if (questionNum <= 5)  return "easy";
  if (questionNum <= 14) return "medium";
  return "hard";
}

export function getDifficultyLabel(d: Difficulty): string {
  return d === "easy" ? "Easy" : d === "hard" ? "Hard" : "Medium";
}

export function getDifficultyColor(d: Difficulty): string {
  return d === "easy"
    ? "text-emerald-600 bg-emerald-50 border-emerald-200"
    : d === "hard"
    ? "text-rose-600 bg-rose-50 border-rose-200"
    : "text-amber-600 bg-amber-50 border-amber-200";
}
