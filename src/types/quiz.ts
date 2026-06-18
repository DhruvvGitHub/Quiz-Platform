export interface Question {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizSettings {
  subject: string;
  topics: string[];
  mode: 'practice' | 'mock';
  difficulty: 'all'; // can expand later
  numberOfQuestions: number;
}

export interface QuizAttempt {
  id: string;
  timestamp: number;
  subject: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  timeElapsed: number;
}
