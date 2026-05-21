"use client";

import { useEffect, useRef, useState } from "react";
import type { Difficulty, GameMode } from "@moviguessr/shared";
import { GENRE_MAP } from "@moviguessr/shared";
import type { ScoreBreakdown } from "@/lib/gameLogic";
import { getDifficultyLabel } from "@/lib/gameLogic";
import { shareResult } from "@/lib/share";

interface ResultModalProps {
  correct: boolean;
  correctTitle: string;
  correctYear: number;
  genres: number[];
  score: ScoreBreakdown;
  streak: number;
  difficulty: Difficulty;
  timedOut: boolean;
  backdropPath: string;
  onNext: () => void;
  onEnd: () => void;
  mode?: GameMode;
  questionNum?: number;
  totalQuestions?: number;
}

const TMDB_BASE = "https://image.tmdb.org/t/p/w1280";

const DIFF_COLORS: Record<Difficulty, string> = {
  easy:   "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  medium: "text-amber-400   bg-amber-500/15   border-amber-500/30",
  hard:   "text-rose-400    bg-rose-500/15    border-rose-500/30",
};

export default function ResultModal({
  correct,
  correctTitle,
  correctYear,
  genres,
  score,
  streak,
  difficulty,
  timedOut,
  backdropPath,
  onNext,
  onEnd,
  mode,
  questionNum,
  totalQuestions = 20,
}: ResultModalProps) {
  const isClassic = mode === "classic";
  const btnRef = useRef<HTMLButtonElement>(null);
  const [shareLabel, setShareLabel] = useState<"Share" | "Shared!" | "Copied!">("Share");

  useEffect(() => {
    const id = setTimeout(() => btnRef.current?.focus(), 80);
    return () => clearTimeout(id);
  }, []);

  async function handleShare() {
    const outcome = await shareResult({ correct, correctTitle, correctYear, genres, score, streak, difficulty });
    setShareLabel(outcome === "shared" ? "Shared!" : "Copied!");
    setTimeout(() => setShareLabel("Share"), 2000);
  }

  const genre = GENRE_MAP[genres[0]] ?? "Movie";

  const statusColor = timedOut ? "bg-amber-500" : correct ? "bg-emerald-500" : "bg-red-500";
  const headingText = timedOut ? "Time's up!" : correct ? "Correct!" : "Not quite";
  const headingColor = timedOut ? "text-amber-400" : correct ? "text-emerald-400" : "text-red-400";
  const subText = timedOut
    ? "The poster fully revealed — you ran out of time"
    : correct
    ? isClassic && questionNum ? `Q${questionNum}/${totalQuestions} · You spotted it in time!` : "You spotted it in time!"
    : isClassic && questionNum ? `Q${questionNum}/${totalQuestions} · Better luck next time` : "Better luck next time";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-heading"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70"
    >
      <div
        className="animate-slide-up w-full max-w-sm rounded-2xl overflow-hidden border border-white/10"
        style={{ background: "rgba(7,11,20,0.97)" }}
      >
        {/* Fully unblurred backdrop reveal */}
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${TMDB_BASE}${backdropPath}`}
            alt={correctTitle}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
            <p className="text-white font-bold text-sm truncate leading-tight">{correctTitle}</p>
            <p className="text-white/50 text-xs mt-0.5">{genre} · {correctYear}</p>
          </div>
        </div>

        {/* Status strip */}
        <div className={`h-0.5 ${statusColor}`} />

        <div className="p-5">
          {/* Heading */}
          <div className="flex items-center gap-3 mb-5">
            <div>
              <h2 id="result-heading" className={`text-lg font-bold ${headingColor}`}>
                {headingText}
              </h2>
              <p className="text-white/40 text-xs mt-0.5">{subText}</p>
            </div>
            {streak >= 3 && correct && (
              <div className="ml-auto flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-full px-3 py-1">
                <span aria-hidden="true" className="text-sm">🔥</span>
                <span className="text-xs font-bold">{streak} streak</span>
              </div>
            )}
          </div>

          {/* Score breakdown */}
          {correct && (
            <div className="rounded-xl overflow-hidden border border-white/8 mb-4 text-sm">
              <div className="flex justify-between items-center px-4 py-2.5 bg-white/3">
                <span className="text-white/50 text-xs">Base</span>
                <span className="font-semibold text-white text-xs">+{score.base}</span>
              </div>
              {score.speedBonus > 0 && (
                <div className="flex justify-between items-center px-4 py-2.5 bg-white/3 border-t border-white/5">
                  <span className="text-white/50 text-xs">Speed bonus</span>
                  <span className="font-semibold text-emerald-400 text-xs">+{score.speedBonus}</span>
                </div>
              )}
              {score.streakMultiplier > 1 && (
                <div className="flex justify-between items-center px-4 py-2.5 bg-white/3 border-t border-white/5">
                  <span className="text-white/50 text-xs">Streak ×{score.streakMultiplier}</span>
                  <span className="font-semibold text-[var(--accent-deep)] text-xs">×{score.streakMultiplier}</span>
                </div>
              )}
              {score.difficultyMultiplier !== 1 && (
                <div className="flex justify-between items-center px-4 py-2.5 bg-white/3 border-t border-white/5">
                  <span className="text-white/50 text-xs flex items-center gap-1.5">
                    {getDifficultyLabel(difficulty)} mode
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${DIFF_COLORS[difficulty]}`}>
                      ×{score.difficultyMultiplier}
                    </span>
                  </span>
                  <span className={`font-semibold text-xs ${score.difficultyMultiplier > 1 ? "text-rose-400" : "text-white/40"}`}>
                    ×{score.difficultyMultiplier}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center px-4 py-3 bg-[var(--accent-light)] border-t border-[var(--accent-border)]">
                <span className="font-bold text-[var(--accent-deep)] text-sm">Total</span>
                <span className="font-bold text-[var(--accent-deep)] text-base tabular-nums">+{score.total}</span>
              </div>
            </div>
          )}

          {!correct && (
            <div className="rounded-xl border border-white/8 px-4 py-3 mb-4 bg-white/3">
              <p className="text-white/30 text-xs text-center">No points this round</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2.5">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-white/70 font-semibold text-sm hover:bg-white/10 hover:text-white active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              {shareLabel}
            </button>
            <button
              ref={btnRef}
              onClick={onNext}
              className="flex-[2] py-3 rounded-xl bg-[var(--accent)] text-white font-bold text-sm tracking-wide hover:bg-[var(--accent-dark)] active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
              style={{ boxShadow: "0 0 20px var(--accent-glow)" }}
            >
              {isClassic ? "Next question →" : "Next round →"}
            </button>
          </div>

          <button
            onClick={onEnd}
            className="w-full mt-3 py-2.5 rounded-xl border border-white/10 text-xs font-medium text-white/40 hover:bg-white/5 hover:text-white/70 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            End game
          </button>
        </div>
      </div>
    </div>
  );
}
