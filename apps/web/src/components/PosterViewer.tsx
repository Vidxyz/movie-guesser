"use client";

import { useState } from "react";

interface PosterViewerProps {
  posterPath: string;
  currentBlurPx: number;
  revealed: boolean;
  movieTitle: string;
}

const TMDB_BASE = "https://image.tmdb.org/t/p/w500";

export default function PosterViewer({ posterPath, currentBlurPx, revealed, movieTitle }: PosterViewerProps) {
  const [loaded, setLoaded] = useState(false);

  const blurPx = revealed ? 0 : currentBlurPx;

  return (
    <div className="relative w-full" style={{ aspectRatio: "2/3" }}>
      {!loaded && (
        <div className="absolute inset-0 rounded-xl animate-shimmer" aria-hidden="true" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${TMDB_BASE}${posterPath}`}
        alt={revealed ? movieTitle : "Movie poster — blurred"}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover rounded-xl select-none transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        style={{
          filter: `blur(${blurPx}px)`,
          transition: "filter 0.1s linear",
        }}
        draggable={false}
      />
    </div>
  );
}
