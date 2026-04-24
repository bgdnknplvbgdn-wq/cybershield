"use client";

import Link from "next/link";
import { useGameStore } from "@/store";
import { Card, Badge } from "@/components/shared";
import { scenarios } from "@/data/scenarios";
import { Shield, CheckCircle2, Lock, ChevronRight, Zap, Target } from "lucide-react";
import { useEffect } from "react";

const difficultyLabel: Record<
  number,
  { text: string; variant: "success" | "warning" | "error" }
> = {
  1: { text: "ЛЁГКИЙ", variant: "success" },
  2: { text: "СРЕДНИЙ", variant: "warning" },
  3: { text: "СЛОЖНЫЙ", variant: "error" },
};

export default function MissionsPage() {
  const { progress, xp, rank, loadProgress, isLevelCompleted } = useGameStore();

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const completedCount = progress.filter((e) => e.completed).length;

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
          <Target size={22} className="text-accent" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-cyber tracking-wider">МИССИИ</h1>
          <p className="text-xs text-muted font-mono">ВЫБЕРИТЕ ЗАДАНИЕ</p>
        </div>
      </div>

      {/* Progress panel */}
      <Card className="mb-6" glow="accent">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-accent" />
            <span className="text-sm text-accent font-mono uppercase tracking-wider">Прогресс агента</span>
          </div>
          <Badge variant="accent">{rank}</Badge>
        </div>
        <div className="cyber-progress mb-2">
          <div
            className="bar"
            style={{ width: `${(completedCount / scenarios.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted font-mono">
            {completedCount} / {scenarios.length} ВЫПОЛНЕНО
          </span>
          <span className="text-xs font-mono flex items-center gap-1">
            <Zap size={12} className="text-warning" />
            <span className="text-warning">{xp} XP</span>
          </span>
        </div>
      </Card>

      {/* Mission list */}
      <div className="space-y-3">
        {scenarios.map((scenario) => {
          const completed = isLevelCompleted(scenario.id);
          const diff = difficultyLabel[scenario.difficulty];

          return (
            <Link
              key={scenario.id}
              href={`/missions/${scenario.id}`}
              className="block group"
            >
              <Card
                className="group-hover:border-accent/40 transition-all"
                glow={completed ? "success" : "none"}
              >
                <div className="flex items-center gap-4">
                  {/* Mission number */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg shrink-0 font-cyber font-bold clip-corner ${
                    completed
                      ? "bg-success/10 border border-success/30 text-success neon-glow-success"
                      : "bg-card-alt border border-card-border text-accent"
                  }`}>
                    {completed ? (
                      <CheckCircle2 size={22} />
                    ) : (
                      <span className="text-sm">{String(scenario.id).padStart(2, "0")}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={diff.variant}>{diff.text}</Badge>
                      {completed && (
                        <span className="text-[10px] text-success font-mono uppercase">ПРОЙДЕНО</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm md:text-base truncate">
                      {scenario.title}
                    </h3>
                    <p className="text-muted text-xs mt-0.5 line-clamp-1 font-mono">
                      {scenario.description}
                    </p>
                  </div>

                  <ChevronRight size={18} className="text-muted group-hover:text-accent transition-colors shrink-0" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
