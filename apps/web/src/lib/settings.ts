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
  { name: "Indigo",  accent: "#6366f1", dark: "#4f46e5", light: "#ede9fe", border: "#ddd6fe", muted: "#818cf8", deep: "#3730a3" },
  { name: "Violet",  accent: "#8b5cf6", dark: "#7c3aed", light: "#f5f3ff", border: "#ddd6fe", muted: "#a78bfa", deep: "#4c1d95" },
  { name: "Rose",    accent: "#f43f5e", dark: "#e11d48", light: "#fff1f2", border: "#fecdd3", muted: "#fb7185", deep: "#9f1239" },
  { name: "Amber",   accent: "#f59e0b", dark: "#d97706", light: "#fffbeb", border: "#fde68a", muted: "#fbbf24", deep: "#78350f" },
  { name: "Emerald", accent: "#10b981", dark: "#059669", light: "#ecfdf5", border: "#a7f3d0", muted: "#34d399", deep: "#065f46" },
  { name: "Blue",    accent: "#3b82f6", dark: "#2563eb", light: "#dbeafe", border: "#bfdbfe", muted: "#60a5fa", deep: "#1e40af" },
  { name: "Teal",    accent: "#009688", dark: "#00796b", light: "#e0f2f1", border: "#b2dfdb", muted: "#26a69a", deep: "#00695c" },
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
}
