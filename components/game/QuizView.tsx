"use client";

import { useState } from "react";
import type { QuizStep } from "@/lib/scenario-types";
import { Card } from "@/components/shared";
import { CheckCircle2, XCircle, ChevronRight, HelpCircle } from "lucide-react";

interface QuizViewProps {
  step: QuizStep;
  onComplete: (score: number, maxScore: number) => void;
}

export function QuizView({ step, onComplete }: QuizViewProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index !== step.correctIndex) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const isCorrect = selected === step.correctIndex;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start gap-2 mb-4">
          <HelpCircle size={18} className="text-accent shrink-0 mt-0.5" />
          <h3 className="font-semibold text-base">{step.question}</h3>
        </div>
        <div className="space-y-2">
          {step.options.map((option, i) => {
            let cls = "w-full text-left p-3 rounded-btn border transition-all text-sm ";
            if (!answered) {
              cls += "border-card-border bg-background hover:border-accent/50 hover:bg-accent/5";
            } else if (i === step.correctIndex) {
              cls += "border-success bg-success/10 text-success neon-glow-success animate-success-reveal";
            } else if (i === selected) {
              cls += "border-error bg-error/10 text-error neon-glow-error";
              if (shake) cls += " animate-threat-pulse";
            } else {
              cls += "border-card-border bg-background opacity-40";
            }

            return (
              <button key={i} onClick={() => handleSelect(i)} className={cls} disabled={answered}>
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded border flex items-center justify-center text-xs font-mono shrink-0 transition-all ${
                    answered && i === step.correctIndex
                      ? "border-success bg-success/20 text-success"
                      : answered && i === selected
                        ? "border-error bg-error/20 text-error"
                        : "border-current"
                  }`}>
                    {answered && i === step.correctIndex ? (
                      <CheckCircle2 size={14} />
                    ) : answered && i === selected ? (
                      <XCircle size={14} />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {answered && (
        <Card className={`animate-slide-in-up ${isCorrect ? "bg-success/5 border-success/20" : "bg-error/5 border-error/20"}`}>
          <div className="flex items-start gap-2">
            {isCorrect ? (
              <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
            ) : (
              <XCircle size={18} className="text-error shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-semibold mb-1 font-cyber tracking-wider">{isCorrect ? "ПРАВИЛЬНО" : "НЕВЕРНО"}</p>
              <p className="text-xs text-muted">{step.explanation}</p>
            </div>
          </div>
        </Card>
      )}

      {answered && (
        <button
          onClick={() => onComplete(isCorrect ? 1 : 0, 1)}
          className="btn-primary w-full flex items-center justify-center gap-2 font-cyber tracking-wider animate-slide-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span>ДАЛЕЕ</span>
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
