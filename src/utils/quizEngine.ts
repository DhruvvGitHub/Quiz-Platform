import type { Question } from '../types/quiz';

// Shuffle an array using Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Select and randomize questions
export const prepareQuiz = (
  allQuestions: Question[],
  selectedTopics: string[],
  numberOfQuestions: number
): Question[] => {
  let filtered = allQuestions;

  // Filter by topics if specific topics are selected
  if (selectedTopics.length > 0) {
    filtered = allQuestions.filter(q => selectedTopics.includes(q.topic));
  }

  // Randomize questions
  let randomized = shuffleArray(filtered);

  // Limit to numberOfQuestions
  if (randomized.length > numberOfQuestions) {
    randomized = randomized.slice(0, numberOfQuestions);
  }

  // Shuffle options for each question, maintaining correct answer reference
  return randomized.map(q => {
    const originalCorrectOption = q.options[q.correctAnswer];
    const shuffledOptions = shuffleArray(q.options);
    const newCorrectIndex = shuffledOptions.indexOf(originalCorrectOption);

    return {
      ...q,
      options: shuffledOptions,
      correctAnswer: newCorrectIndex,
    };
  });
};

export const getTopicsFromQuestions = (questions: Question[]): string[] => {
  const topics = new Set<string>();
  questions.forEach(q => topics.add(q.topic));
  return Array.from(topics);
};
