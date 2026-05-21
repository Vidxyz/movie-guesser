export type Difficulty = "easy" | "medium" | "hard";

export interface ColorPreset {
  name: string;
  accent: string;
  dark: string;
  light: string;
  border: string;
  muted: string;
  deep: string;
}

export interface AppSettings {
  accentColor: string;
  difficulty: Difficulty;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { name: "Indigo",  accent: "#6366f1", dark: "#4f46e5", light: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.30)",  muted: "#818cf8", deep: "#a5b4fc" },
  { name: "Violet",  accent: "#8b5cf6", dark: "#7c3aed", light: "rgba(139,92,246,0.15)",  border: "rgba(139,92,246,0.30)",  muted: "#a78bfa", deep: "#c4b5fd" },
  { name: "Rose",    accent: "#f43f5e", dark: "#e11d48", light: "rgba(244,63,94,0.15)",   border: "rgba(244,63,94,0.30)",   muted: "#fb7185", deep: "#fda4af" },
  { name: "Amber",   accent: "#f59e0b", dark: "#d97706", light: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.30)",  muted: "#fbbf24", deep: "#fcd34d" },
  { name: "Emerald", accent: "#10b981", dark: "#059669", light: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.30)",  muted: "#34d399", deep: "#6ee7b7" },
  { name: "Blue",    accent: "#3b82f6", dark: "#2563eb", light: "rgba(59,130,246,0.15)",  border: "rgba(59,130,246,0.30)",  muted: "#60a5fa", deep: "#93c5fd" },
  { name: "Teal",    accent: "#009688", dark: "#00796b", light: "rgba(0,150,136,0.15)",   border: "rgba(0,150,136,0.30)",   muted: "#26a69a", deep: "#5eead4" },
];

const DEFAULT_SETTINGS: AppSettings = {
  accentColor: "#6366f1",
  difficulty: "medium",
};

const KEY = "moviguessr:settings";

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<AppSettings>): void {
  const current = loadSettings();
  localStorage.setItem(KEY, JSON.stringify({ ...current, ...settings }));
}

export function getPreset(accent: string): ColorPreset {
  return COLOR_PRESETS.find((p) => p.accent === accent) ?? COLOR_PRESETS[0];
}

export function applyPreset(preset: ColorPreset): void {
  const root = document.documentElement;
  root.style.setProperty("--accent",        preset.accent);
  root.style.setProperty("--accent-dark",   preset.dark);
  root.style.setProperty("--accent-light",  preset.light);
  root.style.setProperty("--accent-border", preset.border);
  root.style.setProperty("--accent-muted",  preset.muted);
  root.style.setProperty("--accent-deep",   preset.deep);
  root.style.setProperty("--accent-glow",   preset.border);
}
