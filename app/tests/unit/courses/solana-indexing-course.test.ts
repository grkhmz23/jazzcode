import { describe, expect, it } from "vitest";
import { solanaIndexingCourse } from "@/lib/data/courses/solana-indexing";
import type { Challenge, Lesson } from "@/types/content";

function isChallengeLesson(lesson: Lesson): lesson is Challenge {
  return lesson.type === "challenge";
}

describe("Solana Indexing & Analytics course structure", () => {
  it("has exactly two modules and eight lessons", () => {
    expect(solanaIndexingCourse.modules).toHaveLength(2);
    const totalLessons = solanaIndexingCourse.modules.reduce(
      (sum, moduleItem) => sum + moduleItem.lessons.length,
      0,
    );
    expect(totalLessons).toBe(8);
  });

  it("has three deterministic challenges in lessons 3, 5, and 8", () => {
    const lessons = solanaIndexingCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const challenges = lessons.filter(isChallengeLesson);

    expect(challenges).toHaveLength(3);
    expect(challenges.map((item) => item.id)).toEqual([
      "indexing-v2-decode-token-account",
      "indexing-v2-index-transactions",
      "indexing-v2-analytics-checkpoint",
    ]);

    for (const challenge of challenges) {
      expect(challenge.starterCode.length).toBeGreaterThan(60);
      expect(challenge.solution.length).toBeGreaterThan(80);
      expect(challenge.testCases.length).toBeGreaterThan(0);
      expect(challenge.hints.length).toBeGreaterThan(0);
    }
  });

  it("has valid course metadata", () => {
    expect(solanaIndexingCourse.id).toBe("course-solana-indexing");
    expect(solanaIndexingCourse.slug).toBe("solana-indexing");
    expect(solanaIndexingCourse.title).toBe("Solana Indexing & Analytics");
    expect(solanaIndexingCourse.difficulty).toBe("intermediate");
    expect(solanaIndexingCourse.duration).toBe("10 hours");
    expect(solanaIndexingCourse.totalXP).toBe(400);
    expect(solanaIndexingCourse.tags).toContain("indexing");
    expect(solanaIndexingCourse.tags).toContain("analytics");
    expect(solanaIndexingCourse.imageUrl).toBe("/images/courses/solana-indexing.jpg");
  });

  it("has content lessons with valid blocks", () => {
    const lessons = solanaIndexingCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const contentLessons = lessons.filter((l) => l.type === "content");
    
    expect(contentLessons).toHaveLength(5);
    
    for (const lesson of contentLessons) {
      expect(lesson.xpReward).toBeGreaterThan(0);
      expect(lesson.duration).toBeDefined();
      expect(lesson.content).toContain("#");
    }
  });

  it("has challenges with deterministic test cases", () => {
    const lessons = solanaIndexingCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const challenges = lessons.filter(isChallengeLesson);

    for (const challenge of challenges) {
      expect(challenge.language).toBe("typescript");
      expect(challenge.testCases.every((tc) => tc.name.length > 0)).toBe(true);
      expect(challenge.testCases.every((tc) => tc.expectedOutput.length > 0)).toBe(true);
    }
  });
});
