import type { Locale } from "@/lib/i18n/routing";

export interface LessonTranslation {
  title?: string;
  content?: string;
  duration?: string;
}

export interface ModuleTranslation {
  title?: string;
  description?: string;
  lessons?: Record<string, LessonTranslation>;
}

export interface CourseTranslation {
  title?: string;
  description?: string;
  duration?: string;
  tags?: string[];
  modules?: Record<string, ModuleTranslation>;
}

export type CourseTranslationMap = Record<string, CourseTranslation>;
export type CourseTranslationCatalog = Record<Locale, CourseTranslationMap>;
