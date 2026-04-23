"use client";

import { useState } from "react";
import type { PermissionCheckStep } from "@/lib/scenario-types";
import { Card, Badge } from "@/components/shared";
import { Smartphone, AlertTriangle, CheckCircle2, ChevronRight, Shield } from "lucide-react";

interface PermissionCheckerProps {
  step: PermissionCheckStep;
  onComplete: (score: number, maxScore: number) => void;
}

export function PermissionChecker({ step, onComplete }: PermissionCheckerProps) {
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState(false);

  const suspiciousPerms = step.permissions.filter((p) => p.suspicious);

  const handleToggle = (idx: number) => {
    if (completed) return;
    const next = new Set(marked);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setMarked(next);
  };

  const handleSubmit = () => {
    setCompleted(true);
  };

  const correctlyMarked = [...marked].filter((i) => step.permissions[i].suspicious).length;
  const incorrectlyMarked = [...marked].filter((i) => !step.permissions[i].suspicious).length;
  const score = correctlyMarked - incorrectlyMarked;
  const canComplete = marked.size >= step.minToFind;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Smartphone size={18} className="text-accent" />
        <h3 className="font-semibold text-sm">Проверь разрешения приложения</h3>
      </div>

      <Card className="text-center">
        <div className="text-4xl mb-2">{step.appIcon}</div>
        <h4 className="font-bold text-base">{step.appName}</h4>
        <p className="text-xs text-muted mt-1">Отметь подозрительные разрешения</p>
      </Card>

      <div className="space-y-2">
        {step.permissions.map((perm, i) => {
          const isMarked = marked.has(i);
          let borderCls = "border-card-border";
          if (completed) {
            if (isMarked && perm.suspicious) borderCls = "border-success bg-success/5";
            else if (isMarked && !perm.suspicious) borderCls = "border-error bg-error/5";
            else if (!isMarked && perm.suspicious) borderCls = "border-warning bg-warning/5";
          } else if (isMarked) {
            borderCls = "border-error bg-error/10";
          }

          return (
            <button
              key={i}
              onClick={() => handleToggle(i)}
              disabled={completed}
              className={`w-full text-left p-3 rounded-btn border transition-all ${borderCls}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{perm.icon}</span>
                <div className="flex-1">
                  <span className="text-sm font-semibold">{perm.name}</span>
                  {completed && (
                    <p className="text-xs text-muted mt-0.5">{perm.reason}</p>
                  )}
                </div>
                {isMarked && !completed && (
                  <AlertTriangle size={16} className="text-error" />
                )}
                {completed && isMarked && perm.suspicious && (
                  <CheckCircle2 size={16} className="text-success" />
                )}
                {completed && !isMarked && perm.suspicious && (
                  <AlertTriangle size={16} className="text-warning" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!completed && canComplete && (
        <button onClick={handleSubmit} className="btn-primary w-full flex items-center justify-center gap-2">
          <Shield size={18} />
          <span>Подтвердить выбор</span>
        </button>
      )}

      {completed && (
        <div className="space-y-3">
          <Card className="bg-accent/5 border-accent/20 text-center">
            <p className="text-sm font-semibold">
              Найдено: {correctlyMarked}/{suspiciousPerms.length} подозрительных
            </p>
            {incorrectlyMarked > 0 && (
              <p className="text-xs text-error mt-1">Ложных срабатываний: {incorrectlyMarked}</p>
            )}
          </Card>
          <button
            onClick={() => onComplete(Math.max(score, 0), suspiciousPerms.length)}
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
