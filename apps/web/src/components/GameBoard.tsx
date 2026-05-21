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

export default function GameBoard() {
  const [phase, setPhase]           = useState<GamePhase>("loading");
  const [round, setRound]           = useState<Round | null>(null);
  const [guessed, setGuessed]       = useState<number | null>(null);
  const [timedOut, setTimedOut]     = useState(false);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);
  const [stats, setStats]           = useState<GameStats>(() => loadStats());
  const [error, setError]           = useState<string | null>(null);
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

  // Auto-timeout when progress reaches 1.0
  useEffect(() => {
    if (phase === "playing" && progress >= 1) {
      const breakdown = calculateScore(false, 1, stats.currentStreak, difficulty);
      setTimedOut(true);
      setGuessed(null);
      setScoreBreakdown(breakdown);
      setPhase("revealed");

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
  }, [phase, progress, round, stats.currentStreak, difficulty]);

  const handleGuess = useCallback(
    (id: number) => {
      if (!round || phase !== "playing") return;
      const correct = id === round.correctId;
      const breakdown = calculateScore(correct, progress, stats.currentStreak, difficulty);

      setGuessed(id);
      setScoreBreakdown(breakdown);
      setPhase("revealed");

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
    [round, phase, stats.currentStreak, difficulty, progress]
  );

  return (
    <div className="flex flex-col min-h-[100svh] bg-[#f8f9fb]">
      <ScoreDisplay streak={stats.currentStreak} score={stats.totalScore} difficulty={difficulty} />

      <main className="flex flex-col flex-1 w-full max-w-xl mx-auto px-4 py-5 gap-4" aria-label="Game board">
        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm text-center">
            {error}{" "}
            <button onClick={loadRound} className="underline ml-1 hover:no-underline focus:outline-none">
              Try again
            </button>
          </div>
        )}

        {phase === "loading" && !error && (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 text-[#94a3b8]" aria-live="polite">
            <div className="w-7 h-7 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <span className="text-sm">Loading poster…</span>
          </div>
        )}

        {phase !== "loading" && round && (
          <>
            <section aria-labelledby="poster-heading">
              <h1 id="poster-heading" className="sr-only">Movie poster — guess which movie this is</h1>

              <div className="bg-white rounded-2xl border border-[#e4e7ed] shadow-sm overflow-hidden">
                <div className="p-3">
                  <PosterViewer
                    backdropPath={round.backdropPath}
                    currentBlurPx={currentBlurPx}
                    revealed={phase === "revealed"}
                    movieTitle={round.correctTitle}
                  />
                </div>

                <div className="px-3 pt-1 pb-3 border-t border-[#f1f3f7]">
                  <BlurTimer
                    progress={progress}
                    timerSeconds={round.timerSeconds}
                    stopped={phase === "revealed"}
                  />
                </div>
              </div>
            </section>

            <section aria-labelledby="choices-heading">
              <h2
                id="choices-heading"
                className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-3 text-center"
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
