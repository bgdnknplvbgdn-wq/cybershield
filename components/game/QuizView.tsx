"use client";

import { useState } from "react";
import type { QuizStep } from "@/lib/scenario-types";
import { Card } from "@/components/shared";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";

interface QuizViewProps {
  step: QuizStep;
  onComplete: (score: number, maxScore: number) => void;
}

export function QuizView({ step, onComplete }: QuizViewProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
  };

  const isCorrect = selected === step.correctIndex;

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="font-semibold text-base mb-4">{step.question}</h3>
        <div className="space-y-2">
          {step.options.map((option, i) => {
            let cls = "w-full text-left p-3 rounded-btn border transition-all text-sm ";
            if (!answered) {
              cls += selected === i
                ? "border-accent bg-accent/10"
                : "border-card-border bg-background hover:border-accent/50";
            } else if (i === step.correctIndex) {
              cls += "border-success bg-success/10 text-success";
            } else if (i === selected) {
              cls += "border-error bg-error/10 text-error";
            } else {
              cls += "border-card-border bg-background opacity-50";
            }

            return (
              <button key={i} onClick={() => handleSelect(i)} className={cls} disabled={answered}>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-mono shrink-0">
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
        <Card className={isCorrect ? "bg-success/5 border-success/20" : "bg-error/5 border-error/20"}>
          <div className="flex items-start gap-2">
            {isCorrect ? (
              <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
            ) : (
              <XCircle size={18} className="text-error shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-semibold mb-1">{isCorrect ? "Правильно!" : "Неверно!"}</p>
              <p className="text-xs text-muted">{step.explanation}</p>
            </div>
          </div>
        </Card>
      )}

      {answered && (
        <button
          onClick={() => onComplete(isCorrect ? 1 : 0, 1)}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <span>Далее</span>
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
