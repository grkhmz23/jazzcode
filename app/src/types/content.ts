export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type LessonType = 'content' | 'challenge';
export type ChallengeLanguage = 'typescript' | 'rust';

export interface TestCase {
  name: string;
  input: string;
  expectedOutput: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  type: LessonType;
  content: string;
  xpReward: number;
  duration: string;
}

export interface Challenge extends Lesson {
  starterCode: string;
  language: ChallengeLanguage;
  testCases: TestCase[];
  hints: string[];
  solution: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: CourseDifficulty;
  duration: string;
  totalXP: number;
  tags: string[];
  imageUrl: string;
  modules: Module[];
}
