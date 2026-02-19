import { itGeneratedCourseTranslations } from "./it.generated";
import { buildMergedCourseTranslations } from "./merge";
import type { CourseTranslationMap } from "./types";

const itCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "Fondamenti di Solana",
    description:
      "Impara i concetti base di Solana con lezioni interattive e pratica guidata.",
  },
};

export const itCourseTranslations: CourseTranslationMap = buildMergedCourseTranslations(
  itGeneratedCourseTranslations,
  itCuratedCourseTranslations
);
