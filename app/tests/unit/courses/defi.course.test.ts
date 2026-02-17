import { describe, expect, it } from "vitest";
import { defiSolanaCourse } from "@/lib/data/courses/defi-solana";
import type { Challenge, Lesson } from "@/types/content";

function isChallengeLesson(lesson: Lesson): lesson is Challenge {
  return lesson.type === "challenge";
}

describe("DeFi on Solana V2 course structure", () => {
  it("has exactly two modules and eight lessons", () => {
    expect(defiSolanaCourse.modules).toHaveLength(2);
    const totalLessons = defiSolanaCourse.modules.reduce(
      (sum, moduleItem) => sum + moduleItem.lessons.length,
      0,
    );
    expect(totalLessons).toBe(8);
  });

  it("has four deterministic challenges in 4,5,6,8", () => {
    const challenges = defiSolanaCourse.modules
      .flatMap((moduleItem) => moduleItem.lessons)
      .filter(isChallengeLesson);

    expect(challenges).toHaveLength(4);
    expect(challenges.map((item) => item.id)).toEqual([
      "defi-v2-quote-cpmm",
      "defi-v2-router-best",
      "defi-v2-safety-minout",
      "defi-v2-checkpoint",
    ]);

    for (const challenge of challenges) {
      expect(challenge.starterCode.length).toBeGreaterThan(60);
      expect(challenge.solution.length).toBeGreaterThan(100);
      expect(challenge.testCases.length).toBeGreaterThan(0);
      expect(challenge.testCases.every((testCase) => testCase.expectedOutput.length > 0)).toBe(true);
    }
  });
});
