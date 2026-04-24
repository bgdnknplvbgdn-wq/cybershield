import { create } from "zustand";
import { getRankByXP } from "@/lib/ranks";
import { scenarios } from "@/data/scenarios";

interface ProgressEntry {
  level_id: number;
  score: number;
  completed: boolean;
  completed_at: string | null;
}

interface GameState {
  progress: ProgressEntry[];
  xp: number;
  rank: string;
  loadProgress: () => void;
  updateProgress: (levelId: number, score: number) => Promise<void>;
  isLevelCompleted: (levelId: number) => boolean;
}

const STORAGE_KEY = "cybershield_progress";
const XP_STORAGE_KEY = "cybershield_xp";
const xpReward: Record<number, number> = { 1: 10, 2: 20, 3: 30 };

function loadFromStorage(): { progress: ProgressEntry[]; xp: number } {
  if (typeof window === "undefined") return { progress: [], xp: 0 };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedXp = localStorage.getItem(XP_STORAGE_KEY);
    return {
      progress: saved ? JSON.parse(saved) : [],
      xp: savedXp ? parseInt(savedXp, 10) : 0,
    };
  } catch {
    return { progress: [], xp: 0 };
  }
}

function saveToStorage(progress: ProgressEntry[], xp: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    localStorage.setItem(XP_STORAGE_KEY, String(xp));
  } catch {
    // localStorage not available
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  progress: [],
  xp: 0,
  rank: "Новичок",

  loadProgress: () => {
    const { progress, xp } = loadFromStorage();
    set({
      progress,
      xp,
      rank: getRankByXP(xp).name,
    });
  },

  updateProgress: async (levelId, score) => {
    const { progress, xp } = get();

    const already = progress.some((e) => e.level_id === levelId && e.completed);
    if (already) return;

    const scenario = scenarios.find((s) => s.id === levelId);
    const earnedXP = scenario ? xpReward[scenario.difficulty] || 10 : 10;

    const entry: ProgressEntry = {
      level_id: levelId,
      score,
      completed: true,
      completed_at: new Date().toISOString(),
    };

    const newProgress = [...progress.filter((e) => e.level_id !== levelId), entry];
    const newXp = xp + earnedXP;
    const newRank = getRankByXP(newXp).name;

    saveToStorage(newProgress, newXp);
    set({ progress: newProgress, xp: newXp, rank: newRank });
  },

  isLevelCompleted: (levelId) => {
    return get().progress.some((e) => e.level_id === levelId && e.completed);
  },
}));
