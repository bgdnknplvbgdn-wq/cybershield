"use client";

import type { DebriefingStep } from "@/lib/scenario-types";
import { Card } from "@/components/shared";
import { Trophy, Shield, Scale, Lightbulb, ChevronRight } from "lucide-react";

interface DebriefingViewProps {
  step: DebriefingStep;
  onNext: () => void;
}

export function DebriefingView({ step, onNext }: DebriefingViewProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="w-16 h-16 mx-auto rounded-xl bg-success/10 border border-success/30 flex items-center justify-center mb-3 neon-glow-success">
          <Trophy size={32} className="text-success" />
        </div>
        <h2 className="text-xl font-bold text-success font-cyber tracking-wider">{step.title}</h2>
      </div>

      <Card>
        <div className="flex items-start gap-2 mb-3">
          <Shield size={16} className="text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90">{step.summary}</p>
        </div>
      </Card>

      <Card className="bg-accent/5 border-accent/20">
        <div className="flex items-center gap-2 mb-2">
          <Scale size={16} className="text-accent" />
          <span className="text-xs font-semibold font-mono text-accent">ЗАКОН</span>
        </div>
        <p className="text-sm font-semibold mb-1">{step.lawReference}</p>
        <p className="text-xs text-muted">{step.lawText}</p>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-warning" />
          <span className="text-xs font-semibold font-mono text-warning">ЗАПОМНИ</span>
        </div>
        <ul className="space-y-2">
          {step.tips.map((tip, i) => (
            <li key={i} className="text-xs text-muted flex items-start gap-2">
              <span className="text-success mt-0.5">▸</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </Card>

      <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
        <span className="font-cyber tracking-wider">ЗАВЕРШИТЬ МИССИЮ</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
