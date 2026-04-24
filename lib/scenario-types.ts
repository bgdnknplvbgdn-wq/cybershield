export type StepType =
  | "briefing"
  | "quiz"
  | "email-inspect"
  | "dialog"
  | "password-game"
  | "cipher-puzzle"
  | "network-config"
  | "permission-check"
  | "smart-home"
  | "data-leak-check"
  | "law-match"
  | "ai-scam-chat"
  | "debriefing";

export interface BriefingStep {
  type: "briefing";
  title: string;
  text: string;
  facts: string[];
  icon: string;
}

export interface QuizStep {
  type: "quiz";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface EmailInspectStep {
  type: "email-inspect";
  from: string;
  fromReal: string;
  subject: string;
  body: string;
  suspiciousElements: {
    id: string;
    text: string;
    hint: string;
  }[];
  minToFind: number;
}

export interface DialogStep {
  type: "dialog";
  callerName: string;
  callerRole: string;
  messages: DialogMessage[];
}

export interface DialogMessage {
  sender: "caller" | "player";
  text: string;
  choices?: DialogChoice[];
}

export interface DialogChoice {
  text: string;
  correct: boolean;
  response: string;
  explanation: string;
}

export interface PasswordGameStep {
  type: "password-game";
  testPasswords: {
    password: string;
    crackTime: string;
    score: number;
  }[];
  tips: string[];
}

export interface CipherPuzzleStep {
  type: "cipher-puzzle";
  cipherType: "caesar";
  shift: number;
  encrypted: string;
  answer: string;
  hint: string;
}

export interface NetworkConfigStep {
  type: "network-config";
  devices: {
    name: string;
    icon: string;
    vulnerable: boolean;
    fix: string;
  }[];
  tasks: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface PermissionCheckStep {
  type: "permission-check";
  appName: string;
  appIcon: string;
  permissions: {
    name: string;
    icon: string;
    suspicious: boolean;
    reason: string;
  }[];
  minToFind: number;
}

export interface SmartHomeStep {
  type: "smart-home";
  devices: {
    name: string;
    icon: string;
    location: string;
    vulnerable: boolean;
    vulnerability: string;
    fix: string;
  }[];
}

export interface DataLeakCheckStep {
  type: "data-leak-check";
  leakedServices: string[];
  actions: {
    action: string;
    correct: boolean;
    explanation: string;
  }[];
  minCorrectActions: number;
}

export interface LawMatchStep {
  type: "law-match";
  cases: {
    situation: string;
    lawOptions: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export type ScamScenarioId = "bank" | "email" | "intercom" | "classmate";

export interface AIScamChatStep {
  type: "ai-scam-chat";
  scenarioId: ScamScenarioId;
  scammerName: string;
  scammerRole: string;
  context: string;
  targetData: string[];
  maxMessages: number;
}

export interface DebriefingStep {
  type: "debriefing";
  title: string;
  summary: string;
  lawReference: string;
  lawText: string;
  tips: string[];
}

export type ScenarioStep =
  | BriefingStep
  | QuizStep
  | EmailInspectStep
  | DialogStep
  | PasswordGameStep
  | CipherPuzzleStep
  | NetworkConfigStep
  | PermissionCheckStep
  | SmartHomeStep
  | DataLeakCheckStep
  | LawMatchStep
  | AIScamChatStep
  | DebriefingStep;

export interface Scenario {
  id: number;
  title: string;
  type: string;
  difficulty: 1 | 2 | 3;
  description: string;
  icon: string;
  steps: ScenarioStep[];
}
