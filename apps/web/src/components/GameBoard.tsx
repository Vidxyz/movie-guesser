"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Round, GameStats, GameMode } from "@moviguessr/shared";
import { fetchRound } from "@/lib/api";
import { calculateScore, getClassicDifficulty, BLUR_CONFIG, type ScoreBreakdown } from "@/lib/gameLogic";
import { loadStats, saveResult, saveClassicRun } from "@/lib/localStorage";
import { loadSettings } from "@/lib/settings";
import { useBlur } from "@/lib/useBlur";
import PosterViewer from "./PosterViewer";
import ChoiceGrid from "./ChoiceGrid";
import ScoreDisplay from "./ScoreDisplay";
import ResultModal from "./ResultModal";
import BlurTimer from "./BlurTimer";
import VictoryModal from "./VictoryModal";

type GamePhase = "loading" | "playing" | "revealed" | "victory";
type FlashKind  = "correct" | "wrong" | "timeout";

interface GuessEffect {
  kind: FlashKind;
  score: number;
  key: number;
}

interface GameBoardProps {
  mode: GameMode;
}

const CLASSIC_TOTAL = 20;

export default function GameBoard({ mode }: GameBoardProps) {
  const router = useRouter();

  // Common state
  const [phase, setPhase]           = useState<GamePhase>("loading");
  const [round, setRound]           = useState<Round | null>(null);
  const [roundKey, setRoundKey]     = useState(0);
  const [guessed, setGuessed]       = useState<number | null>(null);
  const [timedOut, setTimedOut]     = useState(false);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);
  const [stats, setStats]           = useState<GameStats>(() => loadStats());
  const [error, setError]           = useState<string | null>(null);
  const [guessEffect, setGuessEffect] = useState<GuessEffect | null>(null);
  const startTimeRef = useRef<number>(0);

  // Classic-mode state
  const [questionNum, setQuestionNum]     = useState(1);
  const [classicScore, setClassicScore]   = useState(0);
  const [classicCorrect, setClassicCorrect] = useState(0);
  const [lastBlurPx, setLastBlurPx]       = useState(0);
  // Ref keeps questionNum readable synchronously in loadRound without making it a dep.
  const questionNumRef = useRef(1);

  // Difficulty: auto in classic, user-chosen in infinite
  const infiniteDifficulty = loadSettings().difficulty;
  const difficulty = mode === "classic"
    ? getClassicDifficulty(questionNum)
    : infiniteDifficulty;

  const { initialBlurPx, easingExponent } = BLUR_CONFIG[difficulty];

  const { currentBlurPx, progress } = useBlur(
    startTimeRef,
    round?.timerSeconds ?? 30,
    initialBlurPx,
    phase !== "playing",
    roundKey,
    easingExponent,
  );

  const loadRound = useCallback(async () => {
    setPhase("loading");
    setGuessed(null);
    setTimedOut(false);
    setScoreBreakdown(null);
    setError(null);
    try {
      // Read questionNum from ref so this callback never stales on questionNum state.
      const d = mode === "classic" ? getClassicDifficulty(questionNumRef.current) : infiniteDifficulty;
      const newRound = await fetchRound(d);
      setRound(newRound);
      startTimeRef.current = Date.now();
      setRoundKey(k => k + 1);
      setPhase("playing");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load round");
      setPhase("loading");
    }
  }, [mode, infiniteDifficulty]);  // questionNum intentionally excluded — read via ref

  // Load on initial mount only. All subsequent loads are driven by explicit handleNext /
  // handleReplay calls, which update questionNumRef before calling loadRound().
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadRound(); }, []);

  const triggerEffect = useCallback((kind: FlashKind, score: number) => {
    const key = Date.now();
    setGuessEffect({ kind, score, key });
    setTimeout(() => setGuessEffect(null), 1200);
  }, []);

  // Auto-timeout when progress reaches 1.0
  useEffect(() => {
    if (phase === "playing" && progress >= 1) {
      if (Date.now() - startTimeRef.current < 500) return;

      const breakdown = calculateScore(false, 1, stats.currentStreak, difficulty);
      setLastBlurPx(currentBlurPx);
      setTimedOut(true);
      setGuessed(null);
      setScoreBreakdown(breakdown);
      triggerEffect("timeout", 0);

      if (mode === "classic") {
        if (questionNum >= CLASSIC_TOTAL) {
          // Save run then go to victory
          const run = { totalScore: classicScore, correctAnswers: classicCorrect, timestamp: new Date().toISOString() };
          saveClassicRun(run);
          setPhase("victory");
        } else {
          setPhase("revealed");
        }
      } else {
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
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, progress]);

  const handleGuess = useCallback(
    (id: number) => {
      if (!round || phase !== "playing") return;
      const correct = id === round.correctId;
      const breakdown = calculateScore(correct, progress, stats.currentStreak, difficulty);

      setGuessed(id);
      setLastBlurPx(currentBlurPx);
      setScoreBreakdown(breakdown);
      triggerEffect(correct ? "correct" : "wrong", breakdown.total);

      if (mode === "classic") {
        const newClassicScore   = classicScore + breakdown.total;
        const newClassicCorrect = classicCorrect + (correct ? 1 : 0);
        setClassicScore(newClassicScore);
        setClassicCorrect(newClassicCorrect);

        if (questionNum >= CLASSIC_TOTAL) {
          const run = { totalScore: newClassicScore, correctAnswers: newClassicCorrect, timestamp: new Date().toISOString() };
          saveClassicRun(run);
          setPhase("victory");
        } else {
          setPhase("revealed");
        }
      } else {
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
      }
    },
    [round, phase, stats.currentStreak, difficulty, progress, currentBlurPx, triggerEffect, mode, classicScore, classicCorrect, questionNum]
  );

  const handleNext = useCallback(() => {
    if (mode === "classic") {
      // Update ref synchronously so loadRound reads the correct next question number.
      const nextQ = questionNumRef.current + 1;
      questionNumRef.current = nextQ;
      setQuestionNum(nextQ);
    }
    loadRound();
  }, [mode, loadRound]);

  // replace() removes the game board from the history stack so the Nav's router.back()
  // doesn't return to an in-progress round.
  const handleEnd = useCallback(() => router.replace(mode === "classic" ? "/play" : "/stats"), [router, mode]);

  const handleReplay = useCallback(() => {
    questionNumRef.current = 1;
    setQuestionNum(1);
    setClassicScore(0);
    setClassicCorrect(0);
    loadRound();
  }, [loadRound]);

  const flashBg =
    guessEffect?.kind === "correct" ? "bg-emerald-500" :
    guessEffect?.kind === "wrong"   ? "bg-red-500"     : "bg-amber-500";

  return (
    <div className="flex flex-col min-h-[100svh] bg-[var(--bg)]">
      {/* Disable all header interactions during victory so no link can push the game into history */}
      <div className={phase === "victory" ? "pointer-events-none" : ""}>
        <ScoreDisplay
          streak={stats.currentStreak}
          score={mode === "classic" ? classicScore : stats.totalScore}
          difficulty={difficulty}
          mode={mode}
          questionNum={questionNum}
          totalQuestions={CLASSIC_TOTAL}
        />
      </div>

      {/* ── Screen-level guess feedback ────────────────────────────────── */}
      {guessEffect && (
        <>
          <div
            key={`flash-${guessEffect.key}`}
            className={`fixed inset-0 z-60 pointer-events-none animate-screen-flash ${flashBg}`}
            aria-hidden="true"
          />

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

        {(phase === "playing" || phase === "revealed") && round && (
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
          onNext={handleNext}
          onEnd={handleEnd}
          mode={mode}
          questionNum={questionNum}
          totalQuestions={CLASSIC_TOTAL}
        />
      )}

      {phase === "victory" && round && (
        <VictoryModal
          finalScore={classicScore}
          correctAnswers={classicCorrect}
          lastBackdropPath={round.backdropPath}
          lastBlurPx={lastBlurPx}
          onPlayAgain={handleReplay}
          onHome={() => router.replace("/play")}
        />
      )}
    </div>
  );
}
