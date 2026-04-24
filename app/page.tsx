"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shield } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
      <div
        className={`transition-all duration-1000 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="animate-float mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-accent/20 flex items-center justify-center neon-glow">
            <Shield size={48} className="text-accent" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 font-heading">
          <span className="text-gradient">КИБЕРЩИТ</span>
        </h1>

        <p className="text-lg md:text-xl text-muted mb-2 font-mono">
          Ты в сети. Они в охоте.
        </p>
        <p className="text-sm text-muted/60 mb-10 max-w-md mx-auto">
          Интерактивная платформа кибербезопасности для граждан Республики
          Беларусь
        </p>

        <button
          onClick={() => router.push("/missions")}
          className="btn-primary text-lg px-8 py-4 animate-pulse-glow"
        >
          Начать испытание
        </button>

        <div className="mt-12 flex items-center justify-center gap-8 text-muted text-xs font-mono">
          <span>14 миссий</span>
          <span className="w-1 h-1 bg-muted rounded-full" />
          <span>5 рангов</span>
          <span className="w-1 h-1 bg-muted rounded-full" />
          <span>Беларусь 🇧🇾</span>
        </div>

        <p className="mt-6 text-accent text-xs font-mono font-semibold">
          #КиберПраво: твой щит в сети
        </p>
      </div>
    </div>
  );
}
