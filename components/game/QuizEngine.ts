import type { Level, Answer } from "@/lib/types";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: Answer;
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  answers: number[];
  isComplete: boolean;
}

export function initQuiz(): QuizState {
  return {
    currentQuestion: 0,
    score: 0,
    answers: [],
    isComplete: false,
  };
}

export function answerQuestion(
  state: QuizState,
  selectedIndex: number,
  correctIndex: number
): QuizState {
  const isCorrect = selectedIndex === correctIndex;
  const newAnswers = [...state.answers, selectedIndex];
  const newScore = isCorrect ? state.score + 1 : state.score;
  const nextQuestion = state.currentQuestion + 1;

  return {
    currentQuestion: nextQuestion,
    score: newScore,
    answers: newAnswers,
    isComplete: nextQuestion >= 3,
  };
}
