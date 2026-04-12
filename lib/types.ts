export interface User {
  id: string;
  email: string;
  nickname: string;
  xp: number;
  rank: string;
  createdAt: string;
}

export interface Level {
  id: number;
  title: string;
  type: "phishing" | "malware" | "social" | "network" | "crypto" | "law" | "data" | "mobile" | "iot" | "password";
  difficulty: 1 | 2 | 3;
  description: string;
}

export interface Report {
  id: string;
  region: string;
  threatType: string;
  description: string;
  createdAt: string;
}

export interface Answer {
  correct: number;
  explanation: string;
}

export interface PlayerProgress {
  completedLevels: number[];
  currentLevel: number;
  xp: number;
  rank: string;
}

export type Difficulty = 1 | 2 | 3;

export type LevelType = Level["type"];

export type RankName =
  | "Новичок"
  | "Агент"
  | "Детектив"
  | "Инспектор"
  | "Кибер-Маршал";
