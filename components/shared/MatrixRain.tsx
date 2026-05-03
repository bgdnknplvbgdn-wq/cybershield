"use client";

import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 20;
    const colGap = 36;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "0123456789ABCDEF{}[]<>#$@!?=+-*";
    const columns = Math.floor(canvas.width / colGap);
    const drops: number[] = Array(columns).fill(0).map(() => Math.floor(Math.random() * -20));

    const draw = () => {
      ctx.fillStyle = "rgba(5, 10, 15, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        if (drops[i] * fontSize > 0) {
          const brightness = 0.08 + Math.random() * 0.1;
          ctx.fillStyle = `rgba(0, 255, 204, ${brightness})`;
          const char = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(char, i * colGap + (colGap - fontSize) / 2, drops[i] * fontSize);
        }

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          drops[i] = Math.floor(Math.random() * -10);
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 60);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-30"
    />
  );
}
