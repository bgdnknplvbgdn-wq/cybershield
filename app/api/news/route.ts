import { NextResponse } from "next/server";

interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  date: string;
}

const KEYWORDS = [
  "мошенни",
  "мошенн",
  "обман",
  "обмануть",
  "обманул",
  "аферист",
  "аферы",
  "жертв.*обман",
  "жертв.*мошен",
  "лжезвон",
  "лжесотрудник",
  "лжемастер",
  "кибермошен",
  "онлайн-мошен",
  "интернет-мошен",
  "телефонн.*мошен",
  "фишинг",
  "вишинг",
  "смишинг",
  "скам",
  "скимм",
  "кибер.*преступ",
  "киберпреступ",
  "хакер",
  "взлом",
  "взломал",
  "взломщик",
  "ransomware",
  "троян",
  "шифровальщик",
  "malware",
  "вредонос",
  "вирус.*компьютер",
  "DDoS",
  "ботнет",
  "утечк.*данных",
  "утечк.*информац",
  "похищен.*данных",
  "кража.*данных",
  "краж.*средств",
  "украл.*деньги",
  "похитил.*деньги",
  "похитил.*средств",
  "списал.*деньги",
  "списан.*средств",
  "банковск.*карт",
  "карт-счёт",
  "карт-счет",
  "перевод.*деньг.*незнаком",
  "SMS.*мошен",
  "звонок.*мошен",
  "звонки.*мошен",
  "звонил.*банк",
  "позвонил.*сотрудник",
  "представил.*сотрудник",
  "кибератак",
  "кибербезопасност",
  "киберугроз",
  "киберзащит",
  "кибернаруш",
  "информационн.*безопасност",
  "цифров.*безопасност",
  "защит.*персональн",
  "персональн.*данн",
  "заблокировал.*ресурс",
  "заблокировал.*сайт",
  "фишинговы.*ресурс",
  "фишинговы.*сайт",
  "поддельн.*сайт",
  "интернет.*ресурс.*заблок",
  "МВД.*кибер",
  "МВД.*мошен",
  "МВД.*интернет",
  "милиц.*мошен",
  "милиц.*кибер",
  "спам.*звон",
  "развод.*деньг",
  "выман.*данн",
  "выман.*деньг",
  "выман.*средств",
  "социальн.*инженер",
  "дропп",
  "криптовалют.*мошен",
  "крючок.*злоумышленник",
  "безопасност.*сет",
];

const KEYWORDS_REGEX = new RegExp(KEYWORDS.join("|"), "i");

const EXCLUDE_KEYWORDS = [
  "чернобыл",
  "ЧАЭС",
  "аварии на",
  "радиац",
  "сельское хозяйство",
  "посевн",
  "свекл",
  "погод",
  "синоптик",
  "ветрен",
  "спорт",
  "медал",
  "чемпионат",
  "олимп",
  "турист",
  "экосистем",
  "форум.*здравоохранен",
  "онколог",
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
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "CyberRubezh/1.0 (Educational)" },
    });
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
    { url: "https://mvd.gov.by/ru/rss", source: "МВД РБ" },
    { url: "https://www.sb.by/rss/", source: "СБ Беларусь сегодня" },
    { url: "https://ont.by/rss", source: "ОНТ" },
    { url: "https://mpt.gov.by/ru/rss", source: "Минсвязи РБ" },
  ];

  const results = await Promise.all(
    feeds.map((f) => fetchFeed(f.url, f.source))
  );

  const allNews = results
    .flat()
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    })
    .slice(0, 50);

  return NextResponse.json({ news: allNews, fetchedAt: new Date().toISOString() });
}
