import { frGeneratedCourseTranslations } from "./fr.generated";
import { buildMergedCourseTranslations } from "./merge";
import type { CourseTranslationMap } from "./types";

const frCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "Fondamentaux de Solana",
    description:
      "Apprenez les bases de Solana avec des lecons interactives et une pratique guidee.",
  },
};

export const frCourseTranslations: CourseTranslationMap = buildMergedCourseTranslations(
  frGeneratedCourseTranslations,
  frCuratedCourseTranslations
);
