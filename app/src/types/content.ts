/**
 * Content types for CourseContentService
 * These types are used by the content service abstraction layer
 * to allow swapping between local files and headless CMS
 */

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string; // e.g. "8 hours"
  totalXP: number;
  thumbnailUrl: string;
  instructor: {
    name: string;
    avatarUrl: string;
    bio: string;
  };
  modules: Module[];
  tags: string[];
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  type: 'content' | 'challenge';
  content: string; // markdown
  xpReward: number;
  order: number;
  moduleId: string;
}

export interface Challenge extends Lesson {
  type: 'challenge';
  starterCode: string;
  language: 'typescript' | 'rust' | 'json';
  testCases: TestCase[];
  hints: string[];
  solution: string;
}

export interface TestCase {
  name: string;
  input: string;
  expectedOutput: string;
}

export interface CourseFilters {
  difficulty?: Course['difficulty'];
  tags?: string[];
  search?: string;
}
