import { NextResponse } from "next/server";

interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  sourceIcon: string;
  date: string;
}

const CYBER_KEYWORDS = [
  "мошенни", "кибер", "хакер", "фишинг", "взлом", "вирус",
  "ransomware", "утечка данных", "персональных данных", "пароль",
  "безопасност", "вишинг", "скам", "malware", "DDoS", "ботнет",
  "интернет-преступ", "киберпреступ", "цифров", "онлайн-мошен",
  "банковск.*карт", "SMS.*код", "троян", "шифровальщик",
  "информационная безопасность", "защита данных",
];

const KEYWORD_REGEX = new RegExp(CYBER_KEYWORDS.join("|"), "i");

function extractRssItems(xml: string, source: string, sourceIcon: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1]
      || block.match(/<title>([\s\S]*?)<\/title>/)?.[1]
      || "";
    const description = block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1]
      || block.match(/<description>([\s\S]*?)<\/description>/)?.[1]
      || "";
    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]
      || block.match(/<link[^>]*href="([^"]*)"[^>]*\/>/)?.[1]
      || "";
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";

    const cleanTitle = title.replace(/<[^>]*>/g, "").trim();
    const cleanDesc = description.replace(/<[^>]*>/g, "").trim();
    const cleanLink = link.replace(/<[^>]*>/g, "").trim();

    if (cleanTitle && KEYWORD_REGEX.test(cleanTitle + " " + cleanDesc)) {
      items.push({
        title: cleanTitle,
        description: cleanDesc.slice(0, 300),
        url: cleanLink,
        source,
        sourceIcon,
        date: pubDate,
      });
    }
  }
  return items;
}

async function fetchFeed(url: string, source: string, sourceIcon: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "CyberShield/1.0 (Educational)" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return extractRssItems(xml, source, sourceIcon);
  } catch {
    return [];
  }
}

export async function GET() {
  const feeds = [
    { url: "https://belta.by/rss", source: "БелТА", icon: "🔵" },
    { url: "https://www.sb.by/rss/", source: "СБ Беларусь сегодня", icon: "🟢" },
    { url: "https://ont.by/rss", source: "ОНТ", icon: "🟠" },
  ];

  const results = await Promise.all(
    feeds.map((f) => fetchFeed(f.url, f.source, f.icon))
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
