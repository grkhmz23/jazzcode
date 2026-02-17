import { describe, expect, it } from "vitest";
import { solanaSecurityCourse } from "@/lib/data/courses/solana-security";
import type { Challenge, Lesson } from "@/types/content";

function isChallengeLesson(lesson: Lesson): lesson is Challenge {
  return lesson.type === "challenge";
}

describe("Solana Security V2 course structure", () => {
  it("has exactly two modules and eight lessons", () => {
    expect(solanaSecurityCourse.modules).toHaveLength(2);
    const totalLessons = solanaSecurityCourse.modules.reduce(
      (sum, moduleItem) => sum + moduleItem.lessons.length,
      0,
    );
    expect(totalLessons).toBe(8);
  });

  it("contains deterministic challenges in lessons 4, 5, 6, and 8", () => {
    const lessons = solanaSecurityCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const challenges = lessons.filter(isChallengeLesson);

    expect(challenges).toHaveLength(4);
    expect(challenges.map((item) => item.id)).toEqual([
      "security-v2-exploit-signer-owner",
      "security-v2-exploit-pda-spoof",
      "security-v2-patch-validate",
      "security-v2-audit-report-checkpoint",
    ]);

    for (const challenge of challenges) {
      expect(challenge.starterCode.length).toBeGreaterThan(80);
      expect(challenge.solution.length).toBeGreaterThan(80);
      expect(challenge.testCases.length).toBeGreaterThan(0);
    }
  });
});
