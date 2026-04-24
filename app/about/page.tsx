"use client";

import { Card, Badge } from "@/components/shared";
import { Shield, Heart, Scale, Users, ExternalLink, User, Code } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center mb-4 neon-glow">
          <Shield size={40} className="text-accent" />
        </div>
        <h1 className="text-3xl font-extrabold mb-2 font-cyber tracking-wider">
          <span className="text-gradient">КИБЕР</span>
          <span className="text-foreground">РУБЕЖ</span>
        </h1>
        <p className="text-muted text-xs font-mono uppercase tracking-widest">#КиберПраво</p>
      </div>

      {/* Author card */}
      <Card className="mb-4" glow="accent">
        <h2 className="font-bold text-sm mb-3 flex items-center gap-2 font-cyber tracking-wider uppercase">
          <User size={18} className="text-accent" />
          Автор проекта
        </h2>
        <p className="text-sm leading-relaxed">
          <span className="font-semibold text-accent">Коноплёв Богдан Михайлович</span>, 17 лет
        </p>
        <p className="text-xs text-muted leading-relaxed mt-2 font-mono">
          Проект создан в рамках республиканского конкурса для детей
          <span className="text-accent font-semibold"> #КиберПраво</span> на лучший
          инновационный проект по защите от кибермошенников.
        </p>
      </Card>

      {/* About project */}
      <Card className="mb-4">
        <h2 className="font-bold text-sm mb-3 flex items-center gap-2 font-cyber tracking-wider uppercase">
          <Code size={18} className="text-neon-blue" />
          О проекте
        </h2>
        <p className="text-xs text-muted leading-relaxed font-mono">
          «КИБЕРРУБЕЖ» — интерактивная образовательная платформа по кибербезопасности для граждан
          Республики Беларусь. Платформа обучает распознаванию фишинга, социальной инженерии,
          вирусов-вымогателей и других киберугроз через интерактивные сценарии и мини-игры.
        </p>
        <p className="text-xs text-muted leading-relaxed mt-3 font-mono">
          Каждая миссия привязана к реальным законам Республики Беларусь. Отдельный модуль
          с ИИ-мошенником позволяет отработать навыки противодействия телефонным и
          интернет-мошенникам в безопасной среде.
        </p>
      </Card>

      {/* Contest organizers */}
      <Card className="mb-4">
        <h2 className="font-bold text-sm mb-3 flex items-center gap-2 font-cyber tracking-wider uppercase">
          <Users size={18} className="text-accent" />
          Организаторы конкурса
        </h2>
        <ul className="space-y-3">
          {[
            { name: "Министерство внутренних дел РБ", role: "Организатор" },
            { name: "Министерство образования РБ", role: "Организатор" },
            { name: "Национальный центр правовой информации РБ", role: "Организатор" },
            { name: "А1", role: "Партнёр" },
            { name: "Лаборатория Касперского БЛР", role: "Партнёр" },
          ].map((org) => (
            <li key={org.name} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{org.name}</p>
                <p className="text-[10px] text-muted font-mono uppercase tracking-wider">{org.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Legal */}
      <Card className="mb-4">
        <h2 className="font-bold text-sm mb-3 flex items-center gap-2 font-cyber tracking-wider uppercase">
          <Scale size={18} className="text-warning" />
          Правовая основа
        </h2>
        <ul className="space-y-2">
          {[
            "Закон РБ «О персональных данных» №455-З от 07.05.2021",
            "Уголовный кодекс РБ, глава 31 (ст. 349-355)",
            "Закон РБ «Об электронном документе» №113-З",
            "Декрет №8 «О развитии цифровой экономики» от 21.12.2017",
          ].map((law) => (
            <li key={law} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
              <span className="text-xs text-muted font-mono">{law}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8">
        <Badge variant="accent" className="text-sm px-4 py-1">
          #КиберПраво
        </Badge>
        <p className="text-muted text-[10px] mt-3 font-mono uppercase tracking-widest">
          Автор: Коноплёв Богдан Михайлович · Республика Беларусь · 2026
        </p>
        <a
          href="https://mir.pravo.by/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-2 font-mono"
        >
          mir.pravo.by <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
