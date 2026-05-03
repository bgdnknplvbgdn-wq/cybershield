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
        max_tokens: 500,
        temperature: 0.9,
        top_p: 0.95,
        frequency_penalty: 0.6,
        presence_penalty: 0.4,
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

  const previousAssistantMessages = conversationMessages
    .filter((m) => m.role === "assistant")
    .map((m) => m.content.substring(0, 60))
    .join("; ");

  const enrichedSystemPrompt = `${scamPrompt.systemPrompt}

СЕЙЧАС СООБЩЕНИЕ №${messageNum} ОТ ПОЛЬЗОВАТЕЛЯ.
Пользователь ТОЛЬКО ЧТО написал: "${lastUserMessage}"

Твои предыдущие фразы (НЕ ПОВТОРЯЙ ИХ): ${previousAssistantMessages || "нет"}

ИНСТРУКЦИЯ К ЭТОМУ ОТВЕТУ:
1. Ты ОБЯЗАН ответить КОНКРЕТНО на слова пользователя "${lastUserMessage}". Проанализируй что он сказал и отреагируй именно на ЭТО.
2. Если пользователь задал вопрос — ответь на него (уклончиво, но ИМЕННО на этот вопрос).
3. Если пользователь отказал или сомневается — используй НОВУЮ тактику манипуляции, которую ещё НЕ использовал.
4. Если пользователь согласился — поблагодари и попроси СЛЕДУЮЩУЮ порцию данных.
5. Если пользователь грубит или обвиняет — будь подчёркнуто вежлив и профессионален.
6. ОБЯЗАТЕЛЬНО упомяни или обыграй конкретные слова из сообщения пользователя.
7. НЕ начинай ответ с тех же слов, что и раньше. Каждый ответ должен быть УНИКАЛЬНЫМ.
8. Отвечай 2-5 предложений. Только русский язык. Без markdown, без смайликов, без звёздочек.`;

  const apiMessages: ChatMessage[] = [
    { role: "system", content: enrichedSystemPrompt },
    ...conversationMessages,
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
