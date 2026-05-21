"use client";

import { useEffect, useRef, useState } from "react";

interface BlurState {
  currentBlurPx: number;
  progress: number;
}

export function useBlur(
  startTimeRef: React.RefObject<number>,
  timerSeconds: number,
  initialBlurPx: number,
  stopped: boolean,
): BlurState {
  const [state, setState] = useState<BlurState>({ currentBlurPx: initialBlurPx, progress: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setState({ currentBlurPx: initialBlurPx, progress: 0 });
  }, [initialBlurPx, timerSeconds]);

  useEffect(() => {
    if (stopped) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const totalMs = timerSeconds * 1000;

    const tick = () => {
      const elapsedMs = Date.now() - startTimeRef.current;
      const rawProgress = Math.min(elapsedMs / totalMs, 1);
      const easedProgress = Math.sqrt(rawProgress);
      const currentBlurPx = initialBlurPx * (1 - easedProgress);

      setState({ currentBlurPx, progress: rawProgress });

      if (rawProgress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [stopped, timerSeconds, initialBlurPx, startTimeRef]);

  return state;
}
