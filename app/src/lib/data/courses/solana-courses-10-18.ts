import type { Challenge, ChallengeLanguage, Course, Lesson, LessonType, Module, TestCase } from "@/types/content";
import rawData from "../../../../../solana_courses_10_18.json";

type RawTestCase = {
  name?: string;
  input?: unknown;
  expectedOutput?: unknown;
  expected?: unknown;
};

type RawLesson = {
  id?: string;
  slug?: string;
  title?: string;
  type?: string;
  content?: string;
  description?: string;
  starterCode?: string;
  solution?: string;
  hints?: string[];
  testCases?: RawTestCase[];
  language?: string;
};

type RawModule = {
  id?: string;
  title?: string;
  description?: string;
  lessons?: RawLesson[];
};

type RawCourse = {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  difficulty?: string;
  duration?: string;
  totalXP?: number;
  tags?: string[];
  imageUrl?: string;
  modules?: RawModule[];
};

const dataset = rawData as { courses?: RawCourse[] };

const DEFAULT_LESSON_DURATION = "45 min";
const DEFAULT_CONTENT_XP = 45;
const DEFAULT_CHALLENGE_XP = 60;

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toDifficulty(value: string | undefined): Course["difficulty"] {
  if (value === "beginner" || value === "intermediate" || value === "advanced") {
    return value;
  }
  return "intermediate";
}

function stringifyValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value ?? "");
}

function inferChallengeLanguage(rawLesson: RawLesson): ChallengeLanguage {
  const source = `${rawLesson.starterCode ?? ""}\n${rawLesson.solution ?? ""}`;
  const looksRust = /\b(fn|pub|impl|struct|enum)\b/.test(source);
  return looksRust ? "rust" : "typescript";
}

function toLessonType(value: string | undefined): LessonType {
  if (
    value === "content" ||
    value === "challenge" ||
    value === "multi-file-challenge" ||
    value === "devnet-challenge"
  ) {
    return value;
  }
  return "content";
}

function normalizeTestCases(testCases: RawTestCase[] | undefined, lessonId: string): TestCase[] {
  if (!Array.isArray(testCases) || testCases.length === 0) {
    return [
      {
        name: `${lessonId}-basic-case`,
        input: "{}",
        expectedOutput: "{}",
      },
    ];
  }

  return testCases.map((testCase, index) => ({
    name: testCase.name?.trim() || `${lessonId}-case-${index + 1}`,
    input: stringifyValue(testCase.input),
    expectedOutput: stringifyValue(
      testCase.expectedOutput === undefined ? testCase.expected : testCase.expectedOutput
    ),
  }));
}

function normalizeLesson(rawLesson: RawLesson, moduleIndex: number, lessonIndex: number): Lesson {
  const baseId = rawLesson.id?.trim() || `lesson-${moduleIndex + 1}-${lessonIndex + 1}`;
  const baseTitle = rawLesson.title?.trim() || `Lesson ${moduleIndex + 1}.${lessonIndex + 1}`;
  const baseType = toLessonType(rawLesson.type);

  const baseLesson: Lesson = {
    id: baseId,
    slug: rawLesson.slug?.trim() || toSlug(baseTitle || baseId),
    title: baseTitle,
    type: baseType,
    content: rawLesson.content?.trim() || rawLesson.description?.trim() || "Content coming soon.",
    xpReward: baseType === "challenge" ? DEFAULT_CHALLENGE_XP : DEFAULT_CONTENT_XP,
    duration: DEFAULT_LESSON_DURATION,
  };

  if (baseType !== "challenge") {
    return baseLesson;
  }

  const challengeLesson: Challenge = {
    ...baseLesson,
    type: "challenge",
    starterCode: rawLesson.starterCode ?? "// TODO: implement",
    language: rawLesson.language === "rust" || rawLesson.language === "typescript"
      ? rawLesson.language
      : inferChallengeLanguage(rawLesson),
    testCases: normalizeTestCases(rawLesson.testCases, baseId),
    hints:
      Array.isArray(rawLesson.hints) && rawLesson.hints.length > 0
        ? rawLesson.hints
        : ["Break the problem down into deterministic helper steps."],
    solution: rawLesson.solution ?? "// Solution not provided in source dataset.",
  };

  return challengeLesson;
}

function normalizeModule(rawModule: RawModule, courseIndex: number, moduleIndex: number): Module {
  const moduleId = rawModule.id?.trim() || `module-${courseIndex + 1}-${moduleIndex + 1}`;
  const moduleTitle = rawModule.title?.trim() || `Module ${moduleIndex + 1}`;

  return {
    id: moduleId,
    title: moduleTitle,
    description: rawModule.description?.trim() || moduleTitle,
    lessons: (rawModule.lessons ?? []).map((lesson, lessonIndex) =>
      normalizeLesson(lesson, moduleIndex, lessonIndex)
    ),
  };
}

function normalizeCourse(rawCourse: RawCourse, courseIndex: number): Course {
  const title = rawCourse.title?.trim() || `Course ${courseIndex + 1}`;
  const id = rawCourse.id?.trim() || `course-${String(courseIndex + 1).padStart(3, "0")}`;

  return {
    id,
    slug: rawCourse.slug?.trim() || toSlug(title || id),
    title,
    description: rawCourse.description?.trim() || "Course description coming soon.",
    difficulty: toDifficulty(rawCourse.difficulty),
    duration: rawCourse.duration?.trim() || "6 weeks",
    totalXP: Number.isFinite(rawCourse.totalXP) ? (rawCourse.totalXP as number) : 1800,
    tags: Array.isArray(rawCourse.tags) && rawCourse.tags.length > 0 ? rawCourse.tags : ["solana"],
    imageUrl: rawCourse.imageUrl?.trim() || "/images/courses/solana-fundamentals.svg",
    modules: (rawCourse.modules ?? []).map((module, moduleIndex) =>
      normalizeModule(module, courseIndex, moduleIndex)
    ),
  };
}

export const solanaCourses10To18: Course[] = (dataset.courses ?? []).map((course, index) =>
  normalizeCourse(course, index)
);
