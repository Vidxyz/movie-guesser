import { Hono } from "hono";
import { MOVIES } from "@moviguessr/shared";
import type { Round, RoundChoice, Difficulty, MovieInfo } from "@moviguessr/shared";

const DIFFICULTY_CONFIG: Record<Difficulty, { timerSeconds: number; initialBlurPx: number }> = {
  easy:   { timerSeconds: 30, initialBlurPx: 4 },
  medium: { timerSeconds: 30, initialBlurPx: 6 },
  hard:   { timerSeconds: 30, initialBlurPx: 8 },
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildDecoys(
  correctId: number,
  primaryGenreId: number,
  difficulty: Difficulty,
): RoundChoice[] {
  const others = MOVIES.filter((m) => m.id !== correctId);
  const sameGenre = others.filter((m) => m.genre_ids[0] === primaryGenreId);
  const diffGenre = others.filter((m) => m.genre_ids[0] !== primaryGenreId);

  const decoys: MovieInfo[] = [];

  if (difficulty === "easy") {
    const usedGenres = new Set<number>([primaryGenreId]);
    const pool = shuffle(diffGenre);
    for (const m of pool) {
      if (decoys.length === 3) break;
      if (!usedGenres.has(m.genre_ids[0])) {
        decoys.push(m);
        usedGenres.add(m.genre_ids[0]);
      }
    }
    const remaining = pool.filter((m) => !decoys.some((d) => d.id === m.id));
    while (decoys.length < 3 && remaining.length > 0) {
      const pick = remaining.splice(Math.floor(Math.random() * remaining.length), 1)[0];
      decoys.push(pick);
    }
  } else if (difficulty === "hard") {
    const pool = shuffle(sameGenre);
    for (const m of pool) {
      if (decoys.length === 3) break;
      decoys.push(m);
    }
    const remaining = others.filter((m) => !decoys.some((d) => d.id === m.id));
    while (decoys.length < 3 && remaining.length > 0) {
      const idx = Math.floor(Math.random() * remaining.length);
      const pick = remaining.splice(idx, 1)[0];
      decoys.push(pick);
    }
  } else {
    if (sameGenre.length > 0) decoys.push(pickRandom(sameGenre));
    const remaining = others.filter((m) => !decoys.some((d) => d.id === m.id));
    while (decoys.length < 3 && remaining.length > 0) {
      const idx = Math.floor(Math.random() * remaining.length);
      const pick = remaining.splice(idx, 1)[0];
      decoys.push(pick);
    }
  }

  return decoys.map((m) => ({ id: m.id, title: m.title, year: m.year }));
}

const round = new Hono();

round.get("/", (c) => {
  const rawDifficulty = c.req.query("difficulty") ?? "medium";
  const difficulty: Difficulty =
    rawDifficulty === "easy" || rawDifficulty === "hard" ? rawDifficulty : "medium";

  const movie = MOVIES[Math.floor(Math.random() * MOVIES.length)];
  const config = DIFFICULTY_CONFIG[difficulty];
  const decoys = buildDecoys(movie.id, movie.genre_ids[0], difficulty);

  const choices: RoundChoice[] = [
    { id: movie.id, title: movie.title, year: movie.year },
    ...decoys,
  ].sort(() => Math.random() - 0.5);

  const payload: Round = {
    correctId: movie.id,
    correctTitle: movie.title,
    correctYear: movie.year,
    genres: movie.genre_ids,
    backdropPath: movie.backdrop_path,
    choices,
    timerSeconds: config.timerSeconds,
    initialBlurPx: config.initialBlurPx,
  };

  return c.json(payload);
});

export default round;
