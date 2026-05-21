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
