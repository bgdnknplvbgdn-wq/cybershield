"use client";

import { useState } from "react";
import type { LawMatchStep } from "@/lib/scenario-types";
import { Card, Badge } from "@/components/shared";
import { Scale, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

interface LawMatchProps {
  step: LawMatchStep;
  onComplete: (score: number, maxScore: number) => void;
}

export function LawMatch({ step, onComplete }: LawMatchProps) {
  const [currentCase, setCurrentCase] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const caseData = step.cases[currentCase];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    if (idx === caseData.correctIndex) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentCase < step.cases.length - 1) {
      setCurrentCase((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="space-y-4">
        <Card className="bg-accent/5 border-accent/20 text-center">
          <Scale size={32} className="text-accent mx-auto mb-2" />
          <p className="text-lg font-bold">Результат</p>
          <p className="text-sm text-muted mt-1">
            Правильно: {correctCount}/{step.cases.length}
          </p>
          <Badge variant={correctCount >= step.cases.length / 2 ? "success" : "warning"} className="mt-2">
            {correctCount >= step.cases.length ? "Отлично!" : correctCount >= step.cases.length / 2 ? "Хорошо!" : "Нужно изучать законы"}
          </Badge>
        </Card>
        <button
          onClick={() => onComplete(correctCount, step.cases.length)}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <span>Далее</span>
          <ChevronRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Scale size={18} className="text-accent" />
        <h3 className="font-semibold text-sm">Подбери закон к ситуации</h3>
        <Badge variant="accent">{currentCase + 1}/{step.cases.length}</Badge>
      </div>

      <Card className="bg-accent/5 border-accent/20">
        <p className="text-sm font-semibold">{caseData.situation}</p>
      </Card>

      <div className="space-y-2">
        {caseData.lawOptions.map((law, i) => {
          let cls = "w-full text-left p-3 rounded-btn border transition-all text-sm ";
          if (!showResult) {
            cls += "border-card-border bg-background hover:border-accent/50";
          } else if (i === caseData.correctIndex) {
            cls += "border-success bg-success/10 text-success";
          } else if (i === selectedAnswer) {
            cls += "border-error bg-error/10 text-error";
          } else {
            cls += "border-card-border bg-background opacity-50";
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} className={cls} disabled={showResult}>
              <div className="flex items-center gap-2">
                {showResult && i === caseData.correctIndex && <CheckCircle2 size={14} />}
                {showResult && i === selectedAnswer && i !== caseData.correctIndex && <XCircle size={14} />}
                <span>{law}</span>
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <>
          <Card className={selectedAnswer === caseData.correctIndex ? "bg-success/5 border-success/20" : "bg-error/5 border-error/20"}>
            <p className="text-xs text-muted">{caseData.explanation}</p>
          </Card>
          <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
            <span>{currentCase < step.cases.length - 1 ? "Следующий кейс" : "Завершить"}</span>
            <ChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}
