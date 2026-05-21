"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { loadStats, clearStats } from "@/lib/localStorage";
import { getDifficultyLabel } from "@/lib/gameLogic";
import type { GameStats, Difficulty, ClassicRun } from "@moviguessr/shared";

const DIFF_COLORS: Record<Difficulty, string> = {
  easy:   "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  medium: "text-amber-400   bg-amber-500/15   border-amber-500/30",
  hard:   "text-rose-400    bg-rose-500/15    border-rose-500/30",
};

function grade(correct: number): string {
  if (correct === 20) return "Perfect score";
  if (correct >= 18)  return "Cinema Maestro";
  if (correct >= 15)  return "Film Buff";
  if (correct >= 10)  return "Casual Viewer";
  return "Still learning";
}

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

  const infiniteAccuracy = stats.totalGames > 0
    ? Math.round((stats.correctAnswers / stats.totalGames) * 100)
    : 0;

  const hasClassic  = stats.classicBestScore > 0 || stats.classicHistory.length > 0;
  const hasInfinite = stats.totalGames > 0;
  const hasAny      = hasClassic || hasInfinite;

  return (
    <div className="min-h-[100svh] bg-[var(--bg)]">
      <Nav />

      <main className="max-w-lg mx-auto px-4 py-8" aria-label="Your stats">
        <h1 className="text-2xl font-bold text-white mb-1">Your Stats</h1>
        <p className="text-white/30 text-sm mb-6">All data is stored locally in your browser.</p>

        {/* ── Classic section ───────────────────────────────────────── */}
        <section aria-labelledby="classic-heading" className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span aria-hidden="true" className="text-lg">🏆</span>
            <h2 id="classic-heading" className="text-xs font-semibold text-amber-400/70 uppercase tracking-widest">
              Classic Mode
            </h2>
          </div>

          {hasClassic ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <StatCard
                  label="Best score"
                  value={stats.classicBestScore.toLocaleString()}
                  accent="amber"
                />
                <StatCard
                  label="Best run"
                  value={`${stats.classicBestCorrect}/20`}
                  sub={grade(stats.classicBestCorrect)}
                  accent="amber"
                />
              </div>

              {stats.classicHistory.length > 0 && (
                <>
                  <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
                    Recent runs
                  </h3>
                  <ul className="space-y-2">
                    {stats.classicHistory.slice(0, 10).map((run: ClassicRun, i: number) => (
                      <li
                        key={i}
                        className="flex items-center justify-between bg-white/4 rounded-xl px-4 py-3 border border-white/8"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 bg-amber-500/15 text-amber-400" aria-hidden="true">
                            🏆
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-white">{run.correctAnswers}/20 correct</p>
                            <p className="text-[10px] text-white/30 mt-0.5">{grade(run.correctAnswers)}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-sm text-amber-400">{run.totalScore.toLocaleString()} pts</p>
                          <p className="text-xs text-white/25 mt-0.5">
                            {new Date(run.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-white/8 bg-white/4 p-5 text-center">
              <p className="text-white/30 text-sm">No classic runs yet.</p>
              <Link
                href="/play/classic"
                className="inline-block mt-2 text-amber-400 font-semibold text-sm hover:text-amber-300 transition-colors"
              >
                Play Classic →
              </Link>
            </div>
          )}
        </section>

        {/* ── Infinite section ──────────────────────────────────────── */}
        <section aria-labelledby="infinite-heading" className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span aria-hidden="true" className="text-lg font-bold text-[var(--accent-deep)]">∞</span>
            <h2 id="infinite-heading" className="text-xs font-semibold text-[var(--accent-deep)]/70 uppercase tracking-widest">
              Infinite Mode
            </h2>
          </div>

          {hasInfinite ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <StatCard label="Total games"   value={stats.totalGames} />
                <StatCard label="Accuracy"      value={`${infiniteAccuracy}%`} accent={infiniteAccuracy >= 60 ? "indigo" : undefined} />
                <StatCard label="Total score"   value={stats.totalScore.toLocaleString()} accent="indigo" />
                <StatCard label="Current streak" value={stats.currentStreak} icon={stats.currentStreak > 0 ? "🔥" : undefined} />
              </div>

              {/* Per-difficulty best streaks */}
              <div className="rounded-xl border border-white/8 bg-white/4 px-4 py-3.5 mb-5">
                <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-3">Best streak by difficulty</p>
                <div className="flex items-center gap-3">
                  {(["easy", "medium", "hard"] as Difficulty[]).map(d => {
                    const key = `bestStreak${d.charAt(0).toUpperCase() + d.slice(1)}` as keyof GameStats;
                    const val = stats[key] as number;
                    return (
                      <div key={d} className="flex-1 text-center">
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mb-1.5 ${DIFF_COLORS[d]}`}>
                          {getDifficultyLabel(d)}
                        </span>
                        <p className="text-lg font-bold text-white tabular-nums">{val}</p>
                        {val > 0 && <span className="text-xs" aria-hidden="true">🔥</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {stats.history.length > 0 && (
                <>
                  <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
                    Recent rounds
                  </h3>
                  <ul className="space-y-2">
                    {stats.history.slice(0, 20).map((result, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between bg-white/4 rounded-xl px-4 py-3 border border-white/8"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                              result.correct ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
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
                </>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-white/8 bg-white/4 p-5 text-center">
              <p className="text-white/30 text-sm">No infinite rounds yet.</p>
              <Link
                href="/play/infinite"
                className="inline-block mt-2 text-[var(--accent)] font-semibold text-sm hover:text-[var(--accent-deep)] transition-colors"
              >
                Play Infinite →
              </Link>
            </div>
          )}
        </section>

        {!hasAny && (
          <div className="text-center py-10">
            <div className="text-5xl mb-4" aria-hidden="true">🎬</div>
            <p className="text-white/30 text-sm">No games played yet.</p>
            <Link
              href="/play"
              className="inline-block mt-4 text-[var(--accent)] font-semibold text-sm hover:text-[var(--accent-deep)] transition-colors"
            >
              Start playing →
            </Link>
          </div>
        )}

        {hasAny && (
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
  label: string;
  value: string | number;
  icon?: string;
  accent?: "indigo" | "amber";
  sub?: string;
}) {
  const isIndigo = accent === "indigo";
  const isAmber  = accent === "amber";

  return (
    <div className={`rounded-xl p-4 border ${
      isAmber  ? "bg-amber-500/8  border-amber-500/25"    :
      isIndigo ? "bg-[var(--accent-light)] border-[var(--accent-border)]" :
                 "bg-white/4 border-white/8"
    }`}>
      <p className={`text-xs font-medium mb-1.5 ${
        isAmber  ? "text-amber-400/70" :
        isIndigo ? "text-[var(--accent-muted)]" :
                   "text-white/30"
      }`}>
        {label}
      </p>
      <p className={`text-2xl font-bold tabular-nums ${
        isAmber  ? "text-amber-400" :
        isIndigo ? "text-[var(--accent-deep)]" :
                   "text-white"
      }`}>
        {icon && <span aria-hidden="true" className="mr-1 text-xl">{icon}</span>}
        {value}
      </p>
      {sub && <p className="text-[10px] text-white/25 mt-1">{sub}</p>}
    </div>
  );
}
