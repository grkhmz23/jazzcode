import type { Course, Lesson, Module, CourseFilters } from '@/types/content';

/**
 * CourseContentService interface
 * Abstracts content retrieval to allow swapping between local files and headless CMS
 * All page components must read course data through this service
 */
export interface CourseContentService {
  /**
   * Get all courses
   */
  getCourses(): Promise<Course[]>;

  /**
   * Get a single course by slug
   * Returns null if not found
   */
  getCourse(slug: string): Promise<Course | null>;

  /**
   * Get a lesson by course slug and lesson ID
   * Returns null if not found
   */
  getLesson(courseSlug: string, lessonId: string): Promise<Lesson | null>;

  /**
   * Get all modules for a course
   */
  getModules(courseSlug: string): Promise<Module[]>;

  /**
   * Search and filter courses
   */
  searchCourses(query: string, filters: CourseFilters): Promise<Course[]>;
}
