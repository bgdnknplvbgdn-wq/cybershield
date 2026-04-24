"use client";

import { useState } from "react";
import type { CipherPuzzleStep } from "@/lib/scenario-types";
import { Card, Badge } from "@/components/shared";
import { Lock, Unlock, ChevronRight, HelpCircle } from "lucide-react";

interface CipherPuzzleProps {
  step: CipherPuzzleStep;
  onComplete: (score: number, maxScore: number) => void;
}

function caesarShift(text: string, shift: number): string {
  const upper = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
  const lower = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
  const upperEn = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerEn = "abcdefghijklmnopqrstuvwxyz";

  return text
    .split("")
    .map((ch) => {
      let idx = upper.indexOf(ch);
      if (idx !== -1) return upper[(idx + shift + upper.length) % upper.length];
      idx = lower.indexOf(ch);
      if (idx !== -1) return lower[(idx + shift + lower.length) % lower.length];
      idx = upperEn.indexOf(ch);
      if (idx !== -1) return upperEn[(idx + shift + upperEn.length) % upperEn.length];
      idx = lowerEn.indexOf(ch);
      if (idx !== -1) return lowerEn[(idx + shift + lowerEn.length) % lowerEn.length];
      return ch;
    })
    .join("");
}

export function CipherPuzzle({ step, onComplete }: CipherPuzzleProps) {
  const [shiftValue, setShiftValue] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [solved, setSolved] = useState(false);

  const decoded = caesarShift(step.encrypted, -shiftValue);
  const isCorrect = shiftValue === step.shift;

  const handleSolve = () => {
    setSolved(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Lock size={18} className="text-accent" />
        <h3 className="font-semibold text-sm">Шифр Цезаря — расшифруй сообщение</h3>
      </div>

      <Card className="bg-[#0a0a1a] border-accent/20 font-mono text-center">
        <p className="text-xs text-muted mb-2">ЗАШИФРОВАНО:</p>
        <p className="text-2xl tracking-widest text-error mb-4">{step.encrypted}</p>

        <div className="w-full h-px bg-card-border my-4" />

        <p className="text-xs text-muted mb-2">РЕЗУЛЬТАТ (сдвиг: {shiftValue}):</p>
        <p className={`text-2xl tracking-widest transition-colors ${isCorrect ? "text-success" : "text-foreground"}`}>
          {decoded}
        </p>
      </Card>

      <Card>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono">Сдвиг:</span>
            <Badge variant={isCorrect ? "success" : "accent"}>{shiftValue}</Badge>
          </div>
          <input
            type="range"
            min="0"
            max="32"
            value={shiftValue}
            onChange={(e) => setShiftValue(Number(e.target.value))}
            className="w-full accent-accent"
            disabled={solved}
          />
          <div className="flex justify-between text-xs text-muted font-mono">
            <span>0</span>
            <span>16</span>
            <span>32</span>
          </div>
        </div>
      </Card>

      {!showHint && !solved && (
        <button
          onClick={() => setShowHint(true)}
          className="flex items-center gap-2 text-xs text-muted hover:text-accent transition-colors"
        >
          <HelpCircle size={14} />
          <span>Показать подсказку</span>
        </button>
      )}

      {showHint && !solved && (
        <Card className="bg-accent/5 border-accent/20 p-3">
          <p className="text-xs text-accent">{step.hint}</p>
        </Card>
      )}

      {isCorrect && !solved && (
        <div className="space-y-3">
          <Card className="bg-success/5 border-success/20">
            <div className="flex items-center gap-2 justify-center">
              <Unlock size={18} className="text-success" />
              <span className="text-sm font-semibold text-success">Расшифровано!</span>
            </div>
          </Card>
          <button onClick={handleSolve} className="btn-primary w-full flex items-center justify-center gap-2">
            <span>Далее</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {solved && (
        <button
          onClick={() => onComplete(1, 1)}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <span>Далее</span>
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
