"use client";

import { useState } from "react";
import type { DialogStep, DialogChoice } from "@/lib/scenario-types";
import { Card, Badge } from "@/components/shared";
import { Phone, CheckCircle2, XCircle, ChevronRight, Shield, Building2, UserCircle, Clock } from "lucide-react";

interface DialogSceneProps {
  step: DialogStep;
  onComplete: (score: number, maxScore: number) => void;
}

interface ChatMessage {
  sender: "caller" | "player" | "system";
  text: string;
  isCorrect?: boolean;
}

function getCallerAvatar(callerName: string): { emoji: string; color: string; bgColor: string; hex: string } {
  const name = callerName.toLowerCase();
  if (name.includes("банк") || name.includes("сотрудник")) return { emoji: "🏦", color: "text-yellow-400", bgColor: "bg-yellow-500/20", hex: "#eab308" };
  if (name.includes("друг") || name.includes("одноклассн") || name.includes("знакомый")) return { emoji: "👤", color: "text-purple-400", bgColor: "bg-purple-500/20", hex: "#a855f7" };
  if (name.includes("почт") || name.includes("доставк")) return { emoji: "📦", color: "text-blue-400", bgColor: "bg-blue-500/20", hex: "#3b82f6" };
  if (name.includes("мастер") || name.includes("домофон") || name.includes("техник")) return { emoji: "🔧", color: "text-orange-400", bgColor: "bg-orange-500/20", hex: "#f97316" };
  if (name.includes("начальн") || name.includes("директор")) return { emoji: "👔", color: "text-cyan-400", bgColor: "bg-cyan-500/20", hex: "#22d3ee" };
  return { emoji: "📞", color: "text-error", bgColor: "bg-error/20", hex: "#ef4444" };
}

export function DialogScene({ step, onComplete }: DialogSceneProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalChoices, setTotalChoices] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [currentChoices, setCurrentChoices] = useState<DialogChoice[] | null>(null);

  const callerAvatar = getCallerAvatar(step.callerName);

  const processNextMessage = (idx: number) => {
    if (idx >= step.messages.length) {
      setFinished(true);
      return;
    }

    const msg = step.messages[idx];

    if (msg.sender === "caller") {
      setChatLog((prev) => [...prev, { sender: "caller", text: msg.text }]);
      const nextIdx = idx + 1;
      if (nextIdx < step.messages.length && step.messages[nextIdx].choices) {
        setTimeout(() => {
          setCurrentChoices(step.messages[nextIdx].choices || null);
          setShowChoices(true);
          setMessageIndex(nextIdx + 1);
        }, 800);
      } else {
        setTimeout(() => processNextMessage(nextIdx), 800);
      }
    } else if (msg.choices) {
      setCurrentChoices(msg.choices);
      setShowChoices(true);
      setMessageIndex(idx + 1);
    }
  };

  const handleChoice = (choice: DialogChoice) => {
    setShowChoices(false);
    setCurrentChoices(null);

    setChatLog((prev) => [
      ...prev,
      { sender: "player", text: choice.text, isCorrect: choice.correct },
    ]);

    setTotalChoices((prev) => prev + 1);
    if (choice.correct) {
      setCorrectCount((prev) => prev + 1);
    }

    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        { sender: "system", text: choice.explanation },
      ]);

      if (choice.response) {
        setTimeout(() => {
          setChatLog((prev) => [
            ...prev,
            { sender: "caller", text: choice.response },
          ]);
          setTimeout(() => processNextMessage(messageIndex), 800);
        }, 600);
      } else {
        setTimeout(() => processNextMessage(messageIndex), 600);
      }
    }, 400);
  };

  const startDialog = () => {
    processNextMessage(0);
  };

  if (chatLog.length === 0 && !showChoices) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="w-24 h-24 mx-auto rounded-2xl border-2 flex items-center justify-center mb-4 relative"
            style={{
              borderColor: `color-mix(in srgb, ${callerAvatar.hex} 40%, transparent)`,
              background: `color-mix(in srgb, ${callerAvatar.hex} 10%, transparent)`,
            }}
          >
            <span className="text-5xl">{callerAvatar.emoji}</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full animate-cyber-pulse flex items-center justify-center">
              <Phone size={10} className="text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 font-cyber tracking-wider">ВХОДЯЩИЙ ЗВОНОК</h3>
          <p className="text-error text-sm font-mono mb-1">{step.callerName}</p>
          <p className="text-xs text-muted font-mono">{step.callerRole}</p>
        </div>
        <button onClick={startDialog} className="btn-primary w-full animate-pulse-glow font-cyber tracking-wider">
          ОТВЕТИТЬ НА ЗВОНОК
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2 px-2">
        <div className={`w-6 h-6 rounded-full ${callerAvatar.bgColor} flex items-center justify-center`}>
          <span className="text-xs">{callerAvatar.emoji}</span>
        </div>
        <span className="text-sm font-mono text-error">Звонок: {step.callerName}</span>
      </div>

      <div className="space-y-3 max-h-[50dvh] overflow-y-auto px-1">
        {chatLog.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "player" ? "justify-end" : msg.sender === "system" ? "justify-center" : "justify-start"}`}
          >
            {msg.sender === "system" ? (
              <div className="bg-accent/10 rounded-xl px-3 py-2 max-w-[85%]">
                <p className="text-xs text-accent">{msg.text}</p>
              </div>
            ) : (
              <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === "player" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === "caller" ? callerAvatar.bgColor : "bg-accent/20"
                }`}>
                  {msg.sender === "caller" ? (
                    <span className="text-sm">{callerAvatar.emoji}</span>
                  ) : (
                    <Shield size={16} className="text-accent" />
                  )}
                </div>
                <div className={`rounded-2xl px-3 py-2 ${
                  msg.sender === "caller"
                    ? "bg-card/80 rounded-bl-sm"
                    : msg.isCorrect
                    ? "bg-success/15 rounded-br-sm"
                    : "bg-error/15 rounded-br-sm"
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  {msg.sender === "player" && msg.isCorrect !== undefined && (
                    <div className="flex items-center gap-1 mt-1">
                      {msg.isCorrect ? (
                        <CheckCircle2 size={12} className="text-success" />
                      ) : (
                        <XCircle size={12} className="text-error" />
                      )}
                      <span className={`text-xs ${msg.isCorrect ? "text-success" : "text-error"}`}>
                        {msg.isCorrect ? "Верный выбор" : "Ошибка"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showChoices && currentChoices && (
        <div className="space-y-2 pt-3">
          <p className="text-xs text-muted font-mono px-1">ВЫБЕРИ ОТВЕТ:</p>
          {currentChoices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleChoice(choice)}
              className="w-full text-left p-3 rounded-xl bg-background/50 hover:bg-accent/5 transition-all text-sm border border-transparent hover:border-accent/30"
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}

      {finished && (
        <div className="space-y-3 pt-3">
          <Card className="bg-accent/5 border-accent/20">
            <div className="text-center">
              <p className="text-sm font-semibold mb-1">
                Результат: {correctCount}/{totalChoices} верных ответов
              </p>
              <Badge variant={correctCount >= totalChoices / 2 ? "success" : "error"}>
                {correctCount >= totalChoices / 2 ? "Хорошо!" : "Нужно практиковаться"}
              </Badge>
            </div>
          </Card>
          <button
            onClick={() => onComplete(correctCount, totalChoices)}
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
