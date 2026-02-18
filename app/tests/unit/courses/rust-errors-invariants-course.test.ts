import { describe, expect, it } from "vitest";
import { rustErrorsInvariantsCourse } from "@/lib/data/courses/rust-errors-invariants";

describe("rust errors invariants course structure", () => {
  it("has expected metadata and module count", () => {
    expect(rustErrorsInvariantsCourse.slug).toBe("rust-errors-invariants");
    expect(rustErrorsInvariantsCourse.modules).toHaveLength(2);
  });

  it("has exactly 8 lessons and >=3 challenge lessons", () => {
    const lessons = rustErrorsInvariantsCourse.modules.flatMap((module) => module.lessons);
    expect(lessons).toHaveLength(8);
    expect(lessons.filter((lesson) => lesson.type === "challenge").length).toBeGreaterThanOrEqual(3);
  });

  it("keeps all content lessons at or above 500 words", () => {
    const contentLessons = rustErrorsInvariantsCourse.modules
      .flatMap((module) => module.lessons)
      .filter((lesson) => lesson.type === "content");

    for (const lesson of contentLessons) {
      expect(lesson.content.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(500);
      expect((lesson.blocks ?? []).length).toBeGreaterThan(0);
    }
  });
});
