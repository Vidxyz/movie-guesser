"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { loadStats, clearStats } from "@/lib/localStorage";
import { getDifficultyLabel, getDifficultyColor } from "@/lib/gameLogic";
import type { GameStats } from "@moviguessr/shared";

export default function StatsPage() {
  const [stats, setStats] = useState<GameStats | null>(null);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const handleClear = () => {
    if (confirm("Reset all stats? This cannot be undone.")) {
      clearStats();
      setStats(loadStats());
    }
  };

  if (!stats) return null;

  const accuracy =
    stats.totalGames > 0
      ? Math.round((stats.correctAnswers / stats.totalGames) * 100)
      : 0;

  return (
    <div className="min-h-[100svh] bg-[#f8f9fb]">
      <Nav />

      <main className="max-w-lg mx-auto px-4 py-8" aria-label="Your stats">
        <h1 className="text-2xl font-bold text-[#0f172a] mb-1">Your Stats</h1>
        <p className="text-[#64748b] text-sm mb-6">All data is stored locally in your browser.</p>

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
              className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-3"
            >
              Recent rounds
            </h2>
            <ul className="space-y-2">
              {stats.history.slice(0, 20).map((result, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-[#e4e7ed] shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                        result.correct
                          ? "bg-[#d1fae5] text-[#059669]"
                          : "bg-[#fee2e2] text-[#dc2626]"
                      }`}
                      aria-hidden="true"
                    >
                      {result.correct ? "✓" : "✕"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#0f172a] truncate max-w-[120px]">
                          {result.title}
                        </span>
                        {result.difficulty && (
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${getDifficultyColor(result.difficulty)}`}>
                            {getDifficultyLabel(result.difficulty)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`font-bold text-sm ${
                        result.correct ? "text-[#059669]" : "text-[#94a3b8]"
                      }`}
                    >
                      {result.correct ? `+${result.score}` : "—"}
                    </span>
                    <p className="text-xs text-[#94a3b8] mt-0.5">
                      {new Date(result.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {stats.totalGames === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3" aria-hidden="true">🎬</div>
            <p className="text-[#64748b] text-sm">No games played yet.</p>
            <Link
              href="/play"
              className="inline-block mt-3 text-[var(--accent)] font-semibold text-sm hover:underline"
            >
              Play your first round →
            </Link>
          </div>
        )}

        {stats.totalGames > 0 && (
          <button
            onClick={handleClear}
            className="w-full py-2.5 rounded-xl border border-[#e4e7ed] text-[#94a3b8] text-sm hover:border-red-300 hover:text-red-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            Reset all stats
          </button>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
  sub,
}: {
  label: string;
  value: string | number;
  icon?: string;
  accent?: boolean;
  sub?: string;
}) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        accent
          ? "bg-[var(--accent-light)] border-[var(--accent-border)]"
          : "bg-white border-[#e4e7ed] shadow-sm"
      }`}
    >
      <p className={`text-xs font-medium mb-1.5 ${accent ? "text-[var(--accent-deep)]" : "text-[#94a3b8]"}`}>
        {label}
      </p>
      <p className={`text-2xl font-bold tabular-nums ${accent ? "text-[var(--accent-dark)]" : "text-[#0f172a]"}`}>
        {icon && (
          <span aria-hidden="true" className="mr-1 text-xl">
            {icon}
          </span>
        )}
        {value}
      </p>
      {sub && (
        <p className="text-[10px] text-[#94a3b8] mt-1">{sub}</p>
      )}
    </div>
  );
}
