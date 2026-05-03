import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050a0f",
        card: "#0a1628",
        "card-alt": "#0d1f35",
        accent: "#00ffcc",
        "accent-dim": "#00b894",
        neon: "#00ff41",
        "neon-blue": "#00d4ff",
        "neon-purple": "#b400ff",
        "neon-pink": "#ff006e",
        success: "#00ff41",
        error: "#ff2d55",
        warning: "#ffb800",
        foreground: "#e0f7fa",
        muted: "#5a7a8a",
        "card-border": "#0f3460",
        "grid-line": "#0a2040",
      },
      borderRadius: {
        card: "8px",
        btn: "6px",
      },
      fontFamily: {
        heading: ["Rajdhani", "Inter", "sans-serif"],
        mono: ["Share Tech Mono", "JetBrains Mono", "monospace"],
        cyber: ["Orbitron", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 255, 204, 0.4), 0 0 40px rgba(0, 255, 204, 0.1)",
        "glow-green": "0 0 20px rgba(0, 255, 65, 0.4), 0 0 40px rgba(0, 255, 65, 0.1)",
        "glow-error": "0 0 20px rgba(255, 45, 85, 0.4), 0 0 40px rgba(0, 0, 0, 0.1)",
        "glow-blue": "0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.1)",
        "glow-purple": "0 0 20px rgba(180, 0, 255, 0.3), 0 0 40px rgba(180, 0, 255, 0.1)",
        "inner-glow": "inset 0 0 30px rgba(0, 255, 204, 0.05)",
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(rgba(0,255,204,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,204,0.03) 1px, transparent 1px)",
        "cyber-gradient": "linear-gradient(135deg, #050a0f 0%, #0a1628 50%, #050a0f 100%)",
      },
      backgroundSize: {
        "grid-40": "40px 40px",
      },
      animation: {
        "scan-line": "scanLine 4s linear infinite",
        "glitch": "glitch 3s infinite",
        "cyber-pulse": "cyberPulse 2s ease-in-out infinite",
        "border-flow": "borderFlow 3s linear infinite",
        "text-flicker": "textFlicker 4s linear infinite",
        "matrix-fall": "matrixFall 20s linear infinite",
        "spin-slow": "spin 30s linear infinite",
        "spin-slow-reverse": "spin 25s linear infinite reverse",
      },
    },
  },
  plugins: [],
};

export default config;
