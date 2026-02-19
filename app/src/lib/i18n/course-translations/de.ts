import { deGeneratedCourseTranslations } from "./de.generated";
import { buildMergedCourseTranslations } from "./merge";
import type { CourseTranslationMap } from "./types";

const deCuratedCourseTranslations: CourseTranslationMap = {
  "solana-fundamentals": {
    title: "Solana Grundlagen",
    description:
      "Lerne die Grundlagen von Solana mit interaktiven Lektionen und gefuhrter Praxis.",
  },
};

export const deCourseTranslations: CourseTranslationMap = buildMergedCourseTranslations(
  deGeneratedCourseTranslations,
  deCuratedCourseTranslations
);
