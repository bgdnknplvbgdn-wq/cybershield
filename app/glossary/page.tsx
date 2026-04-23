"use client";

import { useState } from "react";
import { Card, Badge } from "@/components/shared";
import { BookOpen, Search } from "lucide-react";

interface GlossaryTerm {
  term: string;
  definition: string;
  category: "attack" | "defense" | "law" | "general";
}

const terms: GlossaryTerm[] = [
  { term: "Фишинг", definition: "Вид мошенничества, при котором злоумышленники рассылают поддельные письма от имени организаций для кражи данных.", category: "attack" },
  { term: "Ransomware", definition: "Вирус-вымогатель, шифрующий файлы и требующий выкуп за их расшифровку.", category: "attack" },
  { term: "Социальная инженерия", definition: "Метод манипуляции людьми для получения конфиденциальной информации путём обмана.", category: "attack" },
  { term: "Брутфорс", definition: "Метод взлома путём перебора всех возможных комбинаций паролей.", category: "attack" },
  { term: "DDoS", definition: "Распределённая атака на отказ в обслуживании — перегрузка сервера множеством запросов.", category: "attack" },
  { term: "Кейлоггер", definition: "Программа, записывающая нажатия клавиш для кражи паролей и данных.", category: "attack" },
  { term: "Спуфинг", definition: "Подмена адреса отправителя (email, номера телефона, IP) для обмана жертвы.", category: "attack" },
  { term: "Ботнет", definition: "Сеть заражённых устройств, управляемых злоумышленником удалённо.", category: "attack" },
  { term: "Man-in-the-Middle", definition: "Атака «человек посередине» — перехват данных между двумя сторонами.", category: "attack" },
  { term: "Двухфакторная аутентификация (2FA)", definition: "Дополнительный уровень защиты: кроме пароля требуется второй фактор (код из SMS, приложение).", category: "defense" },
  { term: "VPN", definition: "Виртуальная частная сеть — шифрует интернет-трафик и скрывает IP-адрес.", category: "defense" },
  { term: "Шифрование", definition: "Преобразование данных в нечитаемый формат для защиты конфиденциальности.", category: "defense" },
  { term: "Брандмауэр (Firewall)", definition: "Система фильтрации сетевого трафика, блокирующая нежелательные подключения.", category: "defense" },
  { term: "WPA3", definition: "Новейший стандарт шифрования Wi-Fi с улучшенной защитой от взлома.", category: "defense" },
  { term: "HTTPS", definition: "Защищённый протокол передачи данных с шифрованием TLS/SSL.", category: "defense" },
  { term: "Менеджер паролей", definition: "Программа для безопасного хранения и генерации уникальных паролей.", category: "defense" },
  { term: "Антивирус", definition: "ПО для обнаружения и удаления вредоносных программ.", category: "defense" },
  { term: "Diceware", definition: "Метод создания стойких паролей из случайно выбранных слов.", category: "defense" },
  { term: "Персональные данные", definition: "Любая информация, позволяющая идентифицировать человека: ФИО, адрес, номер телефона и др.", category: "law" },
  { term: "Оператор ПД", definition: "Организация или лицо, осуществляющее обработку персональных данных.", category: "law" },
  { term: "Несанкционированный доступ", definition: "Получение доступа к информации или системам без разрешения владельца (ст. 349 УК РБ).", category: "law" },
  { term: "Электронная цифровая подпись", definition: "Цифровой аналог собственноручной подписи для подтверждения подлинности документа.", category: "law" },
  { term: "IoT", definition: "Интернет вещей — сеть подключённых устройств (камеры, термостаты, замки и др.).", category: "general" },
  { term: "CVV", definition: "Трёхзначный код на обратной стороне карты, используемый для онлайн-платежей.", category: "general" },
  { term: "APK", definition: "Формат установочного файла Android-приложений.", category: "general" },
  { term: "Шифр Цезаря", definition: "Простой шифр подстановки, где каждая буква заменяется буквой с фиксированным сдвигом.", category: "general" },
  { term: "AES-256", definition: "Промышленный стандарт симметричного шифрования с длиной ключа 256 бит.", category: "general" },
  { term: "Cookie", definition: "Файл, хранящий данные о посещении сайта в браузере пользователя.", category: "general" },
  { term: "IP-адрес", definition: "Уникальный числовой идентификатор устройства в сети.", category: "general" },
  { term: "Токен", definition: "Уникальный код для аутентификации или авторизации в системе.", category: "general" },
];

const categoryConfig = {
  attack: { label: "Атака", variant: "error" as const, icon: "⚔️" },
  defense: { label: "Защита", variant: "success" as const, icon: "🛡️" },
  law: { label: "Закон", variant: "warning" as const, icon: "⚖️" },
  general: { label: "Общее", variant: "accent" as const, icon: "📖" },
};

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = terms.filter((t) => {
    const matchSearch = search === "" ||
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === null || t.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen size={28} className="text-accent" />
        <h1 className="text-2xl md:text-3xl font-bold">Словарь</h1>
        <Badge variant="muted">{terms.length} терминов</Badge>
      </div>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Поиск термина..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1 rounded-btn text-xs font-mono transition-all ${
            activeCategory === null ? "bg-accent text-foreground" : "bg-card border border-card-border text-muted hover:text-foreground"
          }`}
        >
          Все
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(activeCategory === key ? null : key)}
            className={`px-3 py-1 rounded-btn text-xs font-mono transition-all ${
              activeCategory === key ? "bg-accent text-foreground" : "bg-card border border-card-border text-muted hover:text-foreground"
            }`}
          >
            {config.icon} {config.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((term) => {
          const config = categoryConfig[term.category];
          return (
            <Card key={term.term} className="p-3">
              <div className="flex items-start gap-3">
                <span className="text-lg">{config.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{term.term}</span>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>
                  <p className="text-xs text-muted">{term.definition}</p>
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-muted text-sm py-8">Ничего не найдено</p>
        )}
      </div>
    </div>
  );
}
