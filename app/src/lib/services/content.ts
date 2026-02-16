import type { Course, Lesson, Module } from '@/types/content';

export interface SearchCourseFilters {
  difficulty?: string;
  tags?: string[];
}

export interface CourseContentService {
  getCourses(): Promise<Course[]>;
  getCourse(slug: string): Promise<Course | null>;
  getLesson(courseSlug: string, lessonId: string): Promise<Lesson | null>;
  getModules(courseSlug: string): Promise<Module[]>;
  searchCourses(query: string, filters?: SearchCourseFilters): Promise<Course[]>;
}
