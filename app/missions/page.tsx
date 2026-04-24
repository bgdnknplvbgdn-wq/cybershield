"use client";

import Link from "next/link";
import { useGameStore } from "@/store";
import { Card, Badge } from "@/components/shared";
import { scenarios } from "@/data/scenarios";
import { Shield, Lock, Unlock, Star } from "lucide-react";
import { useEffect } from "react";

const difficultyLabel: Record<
  number,
  { text: string; variant: "success" | "warning" | "error" }
> = {
  1: { text: "Лёгкий", variant: "success" },
  2: { text: "Средний", variant: "warning" },
  3: { text: "Сложный", variant: "error" },
};

export default function MissionsPage() {
  const { progress, xp, rank, loadProgress, isLevelCompleted } = useGameStore();

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const completedCount = progress.filter((e) => e.completed).length;

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Shield size={28} className="text-accent" />
        <h1 className="text-2xl md:text-3xl font-bold">Миссии</h1>
      </div>

      <div className="mb-6 p-4 bg-card rounded-card border border-card-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted font-mono">Прогресс</span>
          <span className="text-sm font-mono text-accent">
            {completedCount} / {scenarios.length}
          </span>
        </div>
        <div className="w-full h-2 bg-card-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{
              width: `${(completedCount / scenarios.length) * 100}%`,
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted font-mono">XP: {xp}</span>
          <span className="text-xs text-accent font-mono">{rank}</span>
        </div>
      </div>

      <div className="space-y-3">
        {scenarios.map((scenario) => {
          const completed = isLevelCompleted(scenario.id);
          const diff = difficultyLabel[scenario.difficulty];

          return (
            <Link
              key={scenario.id}
              href={`/missions/${scenario.id}`}
              className="block"
            >
              <Card
                className="hover:border-accent/50 transition-colors"
                glow={completed ? "success" : "none"}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-btn bg-accent/10 flex items-center justify-center text-lg shrink-0">
                    {completed ? (
                      <Unlock size={20} className="text-success" />
                    ) : (
                      <span>{scenario.icon}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted font-mono">
                        #{scenario.id}
                      </span>
                      <Badge variant={diff.variant}>{diff.text}</Badge>
                      {completed && (
                        <Star
                          size={14}
                          className="text-success fill-success"
                        />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm md:text-base truncate">
                      {scenario.title}
                    </h3>
                    <p className="text-muted text-xs mt-1 line-clamp-2">
                      {scenario.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
