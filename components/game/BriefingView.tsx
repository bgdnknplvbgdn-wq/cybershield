"use client";

import type { BriefingStep } from "@/lib/scenario-types";
import { Card } from "@/components/shared";
import { BookOpen, ChevronRight, Info } from "lucide-react";

interface BriefingViewProps {
  step: BriefingStep;
  onNext: () => void;
}

export function BriefingView({ step, onNext }: BriefingViewProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">{step.icon}</div>
        <h2 className="text-2xl font-bold mb-2 font-cyber tracking-wider">{step.title}</h2>
        <div className="flex items-center justify-center gap-2 text-accent text-xs font-mono uppercase tracking-widest">
          <BookOpen size={16} />
          <span>Брифинг</span>
        </div>
      </div>

      <Card>
        <p className="text-sm leading-relaxed text-foreground/90">{step.text}</p>
      </Card>

      <Card className="bg-accent/5 border-accent/20">
        <div className="flex items-center gap-2 mb-3">
          <Info size={16} className="text-accent" />
          <span className="text-sm font-semibold text-accent font-mono">ФАКТЫ</span>
        </div>
        <ul className="space-y-2">
          {step.facts.map((fact, i) => (
            <li key={i} className="text-xs text-muted flex items-start gap-2">
              <span className="text-accent mt-0.5">▸</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </Card>

      <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
        <span className="font-cyber tracking-wider">НАЧАТЬ МИССИЮ</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
