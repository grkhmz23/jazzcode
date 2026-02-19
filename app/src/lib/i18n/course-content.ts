import type { Course, Lesson, Module } from "@/types/content";
import type { Locale } from "@/lib/i18n/routing";

interface LessonTranslation {
  title?: string;
  content?: string;
  duration?: string;
}

interface ModuleTranslation {
  title?: string;
  description?: string;
  lessons?: Record<string, LessonTranslation>;
}

interface CourseTranslation {
  title?: string;
  description?: string;
  duration?: string;
  tags?: string[];
  modules?: Record<string, ModuleTranslation>;
}

type CourseTranslationCatalog = Partial<Record<Locale, Record<string, CourseTranslation>>>;

// Translation packs can be incrementally filled by course slug and module/lesson ids.
const courseTranslations: CourseTranslationCatalog = {
  en: {},
  es: {},
  "pt-BR": {},
  fr: {},
  it: {},
  de: {},
  "zh-CN": {},
  ar: {},
};

function applyLessonTranslation(lesson: Lesson, translation?: LessonTranslation): Lesson {
  if (!translation) {
    return lesson;
  }

  return {
    ...lesson,
    title: translation.title ?? lesson.title,
    content: translation.content ?? lesson.content,
    duration: translation.duration ?? lesson.duration,
  };
}

function applyModuleTranslation(moduleItem: Module, translation?: ModuleTranslation): Module {
  if (!translation) {
    return moduleItem;
  }

  return {
    ...moduleItem,
    title: translation.title ?? moduleItem.title,
    description: translation.description ?? moduleItem.description,
    lessons: moduleItem.lessons.map((lesson) =>
      applyLessonTranslation(lesson, translation.lessons?.[lesson.id] ?? translation.lessons?.[lesson.slug])
    ),
  };
}

export function localizeCourse(course: Course, locale: Locale): Course {
  if (locale === "en") {
    return course;
  }

  const translation = courseTranslations[locale]?.[course.slug];
  if (!translation) {
    return course;
  }

  return {
    ...course,
    title: translation.title ?? course.title,
    description: translation.description ?? course.description,
    duration: translation.duration ?? course.duration,
    tags: translation.tags ?? course.tags,
    modules: course.modules.map((moduleItem) =>
      applyModuleTranslation(
        moduleItem,
        translation.modules?.[moduleItem.id]
      )
    ),
  };
}
