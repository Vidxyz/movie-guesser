"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { loadStats, clearStats } from "@/lib/localStorage";
import { getDifficultyLabel } from "@/lib/gameLogic";
import type { GameStats, Difficulty } from "@moviguessr/shared";

const DIFF_COLORS: Record<Difficulty, string> = {
  easy:   "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  medium: "text-amber-400   bg-amber-500/15   border-amber-500/30",
  hard:   "text-rose-400    bg-rose-500/15    border-rose-500/30",
};

export default function StatsPage() {
  const [stats, setStats] = useState<GameStats | null>(null);

  useEffect(() => { setStats(loadStats()); }, []);

  const handleClear = () => {
    if (confirm("Reset all stats? This cannot be undone.")) {
      clearStats();
      setStats(loadStats());
    }
  };

  if (!stats) return null;

  const accuracy = stats.totalGames > 0
    ? Math.round((stats.correctAnswers / stats.totalGames) * 100)
    : 0;

  return (
    <div className="min-h-[100svh] bg-[var(--bg)]">
      <Nav />

      <main className="max-w-lg mx-auto px-4 py-8" aria-label="Your stats">
        <h1 className="text-2xl font-bold text-white mb-1">Your Stats</h1>
        <p className="text-white/30 text-sm mb-6">All data is stored locally in your browser.</p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <StatCard label="Total games"   value={stats.totalGames} />
          <StatCard label="Correct"       value={stats.correctAnswers} />
          <StatCard label="Accuracy"      value={`${accuracy}%`} accent={accuracy >= 60} />
          <StatCard label="Total score"   value={stats.totalScore.toLocaleString()} accent />
          <StatCard
            label="Best streak"
            value={stats.bestStreak}
            icon="🔥"
            sub={stats.bestStreak > 0 ? `on ${getDifficultyLabel(stats.bestStreakDifficulty)}` : undefined}
          />
          <StatCard
            label="Current streak"
            value={stats.currentStreak}
            icon={stats.currentStreak > 0 ? "🔥" : undefined}
            sub={stats.currentStreak > 0 ? `on ${getDifficultyLabel(stats.currentDifficulty)}` : undefined}
          />
        </div>

        {stats.history.length > 0 && (
          <section aria-labelledby="history-heading" className="mb-8">
            <h2
              id="history-heading"
              className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3"
            >
              Recent rounds
            </h2>
            <ul className="space-y-2">
              {stats.history.slice(0, 20).map((result, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between bg-white/4 rounded-xl px-4 py-3 border border-white/8"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                        result.correct
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                      aria-hidden="true"
                    >
                      {result.correct ? "✓" : "✕"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white truncate max-w-[120px]">
                          {result.title}
                        </span>
                        {result.difficulty && (
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${DIFF_COLORS[result.difficulty]}`}>
                            {getDifficultyLabel(result.difficulty)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`font-bold text-sm ${result.correct ? "text-emerald-400" : "text-white/25"}`}>
                      {result.correct ? `+${result.score}` : "—"}
                    </span>
                    <p className="text-xs text-white/25 mt-0.5">
                      {new Date(result.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {stats.totalGames === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4" aria-hidden="true">🎬</div>
            <p className="text-white/30 text-sm">No games played yet.</p>
            <Link
              href="/play"
              className="inline-block mt-4 text-[var(--accent)] font-semibold text-sm hover:text-[var(--accent-deep)] transition-colors"
            >
              Play your first round →
            </Link>
          </div>
        )}

        {stats.totalGames > 0 && (
          <button
            onClick={handleClear}
            className="w-full py-2.5 rounded-xl border border-white/8 text-white/30 text-sm hover:border-red-500/40 hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Reset all stats
          </button>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label, value, icon, accent, sub,
}: {
  label: string; value: string | number; icon?: string; accent?: boolean; sub?: string;
}) {
  return (
    <div className={`rounded-xl p-4 border ${accent ? "bg-[var(--accent-light)] border-[var(--accent-border)]" : "bg-white/4 border-white/8"}`}>
      <p className={`text-xs font-medium mb-1.5 ${accent ? "text-[var(--accent-muted)]" : "text-white/30"}`}>
        {label}
      </p>
      <p className={`text-2xl font-bold tabular-nums ${accent ? "text-[var(--accent-deep)]" : "text-white"}`}>
        {icon && <span aria-hidden="true" className="mr-1 text-xl">{icon}</span>}
        {value}
      </p>
      {sub && <p className="text-[10px] text-white/25 mt-1">{sub}</p>}
    </div>
  );
}
