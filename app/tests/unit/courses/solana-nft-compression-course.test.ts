import { describe, expect, it } from "vitest";
import { solanaNftCompressionCourse } from "@/lib/data/courses/solana-nft-compression";
import type { Challenge, Lesson } from "@/types/content";

function isChallengeLesson(lesson: Lesson): lesson is Challenge {
  return lesson.type === "challenge";
}

describe("Solana NFT Compression course structure", () => {
  it("has exactly two modules and eight lessons", () => {
    expect(solanaNftCompressionCourse.modules).toHaveLength(2);
    const totalLessons = solanaNftCompressionCourse.modules.reduce(
      (sum, moduleItem) => sum + moduleItem.lessons.length,
      0,
    );
    expect(totalLessons).toBe(8);
  });

  it("has three deterministic challenges in lessons 3, 5, and 8", () => {
    const lessons = solanaNftCompressionCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const challenges = lessons.filter(isChallengeLesson);

    expect(challenges).toHaveLength(3);
    expect(challenges.map((item) => item.id)).toEqual([
      "cnft-v2-merkle-insert",
      "cnft-v2-proof-verification",
      "cnft-v2-compression-checkpoint",
    ]);

    for (const challenge of challenges) {
      expect(challenge.starterCode.length).toBeGreaterThan(60);
      expect(challenge.solution.length).toBeGreaterThan(80);
      expect(challenge.testCases.length).toBeGreaterThan(0);
      expect(challenge.hints.length).toBeGreaterThan(0);
    }
  });

  it("has valid course metadata", () => {
    expect(solanaNftCompressionCourse.id).toBe("course-solana-nft-compression");
    expect(solanaNftCompressionCourse.slug).toBe("solana-nft-compression");
    expect(solanaNftCompressionCourse.title).toBe("NFTs & Compressed NFTs Fundamentals");
    expect(solanaNftCompressionCourse.difficulty).toBe("advanced");
    expect(solanaNftCompressionCourse.duration).toBe("12 hours");
    expect(solanaNftCompressionCourse.totalXP).toBe(425);
    expect(solanaNftCompressionCourse.tags).toContain("nfts");
    expect(solanaNftCompressionCourse.tags).toContain("compression");
    expect(solanaNftCompressionCourse.tags).toContain("merkle-trees");
    expect(solanaNftCompressionCourse.imageUrl).toBe("/images/courses/solana-nft-compression.jpg");
  });

  it("has content lessons with valid blocks", () => {
    const lessons = solanaNftCompressionCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const contentLessons = lessons.filter((l) => l.type === "content");
    
    expect(contentLessons).toHaveLength(5);
    
    for (const lesson of contentLessons) {
      expect(lesson.xpReward).toBeGreaterThan(0);
      expect(lesson.duration).toBeDefined();
      expect(lesson.content).toContain("#");
    }
  });

  it("has challenges with deterministic test cases", () => {
    const lessons = solanaNftCompressionCourse.modules.flatMap((moduleItem) => moduleItem.lessons);
    const challenges = lessons.filter(isChallengeLesson);

    for (const challenge of challenges) {
      expect(challenge.language).toBe("typescript");
      expect(challenge.testCases.every((tc) => tc.name.length > 0)).toBe(true);
      expect(challenge.testCases.every((tc) => tc.expectedOutput.length > 0)).toBe(true);
    }
  });
});
