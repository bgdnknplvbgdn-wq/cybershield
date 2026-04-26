"use client";

import { useState } from "react";
import type { URLAnalyzerStep } from "@/lib/scenario-types";
import { Card, Badge } from "@/components/shared";
import { Link2, AlertTriangle, CheckCircle2, ChevronRight, Globe, Lock, Unlock } from "lucide-react";

interface URLAnalyzerProps {
  step: URLAnalyzerStep;
  onComplete: (score: number, maxScore: number) => void;
}

export function URLAnalyzer({ step, onComplete }: URLAnalyzerProps) {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const totalAnswered = Object.keys(answers).length;
  const allAnswered = totalAnswered === step.urls.length;
  const correctCount = step.urls.filter(
    (u, i) => answers[i] === u.dangerous
  ).length;

  function handleAnswer(index: number, isDangerous: boolean) {
    if (answers[index] !== undefined && answers[index] !== null) return;
    setAnswers((prev) => ({ ...prev, [index]: isDangerous }));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Globe size={18} className="text-accent" />
        <h3 className="text-sm font-bold font-cyber tracking-wider uppercase">
          Анализ ссылок
        </h3>
        <Badge variant="accent" className="ml-auto">
          {totalAnswered}/{step.urls.length}
        </Badge>
      </div>

      <p className="text-xs text-muted">
        Определи, какие ссылки безопасны, а какие ведут на мошеннические сайты.
      </p>

      <div className="space-y-3">
        {step.urls.map((url, i) => {
          const answered = answers[i] !== undefined && answers[i] !== null;
          const wasCorrect = answered && answers[i] === url.dangerous;

          return (
            <Card
              key={i}
              className={`transition-all ${
                answered
                  ? wasCorrect
                    ? "border-success/30 bg-success/5"
                    : "border-error/30 bg-error/5 animate-threat-pulse"
                  : ""
              }`}
            >
              {/* URL display with highlighted parts */}
              <div className="flex items-center gap-2 mb-3 p-2 rounded bg-background/50 border border-card-border font-mono text-xs overflow-x-auto">
                {url.isHttps ? (
                  <Lock size={14} className="text-success shrink-0" />
                ) : (
                  <Unlock size={14} className="text-error shrink-0" />
                )}
                <span className={url.isHttps ? "text-success" : "text-error"}>
                  {url.isHttps ? "https" : "http"}://
                </span>
                <span className={url.dangerous ? "text-error font-bold" : "text-foreground"}>
                  {url.displayDomain}
                </span>
                <span className="text-muted">{url.path}</span>
              </div>

              {/* Context */}
              <p className="text-xs text-muted mb-3 italic">&ldquo;{url.context}&rdquo;</p>

              {!answered ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAnswer(i, false)}
                    className="flex-1 py-2 px-3 rounded-btn border border-success/30 text-success text-xs font-mono uppercase tracking-wider hover:bg-success/10 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={14} />
                    Безопасно
                  </button>
                  <button
                    onClick={() => handleAnswer(i, true)}
                    className="flex-1 py-2 px-3 rounded-btn border border-error/30 text-error text-xs font-mono uppercase tracking-wider hover:bg-error/10 transition-all flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle size={14} />
                    Опасно
                  </button>
                </div>
              ) : (
                <div className="animate-slide-in-up">
                  <div className="flex items-start gap-2">
                    {wasCorrect ? (
                      <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle size={16} className="text-error shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs font-mono font-bold mb-0.5" style={{ color: wasCorrect ? "#00ff41" : "#ff2d55" }}>
                        {wasCorrect ? "ВЕРНО" : "ОШИБКА"}
                      </p>
                      <p className="text-xs text-muted">{url.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {allAnswered && (
        <div className="space-y-3 animate-slide-in-up">
          <Card glow={correctCount === step.urls.length ? "success" : "accent"} className="p-3">
            <div className="flex items-center gap-2">
              <Link2 size={18} className={correctCount === step.urls.length ? "text-success" : "text-accent"} />
              <p className="text-sm font-semibold font-cyber tracking-wider" style={{ color: correctCount === step.urls.length ? "#00ff41" : "#00ffcc" }}>
                РЕЗУЛЬТАТ: {correctCount}/{step.urls.length}
              </p>
            </div>
          </Card>
          <button
            onClick={() => onComplete(correctCount, step.urls.length)}
            className="btn-primary w-full flex items-center justify-center gap-2 font-cyber tracking-wider"
          >
            ДАЛЕЕ <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
