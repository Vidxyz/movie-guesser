"use client";

import Link from "next/link";
import type { Difficulty } from "@moviguessr/shared";
import { getDifficultyLabel } from "@/lib/gameLogic";

interface ScoreDisplayProps {
  streak: number;
  score: number;
  difficulty: Difficulty;
}

const DIFF_COLORS: Record<Difficulty, string> = {
  easy:   "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  medium: "text-amber-400   bg-amber-500/15   border-amber-500/30",
  hard:   "text-rose-400    bg-rose-500/15    border-rose-500/30",
};

export default function ScoreDisplay({ streak, score, difficulty }: ScoreDisplayProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 bg-[var(--bg)]/90 backdrop-blur-md border-b border-white/8">
      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          aria-label="Exit game"
          title="Exit game"
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded px-1 py-1 text-xs font-medium"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Exit
        </Link>
        <div className="w-px h-4 bg-white/10" aria-hidden="true" />
        <Link
          href="/"
          className="flex items-baseline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
          aria-label="moviguessr — home"
          tabIndex={-1}
        >
          <span className="text-[var(--accent)] font-bold text-lg tracking-tight">movi</span>
          <span className="text-white font-bold text-lg tracking-tight">guessr</span>
        </Link>
      </div>

      <div className="flex items-center gap-2" aria-live="polite" aria-atomic="true">
        <span
          className={`hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${DIFF_COLORS[difficulty]}`}
          title="Current difficulty"
        >
          {getDifficultyLabel(difficulty)}
        </span>

        {streak > 0 && (
          <div
            className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full text-sm font-semibold"
            title="Current streak"
          >
            <span aria-hidden="true">🔥</span>
            <span className="tabular-nums text-xs">{streak}</span>
            <span className="sr-only">streak</span>
          </div>
        )}

        <div
          className="flex items-center gap-1 bg-[var(--accent-light)] border border-[var(--accent-border)] text-[var(--accent-deep)] px-3 py-1 rounded-full text-sm font-bold"
          title="Total score"
        >
          <span className="tabular-nums text-xs">{score.toLocaleString()}</span>
          <span className="text-[var(--accent-muted)] text-[10px] font-semibold">pts</span>
          <span className="sr-only">points</span>
        </div>

        <Link
          href="/stats"
          className="text-xs text-white/40 hover:text-white/70 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded px-1"
          aria-label="View your stats"
        >
          Stats
        </Link>
      </div>
    </header>
  );
}
