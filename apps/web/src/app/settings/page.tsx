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
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    desc: "More time (45s), less initial blur. Decoys are from different genres — easier to rule out.",
  },
  {
    value: "medium",
    label: "Medium",
    tag: "×1.0",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    desc: "30 seconds, medium blur. One decoy shares the same genre. A balanced challenge.",
  },
  {
    value: "hard",
    label: "Hard",
    tag: "×1.5",
    color: "text-rose-600 bg-rose-50 border-rose-200",
    desc: "Only 20 seconds, heavy blur. All three decoys share the same genre. Pure poster recognition.",
  },
];

export default function SettingsPage() {
  const [accentColor, setAccentColor] = useState<string>("#6366f1");
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
    <div className="min-h-[100svh] bg-[#f8f9fb]">
      <Nav />

      <main className="max-w-lg mx-auto px-4 py-8" aria-label="Settings">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a]">Settings</h1>
            <p className="text-[#64748b] text-sm mt-0.5">Preferences are saved locally.</p>
          </div>
          {saved && (
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              Saved
            </span>
          )}
        </div>

        <section className="mb-8" aria-labelledby="colour-heading">
          <h2 id="colour-heading" className="text-sm font-bold text-[#0f172a] mb-1">
            Accent colour
          </h2>
          <p className="text-xs text-[#64748b] mb-4">Changes buttons and highlight colours.</p>
          <div className="flex flex-wrap gap-3">
            {COLOR_PRESETS.map((preset) => {
              const active = accentColor === preset.accent;
              return (
                <button
                  key={preset.name}
                  onClick={() => pickColor(preset)}
                  aria-pressed={active}
                  aria-label={`${preset.name}${active ? " (selected)" : ""}`}
                  className={`flex flex-col items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-xl transition-transform ${active ? "scale-105" : "hover:scale-105"}`}
                >
                  <span
                    className={`w-10 h-10 rounded-full border-2 transition-all ${active ? "border-[#0f172a]" : "border-transparent"}`}
                    style={{ background: preset.accent }}
                    aria-hidden="true"
                  />
                  <span className={`text-[10px] font-semibold ${active ? "text-[#0f172a]" : "text-[#94a3b8]"}`}>
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="difficulty-heading">
          <h2 id="difficulty-heading" className="text-sm font-bold text-[#0f172a] mb-1">
            Difficulty
          </h2>
          <p className="text-xs text-[#64748b] mb-4">
            Affects timer length, initial blur amount, and how similar the decoy movies are.
          </p>

          <div className="flex flex-col gap-3">
            {DIFFICULTIES.map((d) => {
              const active = difficulty === d.value;
              return (
                <button
                  key={d.value}
                  onClick={() => pickDifficulty(d.value)}
                  aria-pressed={active}
                  className={`w-full text-left rounded-xl border-2 px-4 py-3.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 ${
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-light)]"
                      : "border-[#e4e7ed] bg-white hover:border-[#c8cdd8]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold text-sm ${active ? "text-[var(--accent-deep)]" : "text-[#0f172a]"}`}>
                      {d.label}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${d.color}`}>
                      {d.tag}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] leading-relaxed">{d.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-5 bg-white rounded-xl border border-[#e4e7ed] overflow-hidden text-xs">
            <div className="px-4 py-2.5 bg-[#f8f9fb] border-b border-[#e4e7ed] font-semibold text-[#64748b] uppercase tracking-wider">
              Score formula
            </div>
            <div className="px-4 py-3 text-[#0f172a] leading-relaxed space-y-1">
              <p><span className="font-semibold">Base:</span> 1,000 pts per correct answer</p>
              <p><span className="font-semibold">Speed bonus:</span> +500 (first 20%) · +200 (first 50%) · +50 (first 80%)</p>
              <p><span className="font-semibold">Streak multiplier:</span> ×1.5 (3–4) · ×2 (5+)</p>
              <p><span className="font-semibold">Difficulty multiplier:</span> ×0.75 Easy · ×1 Medium · ×1.5 Hard</p>
              <p className="text-[#94a3b8] pt-1 border-t border-[#f1f3f7] mt-1">
                Total = (Base + Speed) × Streak × Difficulty
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
