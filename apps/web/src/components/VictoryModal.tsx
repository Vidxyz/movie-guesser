"use client";

import { useState } from "react";
import { shareClassicResult } from "@/lib/share";

interface VictoryModalProps {
  finalScore: number;
  correctAnswers: number;
  lastBackdropPath: string;
  lastBlurPx: number;
  onPlayAgain: () => void;
  onHome: () => void;
}

const TMDB_BASE = "https://image.tmdb.org/t/p/w1280";
const STARS = ["✦", "★", "✦", "★", "✦"];

interface Outcome {
  emoji: string;
  headline: string;
  subline: string;
  headlineClass: string;
  stripClass: string;
  borderClass: string;
  showStars: boolean;
  emojiAnimClass: string;
}

function getOutcome(correct: number): Outcome {
  if (correct >= 17) return {
    emoji: "🏆",
    headline: "You won an Oscar!",
    subline: correct === 20
      ? "Perfect score — you ARE the Academy"
      : correct >= 19 ? "Cinema Maestro — flawless taste"
      : "Outstanding performance",
    headlineClass: "animate-gold-shimmer text-2xl font-black tracking-tight",
    stripClass: "bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600",
    borderClass: "border-amber-500/30",
    showStars: true,
    emojiAnimClass: "animate-trophy-bounce animate-victory-glow rounded-full",
  };
  if (correct >= 12) return {
    emoji: "⭐",
    headline: "You've been nominated!",
    subline: "A strong showing — so close to the podium",
    headlineClass: "text-white text-2xl font-black tracking-tight",
    stripClass: "bg-gradient-to-r from-slate-400/60 via-white/25 to-slate-400/60",
    borderClass: "border-white/15",
    showStars: false,
    emojiAnimClass: "animate-trophy-bounce",
  };
  if (correct >= 5) return {
    emoji: "🎬",
    headline: "Not nominated",
    subline: "Keep watching — better luck next awards season",
    headlineClass: "text-white/70 text-2xl font-black tracking-tight",
    stripClass: "bg-white/10",
    borderClass: "border-white/10",
    showStars: false,
    emojiAnimClass: "animate-trophy-bounce",
  };
  return {
    emoji: "😬",
    headline: "Don't expect an invite",
    subline: "Maybe catch up on a few more movies first",
    headlineClass: "text-red-400 text-2xl font-black tracking-tight",
    stripClass: "bg-red-500/30",
    borderClass: "border-red-500/15",
    showStars: false,
    emojiAnimClass: "animate-trophy-bounce",
  };
}

export default function VictoryModal({
  finalScore,
  correctAnswers,
  lastBackdropPath,
  lastBlurPx,
  onPlayAgain,
  onHome,
}: VictoryModalProps) {
  const [shareLabel, setShareLabel] = useState<"Share result" | "Shared!" | "Copied!">("Share result");
  const outcome = getOutcome(correctAnswers);

  async function handleShare() {
    const result = await shareClassicResult({ totalScore: finalScore, correctAnswers });
    setShareLabel(result === "shared" ? "Shared!" : "Copied!");
    setTimeout(() => setShareLabel("Share result"), 2500);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-heading"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80"
    >
      <div
        className={`animate-slide-up w-full max-w-sm rounded-2xl overflow-hidden border ${outcome.borderClass}`}
        style={{ background: "rgba(7,11,20,0.98)" }}
      >
        {/* Last movie backdrop */}
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${TMDB_BASE}${lastBackdropPath}`}
            alt="Last round"
            className="w-full h-full object-cover"
            draggable={false}
            style={{ filter: lastBlurPx > 0 ? `blur(${lastBlurPx}px)` : "none" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/50 to-transparent" />
        </div>

        {/* Status strip */}
        <div className={`h-0.5 ${outcome.stripClass}`} />

        <div className="p-6 flex flex-col items-center text-center gap-4">
          {/* Icon + optional stars */}
          <div className="relative flex items-center justify-center w-24 h-24">
            {outcome.showStars && STARS.map((star, i) => (
              <span
                key={i}
                className="animate-star-float absolute text-amber-400 text-sm select-none pointer-events-none"
                style={{ animationDelay: `${i * 0.18}s`, left: `${10 + i * 16}%`, top: "20%" }}
                aria-hidden="true"
              >
                {star}
              </span>
            ))}
            <span className={`text-7xl select-none ${outcome.emojiAnimClass}`} aria-hidden="true">
              {outcome.emoji}
            </span>
          </div>

          {/* Headline */}
          <div>
            <h2 id="victory-heading" className={outcome.headlineClass}>
              {outcome.headline}
            </h2>
            <p className="text-white/40 text-xs mt-1">{outcome.subline}</p>
          </div>

          {/* Score card */}
          <div className="w-full rounded-xl border border-amber-500/20 bg-amber-500/8 px-5 py-4 flex items-center justify-between">
            <div className="text-left">
              <p className="text-amber-400/70 text-xs font-medium">Correct answers</p>
              <p className="text-white font-bold text-2xl tabular-nums">
                {correctAnswers}<span className="text-white/30 text-base font-normal">/20</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-amber-400/70 text-xs font-medium">Final score</p>
              <p className="animate-gold-shimmer font-black text-2xl tabular-nums">{finalScore.toLocaleString()}</p>
            </div>
          </div>

          {/* Emoji grid */}
          <div className="flex gap-0.5 flex-wrap justify-center" aria-label={`${correctAnswers} of 20 correct`}>
            {Array.from({ length: 20 }, (_, i) => (
              <span key={i} className="text-base" aria-hidden="true">
                {i < correctAnswers ? "🟨" : "⬛"}
              </span>
            ))}
          </div>

          {/* Primary buttons */}
          <div className="w-full flex gap-2.5">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-white/70 font-semibold text-sm hover:bg-white/10 hover:text-white active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              {shareLabel}
            </button>
            <button
              onClick={onPlayAgain}
              className="flex-[2] py-3 rounded-xl font-bold text-sm tracking-wide text-white active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              style={{
                background: "linear-gradient(135deg, #d97706, #f59e0b)",
                boxShadow: "0 0 24px rgba(245,158,11,0.4)",
              }}
            >
              Play again →
            </button>
          </div>

          {/* Home button — styled like ResultModal's "End game" */}
          <button
            onClick={onHome}
            className="w-full py-2.5 rounded-xl border border-white/10 text-xs font-medium text-white/40 hover:bg-white/5 hover:text-white/70 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
