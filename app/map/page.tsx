"use client";

import { useState, useEffect } from "react";
import { Card, Badge } from "@/components/shared";
import {
  Newspaper,
  ExternalLink,
  RefreshCcw,
  Filter,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  sourceIcon: string;
  date: string;
}

const SOURCES = ["Все", "БелТА", "СБ Беларусь сегодня", "ОНТ"];

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ru-BY", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSource, setSelectedSource] = useState("Все");

  const fetchNews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Ошибка загрузки");
      const data = await res.json();
      setNews(data.news || []);
    } catch {
      setError("Не удалось загрузить новости. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filtered =
    selectedSource === "Все"
      ? news
      : news.filter((n) => n.source === selectedSource);

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Newspaper size={28} className="text-accent" />
          <h1 className="text-2xl md:text-3xl font-bold">Кибер-новости</h1>
        </div>
        <button
          onClick={fetchNews}
          disabled={loading}
          className="p-2 rounded-btn text-muted hover:text-accent transition-colors disabled:opacity-50"
          title="Обновить"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <p className="text-muted text-sm mb-4">
        Новости о кибербезопасности из государственных СМИ Беларуси
      </p>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter size={14} className="text-muted shrink-0" />
        {SOURCES.map((source) => (
          <button
            key={source}
            onClick={() => setSelectedSource(source)}
            className={`px-3 py-1.5 rounded-btn text-xs font-mono whitespace-nowrap transition-all ${
              selectedSource === source
                ? "bg-accent text-foreground"
                : "bg-card text-muted hover:text-foreground border border-card-border"
            }`}
          >
            {source}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 size={32} className="text-accent animate-spin mb-3" />
          <p className="text-muted text-sm font-mono">Загрузка новостей...</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <AlertTriangle size={32} className="text-error mb-3" />
          <p className="text-error text-sm">{error}</p>
          <button onClick={fetchNews} className="btn-primary mt-4 text-sm">
            Попробовать снова
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Newspaper size={32} className="text-muted mb-3" />
          <p className="text-muted text-sm">
            {news.length === 0
              ? "Новости о кибербезопасности не найдены в RSS-лентах СМИ"
              : "Нет новостей для выбранного источника"}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {!loading &&
          filtered.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="hover:border-accent/50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="text-2xl shrink-0">{item.sourceIcon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="accent">{item.source}</Badge>
                      {item.date && (
                        <span className="text-xs text-muted font-mono">
                          {formatDate(item.date)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-muted text-xs line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <ExternalLink
                    size={16}
                    className="text-muted shrink-0 mt-1"
                  />
                </div>
              </Card>
            </a>
          ))}
      </div>

      {!loading && filtered.length > 0 && (
        <p className="text-center text-xs text-muted mt-6 font-mono">
          Источники: БелТА · СБ Беларусь сегодня · ОНТ
        </p>
      )}
    </div>
  );
}
