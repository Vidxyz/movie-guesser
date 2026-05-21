"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { loadStats } from "@/lib/localStorage";
import { loadSettings } from "@/lib/settings";
import { getDifficultyLabel, getDifficultyColor } from "@/lib/gameLogic";
import type { GameStats, Difficulty } from "@moviguessr/shared";

const STEPS = [
  { icon: "🎬", title: "See a blurred poster", desc: "A movie poster is shown heavily blurred — can you recognise it?" },
  { icon: "⏳", title: "It clears over time", desc: "The blur fades over the countdown. Guess early to score more points." },
  { icon: "🎯", title: "Pick the right movie", desc: "Choose from four options. One guess — make it count." },
];

export default function LandingPage() {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  useEffect(() => {
    setStats(loadStats());
    setDifficulty(loadSettings().difficulty);
  }, []);

  const hasPlayed = stats && stats.totalGames > 0;
  const accuracy  = hasPlayed
    ? Math.round((stats.correctAnswers / stats.totalGames) * 100)
    : null;

  return (
    <div className="min-h-[100svh] bg-[#f8f9fb] flex flex-col">
      <Nav />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 max-w-xl mx-auto w-full gap-8">

        <section className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
            Can you identify the movie?
          </h1>
          <p className="mt-3 text-[#64748b] text-base max-w-sm mx-auto leading-relaxed">
            A blurred poster slowly comes into focus. Guess the movie before time runs out — faster guesses earn more points.
          </p>
        </section>

        {hasPlayed && (
          <section
            className="w-full bg-white rounded-2xl border border-[#e4e7ed] shadow-sm p-5"
            aria-label="Your stats"
          >
            <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-3">
              Your progress
            </p>
            <div className="grid grid-cols-3 gap-3">
              <MiniStat label="Games"    value={stats.totalGames} />
              <MiniStat label="Accuracy" value={`${accuracy}%`} />
              <MiniStat label="Score"    value={stats.totalScore.toLocaleString()} accent />
            </div>
            {stats.currentStreak > 0 && (
              <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                <span aria-hidden="true">🔥</span>
                <span className="text-amber-800 font-semibold text-sm">
                  {stats.currentStreak}-game streak active
                </span>
                {stats.bestStreak > 0 && (
                  <span className="ml-auto text-amber-600 text-xs">
                    Best: {stats.bestStreak}
                  </span>
                )}
              </div>
            )}
          </section>
        )}

        <div className="w-full flex flex-col items-center gap-3">
          <Link
            href="/play"
            className="w-full py-3.5 rounded-xl bg-[var(--accent)] text-white font-bold text-base tracking-wide text-center hover:bg-[var(--accent-dark)] active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 shadow-sm"
          >
            {hasPlayed ? "Keep playing →" : "Start playing →"}
          </Link>
          {stats && (
            <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
              <span>Difficulty:</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getDifficultyColor(difficulty)}`}>
                {getDifficultyLabel(difficulty)}
              </span>
              <Link href="/settings" className="underline hover:no-underline text-[#94a3b8] hover:text-[#64748b]">
                change
              </Link>
            </div>
          )}
        </div>

        <section className="w-full" aria-labelledby="how-heading">
          <h2
            id="how-heading"
            className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-4 text-center"
          >
            How it works
          </h2>
          <ol className="flex flex-col gap-3">
            {STEPS.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-4 bg-white rounded-xl border border-[#e4e7ed] px-4 py-3.5 shadow-sm"
              >
                <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">{step.icon}</span>
                <div>
                  <p className="font-semibold text-[#0f172a] text-sm">{step.title}</p>
                  <p className="text-[#64748b] text-xs mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

      </main>
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-3 border text-center ${accent ? "bg-[var(--accent-light)] border-[var(--accent-border)]" : "bg-[#f8f9fb] border-[#e4e7ed]"}`}>
      <p className={`text-xs font-medium mb-1 ${accent ? "text-[var(--accent-deep)]" : "text-[#94a3b8]"}`}>{label}</p>
      <p className={`text-lg font-bold tabular-nums ${accent ? "text-[var(--accent-dark)]" : "text-[#0f172a]"}`}>{value}</p>
    </div>
  );
}
