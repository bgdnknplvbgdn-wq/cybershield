import { NextRequest, NextResponse } from "next/server";
import { getScamPrompt } from "@/lib/scam-prompts";
import { getFallbackResponse } from "@/lib/scam-fallbacks";
import type { ScamScenarioId } from "@/lib/scenario-types";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const VALID_SCENARIOS: ScamScenarioId[] = ["bank", "email", "intercom", "classmate"];

const AI_MODELS = [
  "minimax/minimax-m2.5:free",
  "google/gemma-3-4b-it:free",
  "meta-llama/llama-3.1-8b-instruct:free",
];

async function tryAIModel(
  apiKey: string,
  model: string,
  apiMessages: ChatMessage[]
): Promise<string | null> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://cyberrubezh.vercel.app",
        "X-Title": "CyberRubezh - Educational Scam Simulation",
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply || reply.trim().length < 10) return null;

    return reply.trim();
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API ключ не настроен. Установите переменную OPENROUTER_API_KEY." },
      { status: 500 }
    );
  }

  let body: { scenarioId: ScamScenarioId; messages: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 });
  }

  const { scenarioId, messages } = body;

  if (!VALID_SCENARIOS.includes(scenarioId)) {
    return NextResponse.json({ error: "Неизвестный сценарий" }, { status: 400 });
  }

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Сообщения обязательны" }, { status: 400 });
  }

  const scamPrompt = getScamPrompt(scenarioId);

  const conversationMessages = messages.filter((m) => m.role === "user" || m.role === "assistant");
  const lastUserMessage = conversationMessages.filter((m) => m.role === "user").pop()?.content || "";
  const messageNum = conversationMessages.filter((m) => m.role === "user").length;

  const contextReminder = `НАПОМИНАНИЕ: Пользователь написал: "${lastUserMessage}"
Это сообщение №${messageNum}. Ты ОБЯЗАН ответить КОНКРЕТНО на это сообщение.
- Если это вопрос — дай уклончивый ответ именно на ЭТОТ вопрос.
- Если это отказ — смени тактику манипуляции на ДРУГУЮ (не повторяй предыдущую).
- Если пользователь упомянул что-то новое — используй это.
- НЕ повторяй то, что уже говорил. НЕ начинай с той же фразы, что и раньше.
Отвечай 2-4 предложения на русском. Без markdown и смайликов.`;

  const apiMessages: ChatMessage[] = [
    { role: "system", content: scamPrompt.systemPrompt },
    ...conversationMessages,
    { role: "system", content: contextReminder },
  ];

  for (const model of AI_MODELS) {
    const reply = await tryAIModel(apiKey, model, apiMessages);
    if (reply) {
      return NextResponse.json({ reply });
    }
  }

  const userMessage = messages.filter((m) => m.role === "user").pop()?.content || "";
  const messageIndex = Math.max(0, messages.filter((m) => m.role === "user").length - 1);
  const fallback = getFallbackResponse(scenarioId, userMessage, messageIndex);
  return NextResponse.json({ reply: fallback });
}
