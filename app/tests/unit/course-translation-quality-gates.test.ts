import { describe, expect, it } from "vitest";
import { courses } from "@/lib/data/courses";
import { courseTranslationsByLocale } from "@/lib/i18n/course-translations";
import { defaultLocale, locales } from "@/lib/i18n/routing";

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

describe("course translation quality gates", () => {
  const englishBySlug = new Map(
    courses.map((course) => [
      course.slug,
      {
        title: normalize(course.title),
        description: normalize(course.description),
      },
    ])
  );
  const nonDefaultLocales = locales.filter((locale) => locale !== defaultLocale);

  it("keeps localized descriptions meaningfully different from English", () => {
    for (const locale of nonDefaultLocales) {
      const localizedMap = courseTranslationsByLocale[locale];
      let descriptionDiffCount = 0;

      for (const course of courses) {
        const localizedDescription = normalize(localizedMap[course.slug]?.description ?? "");
        const englishDescription = englishBySlug.get(course.slug)?.description ?? "";
        if (localizedDescription !== englishDescription) {
          descriptionDiffCount += 1;
        }
      }

      // Guardrail against silent English fallback for entire locales.
      expect(descriptionDiffCount).toBeGreaterThanOrEqual(Math.ceil(courses.length * 0.9));
    }
  });

  it("keeps at least half of localized titles different from English", () => {
    for (const locale of nonDefaultLocales) {
      const localizedMap = courseTranslationsByLocale[locale];
      let titleDiffCount = 0;

      for (const course of courses) {
        const localizedTitle = normalize(localizedMap[course.slug]?.title ?? "");
        const englishTitle = englishBySlug.get(course.slug)?.title ?? "";
        if (localizedTitle !== englishTitle) {
          titleDiffCount += 1;
        }
      }

      // Titles can legitimately keep product terms; this still blocks broad fallback.
      expect(titleDiffCount).toBeGreaterThanOrEqual(Math.ceil(courses.length * 0.5));
    }
  });

  it("keeps most lesson content localized away from raw English", () => {
    for (const locale of nonDefaultLocales) {
      const localizedMap = courseTranslationsByLocale[locale];
      let lessonContentTotal = 0;
      let lessonContentDiffCount = 0;

      for (const course of courses) {
        const localizedCourse = localizedMap[course.slug];
        for (const moduleItem of course.modules) {
          const localizedModule = localizedCourse?.modules?.[moduleItem.id];
          for (const lesson of moduleItem.lessons) {
            lessonContentTotal += 1;
            const localizedLesson =
              localizedModule?.lessons?.[lesson.id] ?? localizedModule?.lessons?.[lesson.slug];
            const localizedContent = normalize(localizedLesson?.content ?? "");
            const englishContent = normalize(lesson.content);

            if (localizedContent !== "" && localizedContent !== englishContent) {
              lessonContentDiffCount += 1;
            }
          }
        }
      }

      expect(lessonContentDiffCount).toBeGreaterThanOrEqual(Math.ceil(lessonContentTotal * 0.85));
    }
  });

  it("keeps a minimum localized lesson-title baseline per locale", () => {
    for (const locale of nonDefaultLocales) {
      const localizedMap = courseTranslationsByLocale[locale];
      let lessonTitleTotal = 0;
      let lessonTitleDiffCount = 0;

      for (const course of courses) {
        const localizedCourse = localizedMap[course.slug];
        for (const moduleItem of course.modules) {
          const localizedModule = localizedCourse?.modules?.[moduleItem.id];
          for (const lesson of moduleItem.lessons) {
            lessonTitleTotal += 1;
            const localizedLesson =
              localizedModule?.lessons?.[lesson.id] ?? localizedModule?.lessons?.[lesson.slug];
            const localizedTitle = normalize(localizedLesson?.title ?? "");
            const englishTitle = normalize(lesson.title);

            if (localizedTitle !== "" && localizedTitle !== englishTitle) {
              lessonTitleDiffCount += 1;
            }
          }
        }
      }

      expect(lessonTitleDiffCount).toBeGreaterThanOrEqual(Math.ceil(lessonTitleTotal * 0.35));
    }
  });
});
