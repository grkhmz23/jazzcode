import { describe, expect, it } from "vitest";
import { bundlesAtomicityCourse } from "@/lib/data/courses/bundles-atomicity";

describe("bundles atomicity course structure", () => {
  it("has correct metadata", () => {
    expect(bundlesAtomicityCourse.slug).toBe("bundles-atomicity");
    expect(bundlesAtomicityCourse.title).toBe("Bundles & Transaction Atomicity");
    expect(bundlesAtomicityCourse.modules).toHaveLength(2);
  });

  it("has 8 total lessons and >=3 challenges", () => {
    const lessons = bundlesAtomicityCourse.modules.flatMap((module) => module.lessons);
    expect(lessons).toHaveLength(8);
    expect(lessons.filter((lesson) => lesson.type === "challenge").length).toBeGreaterThanOrEqual(3);
  });

  it("has content lessons with >=500 words", () => {
    const contentLessons = bundlesAtomicityCourse.modules
      .flatMap((module) => module.lessons)
      .filter((lesson) => lesson.type === "content");

    for (const lesson of contentLessons) {
      expect(lesson.content.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(500);
      expect((lesson.blocks ?? []).length).toBeGreaterThan(0);
    }
  });
});
