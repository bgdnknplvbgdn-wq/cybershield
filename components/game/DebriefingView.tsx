"use client";

import { useState, useEffect } from "react";
import type { DebriefingStep } from "@/lib/scenario-types";
import { Card } from "@/components/shared";
import { Trophy, Shield, Scale, Lightbulb, ChevronRight, Award, Star } from "lucide-react";

interface DebriefingViewProps {
  step: DebriefingStep;
  onNext: () => void;
  xpReward?: number;
}

function Confetti() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 3500);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="confetti-container">
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} className="confetti-piece" />
      ))}
    </div>
  );
}

export function DebriefingView({ step, onNext, xpReward = 10 }: DebriefingViewProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-4">
      <Confetti />

      {/* Achievement banner */}
      <div className="text-center mb-4 animate-slide-in-up">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-success/10 border-2 border-success/40 flex items-center justify-center mb-3 animate-celebration" style={{ boxShadow: "0 0 30px rgba(0,255,65,0.3), 0 0 60px rgba(0,255,65,0.1)" }}>
          <Trophy size={40} className="text-success" />
        </div>
        <h2 className="text-xl font-bold text-success font-cyber tracking-wider">{step.title}</h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-warning/10 border border-warning/30">
            <Star size={14} className="text-warning" />
            <span className="text-xs font-mono text-warning font-bold">+{xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 border border-accent/30">
            <Award size={14} className="text-accent" />
            <span className="text-xs font-mono text-accent font-bold">ДОСТИЖЕНИЕ</span>
          </div>
        </div>
      </div>

      {showContent && (
        <>
          <Card className="animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start gap-2 mb-3">
              <Shield size={16} className="text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/90">{step.summary}</p>
            </div>
          </Card>

          <Card className="bg-accent/5 border-accent/20 animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2 mb-2">
              <Scale size={16} className="text-accent" />
              <span className="text-xs font-semibold font-mono text-accent">ЗАКОН</span>
            </div>
            <p className="text-sm font-semibold mb-1">{step.lawReference}</p>
            <p className="text-xs text-muted">{step.lawText}</p>
          </Card>

          <Card className="animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
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

          <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2 mt-4 animate-slide-in-up" style={{ animationDelay: "0.4s" }}>
            <span className="font-cyber tracking-wider">ЗАВЕРШИТЬ МИССИЮ</span>
            <ChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}
