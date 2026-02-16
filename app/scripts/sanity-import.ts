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
 * This script reads from lib/data/courses/index.ts and creates Sanity documents.
 */

import { createClient } from "next-sanity";
import type { Challenge, Course as LocalCourse } from "@/types/content";

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

async function importCourses(): Promise<void> {
  // Dynamic import of the course data
  const { courses: COURSES } = await import("../src/lib/data/courses") as { courses: LocalCourse[] };

  console.log(`Importing ${COURSES.length} courses into Sanity (${projectId}/${dataset})...`);

  const transaction = client.transaction();

  for (const course of COURSES) {
    // Create lesson documents first
    for (const [moduleIndex, mod] of course.modules.entries()) {
      for (const [lessonIndex, lesson] of mod.lessons.entries()) {
        const lessonDoc = {
          _id: `lesson-${lesson.id}`,
          _type: "lesson" as const,
          title: lesson.title,
          slug: lesson.slug,
          content: lesson.content,
          type: lesson.type,
          xpReward: lesson.xpReward,
          order: lessonIndex + 1,
          moduleId: mod.id,
        };
        transaction.createOrReplace(lessonDoc);

        // If it's a challenge, create challenge document
        if (lesson.type === "challenge") {
          const challengeLesson = lesson as Challenge;
          const challengeDoc = {
            _id: `challenge-${lesson.id}`,
            _type: "challenge" as const,
            lesson: { _type: "reference" as const, _ref: `lesson-${lesson.id}` },
            starterCode: challengeLesson.starterCode,
            language: challengeLesson.language,
            testCases: challengeLesson.testCases ?? [],
            hints: challengeLesson.hints ?? [],
            solution: challengeLesson.solution,
          };
          transaction.createOrReplace(challengeDoc);
        }
      }

      // Create module document
      const moduleDoc = {
        _id: `module-${mod.id}`,
        _type: "module" as const,
        title: mod.title,
        order: moduleIndex + 1,
        lessons: mod.lessons.map((l) => ({
          _type: "reference" as const,
          _ref: `lesson-${l.id}`,
        })),
      };
      transaction.createOrReplace(moduleDoc);
    }

    // Create course document
    const courseDoc = {
      _id: `course-${course.id}`,
      _type: "course" as const,
      title: course.title,
      slug: course.slug,
      description: course.description,
      difficulty: course.difficulty,
      duration: course.duration,
      totalXP: course.totalXP,
      thumbnailUrl: course.imageUrl,
      instructor: {
        name: "Superteam Academy",
        avatarUrl: "/images/instructors/default.svg",
        bio: "Official Superteam Brazil education content",
      },
      modules: course.modules.map((m) => ({
        _type: "reference" as const,
        _ref: `module-${m.id}`,
      })),
      tags: course.tags,
      language: "en",
    };
    transaction.createOrReplace(courseDoc);
  }

  await transaction.commit();
  console.log(`Successfully imported ${COURSES.length} courses.`);
}

importCourses().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
