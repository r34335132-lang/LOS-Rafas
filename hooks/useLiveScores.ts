import { useEffect, useState } from "react";

import { Match, MATCHES } from "@/constants/data";

/**
 * Simulates real-time score updates by occasionally bumping the score
 * of one of the live matches. Returns matches plus a per-match flashKey
 * that components can use to trigger an animation when the score changes.
 */
export function useLiveScores() {
  const [matches, setMatches] = useState<Match[]>(() => MATCHES);
  const [flashKeys, setFlashKeys] = useState<Record<string, number>>({});

  useEffect(() => {
    const id = setInterval(() => {
      setMatches((current) => {
        const live = current.filter((m) => m.status === "live");
        if (live.length === 0) return current;
        const target = live[Math.floor(Math.random() * live.length)]!;
        const bumpHome = Math.random() < 0.5;
        const incBy =
          target.sport === "basketball"
            ? Math.random() < 0.6
              ? 2
              : 3
            : target.sport === "soccer"
              ? 1
              : Math.random() < 0.5
                ? 6
                : 7;
        return current.map((m) =>
          m.id === target.id
            ? {
                ...m,
                homeScore: bumpHome ? m.homeScore + incBy : m.homeScore,
                awayScore: bumpHome ? m.awayScore : m.awayScore + incBy,
              }
            : m,
        );
      });

      setFlashKeys((current) => {
        const live = MATCHES.filter((m) => m.status === "live");
        if (!live.length) return current;
        const target = live[Math.floor(Math.random() * live.length)]!;
        return { ...current, [target.id]: (current[target.id] ?? 0) + 1 };
      });
    }, 4500);

    return () => clearInterval(id);
  }, []);

  return { matches, flashKeys };
}
