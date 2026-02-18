import { describe, expect, it } from "vitest";
import { defiClmmLiquidityCourse } from "@/lib/data/courses/defi-clmm-liquidity";

describe("defi clmm liquidity course structure", () => {
  it("has correct metadata", () => {
    expect(defiClmmLiquidityCourse.id).toBe("course-defi-clmm-liquidity");
    expect(defiClmmLiquidityCourse.slug).toBe("defi-clmm-liquidity");
    expect(defiClmmLiquidityCourse.title).toBe("CLMM Liquidity Engineering");
    expect(defiClmmLiquidityCourse.difficulty).toBe("advanced");
    expect(defiClmmLiquidityCourse.tags).toContain("clmm");
    expect(defiClmmLiquidityCourse.imageUrl).toBe("/images/courses/defi-clmm-liquidity.jpg");
  });

  it("has 2 modules with 8 total lessons", () => {
    expect(defiClmmLiquidityCourse.modules).toHaveLength(2);
    const totalLessons = defiClmmLiquidityCourse.modules.reduce(
      (sum, m) => sum + m.lessons.length,
      0,
    );
    expect(totalLessons).toBe(8);
  });

  it("has correct XP distribution", () => {
    const totalLessonXP = defiClmmLiquidityCourse.modules
      .flatMap((m) => m.lessons)
      .reduce((sum, l) => sum + l.xpReward, 0);
    expect(totalLessonXP).toBe(defiClmmLiquidityCourse.totalXP);
  });

  it("has 3 challenge lessons", () => {
    const challenges = defiClmmLiquidityCourse.modules
      .flatMap((m) => m.lessons)
      .filter((l) => l.type === "challenge");
    expect(challenges).toHaveLength(3);
    expect(challenges.map((c) => c.id)).toEqual([
      "clmm-v2-tick-math",
      "clmm-v2-position-fees",
      "clmm-v2-position-report",
    ]);
  });

  it("has content lessons with blocks and sufficient content", () => {
    const contentLessons = defiClmmLiquidityCourse.modules
      .flatMap((m) => m.lessons)
      .filter((l) => l.type === "content");
    expect(contentLessons.length).toBe(5);
    for (const lesson of contentLessons) {
      expect(lesson.content.length).toBeGreaterThan(500);
      expect(lesson.blocks).toBeDefined();
      expect(lesson.blocks!.length).toBeGreaterThan(0);
      expect(lesson.xpReward).toBeGreaterThan(0);
      expect(lesson.duration).toBeDefined();
    }
  });
});
