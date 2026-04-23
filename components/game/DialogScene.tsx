"use client";

import { useState } from "react";
import type { DialogStep, DialogChoice } from "@/lib/scenario-types";
import { Card, Badge } from "@/components/shared";
import { Phone, CheckCircle2, XCircle, ChevronRight, User, Shield } from "lucide-react";

interface DialogSceneProps {
  step: DialogStep;
  onComplete: (score: number, maxScore: number) => void;
}

interface ChatMessage {
  sender: "caller" | "player" | "system";
  text: string;
  isCorrect?: boolean;
}

export function DialogScene({ step, onComplete }: DialogSceneProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalChoices, setTotalChoices] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [currentChoices, setCurrentChoices] = useState<DialogChoice[] | null>(null);

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
          <div className="w-20 h-20 mx-auto rounded-full bg-error/20 flex items-center justify-center mb-4 animate-pulse">
            <Phone size={36} className="text-error" />
          </div>
          <h3 className="text-xl font-bold mb-2">Входящий звонок</h3>
          <p className="text-muted text-sm mb-1">{step.callerName}</p>
          <p className="text-xs text-muted">{step.callerRole}</p>
        </div>
        <button onClick={startDialog} className="btn-primary w-full animate-pulse-glow">
          Ответить на звонок
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2 px-2">
        <Phone size={16} className="text-error" />
        <span className="text-sm font-mono text-error">Звонок: {step.callerName}</span>
      </div>

      <div className="space-y-3 max-h-[50dvh] overflow-y-auto px-1">
        {chatLog.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "player" ? "justify-end" : msg.sender === "system" ? "justify-center" : "justify-start"}`}
          >
            {msg.sender === "system" ? (
              <div className="bg-accent/10 border border-accent/20 rounded-btn px-3 py-2 max-w-[85%]">
                <p className="text-xs text-accent">{msg.text}</p>
              </div>
            ) : (
              <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === "player" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === "caller" ? "bg-error/20" : "bg-accent/20"
                }`}>
                  {msg.sender === "caller" ? (
                    <User size={14} className="text-error" />
                  ) : (
                    <Shield size={14} className="text-accent" />
                  )}
                </div>
                <div className={`rounded-2xl px-3 py-2 ${
                  msg.sender === "caller"
                    ? "bg-card border border-card-border rounded-bl-sm"
                    : msg.isCorrect
                    ? "bg-success/20 border border-success/30 rounded-br-sm"
                    : "bg-error/20 border border-error/30 rounded-br-sm"
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
        <div className="space-y-2 border-t border-card-border pt-3">
          <p className="text-xs text-muted font-mono">ВЫБЕРИ ОТВЕТ:</p>
          {currentChoices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleChoice(choice)}
              className="w-full text-left p-3 rounded-btn border border-card-border bg-background hover:border-accent/50 transition-all text-sm"
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}

      {finished && (
        <div className="space-y-3 border-t border-card-border pt-3">
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
