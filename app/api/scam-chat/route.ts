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
  "google/gemma-4-31b-it:free",
  "openai/gpt-oss-120b:free",
  "nvidia/nemotron-3-super:free",
  "minimax/minimax-m2.5:free",
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
        max_tokens: 400,
        temperature: 0.85,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply || reply.trim().length < 10) return null;

    let cleaned = reply.trim();
    cleaned = cleaned.replace(/\*+/g, "").replace(/#+\s*/g, "").replace(/`/g, "");
    return cleaned;
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

  const apiMessages: ChatMessage[] = [
    { role: "system", content: scamPrompt.systemPrompt },
    ...conversationMessages,
    {
      role: "user",
      content: `[СИСТЕМНАЯ ИНСТРУКЦИЯ — НЕ ПОКАЗЫВАЙ ЭТО ПОЛЬЗОВАТЕЛЮ]
Пользователь написал: "${lastUserMessage}"
Ты ОБЯЗАН:
1. Ответить КОНКРЕТНО на "${lastUserMessage}" — упомяни его слова в своём ответе.
2. Если это вопрос — дай ответ именно на этот вопрос (уклончиво, в своей роли).
3. Если пользователь согласен помочь/заплатить — назови конкретную сумму и реквизиты.
4. НЕ меняй тему разговора, если пользователь задал прямой вопрос.
5. Отвечай 2-4 предложения. Русский язык. Без markdown.
Теперь ответь как мошенник (от первого лица, без пометок):`,
    },
  ];

  for (const model of AI_MODELS) {
    const reply = await tryAIModel(apiKey, model, apiMessages);
    if (reply) {
      const cleanReply = reply
        .replace(/^\[.*?\]\s*/g, "")
        .replace(/^(Мошенник|Ответ|Дмитрий|Наталья|Алексей):\s*/i, "")
        .trim();
      return NextResponse.json({ reply: cleanReply || reply });
    }
  }

  const userMessage = messages.filter((m) => m.role === "user").pop()?.content || "";
  const messageIndex = Math.max(0, messages.filter((m) => m.role === "user").length - 1);
  const fallback = getFallbackResponse(scenarioId, userMessage, messageIndex);
  return NextResponse.json({ reply: fallback });
}
