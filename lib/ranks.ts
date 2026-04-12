import type { RankName } from "./types";

export interface Rank {
  name: RankName;
  threshold: number;
  icon: string;
}

export const ranks: Rank[] = [
  { name: "Новичок", threshold: 0, icon: "🔰" },
  { name: "Агент", threshold: 50, icon: "🕵️" },
  { name: "Детектив", threshold: 150, icon: "🔎" },
  { name: "Инспектор", threshold: 300, icon: "🎖️" },
  { name: "Кибер-Маршал", threshold: 500, icon: "🛡️" },
];

export function getRankByXP(xp: number): Rank {
  let current = ranks[0];
  for (const rank of ranks) {
    if (xp >= rank.threshold) {
      current = rank;
    }
  }
  return current;
}

export function getNextRank(xp: number): Rank | null {
  const currentIndex = ranks.findIndex((r) => r.name === getRankByXP(xp).name);
  if (currentIndex < ranks.length - 1) {
    return ranks[currentIndex + 1];
  }
  return null;
}

export function getXPToNextRank(xp: number): number {
  const next = getNextRank(xp);
  if (!next) return 0;
  return next.threshold - xp;
}
