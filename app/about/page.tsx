"use client";

import { Card, Badge } from "@/components/shared";
import { Shield, Heart, Scale, Users, ExternalLink, User } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-4 neon-glow">
          <Shield size={40} className="text-accent" />
        </div>
        <h1 className="text-3xl font-extrabold mb-2">
          <span className="text-gradient">КИБЕРРУБЕЖ</span>
        </h1>
        <p className="text-muted text-sm font-mono">#КиберПраво</p>
      </div>

      <Card className="mb-4">
        <h2 className="font-bold text-base mb-3 flex items-center gap-2">
          <User size={18} className="text-accent" />
          Автор проекта
        </h2>
        <p className="text-sm leading-relaxed">
          <span className="font-semibold text-accent">Коноплёв Богдан Михайлович</span>, 17 лет
        </p>
        <p className="text-sm text-muted leading-relaxed mt-2">
          Проект создан в рамках республиканского конкурса для детей
          <span className="text-accent font-semibold"> #КиберПраво</span> на лучший
          инновационный проект по защите от кибермошенников.
        </p>
      </Card>

      <Card className="mb-4">
        <h2 className="font-bold text-base mb-3 flex items-center gap-2">
          <Heart size={18} className="text-error" />
          О проекте
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          «КИБЕРРУБЕЖ» — интерактивная образовательная платформа по кибербезопасности для граждан
          Республики Беларусь. Платформа обучает распознаванию фишинга, социальной инженерии,
          вирусов-вымогателей и других киберугроз через интерактивные сценарии и мини-игры.
        </p>
        <p className="text-sm text-muted leading-relaxed mt-3">
          Каждая миссия привязана к реальным законам Республики Беларусь. Отдельный модуль
          с ИИ-мошенником позволяет отработать навыки противодействия телефонным и
          интернет-мошенникам в безопасной среде.
        </p>
      </Card>

      <Card className="mb-4">
        <h2 className="font-bold text-base mb-3 flex items-center gap-2">
          <Users size={18} className="text-accent" />
          Организаторы конкурса
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">▸</span>
            <div>
              <p className="text-sm font-semibold">Министерство внутренних дел РБ</p>
              <p className="text-xs text-muted">Организатор</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">▸</span>
            <div>
              <p className="text-sm font-semibold">Министерство образования РБ</p>
              <p className="text-xs text-muted">Организатор</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">▸</span>
            <div>
              <p className="text-sm font-semibold">Национальный центр правовой информации РБ</p>
              <p className="text-xs text-muted">Организатор</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">▸</span>
            <div>
              <p className="text-sm font-semibold">А1</p>
              <p className="text-xs text-muted">Партнёр</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">▸</span>
            <div>
              <p className="text-sm font-semibold">Лаборатория Касперского БЛР</p>
              <p className="text-xs text-muted">Партнёр</p>
            </div>
          </li>
        </ul>
      </Card>

      <Card className="mb-4">
        <h2 className="font-bold text-base mb-3 flex items-center gap-2">
          <Scale size={18} className="text-warning" />
          Правовая основа
        </h2>
        <ul className="space-y-2 text-xs text-muted">
          <li className="flex items-start gap-2">
            <span className="text-warning mt-0.5">▸</span>
            <span>Закон РБ «О персональных данных» №455-З от 07.05.2021</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning mt-0.5">▸</span>
            <span>Уголовный кодекс РБ, глава 31 (ст. 349-355)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning mt-0.5">▸</span>
            <span>Закон РБ «Об электронном документе» №113-З</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning mt-0.5">▸</span>
            <span>Декрет №8 «О развитии цифровой экономики» от 21.12.2017</span>
          </li>
        </ul>
      </Card>

      <div className="text-center mt-8">
        <Badge variant="accent" className="text-sm px-4 py-1">
          #КиберПраво
        </Badge>
        <p className="text-muted text-xs mt-3 font-mono">
          Автор: Коноплёв Богдан Михайлович · Республика Беларусь · 2026
        </p>
        <a
          href="https://mir.pravo.by/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-2"
        >
          mir.pravo.by <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
