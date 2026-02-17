import { describe, expect, it } from "vitest";
import { tokenEngineeringCourse } from "@/lib/data/courses/token-engineering";
import type { Challenge, Lesson } from "@/types/content";

function isChallengeLesson(lesson: Lesson): lesson is Challenge {
  return lesson.type === "challenge";
}

describe("Token Engineering V2 course structure", () => {
  it("has exactly two modules and eight lessons", () => {
    expect(tokenEngineeringCourse.modules).toHaveLength(2);
    const totalLessons = tokenEngineeringCourse.modules.reduce(
      (sum, moduleItem) => sum + moduleItem.lessons.length,
      0,
    );
    expect(totalLessons).toBe(8);
  });

  it("includes deterministic challenges in lessons 4,5,6,8", () => {
    const challenges = tokenEngineeringCourse.modules
      .flatMap((moduleItem) => moduleItem.lessons)
      .filter(isChallengeLesson);

    expect(challenges).toHaveLength(4);
    expect(challenges.map((item) => item.id)).toEqual([
      "token-v2-validate-config-derive",
      "token-v2-build-init-plan",
      "token-v2-simulate-fees-supply",
      "token-v2-launch-pack-checkpoint",
    ]);

    for (const challenge of challenges) {
      expect(challenge.starterCode.length).toBeGreaterThan(100);
      expect(challenge.solution.length).toBeGreaterThan(100);
      expect(challenge.testCases.length).toBeGreaterThan(0);
      expect(challenge.testCases.every((testCase) => testCase.expectedOutput.length > 0)).toBe(true);
    }
  });
});
