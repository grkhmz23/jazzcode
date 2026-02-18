import { describe, expect, it } from "vitest";
import { solanaPaymentsCourse } from "@/lib/data/courses/solana-payments";
import type { Challenge, Lesson } from "@/types/content";

function isChallengeLesson(lesson: Lesson): lesson is Challenge {
  return lesson.type === "challenge";
}

describe("Solana Payments & Checkout Flows course structure", () => {
  it("has exactly two modules and eight lessons", () => {
    expect(solanaPaymentsCourse.modules).toHaveLength(2);
    const totalLessons = solanaPaymentsCourse.modules.reduce(
      (sum, moduleItem) => sum + moduleItem.lessons.length,
      0,
    );
    expect(totalLessons).toBe(8);
  });

  it("has three deterministic challenges in lessons 3, 5, and 8", () => {
    const lessons = solanaPaymentsCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const challenges = lessons.filter(isChallengeLesson);

    expect(challenges).toHaveLength(3);
    expect(challenges.map((item) => item.id)).toEqual([
      "payments-v2-payment-intent",
      "payments-v2-transfer-tx",
      "payments-v2-webhook-receipt",
    ]);

    for (const challenge of challenges) {
      expect(challenge.starterCode.length).toBeGreaterThan(60);
      expect(challenge.solution.length).toBeGreaterThan(80);
      expect(challenge.testCases.length).toBeGreaterThan(0);
      expect(challenge.hints.length).toBeGreaterThan(0);
    }
  });

  it("has valid course metadata", () => {
    expect(solanaPaymentsCourse.id).toBe("course-solana-payments");
    expect(solanaPaymentsCourse.slug).toBe("solana-payments");
    expect(solanaPaymentsCourse.title).toBe("Solana Payments & Checkout Flows");
    expect(solanaPaymentsCourse.difficulty).toBe("intermediate");
    expect(solanaPaymentsCourse.duration).toBe("10 hours");
    expect(solanaPaymentsCourse.totalXP).toBe(400);
    expect(solanaPaymentsCourse.tags).toContain("payments");
    expect(solanaPaymentsCourse.tags).toContain("checkout");
    expect(solanaPaymentsCourse.imageUrl).toBe("/images/courses/solana-payments.jpg");
  });

  it("has content lessons with valid blocks", () => {
    const lessons = solanaPaymentsCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const contentLessons = lessons.filter((l) => l.type === "content");
    
    expect(contentLessons).toHaveLength(5);
    
    for (const lesson of contentLessons) {
      expect(lesson.xpReward).toBeGreaterThan(0);
      expect(lesson.duration).toBeDefined();
      expect(lesson.content).toContain("#");
    }
  });

  it("has challenges with deterministic test cases", () => {
    const lessons = solanaPaymentsCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const challenges = lessons.filter(isChallengeLesson);

    for (const challenge of challenges) {
      expect(challenge.language).toBe("typescript");
      expect(challenge.testCases.every((tc) => tc.name.length > 0)).toBe(true);
      expect(challenge.testCases.every((tc) => tc.expectedOutput.length > 0)).toBe(true);
    }
  });
});
