import { describe, expect, it } from "vitest";
import { defiSwapAggregatorCourse } from "@/lib/data/courses/defi-swap-aggregator";

describe("defi swap aggregator course structure", () => {
  it("has correct metadata", () => {
    expect(defiSwapAggregatorCourse.id).toBe("course-defi-swap-aggregator");
    expect(defiSwapAggregatorCourse.slug).toBe("defi-swap-aggregator");
    expect(defiSwapAggregatorCourse.title).toBe("DeFi Swap Aggregation");
    expect(defiSwapAggregatorCourse.difficulty).toBe("intermediate");
    expect(defiSwapAggregatorCourse.duration).toBe("12 hours");
    expect(defiSwapAggregatorCourse.tags).toContain("defi");
    expect(defiSwapAggregatorCourse.tags).toContain("swap");
    expect(defiSwapAggregatorCourse.imageUrl).toBe("/images/courses/defi-swap-aggregator.jpg");
  });

  it("has 2 modules with 8 total lessons", () => {
    expect(defiSwapAggregatorCourse.modules).toHaveLength(2);
    const totalLessons = defiSwapAggregatorCourse.modules.reduce(
      (sum, m) => sum + m.lessons.length,
      0,
    );
    expect(totalLessons).toBe(8);
  });

  it("has correct XP distribution", () => {
    const totalLessonXP = defiSwapAggregatorCourse.modules
      .flatMap((m) => m.lessons)
      .reduce((sum, l) => sum + l.xpReward, 0);
    expect(totalLessonXP).toBe(defiSwapAggregatorCourse.totalXP);
  });

  it("has 3 challenge lessons", () => {
    const challenges = defiSwapAggregatorCourse.modules
      .flatMap((m) => m.lessons)
      .filter((l) => l.type === "challenge");
    expect(challenges).toHaveLength(3);
    expect(challenges.map((c) => c.id)).toEqual([
      "swap-v2-swap-plan",
      "swap-v2-state-machine",
      "swap-v2-swap-report",
    ]);
  });

  it("has content lessons with blocks and sufficient content", () => {
    const contentLessons = defiSwapAggregatorCourse.modules
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
