import { NextResponse } from "next/server";

interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  date: string;
}

const KEYWORDS = [
  "кибермошен",
  "кибер.?мошен",
  "онлайн.?мошен",
  "интернет.?мошен",
  "телефонн.*мошен",
  "фишинг",
  "вишинг",
  "смишинг",
  "скимминг",
  "скиммер",
  "кибер.*преступ",
  "киберпреступ",
  "хакер.*взлом",
  "хакер.*атак",
  "хакерск",
  "взлом.*аккаунт",
  "взлом.*сайт",
  "взлом.*систем",
  "взлом.*базу",
  "ransomware",
  "вирус.*компьютер",
  "вредонос.*програм",
  "троян.*програм",
  "шифровальщик",
  "DDoS",
  "ботнет",
  "утечк.*данных",
  "утечк.*персональн",
  "кража.*данных",
  "похищен.*данных",
  "перевод.*деньг.*незнаком",
  "перевод.*деньг.*мошен",
  "перевёл.*деньги.*мошен",
  "перевел.*деньги.*мошен",
  "перечислил.*мошен",
  "перечислил.*неизвестн",
  "SMS.*мошен",
  "звон.*мошенник",
  "позвонил.*сотрудник.*банк",
  "представил.*сотрудник.*банк",
  "представил.*сотрудник.*милиц",
  "кибератак",
  "кибербезопасност",
  "киберугроз",
  "киберзащит",
  "информационн.*безопасност",
  "цифров.*безопасност",
  "фишинговы.*ресурс",
  "фишинговы.*сайт",
  "поддельн.*сайт",
  "поддельн.*приложен",
  "поддельн.*страниц",
  "социальн.*инженер",
  "дропп",
  "дроппер",
  "криптовалют.*мошен",
  "криптовалют.*схем",
  "лже.?банкир",
  "лже.?сотрудник.*банк",
  "AnyDesk.*установ",
  "TeamViewer.*установ",
  "удалённ.*доступ.*мошен",
  "удаленн.*доступ.*мошен",
  "инвестиц.*мошен",
  "трейдинг.*мошен",
  "Форекс.*мошен",
  "Куфар.*мошен",
  "Куфар.*обман",
  "кардинг",
  "интернет.*мошенничес",
  "мошенничес.*интернет",
  "мошенничес.*сет[ия]",
  "мошенничес.*телефон",
  "мошенничес.*онлайн",
  "мошенничес.*мессенджер",
  "мошенничес.*viber",
  "мошенничес.*telegram",
  "мошенничес.*whatsapp",
  "финансов.*пирамид.*интернет",
  "банковск.*мошен",
  "карточ.*мошен",
  "malware",
];

const KEYWORDS_REGEX = new RegExp(KEYWORDS.join("|"), "i");

const EXCLUDE_KEYWORDS = [
  "чернобыл",
  "ЧАЭС",
  "радиац",
  "сельское хозяйство",
  "посевн",
  "погод",
  "синоптик",
  "спорт",
  "медал",
  "чемпионат",
  "олимп",
  "турист",
  "вакцин",
  "концерт",
  "выставк",
  "театр",
  "кино",
  "фильм",
  "праздник",
  "юбилей",
  "метро.*инспектор",
  "метро.*задержал",
  "метро.*пассажир",
  "уборщи",
  "сумочк",
  "педагог",
  "молод.*специалист",
  "энерги[яю].*женщин",
  "домофон.*установ",
  "буйн.*пассажир",
  "ползти.*передать",
  "активное сопротивление",
];

const EXCLUDE_REGEX = new RegExp(EXCLUDE_KEYWORDS.join("|"), "i");

function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, "\"")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/&#\d+;/g, "")
    .replace(/&\w+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractRssItems(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const rawTitle = block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1]
      || block.match(/<title>([\s\S]*?)<\/title>/)?.[1]
      || "";
    const rawDescription = block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1]
      || block.match(/<description>([\s\S]*?)<\/description>/)?.[1]
      || "";
    const rawLink = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]
      || block.match(/<link[^>]*href="([^"]*)"[^>]*\/>/)?.[1]
      || "";
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";

    const title = cleanText(rawTitle);
    const description = cleanText(rawDescription);
    const url = cleanText(rawLink);

    if (!title || !url) continue;

    const combined = title + " " + description;

    if (!KEYWORDS_REGEX.test(combined)) continue;

    if (EXCLUDE_REGEX.test(combined)) continue;

    items.push({
      title,
      description: description.slice(0, 250),
      url,
      source,
      date: pubDate,
    });
  }
  return items;
}

async function fetchFeed(url: string, source: string): Promise<NewsItem[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      next: { revalidate: 900 },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CyberRubezh/1.0; Educational)" },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const xml = await res.text();
    return extractRssItems(xml, source);
  } catch {
    return [];
  }
}

export async function GET() {
  const feeds = [
    { url: "https://belta.by/rss", source: "БелТА" },
    { url: "https://www.belta.by/rss/incident/", source: "БелТА Происшествия" },
    { url: "https://mvd.gov.by/ru/rss", source: "МВД РБ" },
    { url: "https://minsknews.by/feed/", source: "Минск-Новости" },
    { url: "https://www.sb.by/rss/", source: "СБ Беларусь сегодня" },
    { url: "https://ont.by/rss", source: "ОНТ" },
    { url: "https://www.tvr.by/rss/", source: "БелТелерадио" },
    { url: "https://www.21.by/rss/", source: "21.by" },
  ];

  const results = await Promise.all(
    feeds.map((f) => fetchFeed(f.url, f.source))
  );

  const seen = new Set<string>();
  const allNews = results
    .flat()
    .filter((item) => {
      const key = item.title.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    })
    .slice(0, 30);

  return NextResponse.json({ news: allNews, fetchedAt: new Date().toISOString() });
}
