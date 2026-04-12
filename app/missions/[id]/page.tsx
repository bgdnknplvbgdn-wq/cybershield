"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuthStore, useGameStore } from "@/store";
import { Card, Badge } from "@/components/shared";
import levels from "@/data/levels.json";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Shield,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import type { Level, Answer } from "@/lib/types";

const quizData: Record<
  number,
  { question: string; options: string[]; answer: Answer }
> = {
  1: {
    question: "Какой признак указывает на фишинговое письмо?",
    options: [
      "Официальный логотип компании",
      "Ссылка на домен, отличающийся от настоящего",
      "Грамотный текст без ошибок",
      "Письмо от известного сервиса",
    ],
    answer: {
      correct: 1,
      explanation:
        "Фишинговые письма часто используют похожие, но поддельные домены (например, paypa1.com вместо paypal.com).",
    },
  },
  2: {
    question: "Что НЕ помогает защититься от ransomware?",
    options: [
      "Регулярное резервное копирование",
      "Обновление ОС и антивируса",
      "Открытие вложений из неизвестных писем",
      "Использование брандмауэра",
    ],
    answer: {
      correct: 2,
      explanation:
        "Открытие неизвестных вложений — главный способ заражения ransomware. Всегда проверяй отправителя.",
    },
  },
  3: {
    question: "Звонящий представился «сотрудником банка» и просит код из SMS. Твои действия?",
    options: [
      "Назвать код — это же банк!",
      "Повесить трубку и перезвонить по официальному номеру",
      "Попросить его назваться ещё раз",
      "Спросить его ФИО и поверить",
    ],
    answer: {
      correct: 1,
      explanation:
        "Никогда не называй коды из SMS. Перезвони по официальному номеру банка с сайта или карты.",
    },
  },
  4: {
    question: "Какой стандарт шифрования Wi-Fi наиболее безопасен?",
    options: ["WEP", "WPA", "WPA2", "WPA3"],
    answer: {
      correct: 3,
      explanation:
        "WPA3 — новейший стандарт с улучшенной защитой от брутфорс-атак и индивидуальным шифрованием.",
    },
  },
  5: {
    question: "Шифр Цезаря со сдвигом 3: что значит «KHOOR»?",
    options: ["ПРИВЕТ", "HELLO", "ШИФР", "СЛОВО"],
    answer: {
      correct: 1,
      explanation:
        "Шифр Цезаря сдвигает каждую букву. K→H (+3 назад), H→E... KHOOR = HELLO со сдвигом +3.",
    },
  },
  6: {
    question: "Какой закон РБ регулирует обработку персональных данных?",
    options: [
      "Закон о государственной тайне",
      "Закон о персональных данных (№455-З)",
      "Закон о СМИ",
      "Гражданский кодекс",
    ],
    answer: {
      correct: 1,
      explanation:
        "Закон Республики Беларусь №455-З «О персональных данных» регулирует сбор, хранение и обработку ПД.",
    },
  },
  7: {
    question: "Обнаружил свои данные в утечке. Первый шаг?",
    options: [
      "Ничего не делать — уже поздно",
      "Сменить пароли на затронутых сервисах",
      "Удалить все аккаунты",
      "Написать в полицию",
    ],
    answer: {
      correct: 1,
      explanation:
        "Немедленно смени пароли на скомпрометированных аккаунтах и включи двухфакторную аутентификацию.",
    },
  },
  8: {
    question: "Какое разрешение НЕ должно быть у приложения-фонарика?",
    options: ["Камера", "Доступ к контактам", "Вибрация", "Wi-Fi"],
    answer: {
      correct: 1,
      explanation:
        "Фонарик не нуждается в доступе к контактам. Это признак вредоносного или шпионящего приложения.",
    },
  },
  9: {
    question: "Уязвимость какого IoT-устройства чаще всего эксплуатируется?",
    options: ["Умная лампочка", "IP-камера", "Умный термостат", "Робот-пылесос"],
    answer: {
      correct: 1,
      explanation:
        "IP-камеры с дефолтными паролями — главная цель. Ботнет Mirai использовал именно их.",
    },
  },
  10: {
    question: "Какой пароль наиболее стойкий к брутфорсу?",
    options: [
      "password123",
      "Qwerty2024!",
      "correct-horse-battery-staple",
      "Пароль1",
    ],
    answer: {
      correct: 2,
      explanation:
        "Длинная фраза из случайных слов (diceware) надёжнее короткого сложного пароля. Длина > сложность.",
    },
  },
};

const difficultyLabel: Record<
  number,
  { text: string; variant: "success" | "warning" | "error" }
> = {
  1: { text: "Лёгкий", variant: "success" },
  2: { text: "Средний", variant: "warning" },
  3: { text: "Сложный", variant: "error" },
};

const xpReward: Record<number, number> = { 1: 10, 2: 20, 3: 30 };

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { updateProgress, isLevelCompleted } = useGameStore();
  const id = Number(params.id);

  const level = (levels as Level[]).find((l) => l.id === id);
  const quiz = quizData[id];

  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  if (!level || !quiz) {
    return (
      <div className="min-h-[80dvh] flex flex-col items-center justify-center px-6 text-center">
        <Shield size={48} className="text-muted mb-4" />
        <p className="text-muted">Миссия не найдена</p>
        <button
          onClick={() => router.push("/missions")}
          className="btn-primary mt-4"
        >
          Назад к миссиям
        </button>
      </div>
    );
  }

  const alreadyCompleted = isLevelCompleted(level.id);
  const isCorrect = selected === quiz.answer.correct;
  const diff = difficultyLabel[level.difficulty];

  const handleAnswer = async () => {
    if (selected === null) return;
    setAnswered(true);
    if (isCorrect) {
      await updateProgress(level.id, xpReward[level.difficulty]);
    }
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-2xl mx-auto">
      <button
        onClick={() => router.push("/missions")}
        className="flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        <span className="text-sm">Миссии</span>
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-muted font-mono">#{level.id}</span>
          <Badge variant={diff.variant}>{diff.text}</Badge>
          <span className="text-xs text-muted font-mono">
            +{xpReward[level.difficulty]} XP
          </span>
          {alreadyCompleted && !answered && (
            <Badge variant="success">Пройдена</Badge>
          )}
        </div>
        <h1 className="text-xl md:text-2xl font-bold">{level.title}</h1>
        <p className="text-muted text-sm mt-2">{level.description}</p>
      </div>

      <Card className="mb-4">
        <h2 className="font-semibold mb-4 text-accent font-mono text-sm">
          ЗАДАНИЕ
        </h2>
        <p className="text-base mb-6">{quiz.question}</p>

        <div className="space-y-2">
          {quiz.options.map((option, idx) => {
            let optionClass =
              "w-full text-left p-3 rounded-btn border transition-all text-sm ";

            if (!answered) {
              optionClass +=
                selected === idx
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-card-border bg-background text-muted hover:border-accent/40";
            } else {
              if (idx === quiz.answer.correct) {
                optionClass += "border-success bg-success/10 text-success";
              } else if (idx === selected && !isCorrect) {
                optionClass += "border-error bg-error/10 text-error";
              } else {
                optionClass +=
                  "border-card-border bg-background text-muted/50";
              }
            }

            return (
              <button
                key={idx}
                className={optionClass}
                onClick={() => {
                  if (!answered) setSelected(idx);
                }}
                disabled={answered}
              >
                <span className="font-mono mr-2">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {option}
              </button>
            );
          })}
        </div>
      </Card>

      {!answered && (
        <button
          onClick={handleAnswer}
          disabled={selected === null}
          className="btn-primary w-full disabled:opacity-40 mt-4"
        >
          Ответить
        </button>
      )}

      {answered && (
        <Card className="mt-4" glow={isCorrect ? "success" : "error"}>
          <div className="flex items-center gap-3 mb-2">
            {isCorrect ? (
              <CheckCircle2 className="text-success" size={24} />
            ) : (
              <XCircle className="text-error" size={24} />
            )}
            <span className="font-bold">
              {isCorrect ? "Верно!" : "Неверно"}
            </span>
            {isCorrect && (
              <Badge variant="success">
                <Trophy size={12} className="mr-1" />+
                {xpReward[level.difficulty]} XP
              </Badge>
            )}
          </div>
          <p className="text-muted text-sm">{quiz.answer.explanation}</p>

          <div className="mt-4 flex gap-3">
            {!isCorrect && (
              <button
                onClick={() => {
                  setSelected(null);
                  setAnswered(false);
                }}
                className="btn-primary flex-1 text-sm"
              >
                Попробовать снова
              </button>
            )}
            {isCorrect && (
              <button
                onClick={() => router.push("/missions")}
                className="btn-primary flex-1 text-sm"
              >
                Следующая миссия
              </button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
