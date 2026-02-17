import { describe, expect, it } from "vitest";
import { anchorDevelopmentCourse } from "@/lib/data/courses/anchor-development";
import type { Challenge, Lesson } from "@/types/content";

function isChallengeLesson(lesson: Lesson): lesson is Challenge {
  return lesson.type === "challenge";
}

describe("Anchor Development V2 course structure", () => {
  it("has two modules and eight lessons", () => {
    expect(anchorDevelopmentCourse.modules).toHaveLength(2);
    const totalLessons = anchorDevelopmentCourse.modules.reduce(
      (sum, moduleItem) => sum + moduleItem.lessons.length,
      0,
    );
    expect(totalLessons).toBe(8);
  });

  it("contains deterministic challenge lessons", () => {
    const challengeLessons = anchorDevelopmentCourse.modules
      .flatMap((moduleItem) => moduleItem.lessons)
      .filter(isChallengeLesson);

    expect(challengeLessons).toHaveLength(3);

    for (const challenge of challengeLessons) {
      expect(challenge.starterCode.length).toBeGreaterThan(100);
      expect(challenge.testCases.length).toBeGreaterThan(0);
      expect(challenge.testCases.every((testCase) => testCase.expectedOutput.length > 0)).toBe(true);
    }
  });
});
