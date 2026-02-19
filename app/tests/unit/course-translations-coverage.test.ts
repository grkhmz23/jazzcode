import { describe, expect, it } from "vitest";
import { courses } from "@/lib/data/courses";
import { courseTranslationsByLocale } from "@/lib/i18n/course-translations";
import { defaultLocale, locales } from "@/lib/i18n/routing";

describe("course translation coverage", () => {
  const courseSlugs = courses.map((course) => course.slug);
  const courseSlugSet = new Set(courseSlugs);
  const nonDefaultLocales = locales.filter((locale) => locale !== defaultLocale);

  it("covers all active course slugs for every non-default locale", () => {
    for (const locale of nonDefaultLocales) {
      const localizedMap = courseTranslationsByLocale[locale];
      const localizedSlugs = Object.keys(localizedMap);

      expect(localizedSlugs.length).toBe(courseSlugs.length);
      for (const courseSlug of courseSlugs) {
        expect(localizedMap[courseSlug]).toBeDefined();
      }
    }
  });

  it("contains no stale translation slugs for every non-default locale", () => {
    for (const locale of nonDefaultLocales) {
      const localizedMap = courseTranslationsByLocale[locale];

      for (const courseSlug of Object.keys(localizedMap)) {
        expect(courseSlugSet.has(courseSlug)).toBe(true);
      }
    }
  });
});
