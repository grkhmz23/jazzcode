import * as coursesModule from "../src/lib/data/courses/index";
import { defaultLocale, locales } from "../src/lib/i18n/routing";
import type { Course } from "../src/types/content";
import type { CourseTranslationMap } from "../src/lib/i18n/course-translations/types";
import * as arModule from "../src/lib/i18n/course-translations/ar";
import * as deModule from "../src/lib/i18n/course-translations/de";
import * as esModule from "../src/lib/i18n/course-translations/es";
import * as frModule from "../src/lib/i18n/course-translations/fr";
import * as itModule from "../src/lib/i18n/course-translations/it";
import * as ptBrModule from "../src/lib/i18n/course-translations/pt-BR";
import * as zhCnModule from "../src/lib/i18n/course-translations/zh-CN";

type Locale = (typeof locales)[number];

type ExportCarrier = {
  default?: Record<string, unknown>;
  "module.exports"?: Record<string, unknown>;
  [key: string]: unknown;
};

function pickNamedExport<T>(mod: ExportCarrier, exportName: string): T {
  const direct = mod[exportName];
  if (direct !== undefined) {
    return direct as T;
  }

  const defaultObj = mod.default;
  if (defaultObj && exportName in defaultObj) {
    return defaultObj[exportName] as T;
  }

  const moduleExports = mod["module.exports"];
  if (moduleExports && exportName in moduleExports) {
    return moduleExports[exportName] as T;
  }

  throw new Error(`Unable to resolve export \"${exportName}\"`);
}

const courses = pickNamedExport<Course[]>(coursesModule as ExportCarrier, "courses");

const curatedMapsByLocale: Record<Exclude<Locale, typeof defaultLocale>, CourseTranslationMap> = {
  es: pickNamedExport<CourseTranslationMap>(esModule as ExportCarrier, "esCourseTranslations"),
  "pt-BR": pickNamedExport<CourseTranslationMap>(ptBrModule as ExportCarrier, "ptBrCourseTranslations"),
  fr: pickNamedExport<CourseTranslationMap>(frModule as ExportCarrier, "frCourseTranslations"),
  it: pickNamedExport<CourseTranslationMap>(itModule as ExportCarrier, "itCourseTranslations"),
  de: pickNamedExport<CourseTranslationMap>(deModule as ExportCarrier, "deCourseTranslations"),
  "zh-CN": pickNamedExport<CourseTranslationMap>(zhCnModule as ExportCarrier, "zhCnCourseTranslations"),
  ar: pickNamedExport<CourseTranslationMap>(arModule as ExportCarrier, "arCourseTranslations"),
};

const activeSlugs = courses.map((course) => course.slug);
const activeSlugSet = new Set(activeSlugs);

const report = (locales.filter((locale) => locale !== defaultLocale) as Exclude<Locale, typeof defaultLocale>[])
  .map((locale) => {
    const curatedMap = curatedMapsByLocale[locale];
    const curatedKeys = Object.keys(curatedMap);
    const curatedActiveSlugs = curatedKeys.filter((slug) => activeSlugSet.has(slug));
    const staleSlugs = curatedKeys.filter((slug) => !activeSlugSet.has(slug));
    const missingSlugs = activeSlugs.filter((slug) => !curatedActiveSlugs.includes(slug));

    return {
      locale,
      totalCourses: activeSlugs.length,
      curatedCourses: curatedActiveSlugs.length,
      coveragePct: Number(((curatedActiveSlugs.length / activeSlugs.length) * 100).toFixed(1)),
      staleCourses: staleSlugs.length,
      staleSlugs,
      missingCourses: missingSlugs.length,
      missingSlugs,
    };
  });

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), report }, null, 2));
  process.exit(0);
}

console.log(`Curated translation coverage for active courses (${activeSlugs.length} total):`);
for (const localeReport of report) {
  console.log(
    `${localeReport.locale}: ${localeReport.curatedCourses}/${localeReport.totalCourses} (${localeReport.coveragePct}%) curated, ${localeReport.staleCourses} stale, ${localeReport.missingCourses} missing`
  );

  if (localeReport.missingSlugs.length > 0) {
    console.log(`  missing slugs: ${localeReport.missingSlugs.join(", ")}`);
  }

  if (localeReport.staleSlugs.length > 0) {
    console.log(`  stale slugs: ${localeReport.staleSlugs.join(", ")}`);
  }
}
