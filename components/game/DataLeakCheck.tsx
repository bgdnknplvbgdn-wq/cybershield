"use client";

import { useState } from "react";
import type { DataLeakCheckStep } from "@/lib/scenario-types";
import { Card, Badge } from "@/components/shared";
import { AlertTriangle, CheckCircle2, XCircle, ChevronRight, Database } from "lucide-react";

interface DataLeakCheckProps {
  step: DataLeakCheckStep;
  onComplete: (score: number, maxScore: number) => void;
}

export function DataLeakCheck({ step, onComplete }: DataLeakCheckProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState(false);

  const handleToggle = (idx: number) => {
    if (completed) return;
    const next = new Set(selected);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setSelected(next);
  };

  const handleSubmit = () => {
    setCompleted(true);
  };

  const correctActions = step.actions.filter((a) => a.correct);
  const correctlySelected = [...selected].filter((i) => step.actions[i].correct).length;
  const incorrectlySelected = [...selected].filter((i) => !step.actions[i].correct).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Database size={18} className="text-error" />
        <h3 className="font-semibold text-sm">Утечка данных обнаружена!</h3>
      </div>

      <Card className="bg-error/5 border-error/20">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={16} className="text-error" />
          <span className="text-sm font-semibold text-error">Затронутые сервисы:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {step.leakedServices.map((svc, i) => (
            <Badge key={i} variant="error">{svc}</Badge>
          ))}
        </div>
      </Card>

      <p className="text-xs text-muted font-mono">ВЫБЕРИ ПРАВИЛЬНЫЕ ДЕЙСТВИЯ:</p>

      <div className="space-y-2">
        {step.actions.map((action, i) => {
          const isSelected = selected.has(i);
          let cls = "w-full text-left p-3 rounded-btn border transition-all text-sm ";
          if (completed) {
            if (isSelected && action.correct) cls += "border-success bg-success/5";
            else if (isSelected && !action.correct) cls += "border-error bg-error/5";
            else if (!isSelected && action.correct) cls += "border-warning bg-warning/5";
            else cls += "border-card-border bg-background opacity-50";
          } else {
            cls += isSelected
              ? "border-accent bg-accent/10"
              : "border-card-border bg-background hover:border-accent/50";
          }

          return (
            <button key={i} onClick={() => handleToggle(i)} disabled={completed} className={cls}>
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                  isSelected ? "border-accent bg-accent text-foreground" : "border-card-border"
                }`}>
                  {completed && isSelected && action.correct && <CheckCircle2 size={12} />}
                  {completed && isSelected && !action.correct && <XCircle size={12} />}
                  {!completed && isSelected && <span className="text-xs">✓</span>}
                </span>
                <div>
                  <span>{action.action}</span>
                  {completed && <p className="text-xs text-muted mt-0.5">{action.explanation}</p>}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {!completed && selected.size >= step.minCorrectActions && (
        <button onClick={handleSubmit} className="btn-primary w-full flex items-center justify-center gap-2">
          <span>Подтвердить</span>
          <ChevronRight size={18} />
        </button>
      )}

      {completed && (
        <div className="space-y-3">
          <Card className="bg-accent/5 border-accent/20 text-center">
            <p className="text-sm font-semibold">
              Верных действий: {correctlySelected}/{correctActions.length}
            </p>
            {incorrectlySelected > 0 && (
              <p className="text-xs text-error mt-1">Ошибочных: {incorrectlySelected}</p>
            )}
          </Card>
          <button
            onClick={() => onComplete(Math.max(correctlySelected - incorrectlySelected, 0), correctActions.length)}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <span>Далее</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
