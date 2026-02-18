import { describe, expect, it } from "vitest";
import { solanaPerformanceCourse } from "@/lib/data/courses/solana-performance";
import type { Challenge, Lesson } from "@/types/content";

function isChallengeLesson(lesson: Lesson): lesson is Challenge {
  return lesson.type === "challenge";
}

describe("Solana Performance & Compute Optimization course structure", () => {
  it("has exactly two modules and eight lessons", () => {
    expect(solanaPerformanceCourse.modules).toHaveLength(2);
    const totalLessons = solanaPerformanceCourse.modules.reduce(
      (sum, moduleItem) => sum + moduleItem.lessons.length,
      0,
    );
    expect(totalLessons).toBe(8);
  });

  it("has three deterministic challenges in lessons 3, 5, and 8", () => {
    const lessons = solanaPerformanceCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const challenges = lessons.filter(isChallengeLesson);

    expect(challenges).toHaveLength(3);
    expect(challenges.map((item) => item.id)).toEqual([
      "performance-v2-cost-model",
      "performance-v2-optimized-layout",
      "performance-v2-perf-checkpoint",
    ]);

    for (const challenge of challenges) {
      expect(challenge.starterCode.length).toBeGreaterThan(60);
      expect(challenge.solution.length).toBeGreaterThan(80);
      expect(challenge.testCases.length).toBeGreaterThan(0);
      expect(challenge.hints.length).toBeGreaterThan(0);
    }
  });

  it("has valid course metadata", () => {
    expect(solanaPerformanceCourse.id).toBe("course-solana-performance");
    expect(solanaPerformanceCourse.slug).toBe("solana-performance");
    expect(solanaPerformanceCourse.title).toBe("Solana Performance & Compute Optimization");
    expect(solanaPerformanceCourse.difficulty).toBe("advanced");
    expect(solanaPerformanceCourse.duration).toBe("11 hours");
    expect(solanaPerformanceCourse.totalXP).toBe(405);
    expect(solanaPerformanceCourse.tags).toContain("performance");
    expect(solanaPerformanceCourse.tags).toContain("optimization");
    expect(solanaPerformanceCourse.tags).toContain("compute");
    expect(solanaPerformanceCourse.imageUrl).toBe("/images/courses/solana-performance.jpg");
  });

  it("has content lessons with valid blocks", () => {
    const lessons = solanaPerformanceCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const contentLessons = lessons.filter((l) => l.type === "content");
    
    expect(contentLessons).toHaveLength(5);
    
    for (const lesson of contentLessons) {
      expect(lesson.xpReward).toBeGreaterThan(0);
      expect(lesson.duration).toBeDefined();
      expect(lesson.content).toContain("#");
    }
  });

  it("has challenges with deterministic test cases", () => {
    const lessons = solanaPerformanceCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const challenges = lessons.filter(isChallengeLesson);

    for (const challenge of challenges) {
      expect(challenge.language).toBe("typescript");
      expect(challenge.testCases.every((tc) => tc.name.length > 0)).toBe(true);
      expect(challenge.testCases.every((tc) => tc.expectedOutput.length > 0)).toBe(true);
    }
  });
});
