"use client";

import { useState, useEffect } from "react";
import { Card, Badge } from "@/components/shared";
import {
  Newspaper,
  ExternalLink,
  RefreshCcw,
  Loader2,
  AlertTriangle,
  Radio,
} from "lucide-react";

interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  date: string;
}

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

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
            <Radio size={22} className="text-accent" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-cyber tracking-wider">НОВОСТИ</h1>
            <p className="text-xs text-muted font-mono">КИБЕРМОНИТОРИНГ СМИ</p>
          </div>
        </div>
        <button
          onClick={fetchNews}
          disabled={loading}
          className="w-10 h-10 rounded-lg bg-card-alt border border-card-border flex items-center justify-center text-muted hover:text-accent hover:border-accent/30 transition-all disabled:opacity-50"
          title="Обновить"
        >
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <p className="text-muted text-xs mb-6 font-mono uppercase tracking-wider">
        Новости о кибермошенничестве и интернет-преступлениях из государственных СМИ Беларуси
      </p>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 size={32} className="text-accent animate-spin mb-3" />
          <p className="text-accent text-sm font-mono">ЗАГРУЗКА ДАННЫХ...</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <AlertTriangle size={32} className="text-error mb-3" />
          <p className="text-error text-sm font-mono">{error}</p>
          <button onClick={fetchNews} className="btn-primary mt-4 text-sm">
            ПОВТОРИТЬ
          </button>
        </div>
      )}

      {!loading && !error && news.length === 0 && (
        <Card className="text-center py-12">
          <Newspaper size={32} className="text-muted mx-auto mb-3" />
          <p className="text-muted text-sm font-mono">
            ДАННЫЕ О КИБЕРМОШЕННИЧЕСТВЕ НЕ НАЙДЕНЫ
          </p>
        </Card>
      )}

      <div className="space-y-3">
        {!loading &&
          news.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className="group-hover:border-accent/40 transition-all">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="accent">{item.source}</Badge>
                      {item.date && (
                        <span className="text-[10px] text-muted font-mono">
                          {formatDate(item.date)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-muted text-xs line-clamp-2 font-mono">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <ExternalLink
                    size={16}
                    className="text-muted group-hover:text-accent shrink-0 mt-1 transition-colors"
                  />
                </div>
              </Card>
            </a>
          ))}
      </div>

      {!loading && news.length > 0 && (
        <p className="text-center text-[10px] text-muted mt-6 font-mono uppercase tracking-widest">
          Источники: БелТА, СБ Беларусь сегодня, ОНТ
        </p>
      )}
    </div>
  );
}
