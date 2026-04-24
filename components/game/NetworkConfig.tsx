"use client";

import { useState } from "react";
import type { NetworkConfigStep } from "@/lib/scenario-types";
import { Card, Badge } from "@/components/shared";
import { Wifi, CheckCircle2, XCircle, AlertTriangle, ChevronRight, Shield } from "lucide-react";

interface NetworkConfigProps {
  step: NetworkConfigStep;
  onComplete: (score: number, maxScore: number) => void;
}

export function NetworkConfig({ step, onComplete }: NetworkConfigProps) {
  const [fixedDevices, setFixedDevices] = useState<Set<number>>(new Set());
  const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
  const [taskAnswers, setTaskAnswers] = useState<boolean[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showTaskResult, setShowTaskResult] = useState(false);
  const [phase, setPhase] = useState<"devices" | "tasks" | "done">("devices");

  const vulnerableDevices = step.devices.filter((d) => d.vulnerable);
  const allFixed = fixedDevices.size >= vulnerableDevices.length;

  const handleFixDevice = (idx: number) => {
    if (!step.devices[idx].vulnerable) return;
    setFixedDevices((prev) => new Set(prev).add(idx));
  };

  const handleTaskAnswer = (answerIdx: number) => {
    if (showTaskResult) return;
    setSelectedAnswer(answerIdx);
    setShowTaskResult(true);
    const correct = answerIdx === step.tasks[currentTaskIdx].correctIndex;
    setTaskAnswers((prev) => [...prev, correct]);
  };

  const nextTask = () => {
    if (currentTaskIdx < step.tasks.length - 1) {
      setCurrentTaskIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowTaskResult(false);
    } else {
      setPhase("done");
    }
  };

  if (phase === "devices") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Wifi size={18} className="text-accent" />
          <h3 className="font-semibold text-sm font-cyber tracking-wider">ЗАЩИТИ УСТРОЙСТВА</h3>
          <Badge variant="accent">{fixedDevices.size}/{vulnerableDevices.length}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {step.devices.map((device, i) => {
            const isFixed = fixedDevices.has(i);
            const isVulnerable = device.vulnerable;

            return (
              <Card
                key={i}
                className={`text-center cursor-pointer transition-all ${
                  isFixed ? "bg-success/5 border-success/20" : isVulnerable ? "hover:border-error/50" : "opacity-70"
                }`}
                onClick={() => handleFixDevice(i)}
              >
                <div className="text-3xl mb-2">{device.icon}</div>
                <p className="text-sm font-semibold">{device.name}</p>
                {isFixed && (
                  <div className="mt-2">
                    <Badge variant="success">Защищено</Badge>
                    <p className="text-xs text-success mt-1">{device.fix}</p>
                  </div>
                )}
                {isVulnerable && !isFixed && (
                  <div className="mt-2">
                    <AlertTriangle size={14} className="text-error mx-auto" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {allFixed && (
          <button
            onClick={() => setPhase("tasks")}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Shield size={18} />
            <span className="font-cyber tracking-wider">НАСТРОИТЬ СЕТЬ</span>
          </button>
        )}
      </div>
    );
  }

  if (phase === "tasks") {
    const task = step.tasks[currentTaskIdx];
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Wifi size={18} className="text-accent" />
          <h3 className="font-semibold text-sm font-cyber tracking-wider">НАСТРОЙКА СЕТИ</h3>
          <Badge variant="accent">{currentTaskIdx + 1}/{step.tasks.length}</Badge>
        </div>

        <Card>
          <h4 className="font-semibold text-sm mb-3">{task.question}</h4>
          <div className="space-y-2">
            {task.options.map((opt, i) => {
              let cls = "w-full text-left p-3 rounded-btn border transition-all text-sm ";
              if (!showTaskResult) {
                cls += "border-card-border bg-background hover:border-accent/50";
              } else if (i === task.correctIndex) {
                cls += "border-success bg-success/10 text-success";
              } else if (i === selectedAnswer) {
                cls += "border-error bg-error/10 text-error";
              } else {
                cls += "border-card-border bg-background opacity-50";
              }
              return (
                <button key={i} onClick={() => handleTaskAnswer(i)} className={cls} disabled={showTaskResult}>
                  <div className="flex items-center gap-2">
                    {showTaskResult && i === task.correctIndex && <CheckCircle2 size={14} />}
                    {showTaskResult && i === selectedAnswer && i !== task.correctIndex && <XCircle size={14} />}
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {showTaskResult && (
          <>
            <Card className={selectedAnswer === task.correctIndex ? "bg-success/5 border-success/20" : "bg-error/5 border-error/20"}>
              <p className="text-xs text-muted">{task.explanation}</p>
            </Card>
            <button onClick={nextTask} className="btn-primary w-full flex items-center justify-center gap-2">
              <span>{currentTaskIdx < step.tasks.length - 1 ? "Следующий вопрос" : "Завершить"}</span>
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
    );
  }

  const correctTasks = taskAnswers.filter(Boolean).length;
  return (
    <div className="space-y-4">
      <Card className="bg-success/5 border-success/20 text-center">
        <CheckCircle2 size={32} className="text-success mx-auto mb-2" />
        <p className="text-sm font-semibold">Сеть настроена!</p>
        <p className="text-xs text-muted mt-1">Правильных ответов: {correctTasks}/{step.tasks.length}</p>
      </Card>
      <button
        onClick={() => onComplete(fixedDevices.size + correctTasks, vulnerableDevices.length + step.tasks.length)}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <span>Далее</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
