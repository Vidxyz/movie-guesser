"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import {
  COLOR_PRESETS,
  loadSettings,
  saveSettings,
  applyPreset,
  getPreset,
  type Difficulty,
  type ColorPreset,
} from "@/lib/settings";

const DIFFICULTIES: { value: Difficulty; label: string; tag: string; color: string; desc: string }[] = [
  {
    value: "easy",
    label: "Easy",
    tag: "×0.75",
    color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    desc: "30 seconds, lighter blur that clears quickly. Decoys are from different genres — easier to rule out.",
  },
  {
    value: "medium",
    label: "Medium",
    tag: "×1.0",
    color: "text-amber-400 bg-amber-500/15 border-amber-500/30",
    desc: "30 seconds, moderate blur with steady progression. One decoy shares the same genre. A balanced challenge.",
  },
  {
    value: "hard",
    label: "Hard",
    tag: "×1.5",
    color: "text-rose-400 bg-rose-500/15 border-rose-500/30",
    desc: "30 seconds, heavier blur that holds longer. All three decoys share the same genre. Pure recognition skills.",
  },
];

export default function SettingsPage() {
  const [accentColor, setAccentColor] = useState("#6366f1");
  const [difficulty, setDifficulty]   = useState<Difficulty>("medium");
  const [saved, setSaved]             = useState(false);

  useEffect(() => {
    const s = loadSettings();
    setAccentColor(s.accentColor);
    setDifficulty(s.difficulty);
  }, []);

  function pickColor(preset: ColorPreset) {
    setAccentColor(preset.accent);
    applyPreset(preset);
    persist(preset.accent, difficulty);
  }

  function pickDifficulty(d: Difficulty) {
    setDifficulty(d);
    persist(accentColor, d);
  }

  function persist(color: string, diff: Difficulty) {
    saveSettings({ accentColor: color, difficulty: diff });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="min-h-[100svh] bg-[var(--bg)]">
      <Nav />

      <main className="max-w-lg mx-auto px-4 py-8" aria-label="Settings">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-white/30 text-sm mt-0.5">Preferences are saved locally.</p>
          </div>
          {saved && (
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              Saved
            </span>
          )}
        </div>

        <section className="mb-8" aria-labelledby="colour-heading">
          <h2 id="colour-heading" className="text-sm font-bold text-white mb-1">Accent colour</h2>
          <p className="text-xs text-white/30 mb-4">Changes buttons and highlight colours.</p>
          <div className="flex flex-wrap gap-4">
            {COLOR_PRESETS.map((preset) => {
              const active = accentColor === preset.accent;
              return (
                <button
                  key={preset.name}
                  onClick={() => pickColor(preset)}
                  aria-pressed={active}
                  aria-label={`${preset.name}${active ? " (selected)" : ""}`}
                  className="flex flex-col items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-xl transition-transform hover:scale-105"
                >
                  <span
                    className={`w-10 h-10 rounded-full border-2 transition-all ${active ? "border-white scale-110" : "border-transparent opacity-70"}`}
                    style={{ background: preset.accent }}
                    aria-hidden="true"
                  />
                  <span className={`text-[10px] font-semibold ${active ? "text-white" : "text-white/30"}`}>
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="difficulty-heading">
          <h2 id="difficulty-heading" className="text-sm font-bold text-white mb-1">Difficulty</h2>
          <p className="text-xs text-white/30 mb-4">
            Affects blur intensity, how fast it clears, and how similar the decoys are.
          </p>

          <div className="flex flex-col gap-2.5">
            {DIFFICULTIES.map((d) => {
              const active = difficulty === d.value;
              return (
                <button
                  key={d.value}
                  onClick={() => pickDifficulty(d.value)}
                  aria-pressed={active}
                  className={`w-full text-left rounded-xl border-2 px-4 py-3.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-light)]"
                      : "border-white/8 bg-white/4 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold text-sm ${active ? "text-[var(--accent-deep)]" : "text-white"}`}>
                      {d.label}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${d.color}`}>
                      {d.tag}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">{d.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-white/8 overflow-hidden text-xs">
            <div className="px-4 py-2.5 bg-white/4 border-b border-white/8 font-semibold text-white/30 uppercase tracking-wider">
              Score formula
            </div>
            <div className="px-4 py-3 text-white/60 leading-relaxed space-y-1 bg-white/2">
              <p><span className="text-white font-semibold">Base:</span> 1,000 pts per correct answer</p>
              <p><span className="text-white font-semibold">Speed bonus:</span> +500 (first 20%) · +200 (first 50%) · +50 (first 80%)</p>
              <p><span className="text-white font-semibold">Streak:</span> ×1.5 (3–4) · ×2.0 (5+)</p>
              <p><span className="text-white font-semibold">Difficulty:</span> ×0.75 Easy · ×1 Medium · ×1.5 Hard</p>
              <p className="text-white/25 pt-1 border-t border-white/8 mt-1">
                Total = (Base + Speed) × Streak × Difficulty
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
