import { courses as localCourses } from '@/lib/data/courses/index';
import { localizeCourse } from '@/lib/i18n/course-content';
import { defaultLocale, type Locale } from '@/lib/i18n/routing';
import type { Course, Lesson, Module } from '@/types/content';
import type { CourseContentService, SearchCourseFilters } from './content';

export class ContentLocalService implements CourseContentService {
  private readonly baseCourses: Course[];
  private readonly localizedCourseCache = new Map<Locale, Course[]>();

  constructor() {
    if (!Array.isArray(localCourses) || localCourses.length === 0) {
      throw new Error('Local course content failed to load: no courses available');
    }

    this.baseCourses = localCourses;
    this.localizedCourseCache.set(defaultLocale, this.baseCourses);
  }

  private getLocalizedCourses(locale: Locale = defaultLocale): Course[] {
    const cached = this.localizedCourseCache.get(locale);
    if (cached) {
      return cached;
    }

    const localized = this.baseCourses.map((course) => localizeCourse(course, locale));
    this.localizedCourseCache.set(locale, localized);
    return localized;
  }

  async getCourses(locale: Locale = defaultLocale): Promise<Course[]> {
    return this.getLocalizedCourses(locale);
  }

  async getCourse(slug: string, locale: Locale = defaultLocale): Promise<Course | null> {
    return this.getLocalizedCourses(locale).find((course) => course.slug === slug) ?? null;
  }

  async getLesson(courseSlug: string, lessonId: string, locale: Locale = defaultLocale): Promise<Lesson | null> {
    const course = await this.getCourse(courseSlug, locale);
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

  async getModules(courseSlug: string, locale: Locale = defaultLocale): Promise<Module[]> {
    const course = await this.getCourse(courseSlug, locale);
    return course?.modules ?? [];
  }

  async searchCourses(query: string, filters?: SearchCourseFilters, locale: Locale = defaultLocale): Promise<Course[]> {
    const normalizedQuery = query.trim().toLowerCase();
    const courses = this.getLocalizedCourses(locale);

    return courses.filter((course) => {
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
