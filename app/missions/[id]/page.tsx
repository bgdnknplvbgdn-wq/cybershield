"use client";

import { useParams, useRouter } from "next/navigation";
import { useGameStore } from "@/store";
import { scenarios } from "@/data/scenarios";
import { ScenarioEngine } from "@/components/game";
import { Shield } from "lucide-react";

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { updateProgress } = useGameStore();
  const id = Number(params.id);

  const scenario = scenarios.find((s) => s.id === id);

  if (!scenario) {
    return (
      <div className="min-h-[80dvh] flex flex-col items-center justify-center px-6 text-center">
        <Shield size={48} className="text-muted mb-4" />
        <p className="text-muted">Миссия не найдена</p>
        <button onClick={() => router.push("/missions")} className="btn-primary mt-4">
          К миссиям
        </button>
      </div>
    );
  }

  const handleComplete = async (score: number) => {
    await updateProgress(id, score);
    router.push("/missions");
  };

  return (
    <ScenarioEngine
      scenario={scenario}
      onComplete={handleComplete}
      onBack={() => router.push("/missions")}
    />
  );
}
