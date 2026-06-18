import type { Question } from '../types/quiz';

export const fetchQuestions = async (subject: string): Promise<Question[]> => {
  try {
    const response = await fetch(`/data/${subject.toLowerCase()}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load questions for ${subject}`);
    }
    const data: Question[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading questions:", error);
    return [];
  }
};

export const getAvailableSubjects = (): string[] => {
  // In a real scenario, this could also be dynamic, but for offline ease we can hardcode the supported ones or fetch a config.json.
  return ['PHP', '.NET', 'Software Engineering', 'QA', 'Emerging Technologies'];
};
