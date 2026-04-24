import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { ranks, getRankByXP } from "@/lib/ranks";
import { useAuthStore } from "./authStore";

interface ProgressEntry {
  id: string;
  user_id: string;
  level_id: number;
  score: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

interface GameState {
  progress: ProgressEntry[];
  currentLevel: number;
  xp: number;
  rank: string;
  fetchProgress: () => Promise<void>;
  updateProgress: (levelId: number, score: number) => Promise<void>;
  calculateRank: (xp: number) => string;
  isLevelCompleted: (levelId: number) => boolean;
}

const xpReward: Record<number, number> = { 1: 10, 2: 20, 3: 30 };

export const useGameStore = create<GameState>((set, get) => ({
  progress: [],
  currentLevel: 1,
  xp: 0,
  rank: "Новичок",

  fetchProgress: async () => {
    const { profile } = useAuthStore.getState();
    if (!profile) return;

    const { data } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", profile.id)
      .order("level_id", { ascending: true });

    if (data) {
      const entries = data as ProgressEntry[];
      const completedIds = entries
        .filter((e) => e.completed)
        .map((e) => e.level_id);
      const nextLevel = completedIds.length > 0
        ? Math.max(...completedIds) + 1
        : 1;

      set({
        progress: entries,
        currentLevel: nextLevel,
        xp: profile.xp,
        rank: profile.rank,
      });
    }
  },

  updateProgress: async (levelId, score) => {
    const { profile } = useAuthStore.getState();
    if (!profile) return;

    const { data: existing } = await supabase
      .from("progress")
      .select("id")
      .eq("user_id", profile.id)
      .eq("level_id", levelId)
      .single();

    if (existing) return;

    const { scenarios } = await import("@/data/scenarios");
    const scenario = scenarios.find((s) => s.id === levelId);
    const earnedXP = scenario ? xpReward[scenario.difficulty] || 10 : 10;

    await supabase.from("progress").insert({
      user_id: profile.id,
      level_id: levelId,
      score,
      completed: true,
      completed_at: new Date().toISOString(),
    });

    const newXp = profile.xp + earnedXP;
    const newRank = getRankByXP(newXp).name;

    await supabase
      .from("users")
      .update({ xp: newXp, rank: newRank })
      .eq("id", profile.id);

    await useAuthStore.getState().fetchUserProfile();
    await get().fetchProgress();
  },

  calculateRank: (xp) => {
    return getRankByXP(xp).name;
  },

  isLevelCompleted: (levelId) => {
    return get().progress.some(
      (e) => e.level_id === levelId && e.completed
    );
  },
}));
