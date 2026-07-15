"use client";

import { useEffect, useState } from "react";

const COLORS = ["#ef4416", "#780228", "#efe439", "#f2c7c0"];

type Piece = {
  id: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
  rotate: number;
  width: number;
  height: number;
};

export default function Confetti({ count = 60, durationMs = 3200 }: { count?: number; durationMs?: number }) {
  const [pieces, setPieces] = useState<Piece[] | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const generated: Piece[] = Array.from({ length: count }, (_, id) => ({
      id,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 400,
      duration: 1800 + Math.random() * 1400,
      rotate: Math.random() * 360,
      width: 6 + Math.random() * 8,
      height: 10 + Math.random() * 10,
    }));
    setPieces(generated);
    const cleanup = window.setTimeout(() => setPieces(null), durationMs);
    return () => window.clearTimeout(cleanup);
  }, [count, durationMs]);

  if (!pieces) return null;

  return (
    <div className="ll-confetti" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.width,
            height: p.height,
            animationDuration: `${p.duration}ms`,
            animationDelay: `${p.delay}ms`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
