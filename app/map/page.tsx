"use client";

import { Card, Badge } from "@/components/shared";
import { MapPin, AlertTriangle, Shield, Eye } from "lucide-react";

interface ThreatPin {
  region: string;
  x: number;
  y: number;
  threatType: string;
  severity: "low" | "medium" | "high";
  description: string;
}

const threats: ThreatPin[] = [
  {
    region: "Минск",
    x: 48,
    y: 42,
    threatType: "phishing",
    severity: "high",
    description: "Волна фишинговых писем от «Беларусбанка»",
  },
  {
    region: "Гомель",
    x: 62,
    y: 68,
    threatType: "malware",
    severity: "medium",
    description: "Заражённые приложения в магазинах",
  },
  {
    region: "Брест",
    x: 22,
    y: 70,
    threatType: "social",
    severity: "low",
    description: "Телефонные мошенники с новым сценарием",
  },
  {
    region: "Витебск",
    x: 55,
    y: 20,
    threatType: "network",
    severity: "medium",
    description: "Незащищённые публичные Wi-Fi точки",
  },
  {
    region: "Могилёв",
    x: 62,
    y: 50,
    threatType: "data",
    severity: "high",
    description: "Утечка данных клиентов сервисов доставки",
  },
  {
    region: "Гродно",
    x: 25,
    y: 38,
    threatType: "password",
    severity: "low",
    description: "Слабые пароли в корпоративных сетях",
  },
];

const severityVariant = {
  low: "success" as const,
  medium: "warning" as const,
  high: "error" as const,
};

const severityLabel = {
  low: "Низкая",
  medium: "Средняя",
  high: "Высокая",
};

export default function MapPage() {
  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <MapPin size={28} className="text-accent" />
        <h1 className="text-2xl md:text-3xl font-bold">Карта угроз</h1>
      </div>

      <p className="text-muted text-sm mb-6">
        Актуальные киберугрозы по регионам Беларуси
      </p>

      <Card className="mb-6 p-0 overflow-hidden">
        <div className="relative bg-card aspect-[3/4] md:aspect-[4/3] overflow-hidden">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20,15 L45,10 L60,12 L75,18 L80,30 L78,45 L85,55 L75,70 L65,75 L55,72 L45,78 L35,75 L25,70 L18,55 L15,40 L18,25 Z"
              fill="#141828"
              stroke="#1E2A45"
              strokeWidth="0.8"
            />

            {threats.map((t, i) => (
              <g key={i}>
                <circle
                  cx={t.x}
                  cy={t.y}
                  r="3"
                  fill={
                    t.severity === "high"
                      ? "#FF3B3B"
                      : t.severity === "medium"
                      ? "#FFD700"
                      : "#00FF41"
                  }
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    values="3;5;3"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx={t.x} cy={t.y} r="1.5" fill="currentColor" />
                <text
                  x={t.x}
                  y={t.y - 5}
                  textAnchor="middle"
                  fill="#8892B0"
                  fontSize="3"
                  fontFamily="monospace"
                >
                  {t.region}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </Card>

      <div className="space-y-3">
        {threats.map((threat, i) => (
          <Card key={i}>
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-btn flex items-center justify-center shrink-0 ${
                  threat.severity === "high"
                    ? "bg-error/20"
                    : threat.severity === "medium"
                    ? "bg-warning/20"
                    : "bg-success/20"
                }`}
              >
                <AlertTriangle
                  size={16}
                  className={
                    threat.severity === "high"
                      ? "text-error"
                      : threat.severity === "medium"
                      ? "text-warning"
                      : "text-success"
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">
                    {threat.region}
                  </span>
                  <Badge variant={severityVariant[threat.severity]}>
                    {severityLabel[threat.severity]}
                  </Badge>
                </div>
                <p className="text-muted text-xs">{threat.description}</p>
              </div>
              <div className="flex items-center gap-1 text-muted">
                <Eye size={14} />
                <Shield size={14} className="text-accent" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success" /> Низкая
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-warning" /> Средняя
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-error" /> Высокая
        </span>
      </div>
    </div>
  );
}
