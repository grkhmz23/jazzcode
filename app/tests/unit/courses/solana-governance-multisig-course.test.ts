import { describe, expect, it } from "vitest";
import { solanaGovernanceMultisigCourse } from "@/lib/data/courses/solana-governance-multisig";
import type { Challenge, Lesson } from "@/types/content";

function isChallengeLesson(lesson: Lesson): lesson is Challenge {
  return lesson.type === "challenge";
}

describe("Solana Governance & Multisig Treasury Ops course structure", () => {
  it("has exactly two modules and eight lessons", () => {
    expect(solanaGovernanceMultisigCourse.modules).toHaveLength(2);
    const totalLessons = solanaGovernanceMultisigCourse.modules.reduce(
      (sum, moduleItem) => sum + moduleItem.lessons.length,
      0,
    );
    expect(totalLessons).toBe(8);
  });

  it("has three deterministic challenges in lessons 4, 6, and 8", () => {
    const lessons = solanaGovernanceMultisigCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const challenges = lessons.filter(isChallengeLesson);

    expect(challenges).toHaveLength(3);
    expect(challenges.map((item) => item.id)).toEqual([
      "governance-v2-quorum-voting",
      "governance-v2-multisig-builder",
      "governance-v2-treasury-execution",
    ]);

    for (const challenge of challenges) {
      expect(challenge.starterCode.length).toBeGreaterThan(60);
      expect(challenge.solution.length).toBeGreaterThan(80);
      expect(challenge.testCases.length).toBeGreaterThan(0);
      expect(challenge.hints.length).toBeGreaterThan(0);
    }
  });

  it("has valid course metadata", () => {
    expect(solanaGovernanceMultisigCourse.id).toBe("course-solana-governance-multisig");
    expect(solanaGovernanceMultisigCourse.slug).toBe("solana-governance-multisig");
    expect(solanaGovernanceMultisigCourse.title).toBe("Governance & Multisig Treasury Ops");
    expect(solanaGovernanceMultisigCourse.difficulty).toBe("intermediate");
    expect(solanaGovernanceMultisigCourse.duration).toBe("11 hours");
    expect(solanaGovernanceMultisigCourse.totalXP).toBe(400);
    expect(solanaGovernanceMultisigCourse.tags).toContain("governance");
    expect(solanaGovernanceMultisigCourse.tags).toContain("multisig");
    expect(solanaGovernanceMultisigCourse.tags).toContain("dao");
    expect(solanaGovernanceMultisigCourse.imageUrl).toBe("/images/courses/solana-governance-multisig.jpg");
  });

  it("has content lessons with valid blocks", () => {
    const lessons = solanaGovernanceMultisigCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const contentLessons = lessons.filter((l) => l.type === "content");
    
    expect(contentLessons).toHaveLength(5);
    
    for (const lesson of contentLessons) {
      expect(lesson.xpReward).toBeGreaterThan(0);
      expect(lesson.duration).toBeDefined();
      expect(lesson.content).toContain("#");
    }
  });

  it("has challenges with deterministic test cases", () => {
    const lessons = solanaGovernanceMultisigCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const challenges = lessons.filter(isChallengeLesson);

    for (const challenge of challenges) {
      expect(challenge.language).toBe("typescript");
      expect(challenge.testCases.every((tc) => tc.name.length > 0)).toBe(true);
      expect(challenge.testCases.every((tc) => tc.expectedOutput.length > 0)).toBe(true);
    }
  });
});
