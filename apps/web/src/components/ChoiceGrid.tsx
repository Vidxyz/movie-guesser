"use client";

import { useEffect, useState } from "react";
import type { RoundChoice } from "@moviguessr/shared";

interface ChoiceGridProps {
  choices: RoundChoice[];
  correctId: number;
  guessed: number | null;
  onGuess: (id: number) => void;
}

export default function ChoiceGrid({ choices, correctId, guessed, onGuess }: ChoiceGridProps) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (guessed !== null) setAnimating(true);
  }, [guessed]);

  return (
    <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" aria-label="Choose the movie">
      <legend className="sr-only">Pick the movie shown in the poster</legend>
      {choices.map((choice) => {
        const isCorrect = choice.id === correctId;
        const isGuessed = choice.id === guessed;
        const revealed  = guessed !== null;

        let baseClass: string;
        let animClass = "";

        if (!revealed) {
          baseClass =
            "border-[#e4e7ed] bg-white hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:shadow-sm text-[#0f172a]";
        } else if (isCorrect && isGuessed) {
          baseClass = "border-[#059669] bg-[#ecfdf5] text-[#065f46]";
          animClass = animating ? "animate-pop animate-pulse-green" : "";
        } else if (isCorrect) {
          baseClass = "border-[#059669] bg-[#ecfdf5] text-[#065f46]";
          animClass = animating ? "animate-pop" : "";
        } else if (isGuessed) {
          baseClass = "border-[#dc2626] bg-[#fef2f2] text-[#991b1b]";
          animClass = animating ? "animate-shake" : "";
        } else {
          baseClass = "border-[#e4e7ed] bg-[#f8f9fb] text-[#94a3b8] cursor-default";
        }

        return (
          <button
            key={choice.id}
            onClick={() => !revealed && onGuess(choice.id)}
            disabled={revealed}
            aria-label={`${choice.title} (${choice.year})`}
            aria-pressed={isGuessed}
            aria-disabled={revealed && !isCorrect && !isGuessed}
            className={`
              flex items-center gap-3 p-4 rounded-xl border-2 transition-colors text-left
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
              ${baseClass} ${animClass}
              ${!revealed ? "cursor-pointer active:scale-[0.985]" : ""}
            `}
          >
            <div
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-lg
                ${!revealed ? "bg-[#f1f3f7] text-[var(--accent-dark)]" : ""}
                ${revealed && isCorrect ? "bg-[#d1fae5] text-[#059669]" : ""}
                ${revealed && isGuessed && !isCorrect ? "bg-[#fee2e2] text-[#dc2626]" : ""}
                ${revealed && !isCorrect && !isGuessed ? "bg-[#f1f3f7] text-[#94a3b8]" : ""}
              `}
              aria-hidden="true"
            >
              🎬
            </div>
            <div className="min-w-0 flex-1">
              <span className="block font-semibold text-sm leading-snug">{choice.title}</span>
              <span className="block text-xs opacity-60 mt-0.5">{choice.year}</span>
            </div>
            {revealed && isCorrect && (
              <span className="ml-auto text-[#059669] shrink-0 text-lg font-bold" aria-hidden="true">✓</span>
            )}
            {revealed && isGuessed && !isCorrect && (
              <span className="ml-auto text-[#dc2626] shrink-0 text-lg font-bold" aria-hidden="true">✕</span>
            )}
          </button>
        );
      })}
    </fieldset>
  );
}
