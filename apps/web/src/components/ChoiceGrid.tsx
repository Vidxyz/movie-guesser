"use client";

import { useEffect, useState } from "react";
import type { RoundChoice } from "@moviguessr/shared";

interface ChoiceGridProps {
  choices: RoundChoice[];
  correctId: number;
  guessed: number | null;
  onGuess: (id: number) => void;
}

const LETTERS = ["A", "B", "C", "D"];

export default function ChoiceGrid({ choices, correctId, guessed, onGuess }: ChoiceGridProps) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (guessed !== null) {
      setAnimating(true);
      const id = setTimeout(() => setAnimating(false), 800);
      return () => clearTimeout(id);
    }
  }, [guessed]);

  return (
    <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" aria-label="Choose the movie">
      <legend className="sr-only">Pick the movie shown in the still</legend>
      {choices.map((choice, idx) => {
        const isCorrect = choice.id === correctId;
        const isGuessed = choice.id === guessed;
        const revealed  = guessed !== null;

        let containerClass: string;
        let letterClass: string;
        let animClass = "";

        if (!revealed) {
          containerClass = "border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 cursor-pointer active:scale-[0.985]";
          letterClass    = "bg-white/8 text-white/40";
        } else if (isCorrect && isGuessed) {
          containerClass = "border-emerald-400/80 bg-emerald-500/25 text-emerald-200 cursor-default";
          letterClass    = "bg-emerald-500/40 text-emerald-200";
          animClass      = animating ? "animate-correct-pop animate-correct-glow" : "";
        } else if (isCorrect) {
          containerClass = "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 cursor-default";
          letterClass    = "bg-emerald-500/25 text-emerald-400";
          animClass      = animating ? "animate-correct-pop" : "";
        } else if (isGuessed) {
          containerClass = "border-red-400/80 bg-red-500/25 text-red-200 cursor-default";
          letterClass    = "bg-red-500/40 text-red-200";
          animClass      = animating ? "animate-shake animate-wrong-flash" : "";
        } else {
          containerClass = "border-white/5 bg-white/3 text-white/25 cursor-default";
          letterClass    = "bg-white/5 text-white/20";
        }

        return (
          <button
            key={choice.id}
            onClick={() => !revealed && onGuess(choice.id)}
            disabled={revealed}
            aria-label={`${choice.title} (${choice.year})`}
            aria-pressed={isGuessed}
            className={`
              relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border
              transition-all duration-150 text-left
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
              ${containerClass} ${animClass}
            `}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${letterClass}`}
              aria-hidden="true"
            >
              {revealed && isCorrect ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : revealed && isGuessed && !isCorrect ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                LETTERS[idx]
              )}
            </div>

            <div className="min-w-0 flex-1">
              <span className="block font-semibold text-sm leading-snug truncate">{choice.title}</span>
              <span className="block text-xs opacity-50 mt-0.5">{choice.year}</span>
            </div>
          </button>
        );
      })}
    </fieldset>
  );
}
