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
  "google/gemma-3-4b-it:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
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

  const apiMessages: ChatMessage[] = [
    { role: "system", content: scamPrompt.systemPrompt },
    ...messages.filter((m) => m.role === "user" || m.role === "assistant"),
  ];

  for (const model of AI_MODELS) {
    const reply = await tryAIModel(apiKey, model, apiMessages);
    if (reply) {
      return NextResponse.json({ reply });
    }
  }

  const userMessage = messages.filter((m) => m.role === "user").pop()?.content || "";
  const messageCount = messages.filter((m) => m.role === "user").length;
  const fallback = getFallbackResponse(scenarioId, userMessage, messageCount);
  return NextResponse.json({ reply: fallback });
}
