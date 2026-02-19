import type { CourseTranslationCatalog } from "./types";
import { arCourseTranslations } from "./ar";
import { deCourseTranslations } from "./de";
import { enCourseTranslations } from "./en";
import { esCourseTranslations } from "./es";
import { frCourseTranslations } from "./fr";
import { itCourseTranslations } from "./it";
import { ptBrCourseTranslations } from "./pt-BR";
import { zhCnCourseTranslations } from "./zh-CN";

export const courseTranslationsByLocale: CourseTranslationCatalog = {
  en: enCourseTranslations,
  es: esCourseTranslations,
  "pt-BR": ptBrCourseTranslations,
  fr: frCourseTranslations,
  it: itCourseTranslations,
  de: deCourseTranslations,
  "zh-CN": zhCnCourseTranslations,
  ar: arCourseTranslations,
};
