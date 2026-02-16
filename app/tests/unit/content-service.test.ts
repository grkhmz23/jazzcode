import { describe, it, expect } from 'vitest';
import { LocalContentService } from '@/lib/services/content-local';
import { courses as allCourses } from '@/lib/data/courses';
import type { Lesson } from '@/types/content';

describe('CourseContentService', () => {
  const service = new LocalContentService();

  describe('getCourses', () => {
    it('returns exactly 8 courses', async () => {
      const courses = await service.getCourses();
      expect(courses.length).toBe(8);
    });

    it('returns all available courses', async () => {
      const courses = await service.getCourses();
      expect(courses.length).toBe(allCourses.length);
    });

    it('returns courses with all required properties', async () => {
      const courses = await service.getCourses();
      for (const course of courses) {
        expect(course).toHaveProperty('id');
        expect(course).toHaveProperty('title');
        expect(course).toHaveProperty('slug');
        expect(course).toHaveProperty('description');
        expect(course).toHaveProperty('difficulty');
        expect(course).toHaveProperty('duration');
        expect(course).toHaveProperty('totalXP');
        expect(course).toHaveProperty('modules');
        expect(course).toHaveProperty('tags');
        expect(course.modules.length).toBeGreaterThan(0);
      }
    });
  });

  describe('getCourse', () => {
    it('returns course by slug', async () => {
      const course = await service.getCourse('solana-fundamentals');
      expect(course).not.toBeNull();
      expect(course?.slug).toBe('solana-fundamentals');
      expect(course?.title).toBe('Solana Fundamentals');
    });

    it('returns null for unknown slug', async () => {
      const course = await service.getCourse('nonexistent');
      expect(course).toBeNull();
    });

    it('returns null for non-existent course', async () => {
      const course = await service.getCourse('random-course-123');
      expect(course).toBeNull();
    });

    it('returns course with correct structure', async () => {
      const course = await service.getCourse('solana-fundamentals');
      expect(course).toHaveProperty('id');
      expect(course).toHaveProperty('title');
      expect(course).toHaveProperty('description');
      expect(course).toHaveProperty('difficulty');
      expect(course).toHaveProperty('modules');
      expect(course?.modules.length).toBeGreaterThan(0);
    });
  });

  describe('searchCourses', () => {
    it('returns all courses with empty query', async () => {
      const results = await service.searchCourses('', {});
      expect(results.length).toBe(8);
    });

    it('filters by difficulty correctly', async () => {
      const beginnerResults = await service.searchCourses('', { difficulty: 'beginner' });
      expect(beginnerResults.length).toBeGreaterThan(0);
      expect(beginnerResults.every(c => c.difficulty === 'beginner')).toBe(true);
      
      const intermediateResults = await service.searchCourses('', { difficulty: 'intermediate' });
      expect(intermediateResults.every(c => c.difficulty === 'intermediate')).toBe(true);
      
      const advancedResults = await service.searchCourses('', { difficulty: 'advanced' });
      expect(advancedResults.every(c => c.difficulty === 'advanced')).toBe(true);
    });

    it('filters by search query in title', async () => {
      const results = await service.searchCourses('solana', {});
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(c => c.title.toLowerCase().includes('solana'))).toBe(true);
    });

    it('filters by search query in description', async () => {
      const results = await service.searchCourses('blockchain', {});
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(c => 
        c.title.toLowerCase().includes('blockchain') || 
        c.description.toLowerCase().includes('blockchain')
      )).toBe(true);
    });

    it('returns empty array when no matches', async () => {
      const results = await service.searchCourses('xyznonexistent123', {});
      expect(results).toEqual([]);
    });

    it('filters by tags', async () => {
      const results = await service.searchCourses('', { tags: ['solana'] });
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(c => c.tags.includes('solana'))).toBe(true);
    });

    it('combines query and difficulty filters', async () => {
      const results = await service.searchCourses('development', { difficulty: 'intermediate' });
      expect(results.every(c => 
        c.difficulty === 'intermediate' && 
        (c.title.toLowerCase().includes('development') || c.description.toLowerCase().includes('development'))
      )).toBe(true);
    });
  });

  describe('getLesson', () => {
    it('returns lesson by id', async () => {
      const lesson = await service.getLesson('solana-fundamentals', 'what-is-solana');
      expect(lesson).not.toBeNull();
      expect(lesson?.id).toBe('what-is-solana');
      expect(lesson?.title).toBe('What is Solana?');
    });

    it('returns null for unknown course slug', async () => {
      const lesson = await service.getLesson('non-existent', 'lesson-1');
      expect(lesson).toBeNull();
    });

    it('returns null for unknown lesson id', async () => {
      const lesson = await service.getLesson('solana-fundamentals', 'non-existent-lesson');
      expect(lesson).toBeNull();
    });

    it('returns challenge lesson with additional fields', async () => {
      const lesson = await service.getLesson('solana-fundamentals', 'first-transaction');
      expect(lesson).not.toBeNull();
      expect(lesson?.type).toBe('challenge');
      const challenge = lesson as Lesson & { 
        starterCode: string; 
        language: string; 
        testCases: unknown[]; 
        hints: string[]; 
        solution: string; 
      };
      expect(challenge.starterCode).toBeDefined();
      expect(challenge.language).toBe('typescript');
      expect(challenge.testCases.length).toBeGreaterThan(0);
      expect(challenge.hints.length).toBeGreaterThan(0);
      expect(challenge.solution).toBeDefined();
    });
  });

  describe('getModules', () => {
    it('returns modules for course', async () => {
      const modules = await service.getModules('solana-fundamentals');
      expect(modules.length).toBeGreaterThan(0);
      expect(modules[0]).toHaveProperty('id');
      expect(modules[0]).toHaveProperty('title');
      expect(modules[0]).toHaveProperty('lessons');
    });

    it('returns empty array for unknown course', async () => {
      const modules = await service.getModules('non-existent');
      expect(modules).toEqual([]);
    });

    it('returns modules with lessons', async () => {
      const modules = await service.getModules('solana-fundamentals');
      expect(modules.every(m => m.lessons.length > 0)).toBe(true);
    });
  });

  describe('Solana Fundamentals Course', () => {
    it('has correct number of modules', async () => {
      const course = await service.getCourse('solana-fundamentals');
      expect(course?.modules.length).toBe(2);
    });

    it('has 8 total lessons', async () => {
      const course = await service.getCourse('solana-fundamentals');
      const totalLessons = course?.modules.reduce((sum, m) => sum + m.lessons.length, 0);
      expect(totalLessons).toBe(8);
    });

    it('has correct XP distribution', async () => {
      const course = await service.getCourse('solana-fundamentals');
      const totalLessonXP = course?.modules.flatMap(m => m.lessons).reduce((sum, l) => sum + l.xpReward, 0);
      expect(totalLessonXP).toBe(course?.totalXP);
    });
  });

  describe('All Courses', () => {
    it('includes Solana Fundamentals', async () => {
      const course = await service.getCourse('solana-fundamentals');
      expect(course).not.toBeNull();
      expect(course?.title).toBe('Solana Fundamentals');
      expect(course?.difficulty).toBe('beginner');
    });

    it('includes Anchor Development', async () => {
      const course = await service.getCourse('anchor-development');
      expect(course).not.toBeNull();
      expect(course?.title).toBe('Anchor Development');
      expect(course?.difficulty).toBe('intermediate');
    });

    it('includes Solana Frontend Development', async () => {
      const course = await service.getCourse('solana-frontend');
      expect(course).not.toBeNull();
      expect(course?.title).toBe('Solana Frontend Development');
      expect(course?.difficulty).toBe('intermediate');
    });

    it('includes DeFi on Solana', async () => {
      const course = await service.getCourse('defi-solana');
      expect(course).not.toBeNull();
      expect(course?.title).toBe('DeFi on Solana');
      expect(course?.difficulty).toBe('advanced');
    });

    it('includes Solana Security & Auditing', async () => {
      const course = await service.getCourse('solana-security');
      expect(course).not.toBeNull();
      expect(course?.title).toBe('Solana Security & Auditing');
      expect(course?.difficulty).toBe('advanced');
    });

    it('includes Token Engineering on Solana', async () => {
      const course = await service.getCourse('token-engineering');
      expect(course).not.toBeNull();
      expect(course?.title).toBe('Token Engineering on Solana');
      expect(course?.difficulty).toBe('intermediate');
    });

    it('includes Solana Mobile Development', async () => {
      const course = await service.getCourse('solana-mobile');
      expect(course).not.toBeNull();
      expect(course?.title).toBe('Solana Mobile Development');
      expect(course?.difficulty).toBe('intermediate');
    });

    it('includes Testing Solana Programs', async () => {
      const course = await service.getCourse('solana-testing');
      expect(course).not.toBeNull();
      expect(course?.title).toBe('Testing Solana Programs');
      expect(course?.difficulty).toBe('intermediate');
    });

    it('has correct total lesson counts', async () => {
      const courses = await service.getCourses();
      for (const course of courses) {
        const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
        expect(totalLessons).toBeGreaterThan(0);
        
        // Verify each lesson has content
        for (const mod of course.modules) {
          for (const lesson of mod.lessons) {
            expect(lesson.content.length).toBeGreaterThan(0);
            expect(lesson.xpReward).toBeGreaterThan(0);
          }
        }
      }
    });
  });
});
