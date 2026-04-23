"use client";

import { useState, useMemo } from "react";
import type { PasswordGameStep } from "@/lib/scenario-types";
import { Card, Badge } from "@/components/shared";
import { Key, Shield, ChevronRight, Zap } from "lucide-react";

interface PasswordGameProps {
  step: PasswordGameStep;
  onComplete: (score: number, maxScore: number) => void;
}

function analyzePassword(password: string): { score: number; crackTime: string; checks: { label: string; passed: boolean }[] } {
  const checks = [
    { label: "Минимум 8 символов", passed: password.length >= 8 },
    { label: "Минимум 12 символов", passed: password.length >= 12 },
    { label: "Содержит цифры", passed: /\d/.test(password) },
    { label: "Содержит заглавные буквы", passed: /[A-ZА-ЯЁ]/.test(password) },
    { label: "Содержит строчные буквы", passed: /[a-zа-яё]/.test(password) },
    { label: "Содержит спецсимволы (!@#$...)", passed: /[^a-zA-Zа-яА-ЯёЁ0-9\s]/.test(password) },
    { label: "Длиннее 16 символов", passed: password.length >= 16 },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  const common = ["123456", "password", "qwerty", "111111", "abc123", "admin", "пароль", "12345678"];
  if (common.includes(password.toLowerCase())) {
    return { score: 0, crackTime: "Мгновенно", checks };
  }

  let time = "Мгновенно";
  if (score >= 90) time = "10 000+ лет";
  else if (score >= 70) time = "100 лет";
  else if (score >= 50) time = "2 месяца";
  else if (score >= 30) time = "3 часа";
  else if (score >= 15) time = "10 минут";

  return { score, crackTime: time, checks };
}

export function PasswordGame({ step, onComplete }: PasswordGameProps) {
  const [userPassword, setUserPassword] = useState("");
  const [showExamples, setShowExamples] = useState(false);
  const [completed, setCompleted] = useState(false);

  const analysis = useMemo(() => analyzePassword(userPassword), [userPassword]);

  const scoreColor = analysis.score >= 70 ? "text-success" : analysis.score >= 40 ? "text-warning" : "text-error";
  const barColor = analysis.score >= 70 ? "bg-success" : analysis.score >= 40 ? "bg-warning" : "bg-error";

  const handleDone = () => {
    setCompleted(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Key size={18} className="text-accent" />
        <h3 className="font-semibold text-sm">Создай надёжный пароль</h3>
      </div>

      <Card>
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="Введи пароль..."
              className="input-field text-lg font-mono pr-16"
              disabled={completed}
            />
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold ${scoreColor}`}>
              {userPassword.length > 0 ? `${analysis.score}%` : ""}
            </span>
          </div>

          {userPassword.length > 0 && (
            <>
              <div className="w-full h-2 bg-card-border rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColor} rounded-full transition-all duration-300`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted font-mono">Время взлома:</span>
                <span className={`text-sm font-bold font-mono ${scoreColor}`}>{analysis.crackTime}</span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {analysis.checks.map((check, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className={check.passed ? "text-success" : "text-muted"}>
                      {check.passed ? "●" : "○"}
                    </span>
                    <span className={check.passed ? "text-foreground" : "text-muted"}>{check.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>

      <button
        onClick={() => setShowExamples(!showExamples)}
        className="text-xs text-accent font-mono hover:underline"
      >
        {showExamples ? "Скрыть примеры" : "Показать примеры паролей"}
      </button>

      {showExamples && (
        <div className="space-y-2">
          {step.testPasswords.map((tp, i) => (
            <Card key={i} className="p-3">
              <div className="flex items-center justify-between">
                <code className="text-xs font-mono text-foreground">{tp.password}</code>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{tp.crackTime}</span>
                  <Badge variant={tp.score >= 70 ? "success" : tp.score >= 30 ? "warning" : "error"}>
                    {tp.score}%
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-accent/5 border-accent/20">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={16} className="text-accent" />
          <span className="text-xs font-semibold text-accent font-mono">СОВЕТЫ</span>
        </div>
        <ul className="space-y-1">
          {step.tips.map((tip, i) => (
            <li key={i} className="text-xs text-muted flex items-start gap-2">
              <span className="text-accent mt-0.5">▸</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </Card>

      {!completed && userPassword.length >= 6 && (
        <button onClick={handleDone} className="btn-primary w-full flex items-center justify-center gap-2">
          <Shield size={18} />
          <span>Проверить и продолжить</span>
        </button>
      )}

      {completed && (
        <div className="space-y-3">
          <Card className={analysis.score >= 50 ? "bg-success/5 border-success/20" : "bg-warning/5 border-warning/20"}>
            <div className="text-center">
              <p className="text-sm font-semibold mb-1">
                Стойкость пароля: {analysis.score}%
              </p>
              <p className="text-xs text-muted">Время взлома: {analysis.crackTime}</p>
            </div>
          </Card>
          <button
            onClick={() => onComplete(analysis.score >= 70 ? 1 : 0, 1)}
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
