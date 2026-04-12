import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  nickname: string;
  xp: number;
  rank: string;
  avatar_id: number;
  created_at: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, nickname: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({ user: session.user, loading: false });
      await get().fetchUserProfile();
    } else {
      set({ user: null, profile: null, loading: false });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        set({ user: session.user });
        await get().fetchUserProfile();
      } else {
        set({ user: null, profile: null });
      }
    });
  },

  signUp: async (email, password, nickname) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
      },
    });
    if (error) {
      set({ loading: false });
      return { error: error.message };
    }
    await get().fetchUserProfile();
    set({ loading: false });
    return { error: null };
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      set({ loading: false });
      return { error: error.message };
    }
    await get().fetchUserProfile();
    set({ loading: false });
    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },

  fetchUserProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      set({ profile: data as Profile });
    }
  },

  updateProfile: async (data) => {
    const { profile } = get();
    if (!profile) return;

    const { data: updated } = await supabase
      .from("users")
      .update(data)
      .eq("id", profile.id)
      .select()
      .single();

    if (updated) {
      set({ profile: updated as Profile });
    }
  },
}));
