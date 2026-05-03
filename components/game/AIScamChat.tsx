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
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  X,
  Loader2,
  Lightbulb,
  Building2,
  Mail,
  Wrench,
  UserCircle,
  Phone,
  Clock,
} from "lucide-react";
import type { ScamScenarioId } from "@/lib/scenario-types";
import { playClick, playNotification } from "@/lib/sounds";

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
  tactic?: string;
}

const SCENARIO_AVATARS: Record<ScamScenarioId, { icon: typeof Building2; emoji: string; color: string; bgColor: string }> = {
  bank: { icon: Building2, emoji: "🏦", color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
  email: { icon: Mail, emoji: "📦", color: "text-blue-400", bgColor: "bg-blue-500/20" },
  intercom: { icon: Wrench, emoji: "🔧", color: "text-orange-400", bgColor: "bg-orange-500/20" },
  classmate: { icon: UserCircle, emoji: "👤", color: "text-purple-400", bgColor: "bg-purple-500/20" },
};

const RESPONSE_SUGGESTIONS: Record<ScamScenarioId, string[][]> = {
  bank: [
    ["Я сам перезвоню в банк по номеру на карте", "Какой именно банк? Назовите номер договора", "Не буду ничего сообщать по телефону"],
    ["Положу трубку и проверю через приложение", "Назовите мой полный номер счёта, если вы из банка", "Я обращусь в отделение лично"],
    ["Перезвоню на горячую линию банка", "Вы не можете подтвердить мою личность — это подозрительно", "Заканчиваю разговор, до свидания"],
  ],
  email: [
    ["Я сам проверю статус на сайте Белпочты", "Назовите номер отправления", "Не буду ничего оплачивать по телефону"],
    ["Зайду в отделение почты лично", "Пришлите уведомление на бумаге", "Какой точный адрес отправителя?"],
    ["Я не жду посылок, это мошенничество", "Буду проверять через официальный трекинг", "Прощайте"],
  ],
  intercom: [
    ["Я уточню в ЖЭСе напрямую", "Покажите документы и разрешение", "Не буду называть номер квартиры"],
    ["Когда именно было решение ЖЭСа? Назовите номер", "Оставьте контактный телефон, я перезвоню", "Не открою дверь незнакомым"],
    ["Позвоню в ЖЭС для проверки", "Не нужна замена домофона", "Это подозрительно, заканчиваю разговор"],
  ],
  classmate: [
    ["Как тебя зовут полностью?", "Назови имя нашего классного руководителя", "Позвоню тебе на старый номер для проверки"],
    ["Не могу переводить деньги незнакомым", "Обратись в полицию, если тебя обокрали", "Напиши мне в соцсетях с основного аккаунта"],
    ["Это похоже на мошенничество", "Я не буду отправлять деньги", "Свяжусь с тобой другим способом"],
  ],
};

function detectTactic(text: string): string | undefined {
  const lower = text.toLowerCase();
  if (/срочно|немедленно|прямо сейчас|быстро|спеши|торопи|заблокир|отмен/i.test(lower)) return "⚡ Давление срочностью";
  if (/безопасност|служб|сотрудник|специалист|начальни|управляющ/i.test(lower)) return "👔 Авторитет должности";
  if (/украд|спис|потеря|пропад|опасн|угроз|штраф|блокировк|заблокир/i.test(lower)) return "😨 Запугивание";
  if (/помог|выруч|друг|помни|вместе учил/i.test(lower)) return "🤝 Манипуляция доверием";
  if (/никому не говори|не рассказывай|между нами|конфиденциальн/i.test(lower)) return "🤫 Секретность";
  if (/стандартн|обычн|процедур|всегда так|все клиенты/i.test(lower)) return "📋 Нормализация";
  return undefined;
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
  const [tacticsFound, setTacticsFound] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const avatar = SCENARIO_AVATARS[step.scenarioId];
  const AvatarIcon = avatar.icon;

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
    const tactic = detectTactic(prompt.firstMessage);
    const firstMsg: DisplayMessage = { sender: "scammer", text: prompt.firstMessage, tactic };
    setMessages([firstMsg]);
    setApiMessages([{ role: "assistant", content: prompt.firstMessage }]);
    if (tactic) setTacticsFound([tactic]);
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

    playClick();
    setInput("");
    setShowSuggestions(false);
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
      const tactic = detectTactic(reply);
      playNotification();
      setMessages((prev) => [...prev, { sender: "scammer", text: reply, tactic }]);
      if (tactic) setTacticsFound((prev) => prev.includes(tactic) ? prev : [...prev, tactic]);
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
    const tactic = detectTactic(reply);
    setMessages((prev) => [...prev, { sender: "scammer", text: reply, tactic }]);
    if (tactic) setTacticsFound((prev) => prev.includes(tactic) ? prev : [...prev, tactic]);
    setApiMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
    setShowSuggestions(true);

    setTimeout(() => inputRef.current?.focus(), 100);
  }, [input, loading, finished, messageCount, leakCount, apiMessages, step.maxMessages, sendToAI]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  const suggestionsPool = RESPONSE_SUGGESTIONS[step.scenarioId] || [];
  const currentSuggestions = suggestionsPool[Math.min(Math.floor(messageCount / 2), suggestionsPool.length - 1)] || suggestionsPool[0] || [];

  if (!started) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="w-24 h-24 mx-auto rounded-2xl border-2 flex items-center justify-center mb-4 relative"
            style={{
              borderColor: `color-mix(in srgb, ${step.scenarioId === "bank" ? "#eab308" : step.scenarioId === "email" ? "#3b82f6" : step.scenarioId === "intercom" ? "#f97316" : "#a855f7"} 40%, transparent)`,
              background: `color-mix(in srgb, ${step.scenarioId === "bank" ? "#eab308" : step.scenarioId === "email" ? "#3b82f6" : step.scenarioId === "intercom" ? "#f97316" : "#a855f7"} 10%, transparent)`,
            }}
          >
            <span className="text-5xl">{avatar.emoji}</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full animate-cyber-pulse flex items-center justify-center">
              <Phone size={10} className="text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 font-cyber tracking-wider">ВХОДЯЩЕЕ СООБЩЕНИЕ</h3>
          <p className="text-error text-sm font-mono mb-1">{step.scammerName}</p>
          <p className="text-xs text-muted font-mono">{step.scammerRole}</p>
          <div className="mt-4 rounded-xl p-4 bg-warning/5 border border-warning/20">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-xs text-warning font-semibold mb-1 font-mono uppercase tracking-wider">Задание</p>
                <p className="text-xs text-muted">{step.context}</p>
                <p className="text-xs text-error mt-2 font-semibold font-mono uppercase">
                  Не выдавай: {step.targetData.join(", ")}
                </p>
                <div className="mt-3 flex items-start gap-2">
                  <Lightbulb size={14} className="text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-accent">
                    Отвечай правильно: задавай проверочные вопросы, предлагай перезвонить, требуй подтверждение личности
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button onClick={startChat} className="btn-primary w-full animate-pulse-glow font-cyber tracking-wider">
          НАЧАТЬ РАЗГОВОР
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full ${avatar.bgColor} flex items-center justify-center`}>
            <AvatarIcon size={13} className={avatar.color} />
          </div>
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
            <Clock size={11} className="mr-1" />
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
                <div className="bg-accent/10 rounded-xl px-3 py-2 max-w-[90%]">
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.sender === "scammer" ? avatar.bgColor : "bg-accent/20"
                    }`}
                  >
                    {msg.sender === "scammer" ? (
                      <AvatarIcon size={16} className={avatar.color} />
                    ) : (
                      <Shield size={16} className="text-accent" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div
                      className={`rounded-2xl px-3 py-2 ${
                        msg.sender === "scammer"
                          ? "bg-card/80 rounded-bl-sm"
                          : msg.warnings
                          ? "bg-error/15 rounded-br-sm"
                          : "bg-accent/10 rounded-br-sm"
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
                    {msg.tactic && msg.sender === "scammer" && (
                      <div className="flex items-center gap-1 px-2">
                        <span className="text-[10px] text-warning/70 font-mono">{msg.tactic}</span>
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${avatar.bgColor}`}>
                <AvatarIcon size={16} className={avatar.color} />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-card/80 rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {activeWarning && (
        <div className="rounded-xl bg-error/10 p-3 animate-fadeIn">
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

      {!finished && showSuggestions && currentSuggestions.length > 0 && !loading && (
        <div className="space-y-1.5 px-1">
          <div className="flex items-center gap-1.5">
            <Lightbulb size={12} className="text-accent/60" />
            <span className="text-[10px] text-accent/60 font-mono uppercase tracking-wider">Подсказки:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(s)}
                className="text-[11px] px-2.5 py-1.5 rounded-lg bg-accent/5 text-accent/80 hover:bg-accent/15 hover:text-accent transition-all text-left leading-tight"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {!finished && (
        <div className="flex gap-2 pt-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напишите ответ мошеннику..."
            disabled={loading}
            className="flex-1 bg-background/50 border border-card-border/50 rounded-xl px-3 py-2.5 text-sm placeholder:text-muted/50 focus:border-accent/50 focus:outline-none transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="btn-primary px-3 rounded-xl disabled:opacity-50"
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
        <div className="space-y-3 pt-3">
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

          {tacticsFound.length > 0 && (
            <Card className="bg-warning/5 border-warning/20">
              <p className="text-xs font-semibold text-warning mb-2 font-mono uppercase tracking-wider">Обнаруженные тактики мошенника:</p>
              <div className="flex flex-wrap gap-1.5">
                {tacticsFound.map((t, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-lg bg-warning/10 text-warning/80">{t}</span>
                ))}
              </div>
            </Card>
          )}

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
