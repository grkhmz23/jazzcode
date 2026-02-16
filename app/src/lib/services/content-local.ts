import type { CourseContentService } from './content';
import type { Course, Lesson, Module, CourseFilters } from '@/types/content';
import { courses as localCourses } from '@/lib/data/courses';

/**
 * Local file-based content service implementation
 * Reads course data from local data files
 */
export class LocalContentService implements CourseContentService {
  private courses: Course[] = localCourses;

  async getCourses(): Promise<Course[]> {
    return [...this.courses];
  }

  async getCourse(slug: string): Promise<Course | null> {
    const course = this.courses.find(c => c.slug === slug);
    return course ? { ...course } : null;
  }

  async getLesson(courseSlug: string, lessonId: string): Promise<Lesson | null> {
    const course = this.courses.find(c => c.slug === courseSlug);
    if (!course) return null;

    for (const mod of course.modules) {
      const lesson = mod.lessons.find(l => l.id === lessonId);
      if (lesson) {
        return { ...lesson };
      }
    }
    return null;
  }

  async getModules(courseSlug: string): Promise<Module[]> {
    const course = this.courses.find(c => c.slug === courseSlug);
    if (!course) return [];
    return [...course.modules];
  }

  async searchCourses(query: string, filters: CourseFilters): Promise<Course[]> {
    let results = [...this.courses];

    // Case-insensitive text search on title and description
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    // Filter by difficulty
    if (filters.difficulty) {
      results = results.filter(c => c.difficulty === filters.difficulty);
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(c =>
        filters.tags!.some(tag => c.tags.includes(tag))
      );
    }

    return results;
  }
}
