import type { GameResult, GameStats, ClassicRun, Difficulty } from "@moviguessr/shared";

const KEY = "moviguessr:stats";

const DEFAULT_STATS: GameStats = {
  totalGames: 0,
  correctAnswers: 0,
  currentStreak: 0,
  bestStreakEasy: 0,
  bestStreakMedium: 0,
  bestStreakHard: 0,
  totalScore: 0,
  currentDifficulty: "medium",
  history: [],
  classicBestScore: 0,
  classicBestCorrect: 0,
  classicHistory: [],
};

export function loadStats(): GameStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...(JSON.parse(raw) as Partial<GameStats>) };
  } catch {
    return DEFAULT_STATS;
  }
}

function bestStreakKey(d: Difficulty): "bestStreakEasy" | "bestStreakMedium" | "bestStreakHard" {
  if (d === "easy") return "bestStreakEasy";
  if (d === "hard") return "bestStreakHard";
  return "bestStreakMedium";
}

// Infinite mode only — tracks per-difficulty streaks
export function saveResult(result: GameResult): GameStats {
  const stats = loadStats();
  stats.totalGames += 1;
  stats.currentDifficulty = result.difficulty;

  if (result.correct) {
    stats.correctAnswers += 1;
    stats.currentStreak += 1;
    stats.totalScore += result.score;
    const key = bestStreakKey(result.difficulty);
    if (stats.currentStreak > stats[key]) stats[key] = stats.currentStreak;
  } else {
    stats.currentStreak = 0;
  }

  stats.history = [result, ...stats.history].slice(0, 100);
  localStorage.setItem(KEY, JSON.stringify(stats));
  return stats;
}

// Classic mode — saves full run summary at Q20
export function saveClassicRun(run: ClassicRun): GameStats {
  const stats = loadStats();
  if (run.totalScore > stats.classicBestScore)      stats.classicBestScore = run.totalScore;
  if (run.correctAnswers > stats.classicBestCorrect) stats.classicBestCorrect = run.correctAnswers;
  stats.classicHistory = [run, ...stats.classicHistory].slice(0, 20);
  localStorage.setItem(KEY, JSON.stringify(stats));
  return stats;
}

export function clearStats(): void {
  localStorage.removeItem(KEY);
}

export function getDifficulty(): Difficulty {
  return loadStats().currentDifficulty;
}
