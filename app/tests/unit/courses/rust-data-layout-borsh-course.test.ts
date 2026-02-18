import { describe, expect, it } from "vitest";
import { rustDataLayoutBorshCourse } from "@/lib/data/courses/rust-data-layout-borsh";

describe("rust data layout borsh course structure", () => {
  it("has expected metadata and module count", () => {
    expect(rustDataLayoutBorshCourse.slug).toBe("rust-data-layout-borsh");
    expect(rustDataLayoutBorshCourse.modules).toHaveLength(2);
  });

  it("has exactly 8 lessons and >=3 challenge lessons", () => {
    const lessons = rustDataLayoutBorshCourse.modules.flatMap((module) => module.lessons);
    expect(lessons).toHaveLength(8);
    expect(lessons.filter((lesson) => lesson.type === "challenge").length).toBeGreaterThanOrEqual(3);
  });

  it("keeps all content lessons at or above 500 words", () => {
    const contentLessons = rustDataLayoutBorshCourse.modules
      .flatMap((module) => module.lessons)
      .filter((lesson) => lesson.type === "content");

    for (const lesson of contentLessons) {
      expect(lesson.content.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(500);
      expect((lesson.blocks ?? []).length).toBeGreaterThan(0);
    }
  });
});
