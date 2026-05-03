"use client";

import { useState, useEffect } from "react";
import type { BriefingStep } from "@/lib/scenario-types";
import { Card } from "@/components/shared";
import { BookOpen, ChevronRight, Info, AlertTriangle } from "lucide-react";
import { playMissionStart } from "@/lib/sounds";

interface BriefingViewProps {
  step: BriefingStep;
  onNext: () => void;
}

export function BriefingView({ step, onNext }: BriefingViewProps) {
  const [showFacts, setShowFacts] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowFacts(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-4">
      {/* Animated header */}
      <div className="text-center mb-6 animate-slide-in-up">
        <div className="text-5xl mb-4 animate-float">{step.icon}</div>
        <h2 className="text-2xl font-bold mb-2 font-cyber tracking-wider">{step.title}</h2>
        <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest">
          <AlertTriangle size={14} className="text-warning" />
          <span className="text-warning">Входящее задание</span>
        </div>
      </div>

      {/* Mission text with typewriter feel */}
      <Card className="animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="terminal-header mb-3">
          <BookOpen size={14} />
          <span>Оперативная сводка</span>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">{step.text}</p>
      </Card>

      {/* Facts with staggered reveal */}
      {showFacts && (
        <Card className="bg-accent/5 border-accent/20 animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-accent" />
            <span className="text-sm font-semibold text-accent font-mono">РАЗВЕДДАННЫЕ</span>
          </div>
          <ul className="space-y-2">
            {step.facts.map((fact, i) => (
              <li key={i} className="text-xs text-muted flex items-start gap-2 animate-slide-in-up" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                <span className="text-accent mt-0.5 font-mono">[{String(i + 1).padStart(2, "0")}]</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <button onClick={() => { playMissionStart(); onNext(); }} className="btn-primary w-full flex items-center justify-center gap-2 mt-6 animate-slide-in-up" style={{ animationDelay: "0.5s" }}>
        <span className="font-cyber tracking-wider">НАЧАТЬ МИССИЮ</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
