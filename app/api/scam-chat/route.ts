import { NextRequest, NextResponse } from "next/server";
import { getScamPrompt } from "@/lib/scam-prompts";
import type { ScamScenarioId } from "@/lib/scenario-types";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const VALID_SCENARIOS: ScamScenarioId[] = ["bank", "email", "intercom", "classmate"];

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

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://cyberrubezh.app",
        "X-Title": "CyberRubezh - Educational Scam Simulation",
      },
      body: JSON.stringify({
        model: "z-ai/glm-4.5-air:free",
        messages: apiMessages,
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter error:", errorData);
      return NextResponse.json(
        { error: "Ошибка AI сервиса. Попробуйте позже." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "...";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI request failed:", err);
    return NextResponse.json(
      { error: "Не удалось связаться с AI сервисом" },
      { status: 502 }
    );
  }
}
