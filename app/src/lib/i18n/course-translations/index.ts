import type { CourseTranslationCatalog } from "./types";
import { courses } from "@/lib/data/courses";
import { buildMergedCourseTranslations } from "./merge";
import { arCourseTranslations as arCuratedCourseTranslations } from "./ar";
import { arGeneratedCourseTranslations } from "./ar.generated";
import { deCourseTranslations as deCuratedCourseTranslations } from "./de";
import { deGeneratedCourseTranslations } from "./de.generated";
import { enCourseTranslations } from "./en";
import { esCourseTranslations as esCuratedCourseTranslations } from "./es";
import { esGeneratedCourseTranslations } from "./es.generated";
import { frCourseTranslations as frCuratedCourseTranslations } from "./fr";
import { frGeneratedCourseTranslations } from "./fr.generated";
import { itCourseTranslations as itCuratedCourseTranslations } from "./it";
import { itGeneratedCourseTranslations } from "./it.generated";
import { ptBrCourseTranslations as ptBrCuratedCourseTranslations } from "./pt-BR";
import { ptBrGeneratedCourseTranslations } from "./pt-BR.generated";
import type { CourseTranslationMap } from "./types";
import { zhCnCourseTranslations as zhCnCuratedCourseTranslations } from "./zh-CN";
import { zhCnGeneratedCourseTranslations } from "./zh-CN.generated";

const courseSlugSet = new Set(courses.map((course) => course.slug));

function toActiveCourseSlugs(translations: CourseTranslationMap): CourseTranslationMap {
  return Object.fromEntries(
    Object.entries(translations).filter(([courseSlug]) => courseSlugSet.has(courseSlug))
  ) as CourseTranslationMap;
}

export const courseTranslationsByLocale: CourseTranslationCatalog = {
  en: enCourseTranslations,
  es: toActiveCourseSlugs(
    buildMergedCourseTranslations(esGeneratedCourseTranslations, esCuratedCourseTranslations)
  ),
  "pt-BR": toActiveCourseSlugs(
    buildMergedCourseTranslations(ptBrGeneratedCourseTranslations, ptBrCuratedCourseTranslations)
  ),
  fr: toActiveCourseSlugs(
    buildMergedCourseTranslations(frGeneratedCourseTranslations, frCuratedCourseTranslations)
  ),
  it: toActiveCourseSlugs(
    buildMergedCourseTranslations(itGeneratedCourseTranslations, itCuratedCourseTranslations)
  ),
  de: toActiveCourseSlugs(
    buildMergedCourseTranslations(deGeneratedCourseTranslations, deCuratedCourseTranslations)
  ),
  "zh-CN": toActiveCourseSlugs(
    buildMergedCourseTranslations(zhCnGeneratedCourseTranslations, zhCnCuratedCourseTranslations)
  ),
  ar: toActiveCourseSlugs(
    buildMergedCourseTranslations(arGeneratedCourseTranslations, arCuratedCourseTranslations)
  ),
};
