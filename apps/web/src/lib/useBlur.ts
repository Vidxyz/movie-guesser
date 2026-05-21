"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface BlurState {
  currentBlurPx: number;
  progress: number;
}

export function useBlur(
  startTimeRef: React.RefObject<number>,
  timerSeconds: number,
  initialBlurPx: number,
  stopped: boolean,
  roundKey: number,
  easingExponent: number = 0.5,
): BlurState {
  const [state, setState] = useState<BlurState>({ currentBlurPx: initialBlurPx, progress: 0 });
  const rafRef = useRef<number | null>(null);

  // Reset to full blur whenever a new round begins (roundKey) or the timer config changes.
  // useLayoutEffect fires synchronously before browser paint, preventing a single
  // unblurred frame from appearing when the poster re-mounts for the new round.
  useLayoutEffect(() => {
    setState({ currentBlurPx: initialBlurPx, progress: 0 });
  }, [initialBlurPx, timerSeconds, roundKey]);

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
      // exponent < 1 → ease-out (fast early unblur, e.g. easy=0.5)
      // exponent = 1 → linear (steady unblur, e.g. medium)
      // exponent > 1 → ease-in (slow early, noticeably clears near end, e.g. hard=1.5)
      const easedProgress = Math.pow(rawProgress, easingExponent);
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
  }, [stopped, timerSeconds, initialBlurPx, easingExponent, startTimeRef]);

  return state;
}
