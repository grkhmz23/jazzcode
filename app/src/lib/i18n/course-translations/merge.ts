import type {
  CourseTranslation,
  CourseTranslationMap,
  LessonTranslation,
  ModuleTranslation,
} from "./types";

function mergeLesson(
  baseLesson?: LessonTranslation,
  overrideLesson?: LessonTranslation
): LessonTranslation | undefined {
  if (!baseLesson && !overrideLesson) {
    return undefined;
  }

  return {
    ...(baseLesson ?? {}),
    ...(overrideLesson ?? {}),
  };
}

function mergeModule(
  baseModule?: ModuleTranslation,
  overrideModule?: ModuleTranslation
): ModuleTranslation | undefined {
  if (!baseModule && !overrideModule) {
    return undefined;
  }

  const lessonIds = new Set<string>([
    ...Object.keys(baseModule?.lessons ?? {}),
    ...Object.keys(overrideModule?.lessons ?? {}),
  ]);

  const lessons = Object.fromEntries(
    Array.from(lessonIds)
      .map((lessonId) => [
        lessonId,
        mergeLesson(baseModule?.lessons?.[lessonId], overrideModule?.lessons?.[lessonId]),
      ])
      .filter(([, lesson]) => lesson !== undefined)
  ) as Record<string, LessonTranslation>;

  return {
    ...(baseModule ?? {}),
    ...(overrideModule ?? {}),
    ...(Object.keys(lessons).length > 0 ? { lessons } : {}),
  };
}

function mergeCourse(
  baseCourse?: CourseTranslation,
  overrideCourse?: CourseTranslation
): CourseTranslation | undefined {
  if (!baseCourse && !overrideCourse) {
    return undefined;
  }

  const moduleIds = new Set<string>([
    ...Object.keys(baseCourse?.modules ?? {}),
    ...Object.keys(overrideCourse?.modules ?? {}),
  ]);

  const modules = Object.fromEntries(
    Array.from(moduleIds)
      .map((moduleId) => [
        moduleId,
        mergeModule(baseCourse?.modules?.[moduleId], overrideCourse?.modules?.[moduleId]),
      ])
      .filter(([, moduleValue]) => moduleValue !== undefined)
  ) as Record<string, ModuleTranslation>;

  return {
    ...(baseCourse ?? {}),
    ...(overrideCourse ?? {}),
    ...(Object.keys(modules).length > 0 ? { modules } : {}),
  };
}

export function buildMergedCourseTranslations(
  generated: CourseTranslationMap,
  curated: CourseTranslationMap
): CourseTranslationMap {
  return Object.fromEntries(
    Array.from(new Set<string>([...Object.keys(generated), ...Object.keys(curated)])).map(
      (courseSlug) => [courseSlug, mergeCourse(generated[courseSlug], curated[courseSlug]) ?? {}]
    )
  ) as CourseTranslationMap;
}
