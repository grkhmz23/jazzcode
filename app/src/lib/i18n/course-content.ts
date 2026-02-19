import type { Course, Lesson, Module } from "@/types/content";
import type { Locale } from "@/lib/i18n/routing";
import { courseTranslationsByLocale } from "@/lib/i18n/course-translations";
import type {
  CourseTranslation,
  LessonTranslation,
  ModuleTranslation,
} from "@/lib/i18n/course-translations/types";

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
      applyLessonTranslation(
        lesson,
        translation.lessons?.[lesson.id] ?? translation.lessons?.[lesson.slug]
      )
    ),
  };
}

function applyCourseTranslation(course: Course, translation?: CourseTranslation): Course {
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
      applyModuleTranslation(moduleItem, translation.modules?.[moduleItem.id])
    ),
  };
}

export function localizeCourse(course: Course, locale: Locale): Course {
  if (locale === "en") {
    return course;
  }

  const translation = courseTranslationsByLocale[locale]?.[course.slug];
  return applyCourseTranslation(course, translation);
}
