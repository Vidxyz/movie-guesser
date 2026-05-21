"use client";

import { useEffect, useRef, useState } from "react";
import type { Difficulty } from "@moviguessr/shared";
import { GENRE_MAP } from "@moviguessr/shared";
import type { ScoreBreakdown } from "@/lib/gameLogic";
import { getDifficultyLabel, getDifficultyColor } from "@/lib/gameLogic";
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
}

const TMDB_BASE = "https://image.tmdb.org/t/p/w1280";

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
}: ResultModalProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [shareLabel, setShareLabel] = useState<"Share" | "Shared!" | "Copied!">("Share");

  useEffect(() => {
    const id = setTimeout(() => btnRef.current?.focus(), 80);
    return () => clearTimeout(id);
  }, []);

  async function handleShare() {
    const outcome = await shareResult({
      correct,
      correctTitle,
      correctYear,
      genres,
      score,
      streak,
      difficulty,
    });
    setShareLabel(outcome === "shared" ? "Shared!" : "Copied!");
    setTimeout(() => setShareLabel("Share"), 2000);
  }

  const genre = GENRE_MAP[genres[0]] ?? "Movie";

  const headingText = timedOut ? "Time's up!" : correct ? "Nice one!" : "Not quite";
  const subText = timedOut
    ? "The poster fully revealed — you ran out of time"
    : correct
    ? "You spotted it in time!"
    : "Better luck next time";
  const emoji = timedOut ? "⏱️" : correct ? "🎯" : "📽️";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-heading"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-[#0f172a]/40 backdrop-blur-sm"
    >
      <div className="animate-fade-up w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* fully unblurred backdrop reveal */}
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${TMDB_BASE}${backdropPath}`}
            alt={correctTitle}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <p className="absolute bottom-2 left-3 right-3 text-white font-bold text-sm drop-shadow-sm truncate">
            {correctTitle} <span className="font-normal opacity-70">({correctYear})</span>
          </p>
        </div>

        <div className={`h-1.5 ${correct ? "bg-[#059669]" : timedOut ? "bg-[#f59e0b]" : "bg-[#dc2626]"}`} />

        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                correct ? "bg-[#ecfdf5]" : timedOut ? "bg-[#fffbeb]" : "bg-[#fef2f2]"
              }`}
              aria-hidden="true"
            >
              {emoji}
            </div>
            <div>
              <h2
                id="result-heading"
                className={`text-lg font-bold ${correct ? "text-[#065f46]" : timedOut ? "text-amber-700" : "text-[#991b1b]"}`}
              >
                {headingText}
              </h2>
              <p className="text-[#64748b] text-sm mt-0.5">{subText}</p>
            </div>
          </div>

          {/* movie card */}
          <div className="bg-[#f8f9fb] border border-[#e4e7ed] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#0f172a] text-sm">{correctTitle}</p>
                <p className="text-[#64748b] text-xs mt-0.5">{genre} · {correctYear}</p>
              </div>
              <span className="text-2xl" aria-hidden="true">🎬</span>
            </div>
          </div>

          {/* score breakdown */}
          {correct && (
            <div className="border border-[#e4e7ed] rounded-xl overflow-hidden mb-4 text-sm">
              <div className="flex justify-between items-center px-4 py-2.5 bg-white">
                <span className="text-[#64748b]">Base</span>
                <span className="font-semibold text-[#0f172a]">+{score.base}</span>
              </div>
              {score.speedBonus > 0 && (
                <div className="flex justify-between items-center px-4 py-2.5 bg-white border-t border-[#f1f3f7]">
                  <span className="text-[#64748b]">Speed bonus</span>
                  <span className="font-semibold text-[#059669]">+{score.speedBonus}</span>
                </div>
              )}
              {score.streakMultiplier > 1 && (
                <div className="flex justify-between items-center px-4 py-2.5 bg-white border-t border-[#f1f3f7]">
                  <span className="text-[#64748b]">Streak ×{score.streakMultiplier}</span>
                  <span className="font-semibold text-[var(--accent)]">×{score.streakMultiplier}</span>
                </div>
              )}
              {score.difficultyMultiplier !== 1 && (
                <div className="flex justify-between items-center px-4 py-2.5 bg-white border-t border-[#f1f3f7]">
                  <span className="text-[#64748b]">
                    {getDifficultyLabel(difficulty)} mode
                    <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full border font-medium ${getDifficultyColor(difficulty)}`}>
                      ×{score.difficultyMultiplier}
                    </span>
                  </span>
                  <span className={`font-semibold ${score.difficultyMultiplier > 1 ? "text-rose-500" : "text-[#94a3b8]"}`}>
                    ×{score.difficultyMultiplier}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center px-4 py-2.5 bg-[var(--accent-light)] border-t border-[var(--accent-border)]">
                <span className="font-bold text-[var(--accent-deep)]">Total</span>
                <span className="font-bold text-[var(--accent-dark)]">+{score.total}</span>
              </div>
            </div>
          )}

          {streak >= 3 && correct && (
            <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4">
              <span aria-hidden="true">🔥</span>
              <span className="text-amber-800 font-semibold text-sm">{streak} in a row!</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 flex-1 py-3 rounded-xl border border-[#e4e7ed] bg-white text-[#374151] font-semibold text-sm hover:bg-[#f1f3f7] active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              {shareLabel}
            </button>
            <button
              ref={btnRef}
              onClick={onNext}
              className="flex-[2] py-3 rounded-xl bg-[var(--accent)] text-white font-bold text-sm tracking-wide hover:bg-[var(--accent-dark)] active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
            >
              Next round →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
