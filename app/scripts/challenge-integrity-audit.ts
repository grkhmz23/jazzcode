import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { courses } from "@/lib/data/courses";
import { runChallengeInSandbox } from "@/lib/challenge-runner/sandbox";
import { runStructuralChecks, validateRustCode } from "@/lib/structural-checker";
import type { Challenge, Lesson } from "@/types/content";

type Failure = {
  courseSlug: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  error: string;
};

type CourseFailure = {
  courseSlug: string;
  courseTitle: string;
  failingChallenges: number;
  totalChallenges: number;
  lessons: Array<{
    lessonId: string;
    lessonTitle: string;
    error: string;
  }>;
};

function isChallengeLesson(lesson: Lesson): lesson is Challenge {
  return (
    (lesson.type === "challenge" ||
      lesson.type === "multi-file-challenge" ||
      lesson.type === "devnet-challenge") &&
    "solution" in lesson &&
    "testCases" in lesson &&
    "language" in lesson
  );
}

async function main() {
  const startedAt = Date.now();
  let totalChallenges = 0;
  let totalPass = 0;
  let totalFail = 0;

  const failures: Failure[] = [];
  const totalByCourse = new Map<string, { title: string; total: number }>();

  for (const course of courses) {
    for (const moduleItem of course.modules) {
      for (const lesson of moduleItem.lessons) {
        if (!isChallengeLesson(lesson)) {
          continue;
        }

        totalChallenges += 1;
        totalByCourse.set(course.slug, {
          title: course.title,
          total: (totalByCourse.get(course.slug)?.total ?? 0) + 1,
        });

        if (lesson.language === "rust") {
          const validation = validateRustCode(lesson.solution);
          if (!validation.valid) {
            totalFail += 1;
            failures.push({
              courseSlug: course.slug,
              courseTitle: course.title,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              error: validation.error ?? "Rust solution is not valid",
            });
            continue;
          }

          const checks = runStructuralChecks(lesson.solution, lesson.solution);
          const allChecksPassed = checks.every((check) => check.passed);
          if (allChecksPassed) {
            totalPass += 1;
            continue;
          }

          totalFail += 1;
          failures.push({
            courseSlug: course.slug,
            courseTitle: course.title,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            error: checks.find((check) => !check.passed)?.description ?? "Rust structural checks failed",
          });
          continue;
        }

        const result = await runChallengeInSandbox(lesson.solution, lesson.testCases, 2000);
        if (result.allPassed) {
          totalPass += 1;
          continue;
        }

        totalFail += 1;
        const firstFailed = result.testResults.find((entry) => !entry.passed);
        failures.push({
          courseSlug: course.slug,
          courseTitle: course.title,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          error: result.error ?? firstFailed?.error ?? "Output mismatch",
        });
      }
    }
  }

  const grouped = new Map<string, CourseFailure>();
  for (const failure of failures) {
    const fromTotal = totalByCourse.get(failure.courseSlug);
    const current = grouped.get(failure.courseSlug);
    if (!current) {
      grouped.set(failure.courseSlug, {
        courseSlug: failure.courseSlug,
        courseTitle: failure.courseTitle,
        failingChallenges: 1,
        totalChallenges: fromTotal?.total ?? 0,
        lessons: [
          {
            lessonId: failure.lessonId,
            lessonTitle: failure.lessonTitle,
            error: failure.error,
          },
        ],
      });
      continue;
    }

    current.failingChallenges += 1;
    current.lessons.push({
      lessonId: failure.lessonId,
      lessonTitle: failure.lessonTitle,
      error: failure.error,
    });
  }

  const failingCourses = Array.from(grouped.values()).sort((a, b) => {
    if (b.failingChallenges !== a.failingChallenges) {
      return b.failingChallenges - a.failingChallenges;
    }
    return a.courseSlug.localeCompare(b.courseSlug);
  });

  const batchSize = 5;
  const batches: Array<{ batch: number; courses: CourseFailure[] }> = [];
  for (let index = 0; index < failingCourses.length; index += batchSize) {
    batches.push({
      batch: index / batchSize + 1,
      courses: failingCourses.slice(index, index + batchSize),
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt,
    totals: {
      totalCourses: courses.length,
      totalChallenges,
      totalPass,
      totalFail,
      totalFailingCourses: failingCourses.length,
    },
    batches,
  };

  mkdirSync(join(process.cwd(), "tmp"), { recursive: true });
  const outputPath = join(process.cwd(), "tmp", "challenge-integrity-report.json");
  writeFileSync(outputPath, JSON.stringify(report, null, 2));

  console.log(`WROTE_REPORT ${outputPath}`);
  console.log(
    `TOTALS courses=${report.totals.totalCourses} challenges=${report.totals.totalChallenges} pass=${report.totals.totalPass} fail=${report.totals.totalFail} failingCourses=${report.totals.totalFailingCourses}`
  );

  for (const batch of batches) {
    const summary = batch.courses
      .map((course) => `${course.courseSlug}(${course.failingChallenges}/${course.totalChallenges})`)
      .join(", ");
    console.log(`BATCH ${batch.batch}: ${summary}`);
  }
}

void main();
