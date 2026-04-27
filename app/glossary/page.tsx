"use client";

import { useState, useMemo } from "react";
import { Card, Badge } from "@/components/shared";
import { Search, Database, ChevronDown, ChevronUp, Shuffle, BookOpen, Hash } from "lucide-react";

interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
  category: "attack" | "defense" | "law" | "general" | "social";
}

const terms: GlossaryTerm[] = [
  // АТАКИ
  { term: "Фишинг", definition: "Вид мошенничества, при котором злоумышленники рассылают поддельные письма от имени организаций для кражи данных.", example: "Письмо «от банка» с просьбой подтвердить данные карты по ссылке belarusbank-secure.com", category: "attack" },
  { term: "Вишинг", definition: "Телефонное мошенничество (voice + phishing). Звонок от «сотрудника банка» или «милиции» с требованием сообщить данные карты.", example: "«Здравствуйте, ваш счёт заблокирован. Назовите CVV-код для разблокировки»", category: "attack" },
  { term: "Смишинг", definition: "Мошенничество через SMS. Поддельные сообщения со ссылками на фишинговые сайты.", example: "SMS: «Вы выиграли iPhone! Заберите приз: bit.ly/win-phone»", category: "attack" },
  { term: "Ransomware", definition: "Вирус-вымогатель, шифрующий файлы жертвы и требующий выкуп (обычно в криптовалюте) за их расшифровку.", example: "WannaCry — заразил 230 000+ компьютеров в 150 странах в 2017 году", category: "attack" },
  { term: "Социальная инженерия", definition: "Метод манипуляции людьми для получения конфиденциальной информации путём обмана, давления или игры на эмоциях.", example: "Мошенник представляется мастером по установке домофонов и просит оплату переводом", category: "attack" },
  { term: "Брутфорс", definition: "Метод взлома путём перебора всех возможных комбинаций паролей. Чем длиннее и сложнее пароль — тем дольше перебор.", example: "Пароль «123456» взламывается за 1 секунду, «K!b3r$h1eld» — за 10 000+ лет", category: "attack" },
  { term: "DDoS", definition: "Distributed Denial of Service — распределённая атака на отказ в обслуживании. Сервер перегружается миллионами запросов и перестаёт работать.", example: "Атака на сайт во время онлайн-экзамена — сайт становится недоступен для всех", category: "attack" },
  { term: "Кейлоггер", definition: "Программа или устройство, записывающее все нажатия клавиш. Используется для кражи паролей, переписки и данных карт.", example: "Скрытая программа на компьютере интернет-кафе записывает твой пароль от почты", category: "attack" },
  { term: "Спуфинг", definition: "Подмена адреса отправителя (email, номера телефона, IP) для обмана жертвы.", example: "SMS приходит с номера «Беларусбанк», но на самом деле отправлен мошенниками", category: "attack" },
  { term: "Ботнет", definition: "Сеть заражённых устройств (компьютеров, камер, роутеров), управляемых злоумышленником удалённо для DDoS-атак или рассылки спама.", example: "Mirai — ботнет из 600 000 IoT-устройств, проводивший DDoS в 2016 году", category: "attack" },
  { term: "Man-in-the-Middle (MitM)", definition: "Атака «человек посередине» — злоумышленник перехватывает данные между двумя сторонами (например, между тобой и Wi-Fi роутером).", example: "Хакер в кафе перехватывает твой трафик через поддельную точку Wi-Fi «Free_Cafe_WiFi»", category: "attack" },
  { term: "Троян", definition: "Вредоносная программа, маскирующаяся под легитимное ПО. В отличие от вируса, не распространяется самостоятельно.", example: "Файл «крутые_скины_CS2.pdf.exe» — выглядит как PDF, но запускает вредоносный код", category: "attack" },
  { term: "SQL-инъекция", definition: "Внедрение вредоносного SQL-кода в запросы к базе данных через поля ввода на сайте.", example: "Ввод ' OR 1=1 -- в поле логина для обхода авторизации", category: "attack" },
  { term: "XSS", definition: "Cross-Site Scripting — внедрение вредоносного JavaScript-кода на страницу сайта для кражи cookie или перенаправления пользователей.", example: "Вредоносный скрипт в комментарии на форуме крадёт сессию администратора", category: "attack" },
  { term: "Скимминг", definition: "Установка скрытых устройств на банкоматы для копирования данных карты и PIN-кода.", example: "Накладка на слот карты и скрытая камера над клавиатурой банкомата", category: "attack" },
  { term: "Кардинг", definition: "Мошенничество с банковскими картами — использование украденных данных карт для покупок.", example: "Покупка товаров в интернет-магазинах с чужой карты, данные которой украдены через фишинг", category: "attack" },
  { term: "Дроппер", definition: "Человек, который за вознаграждение предоставляет свою банковскую карту для перевода похищенных денег. Является соучастником.", example: "«Подработка»: получи деньги на карту и перешли 90% на другой счёт — это уголовное преступление", category: "attack" },
  { term: "Криптоджекинг", definition: "Скрытый майнинг криптовалюты на устройстве жертвы без её ведома через вредоносный скрипт.", example: "Сайт скрытно использует процессор твоего компьютера для майнинга Monero", category: "attack" },
  { term: "Zero-day", definition: "Уязвимость в программе, о которой разработчик ещё не знает и для которой нет патча.", example: "Хакер находит дыру в WhatsApp, через которую можно установить шпионское ПО одним звонком", category: "attack" },

  // ЗАЩИТА
  { term: "Двухфакторная аутентификация (2FA)", definition: "Дополнительный уровень защиты: кроме пароля требуется второй фактор — код из SMS, приложение-аутентификатор или физический ключ.", example: "Даже если мошенник узнает пароль, без кода из Google Authenticator он не войдёт", category: "defense" },
  { term: "VPN", definition: "Virtual Private Network — шифрует интернет-трафик и скрывает IP-адрес. Защищает в публичных Wi-Fi сетях.", example: "При подключении к VPN провайдер и хакеры не видят, какие сайты ты посещаешь", category: "defense" },
  { term: "Шифрование", definition: "Преобразование данных в нечитаемый формат при помощи ключа. Только обладатель ключа может расшифровать.", example: "Мессенджер Signal шифрует сообщения так, что даже сервер не может их прочитать", category: "defense" },
  { term: "Брандмауэр (Firewall)", definition: "Система фильтрации сетевого трафика, блокирующая нежелательные подключения и защищающая от несанкционированного доступа.", example: "Firewall блокирует попытку трояна подключиться к серверу злоумышленника", category: "defense" },
  { term: "WPA3", definition: "Новейший стандарт шифрования Wi-Fi с улучшенной защитой от перебора паролей и атак KRACK.", example: "WPA3 защищает даже если пароль от Wi-Fi короткий — каждое устройство получает индивидуальное шифрование", category: "defense" },
  { term: "HTTPS", definition: "HyperText Transfer Protocol Secure — защищённый протокол передачи данных с шифрованием TLS. Значок 🔒 в браузере.", example: "На сайте с HTTPS никто в Wi-Fi сети не может перехватить твой пароль или данные карты", category: "defense" },
  { term: "Менеджер паролей", definition: "Программа для безопасного хранения и генерации уникальных сложных паролей. Ты запоминаешь 1 мастер-пароль.", example: "Bitwarden, KeePass — генерируют пароли вроде «x7$kQ9!mB2» для каждого сайта отдельно", category: "defense" },
  { term: "Антивирус", definition: "ПО для обнаружения, карантина и удаления вредоносных программ. Сканирует файлы и трафик в реальном времени.", example: "Антивирус блокирует загрузку файла «обновление_windows.exe» с подозрительного сайта", category: "defense" },
  { term: "Бэкап (Резервное копирование)", definition: "Создание копий важных данных на внешних носителях или в облаке для защиты от потери.", example: "Если ransomware зашифрует файлы — восстанови из бэкапа без выплаты выкупа", category: "defense" },
  { term: "Песочница (Sandbox)", definition: "Изолированная среда для запуска подозрительных программ без риска для основной системы.", example: "Открой подозрительный файл в песочнице — если это вирус, он не выйдет за её пределы", category: "defense" },
  { term: "Патч", definition: "Обновление программы, исправляющее уязвимости и ошибки. Всегда устанавливай обновления вовремя!", example: "Обновление iOS 16.4 закрывает уязвимость, через которую хакеры могли получить доступ к камере", category: "defense" },
  { term: "Хэширование", definition: "Преобразование данных в строку фиксированной длины (хэш). Даже малое изменение данных полностью меняет хэш.", example: "Пароль хранится как хэш SHA-256, а не открытым текстом — при утечке базы пароль не виден", category: "defense" },

  // ПРАВО
  { term: "Персональные данные", definition: "Любая информация, позволяющая идентифицировать человека: ФИО, адрес, номер телефона, фото, email и др.", example: "Паспортные данные, ИНН, номер карты, геолокация — всё это персональные данные", category: "law" },
  { term: "Несанкционированный доступ (ст. 349 УК РБ)", definition: "Получение доступа к компьютерной информации или системам без разрешения владельца. Наказание до 7 лет лишения свободы.", example: "Взлом чужого аккаунта ВКонтакте или Instagram — это уголовное преступление", category: "law" },
  { term: "Мошенничество (ст. 209 УК РБ)", definition: "Завладение имуществом или правом на него путём обмана или злоупотребления доверием. До 10 лет лишения свободы.", example: "Выманивание денег под видом «выигрыша в лотерею» или «инвестиций с гарантированным доходом»", category: "law" },
  { term: "Хищение путём модификации данных (ст. 212 УК РБ)", definition: "Хищение денег через изменение компьютерной информации — отдельная статья для кибермошенничества. До 12 лет.", example: "Использование украденных данных карты для онлайн-покупок", category: "law" },
  { term: "Закон о персональных данных (№ 99-З)", definition: "Основной закон Беларуси о защите персональных данных. Определяет права субъектов ПД и обязанности операторов.", example: "Компания обязана получить согласие на обработку ПД и защитить их от утечки", category: "law" },
  { term: "Закон об информации (№ 455-З)", definition: "Регулирует отношения в сфере информации, информатизации и защиты информации в Беларуси.", example: "Определяет понятия информационной безопасности, электронного документа, ЭЦП", category: "law" },
  { term: "Электронная цифровая подпись (ЭЦП)", definition: "Цифровой аналог собственноручной подписи для подтверждения подлинности электронного документа.", example: "Подпись договора через ЭЦП имеет такую же юридическую силу, как и бумажная", category: "law" },
  { term: "Оператор персональных данных", definition: "Организация или лицо, осуществляющее сбор, хранение и обработку персональных данных с согласия субъекта.", example: "Банк, школа, интернет-магазин — все они операторы ПД и обязаны защитить твои данные", category: "law" },
  { term: "Создание вредоносных программ (ст. 354 УК РБ)", definition: "Создание, использование или распространение вредоносных программ. До 10 лет лишения свободы.", example: "Написание и распространение трояна или вируса-вымогателя — тяжкое преступление", category: "law" },

  // СОЦИАЛЬНЫЕ
  { term: "Кибербуллинг", definition: "Травля, запугивание или унижение человека через интернет и социальные сети.", example: "Массовые оскорбительные комментарии под фото, создание поддельных страниц с целью унижения", category: "social" },
  { term: "Доксинг", definition: "Публикация личной информации человека в интернете без его согласия с целью запугивания.", example: "Публикация домашнего адреса, номера телефона и фото одноклассника в Telegram-канале", category: "social" },
  { term: "Груминг", definition: "Установление доверительного контакта взрослого с несовершеннолетним в интернете с целью сексуальной эксплуатации.", example: "«Друг» в игре постепенно просит фото, узнаёт адрес и предлагает встретиться лично", category: "social" },
  { term: "Секстинг", definition: "Отправка интимных фото или видео через мессенджеры. Опасен тем, что материалы могут быть распространены.", example: "Фото отправлено «парню/девушке», а потом появилось в группе класса", category: "social" },
  { term: "Фейковый аккаунт", definition: "Поддельная страница в социальной сети, созданная для обмана, мошенничества или слежки.", example: "«Одноклассник» пишет с нового аккаунта и просит перевести деньги — проверь звонком", category: "social" },
  { term: "Дипфейк", definition: "Поддельное видео или аудио, созданное с помощью ИИ, где человек «говорит» то, чего не говорил.", example: "Видеозвонок «от директора школы» — на самом деле ИИ подменил лицо и голос мошенника", category: "social" },

  // ОБЩЕЕ
  { term: "IoT", definition: "Internet of Things — интернет вещей. Сеть подключённых устройств: камеры, термостаты, колонки, замки.", example: "Умная колонка, робот-пылесос с Wi-Fi, «умная» лампочка — всё это IoT-устройства", category: "general" },
  { term: "CVV / CVC", definition: "Трёхзначный код безопасности на обратной стороне банковской карты для онлайн-платежей. Никогда не сообщай его!", example: "Сотрудник банка НИКОГДА не попросит CVV — если просят, это мошенники", category: "general" },
  { term: "APK", definition: "Android Package Kit — формат установочного файла Android-приложений. Установка APK из неизвестных источников опасна.", example: "Файл «whatsapp_gold.apk» из Telegram — скорее всего троян, а не «секретная версия WhatsApp»", category: "general" },
  { term: "Шифр Цезаря", definition: "Один из старейших шифров: каждая буква заменяется буквой с фиксированным сдвигом в алфавите.", example: "Сдвиг 3: А→Г, Б→Д, ПРИВЕТ→СУЛЁЗХ", category: "general" },
  { term: "AES-256", definition: "Advanced Encryption Standard — промышленный стандарт шифрования с ключом 256 бит. Используется банками и мессенджерами.", example: "Перебор всех ключей AES-256 займёт больше времени, чем существует Вселенная", category: "general" },
  { term: "Cookie", definition: "Небольшой файл данных, хранящий информацию о посещении сайта: настройки, сессию, предпочтения.", example: "Cookie позволяет сайту «помнить» твой логин — но трекинговые cookie следят за тобой", category: "general" },
  { term: "IP-адрес", definition: "Уникальный числовой идентификатор устройства в сети. IPv4 (4 числа) и IPv6 (более длинный формат).", example: "192.168.1.1 — твой роутер, 8.8.8.8 — DNS-сервер Google", category: "general" },
  { term: "Токен", definition: "Уникальный код для аутентификации или авторизации в системе. Бывает программный и аппаратный.", example: "JWT-токен — цифровой «пропуск», подтверждающий что ты авторизован на сайте", category: "general" },
  { term: "DNS", definition: "Domain Name System — переводит доменные имена (google.com) в IP-адреса. «Телефонная книга» интернета.", example: "Мошенники могут подменить DNS, чтобы belarusbank.by вёл на поддельный сайт", category: "general" },
  { term: "Метаданные", definition: "Данные о данных: время создания файла, геолокация фото, автор документа, модель камеры.", example: "Фото с телефона содержит GPS-координаты — по ним можно определить, где ты был", category: "general" },
  { term: "Даркнет", definition: "Скрытая часть интернета, доступная через специальные браузеры (Tor). Используется как для анонимности, так и для нелегальных целей.", example: "На даркнет-форумах продают украденные базы данных, пароли и данные карт", category: "general" },
  { term: "Облачное хранилище", definition: "Сервис для хранения файлов на удалённых серверах: Google Drive, iCloud, Яндекс.Диск.", example: "Файлы в облаке доступны с любого устройства, но защити аккаунт двухфакторной аутентификацией", category: "general" },
  { term: "Open Source", definition: "Программное обеспечение с открытым исходным кодом. Любой может проверить его на уязвимости и бэкдоры.", example: "Linux, Signal, KeePass — открытый код позволяет убедиться, что программа не шпионит за тобой", category: "general" },
];

const categoryConfig = {
  attack: { label: "АТАКА", variant: "error" as const, color: "#ff2d55" },
  defense: { label: "ЗАЩИТА", variant: "success" as const, color: "#00ff41" },
  law: { label: "ПРАВО", variant: "warning" as const, color: "#ffb800" },
  social: { label: "СОЦСЕТИ", variant: "accent" as const, color: "#b400ff" },
  general: { label: "ОБЩЕЕ", variant: "muted" as const, color: "#00ffcc" },
};

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const [sortAlpha, setSortAlpha] = useState(false);

  const filtered = useMemo(() => {
    let list = terms.filter((t) => {
      const matchSearch = search === "" ||
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === null || t.category === activeCategory;
      return matchSearch && matchCategory;
    });
    if (sortAlpha) {
      list = [...list].sort((a, b) => a.term.localeCompare(b.term, "ru"));
    }
    return list;
  }, [search, activeCategory, sortAlpha]);

  const handleRandom = () => {
    const randomTerm = terms[Math.floor(Math.random() * terms.length)];
    setSearch("");
    setActiveCategory(null);
    setExpandedTerm(randomTerm.term);
    const el = document.getElementById(`term-${randomTerm.term}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of terms) {
      counts[t.category] = (counts[t.category] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
          <Database size={22} className="text-accent" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold font-cyber tracking-wider">КИБЕР-СЛОВАРЬ</h1>
          <p className="text-xs text-muted font-mono">{terms.length} ТЕРМИНОВ В БАЗЕ ДАННЫХ</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(activeCategory === key ? null : key)}
            className={`card-base py-2 px-1 text-center transition-all ${
              activeCategory === key ? "border-accent/50" : ""
            }`}
            style={activeCategory === key ? { borderColor: config.color, boxShadow: `0 0 10px ${config.color}30` } : undefined}
          >
            <div className="text-lg font-cyber font-bold" style={{ color: config.color }}>{categoryCounts[key] || 0}</div>
            <div className="text-[8px] text-muted font-mono uppercase tracking-wider">{config.label}</div>
          </button>
        ))}
      </div>

      {/* Search + controls */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Поиск термина..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 text-sm w-full"
          />
        </div>
        <button
          onClick={() => setSortAlpha(!sortAlpha)}
          className={`px-3 rounded-btn border transition-all ${
            sortAlpha ? "border-accent/50 text-accent bg-accent/10" : "border-card-border text-muted hover:text-accent"
          }`}
          title="Сортировка А-Я"
        >
          <Hash size={16} />
        </button>
        <button
          onClick={handleRandom}
          className="px-3 rounded-btn border border-card-border text-muted hover:text-accent hover:border-accent/30 transition-all"
          title="Случайный термин"
        >
          <Shuffle size={16} />
        </button>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-btn text-xs font-mono tracking-wider transition-all ${
            activeCategory === null
              ? "bg-accent/20 text-accent border border-accent/40"
              : "bg-card border border-card-border text-muted hover:text-accent hover:border-accent/30"
          }`}
        >
          ВСЕ ({terms.length})
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(activeCategory === key ? null : key)}
            className={`px-3 py-1.5 rounded-btn text-xs font-mono tracking-wider transition-all ${
              activeCategory === key
                ? "bg-accent/20 text-accent border border-accent/40"
                : "bg-card border border-card-border text-muted hover:text-accent hover:border-accent/30"
            }`}
          >
            {config.label} ({categoryCounts[key] || 0})
          </button>
        ))}
      </div>

      {/* Terms list */}
      <div className="space-y-2">
        {filtered.map((term) => {
          const config = categoryConfig[term.category];
          const isExpanded = expandedTerm === term.term;
          return (
            <Card
              key={term.term}
              className={`p-3 cursor-pointer transition-all ${isExpanded ? "ring-1" : ""}`}
              style={isExpanded ? { borderColor: config.color + "60" } : undefined}
              onClick={() => setExpandedTerm(isExpanded ? null : term.term)}
            >
              <div id={`term-${term.term}`} className="flex items-start gap-3">
                <div
                  className="w-1 min-h-[2rem] rounded-full shrink-0"
                  style={{ background: config.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{term.term}</span>
                    <Badge variant={config.variant}>{config.label}</Badge>
                    <span className="ml-auto shrink-0">
                      {isExpanded ? <ChevronUp size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{term.definition}</p>
                  {isExpanded && term.example && (
                    <div className="mt-2 p-2 rounded bg-background/50 border border-card-border animate-slide-in-up">
                      <div className="flex items-start gap-2">
                        <BookOpen size={12} className="text-accent shrink-0 mt-0.5" />
                        <p className="text-xs text-accent font-mono">{term.example}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card className="text-center py-8">
            <p className="text-muted text-sm font-mono">СОВПАДЕНИЙ НЕ НАЙДЕНО</p>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-muted font-mono">
        <p>Показано {filtered.length} из {terms.length} терминов</p>
      </div>
    </div>
  );
}
