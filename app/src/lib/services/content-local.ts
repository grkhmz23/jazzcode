import { courses as localCourses } from '@/lib/data/courses/index';
import type { Course, Lesson, Module } from '@/types/content';
import type { CourseContentService, SearchCourseFilters } from './content';

export class ContentLocalService implements CourseContentService {
  private readonly normalizedCourses: Course[];

  constructor() {
    if (!Array.isArray(localCourses) || localCourses.length === 0) {
      throw new Error('Local course content failed to load: no courses available');
    }

    this.normalizedCourses = localCourses;
  }
  async getCourses(): Promise<Course[]> {
    return this.normalizedCourses;
  }

  async getCourse(slug: string): Promise<Course | null> {
    return this.normalizedCourses.find((course) => course.slug === slug) ?? null;
  }

  async getLesson(courseSlug: string, lessonId: string): Promise<Lesson | null> {
    const course = await this.getCourse(courseSlug);
    if (!course) {
      return null;
    }
    const legacyNormalizedId = lessonId.replace(/^lesson-\d+-/, "");

    for (const courseModule of course.modules) {
      const lesson = courseModule.lessons.find(
        (item) =>
          item.id === lessonId ||
          item.slug === lessonId ||
          item.id === legacyNormalizedId ||
          item.slug === legacyNormalizedId
      );
      if (lesson) {
        return lesson;
      }
    }

    return null;
  }

  async getModules(courseSlug: string): Promise<Module[]> {
    const course = await this.getCourse(courseSlug);
    return course?.modules ?? [];
  }

  async searchCourses(query: string, filters?: SearchCourseFilters): Promise<Course[]> {
    const normalizedQuery = query.trim().toLowerCase();

    return this.normalizedCourses.filter((course) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        course.title.toLowerCase().includes(normalizedQuery) ||
        course.description.toLowerCase().includes(normalizedQuery);

      const matchesDifficulty =
        !filters?.difficulty || course.difficulty === filters.difficulty;

      const matchesTags =
        !filters?.tags ||
        filters.tags.length === 0 ||
        filters.tags.every((tag) =>
          course.tags.some((courseTag) => courseTag.toLowerCase() === tag.toLowerCase())
        );

      return matchesQuery && matchesDifficulty && matchesTags;
    });
  }
}

export { ContentLocalService as LocalContentService };
