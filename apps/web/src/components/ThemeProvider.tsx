"use client";

import { useEffect } from "react";
import { loadSettings, getPreset, applyPreset } from "@/lib/settings";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const settings = loadSettings();
    applyPreset(getPreset(settings.accentColor));
  }, []);

  return <>{children}</>;
}
