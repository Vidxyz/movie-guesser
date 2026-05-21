import type { GameResult, GameStats, Difficulty } from "@moviguessr/shared";

const KEY = "moviguessr:stats";

const DEFAULT_STATS: GameStats = {
  totalGames: 0,
  correctAnswers: 0,
  currentStreak: 0,
  bestStreak: 0,
  bestStreakDifficulty: "medium",
  totalScore: 0,
  currentDifficulty: "medium",
  history: [],
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

export function saveResult(result: GameResult): GameStats {
  const stats = loadStats();
  stats.totalGames += 1;
  stats.currentDifficulty = result.difficulty;

  if (result.correct) {
    stats.correctAnswers += 1;
    stats.currentStreak += 1;
    stats.totalScore += result.score;
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
      stats.bestStreakDifficulty = result.difficulty;
    }
  } else {
    stats.currentStreak = 0;
  }

  stats.history = [result, ...stats.history].slice(0, 100);
  localStorage.setItem(KEY, JSON.stringify(stats));
  return stats;
}

export function clearStats(): void {
  localStorage.removeItem(KEY);
}

export function getDifficulty(): Difficulty {
  return loadStats().currentDifficulty;
}
