"use client";

import { useGameStore } from "@/store";
import { Card, Badge, ProgressBar } from "@/components/shared";
import { ranks, getRankByXP, getNextRank, getXPToNextRank } from "@/lib/ranks";
import { scenarios } from "@/data/scenarios";
import { useEffect } from "react";
import {
  User,
  ChevronRight,
  Star,
  Target,
  Zap,
  Shield,
  Award,
} from "lucide-react";

export default function ProfilePage() {
  const { progress, xp, rank, loadProgress, isLevelCompleted } = useGameStore();

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const currentRank = getRankByXP(xp);
  const nextRank = getNextRank(xp);
  const xpToNext = getXPToNextRank(xp);
  const completedCount = progress.filter((e) => e.completed).length;
  const totalLevels = scenarios.length;

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
          <User size={22} className="text-accent" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-cyber tracking-wider">КИБЕРПРОФИЛЬ</h1>
          <p className="text-xs text-muted font-mono">СТАТУС АГЕНТА</p>
        </div>
      </div>

      {/* Profile card */}
      <Card glow="accent" className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-accent/10 border-2 border-accent/40 flex items-center justify-center shrink-0 neon-glow">
            <Shield size={32} className="text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-cyber tracking-wide">КИБЕР-АГЕНТ</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="accent">{currentRank.name}</Badge>
              <span className="text-xs text-warning font-mono flex items-center gap-1">
                <Zap size={12} />
                {xp} XP
              </span>
            </div>
          </div>
        </div>

        {nextRank && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted font-mono uppercase tracking-wider">
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

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="text-center p-4">
          <Target size={20} className="text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold font-cyber text-accent">{completedCount}</div>
          <div className="text-[10px] text-muted font-mono uppercase tracking-wider">Миссий</div>
        </Card>
        <Card className="text-center p-4">
          <Zap size={20} className="text-warning mx-auto mb-2" />
          <div className="text-2xl font-bold font-cyber text-warning">{xp}</div>
          <div className="text-[10px] text-muted font-mono uppercase tracking-wider">Опыт</div>
        </Card>
        <Card className="text-center p-4">
          <Star size={20} className="text-neon mx-auto mb-2" />
          <div className="text-2xl font-bold font-cyber text-neon">
            {Math.round((completedCount / totalLevels) * 100)}%
          </div>
          <div className="text-[10px] text-muted font-mono uppercase tracking-wider">Прогресс</div>
        </Card>
      </div>

      {/* Ranks */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-3 text-muted font-mono uppercase tracking-widest flex items-center gap-2">
          <Award size={14} />
          СИСТЕМА РАНГОВ
        </h3>
        <div className="space-y-2">
          {ranks.map((r) => {
            const isCurrent = r.name === currentRank.name;
            const isUnlocked = xp >= r.threshold;
            return (
              <div
                key={r.name}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isCurrent
                    ? "bg-accent/5 border border-accent/30 neon-glow"
                    : isUnlocked
                    ? "bg-card-alt/50 border border-card-border/30"
                    : "bg-background/50 border border-card-border/20 opacity-50"
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

      {/* Completed missions */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-3 text-muted font-mono uppercase tracking-widest flex items-center gap-2">
          <Target size={14} />
          ПРОЙДЕННЫЕ МИССИИ
        </h3>
        {completedCount === 0 ? (
          <Card className="text-center py-6">
            <p className="text-muted text-sm font-mono">
              ПРОЙДИТЕ ПЕРВУЮ МИССИЮ
            </p>
          </Card>
        ) : (
          <div className="flex flex-wrap gap-2">
            {progress
              .filter((e) => e.completed)
              .map((e) => {
                const scenario = scenarios.find((s) => s.id === e.level_id);
                return (
                  <Badge key={e.level_id} variant="success">
                    #{e.level_id} {scenario?.title || `Миссия ${e.level_id}`}
                  </Badge>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
