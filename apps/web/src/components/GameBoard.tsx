"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Round, GameStats } from "@moviguessr/shared";
import { fetchRound } from "@/lib/api";
import { calculateScore, type ScoreBreakdown } from "@/lib/gameLogic";
import { loadStats, saveResult } from "@/lib/localStorage";
import { loadSettings } from "@/lib/settings";
import { useBlur } from "@/lib/useBlur";
import PosterViewer from "./PosterViewer";
import ChoiceGrid from "./ChoiceGrid";
import ScoreDisplay from "./ScoreDisplay";
import ResultModal from "./ResultModal";
import BlurTimer from "./BlurTimer";

type GamePhase = "loading" | "playing" | "revealed";
type FlashKind  = "correct" | "wrong" | "timeout";

interface GuessEffect {
  kind: FlashKind;
  score: number;
  key: number;
}

export default function GameBoard() {
  const [phase, setPhase]           = useState<GamePhase>("loading");
  const [round, setRound]           = useState<Round | null>(null);
  const [guessed, setGuessed]       = useState<number | null>(null);
  const [timedOut, setTimedOut]     = useState(false);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);
  const [stats, setStats]           = useState<GameStats>(() => loadStats());
  const [error, setError]           = useState<string | null>(null);
  const [guessEffect, setGuessEffect] = useState<GuessEffect | null>(null);
  const startTimeRef = useRef<number>(0);

  const difficulty = loadSettings().difficulty;

  const { currentBlurPx, progress } = useBlur(
    startTimeRef,
    round?.timerSeconds ?? 30,
    round?.initialBlurPx ?? 16,
    phase !== "playing",
  );

  const loadRound = useCallback(async () => {
    setPhase("loading");
    setGuessed(null);
    setTimedOut(false);
    setScoreBreakdown(null);
    setError(null);
    try {
      const newRound = await fetchRound(difficulty);
      setRound(newRound);
      startTimeRef.current = Date.now();
      setPhase("playing");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load round");
      setPhase("loading");
    }
  }, [difficulty]);

  useEffect(() => { loadRound(); }, [loadRound]);

  const triggerEffect = useCallback((kind: FlashKind, score: number) => {
    const key = Date.now();
    setGuessEffect({ kind, score, key });
    setTimeout(() => setGuessEffect(null), 1200);
  }, []);

  // Auto-timeout when progress reaches 1.0
  useEffect(() => {
    if (phase === "playing" && progress >= 1) {
      const breakdown = calculateScore(false, 1, stats.currentStreak, difficulty);
      setTimedOut(true);
      setGuessed(null);
      setScoreBreakdown(breakdown);
      setPhase("revealed");
      triggerEffect("timeout", 0);

      if (round) {
        const newStats = saveResult({
          movieId: round.correctId,
          title: round.correctTitle,
          correct: false,
          score: 0,
          difficulty,
          timestamp: new Date().toISOString(),
        });
        setStats(newStats);
      }
    }
  }, [phase, progress, round, stats.currentStreak, difficulty, triggerEffect]);

  const handleGuess = useCallback(
    (id: number) => {
      if (!round || phase !== "playing") return;
      const correct = id === round.correctId;
      const breakdown = calculateScore(correct, progress, stats.currentStreak, difficulty);

      setGuessed(id);
      setScoreBreakdown(breakdown);
      setPhase("revealed");
      triggerEffect(correct ? "correct" : "wrong", breakdown.total);

      const newStats = saveResult({
        movieId: round.correctId,
        title: round.correctTitle,
        correct,
        score: breakdown.total,
        difficulty,
        timestamp: new Date().toISOString(),
      });
      setStats(newStats);
    },
    [round, phase, stats.currentStreak, difficulty, progress, triggerEffect]
  );

  const flashBg =
    guessEffect?.kind === "correct" ? "bg-emerald-500" :
    guessEffect?.kind === "wrong"   ? "bg-red-500"     : "bg-amber-500";

  return (
    <div className="flex flex-col min-h-[100svh] bg-[var(--bg)]">
      <ScoreDisplay streak={stats.currentStreak} score={stats.totalScore} difficulty={difficulty} />

      {/* ── Screen-level guess feedback ────────────────────────────────── */}
      {guessEffect && (
        <>
          {/* Full-viewport color flash */}
          <div
            key={`flash-${guessEffect.key}`}
            className={`fixed inset-0 z-60 pointer-events-none animate-screen-flash ${flashBg}`}
            aria-hidden="true"
          />

          {/* Floating score (correct only) */}
          {guessEffect.kind === "correct" && guessEffect.score > 0 && (
            <div
              key={`score-${guessEffect.key}`}
              className="fixed inset-0 z-60 pointer-events-none flex items-center justify-center"
              aria-hidden="true"
            >
              <span
                className="animate-score-rise font-black text-5xl text-white select-none"
                style={{ textShadow: "0 0 32px rgba(52,211,153,0.9), 0 2px 8px rgba(0,0,0,0.6)" }}
              >
                +{guessEffect.score.toLocaleString()}
              </span>
            </div>
          )}

          {/* ✕ icon (wrong only) */}
          {guessEffect.kind === "wrong" && (
            <div
              key={`x-${guessEffect.key}`}
              className="fixed inset-0 z-60 pointer-events-none flex items-center justify-center"
              aria-hidden="true"
            >
              <span
                className="animate-wrong-x-pop text-7xl select-none"
                style={{ filter: "drop-shadow(0 0 24px rgba(239,68,68,0.9))" }}
              >
                ✕
              </span>
            </div>
          )}
        </>
      )}

      <main className="flex flex-col flex-1 w-full max-w-xl mx-auto px-4 py-4 gap-4" aria-label="Game board">
        {error && (
          <div role="alert" className="bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm text-center">
            {error}{" "}
            <button onClick={loadRound} className="underline ml-1 hover:no-underline focus:outline-none">
              Try again
            </button>
          </div>
        )}

        {phase === "loading" && !error && (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 text-white/30" aria-live="polite">
            <div className="w-7 h-7 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <span className="text-sm">Loading…</span>
          </div>
        )}

        {phase !== "loading" && round && (
          <>
            <section aria-labelledby="poster-heading">
              <h1 id="poster-heading" className="sr-only">Movie still — guess which movie this is</h1>

              <div className="rounded-2xl overflow-hidden">
                <PosterViewer
                  backdropPath={round.backdropPath}
                  currentBlurPx={currentBlurPx}
                  revealed={phase === "revealed"}
                  movieTitle={round.correctTitle}
                />
              </div>

              <div className="mt-2.5 px-1">
                <BlurTimer
                  progress={progress}
                  timerSeconds={round.timerSeconds}
                  stopped={phase === "revealed"}
                />
              </div>
            </section>

            <section aria-labelledby="choices-heading">
              <h2
                id="choices-heading"
                className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3 text-center"
              >
                Which movie is this?
              </h2>
              <ChoiceGrid
                choices={round.choices}
                correctId={round.correctId}
                guessed={guessed}
                onGuess={handleGuess}
              />
            </section>
          </>
        )}
      </main>

      {phase === "revealed" && round && scoreBreakdown && (
        <ResultModal
          correct={!timedOut && guessed === round.correctId}
          correctTitle={round.correctTitle}
          correctYear={round.correctYear}
          genres={round.genres}
          score={scoreBreakdown}
          streak={stats.currentStreak}
          difficulty={difficulty}
          timedOut={timedOut}
          backdropPath={round.backdropPath}
          onNext={loadRound}
        />
      )}
    </div>
  );
}
