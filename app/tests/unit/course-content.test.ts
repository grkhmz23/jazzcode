import { describe, it, expect } from "vitest";
import { courses as COURSES } from "@/lib/data/courses";
import { LocalContentService } from "@/lib/services/content-local";

describe("Course Data", () => {
  it("contains at least 1 course", () => {
    expect(COURSES.length).toBeGreaterThanOrEqual(1);
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
            // Challenge lessons have additional fields
            expect((lesson as { starterCode?: string }).starterCode).toBeTruthy();
            expect((lesson as { solution?: string }).solution).toBeTruthy();
            expect((lesson as { testCases?: unknown[] }).testCases?.length).toBeGreaterThan(0);
            expect(["typescript", "rust", "json"]).toContain((lesson as { language?: string }).language);
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

describe("LocalContentService", () => {
  const service = new LocalContentService();

  it("returns all courses", async () => {
    const courses = await service.getCourses();
    expect(courses.length).toBeGreaterThanOrEqual(1);
  });

  it("filters by difficulty", async () => {
    const beginnerCourses = await service.searchCourses("", { difficulty: "beginner" });
    expect(beginnerCourses.every((c) => c.difficulty === "beginner")).toBe(true);
  });

  it("filters by search query", async () => {
    const results = await service.searchCourses("solana", {});
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((c) => c.title.toLowerCase().includes("solana"))).toBe(true);
  });

  it("returns course by slug", async () => {
    const course = await service.getCourse("solana-fundamentals");
    expect(course).not.toBeNull();
    expect(course!.title).toBe("Solana Fundamentals");
  });

  it("returns null for unknown slug", async () => {
    const course = await service.getCourse("nonexistent");
    expect(course).toBeNull();
  });

  it("returns lesson by course slug and ID", async () => {
    const lesson = await service.getLesson("solana-fundamentals", "first-transaction");
    expect(lesson).not.toBeNull();
    expect(lesson!.type).toBe("challenge");
  });

  it("searchCourses returns filtered results", async () => {
    const results = await service.searchCourses("fundamentals", {});
    expect(results.length).toBeGreaterThan(0);
  });
});
