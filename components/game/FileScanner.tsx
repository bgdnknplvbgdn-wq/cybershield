"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Shield, FileWarning, ArrowRight } from "lucide-react";
import type { FileScannerStep } from "@/lib/scenario-types";
import { Card, Badge } from "@/components/shared";

interface FileScannerProps {
  step: FileScannerStep;
  onComplete: () => void;
}

export default function FileScanner({ step, onComplete }: FileScannerProps) {
  const [scanned, setScanned] = useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const dangerousCount = step.files.filter((f) => f.dangerous).length;
  const foundDangerous = step.files.filter(
    (f, i) => f.dangerous && scanned[i]
  ).length;
  const completed = foundDangerous >= step.minToFind;

  function handleScan(index: number) {
    if (revealed[index]) return;
    setScanned((prev) => ({ ...prev, [index]: true }));
    setRevealed((prev) => ({ ...prev, [index]: true }));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileWarning size={18} className="text-error" />
        <h3 className="text-sm font-bold font-cyber tracking-wider uppercase">
          Проверь файлы в папке «Загрузки»
        </h3>
        <Badge variant="accent" className="ml-auto">
          {foundDangerous}/{dangerousCount}
        </Badge>
      </div>

      <p className="text-xs text-muted">
        Нажми на файлы, чтобы проверить их. Найди все опасные файлы!
      </p>

      <div className="space-y-2">
        {step.files.map((file, i) => {
          const isRevealed = revealed[i];
          const isDangerous = file.dangerous;

          let borderClass = "border-card-border hover:border-accent/50";
          if (isRevealed && isDangerous) {
            borderClass = "border-error/50";
          } else if (isRevealed && !isDangerous) {
            borderClass = "border-success/50";
          }

          return (
            <button
              key={i}
              onClick={() => handleScan(i)}
              disabled={isRevealed}
              className={`w-full text-left p-3 rounded-lg border bg-card-alt transition-all ${borderClass} cyber-corners`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{file.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-mono font-semibold ${
                    isRevealed && isDangerous ? "text-error line-through" : 
                    isRevealed && !isDangerous ? "text-success" : "text-foreground"
                  }`}>
                    {file.name}
                  </p>
                  <div className="flex gap-3 mt-0.5">
                    <span className="text-xs text-muted">{file.size}</span>
                    <span className="text-xs text-muted">{file.source}</span>
                  </div>
                </div>
                {isRevealed && isDangerous && (
                  <AlertTriangle size={18} className="text-error shrink-0" />
                )}
                {isRevealed && !isDangerous && (
                  <CheckCircle2 size={18} className="text-success shrink-0" />
                )}
                {!isRevealed && (
                  <Shield size={16} className="text-muted shrink-0" />
                )}
              </div>

              {isRevealed && (
                <Card className={`mt-2 p-2 ${
                  isDangerous ? "bg-error/5 border-error/20" : "bg-success/5 border-success/20"
                }`}>
                  <p className="text-xs">
                    {isDangerous ? (
                      <span className="text-error font-semibold">ОПАСНО: </span>
                    ) : (
                      <span className="text-success font-semibold">БЕЗОПАСНО: </span>
                    )}
                    {file.reason}
                  </p>
                </Card>
              )}
            </button>
          );
        })}
      </div>

      {completed && (
        <>
          <Card glow="success" className="p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-success" />
              <p className="text-sm font-semibold text-success font-cyber tracking-wider">
                Найдено {foundDangerous} из {dangerousCount} опасных файлов!
              </p>
            </div>
          </Card>
          <button 
            onClick={onComplete} 
            className="w-full py-3 rounded-btn bg-accent text-background font-cyber tracking-wider uppercase text-sm font-bold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
          >
            Далее <ArrowRight size={16} />
          </button>
        </>
      )}
    </div>
  );
}
