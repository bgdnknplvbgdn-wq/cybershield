"use client";

import { Card, Badge } from "@/components/shared";
import { Scale, BookOpen, Shield, ExternalLink } from "lucide-react";

interface LawArticle {
  id: string;
  title: string;
  category: "data" | "cyber" | "rights" | "responsibility";
  summary: string;
  lawNumber: string;
}

const laws: LawArticle[] = [
  {
    id: "1",
    title: "Закон о защите персональных данных",
    category: "data",
    summary:
      "Регулирует сбор, обработку, хранение и передачу персональных данных граждан РБ. Определяет права субъектов ПД и обязанности операторов.",
    lawNumber: "№ 99-З от 07.05.2021",
  },
  {
    id: "2",
    title: "Закон об электронном документе",
    category: "data",
    summary:
      "Устанавливает правовые основы использования электронных документов и цифровой подписи в РБ.",
    lawNumber: "№113-З от 28.12.2009",
  },
  {
    id: "3",
    title: "Уголовная ответственность за киберпреступления",
    category: "cyber",
    summary:
      "Статьи 209, 212, 222, 349-350, 354 УК РБ: несанкционированный доступ, мошенничество, создание вредоносных программ, кардинг.",
    lawNumber: "УК РБ, гл. 24, 31",
  },
  {
    id: "4",
    title: "Закон об информации, информатизации и защите информации",
    category: "rights",
    summary:
      "Гарантирует право граждан на доступ к информации, защиту информации и информационных ресурсов.",
    lawNumber: "№ 455-З от 10.11.2008",
  },
  {
    id: "5",
    title: "Правила безопасного поведения в сети",
    category: "responsibility",
    summary:
      "Обязанности пользователей при работе в интернете: недопустимость распространения вредоносного ПО, уважение чужих данных.",
    lawNumber: "Постановление СМ РБ",
  },
  {
    id: "6",
    title: "Закон о защите детей от вредной информации",
    category: "rights",
    summary:
      "Защита несовершеннолетних от контента, причиняющего вред здоровью и развитию. Контент-фильтрация.",
    lawNumber: "№267-З от 13.12.2011",
  },
  {
    id: "7",
    title: "Декрет о развитии цифровой экономики",
    category: "cyber",
    summary:
      "Создание условий для развития IT-сектора, регулирование криптовалют и смарт-контрактов в РБ.",
    lawNumber: "Декрет №8 от 21.12.2017",
  },
  {
    id: "8",
    title: "Административная ответственность в сфере связи",
    category: "responsibility",
    summary:
      "Штрафы за нарушение правил пользования электросвязью, спам, неправомерный доступ к сетям.",
    lawNumber: "КоАП РБ, ст. 22.7-22.9",
  },
];

const categoryConfig: Record<
  LawArticle["category"],
  { label: string; variant: "accent" | "success" | "warning" | "error"; icon: string }
> = {
  data: { label: "Данные", variant: "accent", icon: "💾" },
  cyber: { label: "Кибер", variant: "error", icon: "🛡️" },
  rights: { label: "Права", variant: "success", icon: "⚖️" },
  responsibility: { label: "Обязанности", variant: "warning", icon: "📋" },
};

export default function LawsPage() {
  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Scale size={28} className="text-accent" />
        <h1 className="text-2xl md:text-3xl font-bold">Кодекс законов</h1>
      </div>

      <p className="text-muted text-sm mb-6">
        Законы Республики Беларусь в сфере кибербезопасности и цифровых прав
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(categoryConfig).map(([key, config]) => (
          <Badge key={key} variant={config.variant}>
            {config.icon} {config.label}
          </Badge>
        ))}
      </div>

      <div className="space-y-3">
        {laws.map((law) => {
          const config = categoryConfig[law.category];
          return (
            <Card key={law.id}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-btn bg-accent/10 flex items-center justify-center text-lg shrink-0">
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-sm">{law.title}</h3>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>
                  <p className="text-xs text-muted font-mono mb-2">
                    {law.lawNumber}
                  </p>
                  <p className="text-muted text-xs leading-relaxed">
                    {law.summary}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-2 text-muted text-sm">
          <BookOpen size={16} />
          <span>Информация актуальна на 2026 год</span>
        </div>
        <p className="text-muted/50 text-xs mt-2 font-mono">
          Для юридически точной информации обращайтесь к официальным источникам
        </p>
      </div>
    </div>
  );
}
