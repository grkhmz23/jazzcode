import type { Course, Lesson, Module } from '@/types/content';
import type { Locale } from '@/lib/i18n/routing';

export interface SearchCourseFilters {
  difficulty?: string;
  tags?: string[];
}

export interface CourseContentService {
  getCourses(locale?: Locale): Promise<Course[]>;
  getCourse(slug: string, locale?: Locale): Promise<Course | null>;
  getLesson(courseSlug: string, lessonId: string, locale?: Locale): Promise<Lesson | null>;
  getModules(courseSlug: string, locale?: Locale): Promise<Module[]>;
  searchCourses(query: string, filters?: SearchCourseFilters, locale?: Locale): Promise<Course[]>;
}
