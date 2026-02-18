import { describe, expect, it } from "vitest";
import { mempoolUxDefenseCourse } from "@/lib/data/courses/mempool-ux-defense";

describe("mempool ux defense course structure", () => {
  it("has correct metadata", () => {
    expect(mempoolUxDefenseCourse.slug).toBe("mempool-ux-defense");
    expect(mempoolUxDefenseCourse.title).toBe("Mempool Reality & Anti-Sandwich UX");
    expect(mempoolUxDefenseCourse.modules).toHaveLength(2);
  });

  it("has 8 total lessons and >=3 challenges", () => {
    const lessons = mempoolUxDefenseCourse.modules.flatMap((module) => module.lessons);
    expect(lessons).toHaveLength(8);
    expect(lessons.filter((lesson) => lesson.type === "challenge").length).toBeGreaterThanOrEqual(3);
  });

  it("has content lessons with >=500 words", () => {
    const contentLessons = mempoolUxDefenseCourse.modules
      .flatMap((module) => module.lessons)
      .filter((lesson) => lesson.type === "content");

    for (const lesson of contentLessons) {
      expect(lesson.content.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(500);
      expect((lesson.blocks ?? []).length).toBeGreaterThan(0);
    }
  });
});
