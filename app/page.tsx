"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shield, Terminal, Zap, ChevronRight, Search } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ ЗАЩИТЫ...";

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showContent) return;
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [showContent]);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none scanline-overlay z-10" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-blue/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-neon-blue/5 rounded-full" />
      </div>

      <div
        className={`transition-all duration-1000 relative z-20 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Shield icon with glow */}
        <div className="animate-float mb-8">
          <div className="w-28 h-28 mx-auto rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center neon-glow relative">
            <Shield size={56} className="text-accent" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-cyber-pulse" />
          </div>
        </div>

        {/* Title with glitch effect */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 font-cyber tracking-wider glitch-text relative">
          <span className="text-gradient">КИБЕР</span>
          <span className="text-foreground">РУБЕЖ</span>
        </h1>

        {/* Typed terminal text */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Terminal size={16} className="text-accent" />
          <p className="text-sm md:text-base text-accent font-mono">
            {typedText}
            <span className="animate-pulse">_</span>
          </p>
        </div>

        <p className="text-sm text-muted/80 mb-10 max-w-md mx-auto font-mono">
          Интерактивная образовательная платформа по кибербезопасности
        </p>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/missions")}
          className="btn-primary text-lg px-10 py-4 animate-pulse-glow font-cyber tracking-widest flex items-center gap-3 mx-auto"
        >
          <Zap size={20} />
          НАЧАТЬ ОБУЧЕНИЕ
          <ChevronRight size={20} />
        </button>

        {/* Stats bar */}
        <div className="mt-12 grid grid-cols-3 gap-3 max-w-sm mx-auto">
          <div className="card-base py-3 px-2 text-center border-accent/20">
            <div className="text-2xl font-cyber font-bold text-accent mb-0.5">14</div>
            <div className="text-[10px] text-muted font-mono uppercase tracking-wider">Миссий</div>
          </div>
          <div className="card-base py-3 px-2 text-center border-neon-blue/20">
            <div className="text-2xl font-cyber font-bold text-neon-blue mb-0.5">11</div>
            <div className="text-[10px] text-muted font-mono uppercase tracking-wider">Мини-игр</div>
          </div>
          <div className="card-base py-3 px-2 text-center border-neon-pink/20">
            <div className="text-2xl font-cyber font-bold text-neon-pink mb-0.5">AI</div>
            <div className="text-[10px] text-muted font-mono uppercase tracking-wider">Мошенник</div>
          </div>
        </div>

        {/* Проверь.бел link */}
        <a
          href="https://xn--b1agzdfd8f.xn--90ais/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 card-base py-3 px-4 flex items-center gap-3 max-w-sm mx-auto hover:border-neon-blue/40 transition-all group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center shrink-0 group-hover:bg-neon-blue/20 transition-all">
            <Search size={20} className="text-neon-blue" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold font-cyber tracking-wider text-neon-blue">ПРОВЕРЬ.БЕЛ</p>
            <p className="text-[10px] text-muted font-mono">Проверяй аккаунты на мошенничество — СК РБ</p>
          </div>
          <ChevronRight size={16} className="text-muted ml-auto shrink-0 group-hover:text-neon-blue transition-colors" />
        </a>

        {/* Author and hashtag */}
        <div className="mt-6 space-y-1">
          <p className="text-accent/60 text-xs font-mono">
            #КиберПраво
          </p>
          <p className="text-muted text-xs font-mono">
            Автор: Коноплёв Богдан, 17 лет
          </p>
        </div>
      </div>
    </div>
  );
}
