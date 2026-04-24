"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { AIScamChatStep } from "@/lib/scenario-types";
import { detectLeaks, type LeakWarning } from "@/lib/data-leak-detector";
import { getScamPrompt } from "@/lib/scam-prompts";
import { Card, Badge } from "@/components/shared";
import {
  MessageCircle,
  Send,
  Shield,
  User,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  X,
  Loader2,
} from "lucide-react";

interface AIScamChatProps {
  step: AIScamChatStep;
  onComplete: (score: number, maxScore: number) => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface DisplayMessage {
  sender: "scammer" | "player" | "system";
  text: string;
  warnings?: LeakWarning[];
}

export function AIScamChat({ step, onComplete }: AIScamChatProps) {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [apiMessages, setApiMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [leakCount, setLeakCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [activeWarning, setActiveWarning] = useState<LeakWarning | null>(null);
  const [allLeaks, setAllLeaks] = useState<LeakWarning[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeWarning]);

  const sendToAI = useCallback(async (newApiMessages: ChatMessage[]): Promise<string> => {
    try {
      const res = await fetch("/api/scam-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: step.scenarioId,
          messages: newApiMessages,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        return data.error || "Ошибка связи...";
      }

      const data = await res.json();
      return data.reply;
    } catch {
      return "Связь прервалась... Попробуйте ещё раз.";
    }
  }, [step.scenarioId]);

  const startChat = useCallback(() => {
    const prompt = getScamPrompt(step.scenarioId);
    setStarted(true);
    setMessages([{ sender: "scammer", text: prompt.firstMessage }]);
    setApiMessages([{ role: "assistant", content: prompt.firstMessage }]);
  }, [step.scenarioId]);

  const endChat = useCallback(() => {
    setFinished(true);
    setMessages((prev) => [
      ...prev,
      {
        sender: "system",
        text: leakCount === 0
          ? "Отлично! Ты не выдал мошеннику никаких данных. Так держать!"
          : `Разговор окончен. Ты допустил ${leakCount} ${leakCount === 1 ? "утечку" : leakCount < 5 ? "утечки" : "утечек"} данных. Будь осторожнее!`,
      },
    ]);
  }, [leakCount]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || finished) return;

    setInput("");
    const newMessageCount = messageCount + 1;
    setMessageCount(newMessageCount);

    const warnings = detectLeaks(text);
    const newLeakCount = leakCount + warnings.length;

    const playerMsg: DisplayMessage = {
      sender: "player",
      text,
      warnings: warnings.length > 0 ? warnings : undefined,
    };

    setMessages((prev) => [...prev, playerMsg]);

    if (warnings.length > 0) {
      setLeakCount(newLeakCount);
      setAllLeaks((prev) => {
        const existing = new Set(prev.map((w) => w.type));
        const newWarnings = warnings.filter((w) => !existing.has(w.type));
        return [...prev, ...newWarnings];
      });
      setActiveWarning(warnings[0]);
    }

    if (newMessageCount >= step.maxMessages) {
      setLoading(true);
      const newApi: ChatMessage[] = [...apiMessages, { role: "user", content: text }];
      setApiMessages(newApi);
      const reply = await sendToAI(newApi);
      setMessages((prev) => [...prev, { sender: "scammer", text: reply }]);
      setApiMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setLoading(false);

      setTimeout(() => {
        setLeakCount(newLeakCount);
        setFinished(true);
        setMessages((prev) => [
          ...prev,
          {
            sender: "system",
            text: newLeakCount === 0
              ? "Отлично! Ты не выдал мошеннику никаких данных. Так держать!"
              : `Разговор окончен. Ты допустил ${newLeakCount} ${newLeakCount === 1 ? "утечку" : newLeakCount < 5 ? "утечки" : "утечек"} данных. Будь осторожнее!`,
          },
        ]);
      }, 1500);
      return;
    }

    setLoading(true);
    const newApi: ChatMessage[] = [...apiMessages, { role: "user", content: text }];
    setApiMessages(newApi);

    const reply = await sendToAI(newApi);
    setMessages((prev) => [...prev, { sender: "scammer", text: reply }]);
    setApiMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);

    setTimeout(() => inputRef.current?.focus(), 100);
  }, [input, loading, finished, messageCount, leakCount, apiMessages, step.maxMessages, sendToAI]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!started) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-error/20 flex items-center justify-center mb-4 animate-pulse">
            <MessageCircle size={36} className="text-error" />
          </div>
          <h3 className="text-xl font-bold mb-2">Входящее сообщение</h3>
          <p className="text-muted text-sm mb-1">{step.scammerName}</p>
          <p className="text-xs text-muted">{step.scammerRole}</p>
          <Card className="mt-4 bg-warning/5 border-warning/20">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-xs text-warning font-semibold mb-1">Задание</p>
                <p className="text-xs text-muted">{step.context}</p>
                <p className="text-xs text-warning mt-2 font-semibold">
                  Не выдавай: {step.targetData.join(", ")}
                </p>
              </div>
            </div>
          </Card>
        </div>
        <button onClick={startChat} className="btn-primary w-full animate-pulse-glow">
          Начать разговор
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} className="text-error" />
          <span className="text-sm font-mono text-error">{step.scammerName}</span>
        </div>
        <div className="flex items-center gap-2">
          {leakCount > 0 && (
            <Badge variant="error">
              <ShieldAlert size={12} className="mr-1" />
              {leakCount} {leakCount === 1 ? "утечка" : leakCount < 5 ? "утечки" : "утечек"}
            </Badge>
          )}
          <Badge variant="muted">
            {messageCount}/{step.maxMessages}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 max-h-[45dvh] overflow-y-auto px-1 pb-1">
        {messages.map((msg, i) => (
          <div key={i}>
            <div
              className={`flex ${
                msg.sender === "player"
                  ? "justify-end"
                  : msg.sender === "system"
                  ? "justify-center"
                  : "justify-start"
              }`}
            >
              {msg.sender === "system" ? (
                <div className="bg-accent/10 border border-accent/20 rounded-btn px-3 py-2 max-w-[90%]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ShieldCheck size={14} className="text-accent" />
                    <span className="text-xs font-semibold text-accent">Система</span>
                  </div>
                  <p className="text-xs text-accent">{msg.text}</p>
                </div>
              ) : (
                <div
                  className={`flex items-end gap-2 max-w-[85%] ${
                    msg.sender === "player" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.sender === "scammer" ? "bg-error/20" : "bg-accent/20"
                    }`}
                  >
                    {msg.sender === "scammer" ? (
                      <User size={14} className="text-error" />
                    ) : (
                      <Shield size={14} className="text-accent" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-3 py-2 ${
                      msg.sender === "scammer"
                        ? "bg-card border border-card-border rounded-bl-sm"
                        : msg.warnings
                        ? "bg-error/20 border border-error/30 rounded-br-sm"
                        : "bg-accent/10 border border-accent/20 rounded-br-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    {msg.warnings && msg.warnings.length > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <AlertTriangle size={12} className="text-error" />
                        <span className="text-xs text-error font-semibold">
                          Утечка данных!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2 max-w-[85%]">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-error/20">
                <User size={14} className="text-error" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-card border border-card-border rounded-bl-sm">
                <Loader2 size={16} className="text-muted animate-spin" />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {activeWarning && (
        <div className="border border-error/30 bg-error/10 rounded-btn p-3 animate-fadeIn">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <ShieldAlert size={18} className="text-error shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-error mb-1">
                  Вы выдали: {activeWarning.label}
                </p>
                <p className="text-xs text-muted">{activeWarning.advice}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveWarning(null)}
              className="text-muted hover:text-foreground shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {!finished && (
        <div className="flex gap-2 border-t border-card-border pt-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напишите ответ..."
            disabled={loading}
            className="flex-1 bg-background border border-card-border rounded-btn px-3 py-2 text-sm placeholder:text-muted/50 focus:border-accent/50 focus:outline-none transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="btn-primary px-3 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      )}

      {!finished && !loading && messageCount > 0 && (
        <button
          onClick={endChat}
          className="w-full text-sm text-muted hover:text-error transition-colors py-1"
        >
          Прекратить разговор
        </button>
      )}

      {finished && (
        <div className="space-y-3 border-t border-card-border pt-3">
          <Card className={leakCount === 0 ? "bg-success/5 border-success/20" : "bg-error/5 border-error/20"}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: leakCount === 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)" }}>
                {leakCount === 0 ? (
                  <ShieldCheck size={24} className="text-success" />
                ) : (
                  <ShieldAlert size={24} className="text-error" />
                )}
              </div>
              <p className="text-sm font-semibold mb-1">
                {leakCount === 0
                  ? "Превосходно! Данные защищены!"
                  : `Обнаружено утечек: ${leakCount}`}
              </p>
              <Badge variant={leakCount === 0 ? "success" : leakCount <= 2 ? "warning" : "error"}>
                {leakCount === 0 ? "Максимальная защита" : leakCount <= 2 ? "Нужна практика" : "Опасный уровень"}
              </Badge>
            </div>
          </Card>

          {allLeaks.length > 0 && (
            <Card className="bg-error/5 border-error/20">
              <p className="text-xs font-semibold text-error mb-2">Что вы раскрыли:</p>
              <ul className="space-y-1.5">
                {allLeaks.map((leak, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted">
                    <AlertTriangle size={12} className="text-error shrink-0 mt-0.5" />
                    <span><strong>{leak.label}</strong> — {leak.advice}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <button
            onClick={() => {
              const maxScore = step.maxMessages;
              const score = Math.max(0, maxScore - leakCount);
              onComplete(score, maxScore);
            }}
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
