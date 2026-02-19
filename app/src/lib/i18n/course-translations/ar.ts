import { arGeneratedCourseTranslations } from "./ar.generated";
import { buildMergedCourseTranslations } from "./merge";
import type { CourseTranslationMap } from "./types";

const arCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "اساسيات سولانا",
    description: "تعلم مفاهيم سولانا الاساسية من خلال دروس تفاعلية وتطبيق عملي.",
  },
};

export const arCourseTranslations: CourseTranslationMap = buildMergedCourseTranslations(
  arGeneratedCourseTranslations,
  arCuratedCourseTranslations
);
