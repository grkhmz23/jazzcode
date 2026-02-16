#!/usr/bin/env tsx
/**
 * Sanity CMS Import Script
 *
 * Imports the local course dataset into a configured Sanity project.
 * Requires: SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN env vars.
 *
 * Usage:
 *   pnpm --filter @superteam/app sanity:import
 *
 * This script reads from lib/data/courses.ts and creates Sanity documents
 * matching the schemas defined in lib/cms/sanity-schemas.ts.
 */

import { createClient } from "next-sanity";

const projectId = process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Missing SANITY_PROJECT_ID or SANITY_API_TOKEN.");
  console.error("Set these environment variables before running the import.");
  console.error("");
  console.error("  SANITY_PROJECT_ID=your-project-id");
  console.error("  SANITY_DATASET=production");
  console.error("  SANITY_API_TOKEN=your-write-token");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

interface LocalLesson {
  id: string;
  title: string;
  description: string;
  type: "content" | "challenge";
  order: number;
  xpReward: number;
  durationMinutes: number;
  content: string;
  challenge?: {
    language: string;
    instructions: string;
    starterCode: string;
    solutionCode: string;
    testCases: Array<{ id: string; name: string; input: string; expectedOutput: string; hidden: boolean }>;
    hints: string[];
    timeoutMs: number;
  };
}

interface LocalModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: LocalLesson[];
}

interface LocalCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  durationMinutes: number;
  totalXP: number;
  trackId: string;
  tags: string[];
  instructorName: string;
  enrolledCount: number;
  publishedAt: string;
  modules: LocalModule[];
}

async function importCourses(): Promise<void> {
  // Dynamic import of the course data
  const { COURSES } = await import("../src/lib/data/courses.js") as { COURSES: LocalCourse[] };

  console.log(`Importing ${COURSES.length} courses into Sanity (${projectId}/${dataset})...`);

  const transaction = client.transaction();

  for (const course of COURSES) {
    // Create lesson documents first
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        const lessonDoc = {
          _id: `lesson-${lesson.id}`,
          _type: "lesson" as const,
          title: lesson.title,
          description: lesson.description,
          lessonType: lesson.type,
          order: lesson.order,
          xpReward: lesson.xpReward,
          durationMinutes: lesson.durationMinutes,
          content: lesson.content,
          ...(lesson.challenge
            ? {
                challenge: {
                  language: lesson.challenge.language,
                  instructions: lesson.challenge.instructions,
                  starterCode: lesson.challenge.starterCode,
                  solutionCode: lesson.challenge.solutionCode,
                  testCases: lesson.challenge.testCases.map((tc) => ({
                    _key: tc.id,
                    testId: tc.id,
                    name: tc.name,
                    input: tc.input,
                    expectedOutput: tc.expectedOutput,
                    hidden: tc.hidden,
                  })),
                  hints: lesson.challenge.hints,
                  timeoutMs: lesson.challenge.timeoutMs,
                },
              }
            : {}),
        };
        transaction.createOrReplace(lessonDoc);
      }

      // Create module document
      const moduleDoc = {
        _id: `module-${mod.id}`,
        _type: "module" as const,
        title: mod.title,
        description: mod.description,
        order: mod.order,
        lessons: mod.lessons.map((l) => ({
          _type: "reference" as const,
          _ref: `lesson-${l.id}`,
          _key: l.id,
        })),
      };
      transaction.createOrReplace(moduleDoc);
    }

    // Create course document
    const courseDoc = {
      _id: `course-${course.id}`,
      _type: "course" as const,
      title: course.title,
      slug: { _type: "slug" as const, current: course.slug },
      description: course.description,
      difficulty: course.difficulty,
      durationMinutes: course.durationMinutes,
      totalXP: course.totalXP,
      trackId: course.trackId,
      tags: course.tags,
      instructorName: course.instructorName,
      enrolledCount: course.enrolledCount,
      publishedAt: course.publishedAt,
      modules: course.modules.map((m) => ({
        _type: "reference" as const,
        _ref: `module-${m.id}`,
        _key: m.id,
      })),
    };
    transaction.createOrReplace(courseDoc);

    console.log(`  + ${course.title} (${course.modules.length} modules)`);
  }

  await transaction.commit();
  console.log("Import complete.");
}

importCourses().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
