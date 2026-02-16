import { describe, it, expect } from "vitest";
import { LocalCourseContentService } from "@/lib/services/implementations/local-content";
import { COURSES, getLessonContext } from "@/lib/data/courses";

describe("Course Data", () => {
  it("contains at least 4 courses", () => {
    expect(COURSES.length).toBeGreaterThanOrEqual(4);
  });

  it("every course has required fields", () => {
    for (const course of COURSES) {
      expect(course.id).toBeTruthy();
      expect(course.slug).toBeTruthy();
      expect(course.title).toBeTruthy();
      expect(course.modules.length).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(course.difficulty);
    }
  });

  it("every lesson has content", () => {
    for (const course of COURSES) {
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          expect(lesson.id).toBeTruthy();
          expect(lesson.title).toBeTruthy();
          expect(lesson.content.length).toBeGreaterThan(0);
          expect(lesson.xpReward).toBeGreaterThan(0);
        }
      }
    }
  });

  it("challenge lessons have valid challenge definitions", () => {
    for (const course of COURSES) {
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          if (lesson.type === "challenge") {
            expect(lesson.challenge).toBeDefined();
            const ch = lesson.challenge!;
            expect(ch.starterCode).toBeTruthy();
            expect(ch.solutionCode).toBeTruthy();
            expect(ch.testCases.length).toBeGreaterThan(0);
            expect(["typescript", "rust", "json"]).toContain(ch.language);
            expect(ch.timeoutMs).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it("all lesson IDs are unique across all courses", () => {
    const ids = new Set<string>();
    for (const course of COURSES) {
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          expect(ids.has(lesson.id)).toBe(false);
          ids.add(lesson.id);
        }
      }
    }
  });
});

describe("getLessonContext", () => {
  it("returns lesson context for a valid course/lesson pair", () => {
    const ctx = getLessonContext("solana-fundamentals", "les-1");
    expect(ctx).not.toBeNull();
    expect(ctx!.lesson.title).toBe("What is Solana?");
    expect(ctx!.prevLessonId).toBeNull();
    expect(ctx!.nextLessonId).toBe("les-2");
  });

  it("returns correct prev/next for middle lessons", () => {
    const ctx = getLessonContext("solana-fundamentals", "les-2");
    expect(ctx).not.toBeNull();
    expect(ctx!.prevLessonId).toBe("les-1");
    expect(ctx!.nextLessonId).toBe("les-3");
  });

  it("returns null for non-existent lesson", () => {
    const ctx = getLessonContext("solana-fundamentals", "nonexistent");
    expect(ctx).toBeNull();
  });

  it("returns null for non-existent course", () => {
    const ctx = getLessonContext("nonexistent-course", "les-1");
    expect(ctx).toBeNull();
  });
});

describe("LocalCourseContentService", () => {
  const service = new LocalCourseContentService();

  it("returns all courses", async () => {
    const courses = await service.getCourses();
    expect(courses.length).toBeGreaterThanOrEqual(4);
  });

  it("filters by difficulty", async () => {
    const beginnerCourses = await service.getCourses({ difficulty: "beginner" });
    expect(beginnerCourses.every((c) => c.difficulty === "beginner")).toBe(true);
  });

  it("filters by search query", async () => {
    const results = await service.getCourses({ search: "anchor" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((c) => c.title.toLowerCase().includes("anchor"))).toBe(true);
  });

  it("returns course by slug", async () => {
    const course = await service.getCourseBySlug("solana-fundamentals");
    expect(course).not.toBeNull();
    expect(course!.title).toBe("Solana Fundamentals");
  });

  it("returns null for unknown slug", async () => {
    const course = await service.getCourseBySlug("nonexistent");
    expect(course).toBeNull();
  });

  it("returns lesson by course slug and ID", async () => {
    const lesson = await service.getLessonById("solana-fundamentals", "les-3");
    expect(lesson).not.toBeNull();
    expect(lesson!.type).toBe("challenge");
    expect(lesson!.challenge).toBeDefined();
  });

  it("searchCourses delegates to getCourses", async () => {
    const results = await service.searchCourses("DeFi");
    expect(results.length).toBeGreaterThan(0);
  });
});
