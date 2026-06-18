import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizAttempt, Question } from '../types/quiz';

export interface Bookmark {
  subject: string;
  question: Question;
}

interface StatsState {
  attempts: QuizAttempt[];
  bookmarks: Bookmark[];
  
  addAttempt: (attempt: QuizAttempt) => void;
  toggleBookmark: (subject: string, question: Question) => void;
  clearStats: () => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      attempts: [],
      bookmarks: [],

      addAttempt: (attempt) => set((state) => ({
        attempts: [...state.attempts, attempt]
      })),

      toggleBookmark: (subject, question) => set((state) => {
        const currentBookmarks = state.bookmarks || []; 
        const isBookmarked = currentBookmarks.some(b => b.subject === subject && b.question.id === question.id);
        return {
          bookmarks: isBookmarked 
            ? currentBookmarks.filter(b => !(b.subject === subject && b.question.id === question.id))
            : [...currentBookmarks, { subject, question }]
        };
      }),

      clearStats: () => set({ attempts: [], bookmarks: [] }),
    }),
    {
      name: 'quiz-platform-stats', // key in localStorage
    }
  )
);
