"use client";

import { useState } from "react";
import type { EmailInspectStep } from "@/lib/scenario-types";
import { Card, Badge } from "@/components/shared";
import { Mail, AlertTriangle, CheckCircle2, Search, ChevronRight } from "lucide-react";

interface EmailInspectorProps {
  step: EmailInspectStep;
  onComplete: (score: number, maxScore: number) => void;
}

export function EmailInspector({ step, onComplete }: EmailInspectorProps) {
  const [found, setFound] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);

  const handleFind = (id: string) => {
    if (completed) return;
    const next = new Set(found);
    next.add(id);
    setFound(next);

    if (next.size >= step.minToFind) {
      setCompleted(true);
    }
  };

  const allFound = found.size >= step.suspiciousElements.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Search size={18} className="text-accent" />
        <h3 className="font-semibold text-sm">Найди подозрительные элементы в письме</h3>
        <Badge variant="accent">{found.size}/{step.suspiciousElements.length}</Badge>
      </div>

      <Card className="bg-[#1a1a2e] border-card-border">
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-card-border">
            <Mail size={16} className="text-muted" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted font-mono">От:</div>
              <button
                onClick={() => handleFind("domain")}
                className={`text-sm font-mono transition-all ${
                  found.has("domain")
                    ? "text-error line-through"
                    : "text-foreground hover:text-error hover:bg-error/10 px-1 -mx-1 rounded"
                }`}
              >
                {step.from}
              </button>
            </div>
          </div>

          <div className="pb-3 border-b border-card-border">
            <div className="text-xs text-muted font-mono">Тема:</div>
            <p className="text-sm font-semibold">{step.subject}</p>
          </div>

          <div className="text-sm leading-relaxed whitespace-pre-line">
            {step.body.split(/(\b\S+\b)/g).map((part, i) => {
              const element = step.suspiciousElements.find((el) =>
                part.toLowerCase().includes(el.text.toLowerCase().split(" ")[0]) &&
                el.id !== "domain"
              );

              if (element && !found.has(element.id)) {
                return (
                  <button
                    key={i}
                    onClick={() => handleFind(element.id)}
                    className="text-foreground hover:text-error hover:bg-error/10 rounded transition-all cursor-pointer"
                  >
                    {part}
                  </button>
                );
              }

              if (element && found.has(element.id)) {
                return (
                  <span key={i} className="text-error bg-error/10 rounded px-0.5">
                    {part}
                  </span>
                );
              }

              return <span key={i}>{part}</span>;
            })}
          </div>
        </div>
      </Card>

      {found.size > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted font-mono uppercase tracking-wider">Обнаружено угроз: {found.size}</p>
          {step.suspiciousElements
            .filter((el) => found.has(el.id))
            .map((el) => (
              <Card key={el.id} className="bg-error/5 border-error/20 p-3 animate-slide-in-up animate-threat-pulse">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={14} className="text-error shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-error">{el.text}</span>
                    <p className="text-xs text-muted mt-0.5">{el.hint}</p>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {completed && (
        <div className="space-y-3 animate-slide-in-up">
          <Card className="bg-success/5 border-success/20 neon-glow-success">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-success" />
              <span className="text-sm font-semibold text-success font-cyber tracking-wider">
                {allFound ? "ВСЕ УГРОЗЫ ОБНАРУЖЕНЫ" : `НАЙДЕНО ${found.size} ИЗ ${step.suspiciousElements.length}`}
              </span>
            </div>
          </Card>
          <button
            onClick={() => onComplete(found.size, step.suspiciousElements.length)}
            className="btn-primary w-full flex items-center justify-center gap-2 font-cyber tracking-wider"
          >
            <span>ДАЛЕЕ</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
