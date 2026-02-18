import { describe, expect, it } from "vitest";
import { priorityFeesComputeBudgetCourse } from "@/lib/data/courses/priority-fees-compute-budget";

describe("priority fees compute budget course structure", () => {
  it("has correct metadata", () => {
    expect(priorityFeesComputeBudgetCourse.slug).toBe("priority-fees-compute-budget");
    expect(priorityFeesComputeBudgetCourse.title).toBe("Priority Fees & Compute Budget");
    expect(priorityFeesComputeBudgetCourse.modules).toHaveLength(2);
  });

  it("has 8 total lessons and >=3 challenges", () => {
    const lessons = priorityFeesComputeBudgetCourse.modules.flatMap((module) => module.lessons);
    expect(lessons).toHaveLength(8);
    expect(lessons.filter((lesson) => lesson.type === "challenge").length).toBeGreaterThanOrEqual(3);
  });

  it("has content lessons with >=500 words", () => {
    const contentLessons = priorityFeesComputeBudgetCourse.modules
      .flatMap((module) => module.lessons)
      .filter((lesson) => lesson.type === "content");

    for (const lesson of contentLessons) {
      expect(lesson.content.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(500);
      expect((lesson.blocks ?? []).length).toBeGreaterThan(0);
    }
  });
});
