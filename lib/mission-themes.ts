export interface MissionTheme {
  accent: string;
  accentRgb: string;
  gradient: string;
  icon: string;
  label: string;
}

const themes: Record<string, MissionTheme> = {
  phishing: {
    accent: "#00d4ff",
    accentRgb: "0, 212, 255",
    gradient: "from-blue-500/20 to-cyan-500/20",
    icon: "🎣",
    label: "ФИШИНГ",
  },
  malware: {
    accent: "#ff2d55",
    accentRgb: "255, 45, 85",
    gradient: "from-red-500/20 to-orange-500/20",
    icon: "🦠",
    label: "МАЛВЕР",
  },
  social: {
    accent: "#b400ff",
    accentRgb: "180, 0, 255",
    gradient: "from-purple-500/20 to-pink-500/20",
    icon: "🎭",
    label: "СОЦ. ИНЖ.",
  },
  network: {
    accent: "#00ff41",
    accentRgb: "0, 255, 65",
    gradient: "from-green-500/20 to-emerald-500/20",
    icon: "🌐",
    label: "СЕТЬ",
  },
  crypto: {
    accent: "#ffb800",
    accentRgb: "255, 184, 0",
    gradient: "from-yellow-500/20 to-amber-500/20",
    icon: "🔐",
    label: "КРИПТО",
  },
  law: {
    accent: "#c0c0c0",
    accentRgb: "192, 192, 192",
    gradient: "from-slate-400/20 to-gray-500/20",
    icon: "⚖️",
    label: "ЗАКОН",
  },
  data: {
    accent: "#ff6b00",
    accentRgb: "255, 107, 0",
    gradient: "from-orange-500/20 to-red-500/20",
    icon: "💾",
    label: "ДАННЫЕ",
  },
  mobile: {
    accent: "#00b4ff",
    accentRgb: "0, 180, 255",
    gradient: "from-sky-500/20 to-blue-500/20",
    icon: "📱",
    label: "МОБАЙЛ",
  },
  iot: {
    accent: "#00e5c0",
    accentRgb: "0, 229, 192",
    gradient: "from-teal-500/20 to-cyan-500/20",
    icon: "🏠",
    label: "IoT",
  },
  password: {
    accent: "#00ff41",
    accentRgb: "0, 255, 65",
    gradient: "from-lime-500/20 to-green-500/20",
    icon: "🔑",
    label: "ПАРОЛИ",
  },
  "ai-scam": {
    accent: "#ff006e",
    accentRgb: "255, 0, 110",
    gradient: "from-rose-500/20 to-red-500/20",
    icon: "🤖",
    label: "ИИ-СКАМ",
  },
};

const defaultTheme: MissionTheme = {
  accent: "#00ffcc",
  accentRgb: "0, 255, 204",
  gradient: "from-cyan-500/20 to-teal-500/20",
  icon: "🛡️",
  label: "МИССИЯ",
};

export function getMissionTheme(type: string): MissionTheme {
  return themes[type] || defaultTheme;
}

export function getThemeStyle(theme: MissionTheme): React.CSSProperties {
  return {
    "--mission-accent": theme.accent,
    "--mission-accent-rgb": theme.accentRgb,
  } as React.CSSProperties;
}
