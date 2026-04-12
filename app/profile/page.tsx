"use client";

import { useAuthStore, useGameStore } from "@/store";
import { Card, Badge, ProgressBar } from "@/components/shared";
import { ranks, getRankByXP, getNextRank, getXPToNextRank } from "@/lib/ranks";
import levels from "@/data/levels.json";
import { useEffect } from "react";
import {
  User,
  Trophy,
  LogOut,
  ChevronRight,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { profile, signOut, initialize } = useAuthStore();
  const { progress, xp, rank, fetchProgress, isLevelCompleted } = useGameStore();
  const router = useRouter();

  useEffect(() => {
    if (profile) {
      fetchProgress();
    }
  }, [profile, fetchProgress]);

  if (!profile) {
    return (
      <div className="min-h-[80dvh] flex flex-col items-center justify-center px-6 text-center">
        <User size={48} className="text-muted mb-4" />
        <p className="text-muted mb-4">Войди, чтобы увидеть профиль</p>
        <button
          onClick={() => router.push("/auth")}
          className="btn-primary"
        >
          Войти
        </button>
      </div>
    );
  }

  const currentRank = getRankByXP(xp);
  const nextRank = getNextRank(xp);
  const xpToNext = getXPToNextRank(xp);
  const completedCount = progress.filter((e) => e.completed).length;
  const totalLevels = levels.length;

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const avatarColors = [
    "bg-accent",
    "bg-success",
    "bg-warning",
    "bg-error",
    "bg-purple-500",
    "bg-pink-500",
    "bg-cyan-500",
  ];
  const avatarColor = avatarColors[(profile.avatar_id - 1) % avatarColors.length];

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <User size={28} className="text-accent" />
        <h1 className="text-2xl md:text-3xl font-bold">Профиль</h1>
      </div>

      <Card glow="accent" className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-16 h-16 rounded-full ${avatarColor} flex items-center justify-center text-2xl font-bold text-foreground shrink-0`}
          >
            {profile.nickname.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile.nickname}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="accent">{currentRank.name}</Badge>
              <span className="text-xs text-muted font-mono">
                {xp} XP
              </span>
            </div>
          </div>
        </div>

        {nextRank && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted font-mono">
                До {nextRank.name}
              </span>
              <span className="text-xs text-accent font-mono">
                {xpToNext} XP
              </span>
            </div>
            <ProgressBar
              value={xp - currentRank.threshold}
              max={nextRank.threshold - currentRank.threshold}
            />
          </div>
        )}
      </Card>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="text-center p-4">
          <Target size={20} className="text-accent mx-auto mb-1" />
          <div className="text-xl font-bold">{completedCount}</div>
          <div className="text-xs text-muted">Миссий</div>
        </Card>
        <Card className="text-center p-4">
          <Zap size={20} className="text-warning mx-auto mb-1" />
          <div className="text-xl font-bold">{xp}</div>
          <div className="text-xs text-muted">XP</div>
        </Card>
        <Card className="text-center p-4">
          <Star size={20} className="text-success mx-auto mb-1" />
          <div className="text-xl font-bold">
            {Math.round((completedCount / totalLevels) * 100)}%
          </div>
          <div className="text-xs text-muted">Прогресс</div>
        </Card>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-3 text-muted font-mono">
          РАНГИ
        </h3>
        <div className="space-y-2">
          {ranks.map((r) => {
            const isCurrent = r.name === currentRank.name;
            const isUnlocked = xp >= r.threshold;
            return (
              <div
                key={r.name}
                className={`flex items-center gap-3 p-3 rounded-btn transition-colors ${
                  isCurrent
                    ? "bg-accent/10 border border-accent/30"
                    : "bg-background"
                }`}
              >
                <span className="text-xl">{r.icon}</span>
                <div className="flex-1">
                  <span
                    className={`text-sm font-semibold ${
                      isUnlocked ? "text-foreground" : "text-muted"
                    }`}
                  >
                    {r.name}
                  </span>
                  <span className="text-xs text-muted ml-2 font-mono">
                    {r.threshold} XP
                  </span>
                </div>
                {isCurrent && (
                  <ChevronRight size={16} className="text-accent" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-3 text-muted font-mono">
          ПРОЙДЕННЫЕ МИССИИ
        </h3>
        {completedCount === 0 ? (
          <p className="text-muted text-sm text-center py-4">
            Пока нет пройденных миссий
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {progress
              .filter((e) => e.completed)
              .map((e) => {
                const level = levels.find((l) => l.id === e.level_id);
                return (
                  <Badge key={e.level_id} variant="success">
                    #{e.level_id} {level?.title || `Миссия ${e.level_id}`}
                  </Badge>
                );
              })}
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-error text-sm hover:underline mt-8"
      >
        <LogOut size={16} />
        Выйти из аккаунта
      </button>
    </div>
  );
}
