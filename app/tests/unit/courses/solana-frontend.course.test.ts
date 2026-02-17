import { describe, expect, it } from "vitest";
import { solanaFrontendCourse } from "@/lib/data/courses/solana-frontend";
import type { Challenge, Lesson } from "@/types/content";

function isChallenge(lesson: Lesson): lesson is Challenge {
  return lesson.type === "challenge";
}

describe("Solana Frontend V2 course structure", () => {
  it("has exactly two modules and eight lessons", () => {
    expect(solanaFrontendCourse.modules).toHaveLength(2);
    const totalLessons = solanaFrontendCourse.modules.reduce(
      (sum, moduleItem) => sum + moduleItem.lessons.length,
      0,
    );
    expect(totalLessons).toBe(8);
  });

  it("includes deterministic challenges 4,5,6,8", () => {
    const challenges = solanaFrontendCourse.modules
      .flatMap((moduleItem) => moduleItem.lessons)
      .filter(isChallenge);

    expect(challenges).toHaveLength(4);
    expect(challenges.map((challenge) => challenge.id)).toEqual([
      "frontend-v2-core-reducer",
      "frontend-v2-stream-replay-snapshots",
      "frontend-v2-query-layer-metrics",
      "frontend-v2-dashboard-summary-checkpoint",
    ]);

    for (const challenge of challenges) {
      expect(challenge.starterCode.length).toBeGreaterThan(40);
      expect(challenge.solution.length).toBeGreaterThan(80);
      expect(challenge.testCases.length).toBeGreaterThan(0);
      expect(challenge.testCases.every((testCase) => testCase.expectedOutput.length > 0)).toBe(true);
    }
  });
});
