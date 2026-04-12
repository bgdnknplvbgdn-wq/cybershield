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
        background: "#0A0E1A",
        card: "#141828",
        accent: "#0066CC",
        success: "#00FF41",
        error: "#FF3B3B",
        warning: "#FFD700",
        foreground: "#FFFFFF",
        muted: "#8892B0",
        "card-border": "#1E2A45",
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 15px rgba(0, 102, 204, 0.4)",
        "glow-success": "0 0 15px rgba(0, 255, 65, 0.4)",
        "glow-error": "0 0 15px rgba(255, 59, 59, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
