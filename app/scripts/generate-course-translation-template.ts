import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { courses } from "@/lib/data/courses";
import type { CourseTranslationMap } from "@/lib/i18n/course-translations/types";

const locale = process.argv[2];

if (!locale) {
  console.error("Usage: pnpm -C app tsx scripts/generate-course-translation-template.ts <locale>");
  process.exit(1);
}

const template: CourseTranslationMap = {};

for (const course of courses) {
  template[course.slug] = {
    title: course.title,
    description: course.description,
    duration: course.duration,
    tags: course.tags,
    modules: Object.fromEntries(
      course.modules.map((moduleItem) => [
        moduleItem.id,
        {
          title: moduleItem.title,
          description: moduleItem.description,
          lessons: Object.fromEntries(
            moduleItem.lessons.map((lesson) => [
              lesson.id,
              {
                title: lesson.title,
                content: lesson.content,
                duration: lesson.duration,
              },
            ])
          ),
        },
      ])
    ),
  };
}

const outputDir = join(process.cwd(), "tmp", "course-translation-templates");
mkdirSync(outputDir, { recursive: true });
const outputFile = join(outputDir, `${locale}.json`);

writeFileSync(outputFile, JSON.stringify(template, null, 2) + "\n");
console.log(`Wrote ${outputFile}`);
