import { create } from 'zustand';
import type { Question, QuizSettings } from '../types/quiz';

interface QuizState {
  isActive: boolean;
  settings: QuizSettings | null;
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<number, number>; // index of the option selected for each question
  timeElapsed: number;
  
  // Actions
  startQuiz: (settings: QuizSettings, questions: Question[]) => void;
  answerQuestion: (questionIndex: number, optionIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  tickTimer: () => void;
  endQuiz: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  isActive: false,
  settings: null,
  questions: [],
  currentIndex: 0,
  userAnswers: {},
  timeElapsed: 0,

  startQuiz: (settings, questions) => set({
    isActive: true,
    settings,
    questions,
    currentIndex: 0,
    userAnswers: {},
    timeElapsed: 0,
  }),

  answerQuestion: (questionIndex, optionIndex) => set((state) => ({
    userAnswers: { ...state.userAnswers, [questionIndex]: optionIndex }
  })),

  nextQuestion: () => set((state) => ({
    currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1)
  })),

  prevQuestion: () => set((state) => ({
    currentIndex: Math.max(state.currentIndex - 1, 0)
  })),

  tickTimer: () => set((state) => ({
    timeElapsed: state.isActive ? state.timeElapsed + 1 : state.timeElapsed
  })),

  endQuiz: () => set({ isActive: false }),
  
  resetQuiz: () => set({
    isActive: false,
    settings: null,
    questions: [],
    currentIndex: 0,
    userAnswers: {},
    timeElapsed: 0,
  }),
}));
