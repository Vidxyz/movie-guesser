// Types mirrored from packages/shared — kept local so apps/web is self-contained for Vercel.

export interface MovieInfo {
  id: number;
  title: string;
  year: number;
  genre_ids: number[];
  backdrop_path: string;
  popularity: number;
}

export const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export type Difficulty = "easy" | "medium" | "hard";
export type GameMode = "classic" | "infinite";

export interface RoundChoice {
  id: number;
  title: string;
  year: number;
}

export interface Round {
  correctId: number;
  correctTitle: string;
  correctYear: number;
  genres: number[];
  backdropPath: string;
  choices: RoundChoice[];
  timerSeconds: number;
  initialBlurPx: number;
}

export interface GameResult {
  movieId: number;
  title: string;
  correct: boolean;
  score: number;
  difficulty: Difficulty;
  timestamp: string;
}

export interface ClassicRun {
  totalScore: number;
  correctAnswers: number;
  timestamp: string;
}

export interface GameStats {
  // Infinite mode
  totalGames: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreakEasy: number;
  bestStreakMedium: number;
  bestStreakHard: number;
  totalScore: number;
  currentDifficulty: Difficulty;
  history: GameResult[];

  // Classic mode
  classicBestScore: number;
  classicBestCorrect: number;
  classicHistory: ClassicRun[];
}
