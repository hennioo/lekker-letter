"use client";

import { useEffect, useState } from "react";

export default function RotatingWord({
  words,
  intervalMs = 2600,
}: {
  words: string[];
  intervalMs?: number;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const id = setInterval(() => setI((prev) => (prev + 1) % words.length), intervalMs);
    return () => clearInterval(id);
  }, [words, intervalMs]);

  return (
    <span className="ll-rotate">
      <span key={i} className="ll-rotate-word">
        {words[i]}
      </span>
    </span>
  );
}
