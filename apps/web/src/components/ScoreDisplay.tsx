"use client";

import Link from "next/link";
import type { Difficulty } from "@moviguessr/shared";
import { getDifficultyLabel, getDifficultyColor } from "@/lib/gameLogic";

interface ScoreDisplayProps {
  streak: number;
  score: number;
  difficulty: Difficulty;
}

export default function ScoreDisplay({ streak, score, difficulty }: ScoreDisplayProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 bg-white border-b border-[#e4e7ed] shadow-sm">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          aria-label="Exit game and go to home"
          title="Exit game"
          className="flex items-center gap-1 text-[#94a3b8] hover:text-[#64748b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded px-1 py-1"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          <span className="text-xs font-medium">Exit</span>
        </Link>
        <Link
          href="/"
          className="flex items-baseline gap-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
          aria-label="moviguessr — home"
          tabIndex={-1}
        >
          <span className="text-[var(--accent)] font-bold text-lg tracking-tight">movi</span>
          <span className="text-[#0f172a] font-bold text-lg tracking-tight">guessr</span>
        </Link>
      </div>

      <div className="flex items-center gap-2.5" aria-live="polite" aria-atomic="true">
        <span
          className={`hidden sm:inline-flex text-xs font-semibold px-2 py-0.5 rounded-full border ${getDifficultyColor(difficulty)}`}
          title="Current difficulty"
        >
          {getDifficultyLabel(difficulty)}
        </span>

        {streak > 0 && (
          <div
            className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full text-sm font-semibold"
            title="Current streak"
          >
            <span aria-hidden="true">🔥</span>
            <span className="tabular-nums">{streak}</span>
            <span className="sr-only">streak</span>
          </div>
        )}

        <div
          className="flex items-center gap-1 bg-[var(--accent-light)] text-[var(--accent-dark)] px-3 py-1 rounded-full text-sm font-bold"
          title="Total score"
        >
          <span className="tabular-nums">{score.toLocaleString()}</span>
          <span className="text-[var(--accent-muted)] text-xs font-semibold">pts</span>
          <span className="sr-only">points</span>
        </div>

        <Link
          href="/stats"
          className="text-sm text-[#64748b] hover:text-[#0f172a] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded px-1"
          aria-label="View your stats"
        >
          Stats
        </Link>
      </div>
    </header>
  );
}
