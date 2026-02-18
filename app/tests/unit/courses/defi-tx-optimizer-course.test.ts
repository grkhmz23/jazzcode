import { describe, expect, it } from "vitest";
import { defiTxOptimizerCourse } from "@/lib/data/courses/defi-tx-optimizer";

describe("defi tx optimizer course structure", () => {
  it("has correct metadata", () => {
    expect(defiTxOptimizerCourse.id).toBe("course-defi-tx-optimizer");
    expect(defiTxOptimizerCourse.slug).toBe("defi-tx-optimizer");
    expect(defiTxOptimizerCourse.title).toBe("DeFi Transaction Optimizer");
    expect(defiTxOptimizerCourse.difficulty).toBe("advanced");
    expect(defiTxOptimizerCourse.tags).toContain("transactions");
    expect(defiTxOptimizerCourse.imageUrl).toBe("/images/courses/defi-tx-optimizer.jpg");
  });

  it("has 2 modules with 8 total lessons", () => {
    expect(defiTxOptimizerCourse.modules).toHaveLength(2);
    const totalLessons = defiTxOptimizerCourse.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    expect(totalLessons).toBe(8);
  });

  it("has correct XP distribution", () => {
    const totalLessonXP = defiTxOptimizerCourse.modules.flatMap((m) => m.lessons).reduce((sum, l) => sum + l.xpReward, 0);
    expect(totalLessonXP).toBe(defiTxOptimizerCourse.totalXP);
  });

  it("has 3 challenge lessons", () => {
    const challenges = defiTxOptimizerCourse.modules.flatMap((m) => m.lessons).filter((l) => l.type === "challenge");
    expect(challenges).toHaveLength(3);
    expect(challenges.map((c) => c.id)).toEqual(["txopt-v2-tx-plan", "txopt-v2-lut-planner", "txopt-v2-send-strategy"]);
  });

  it("has content lessons with blocks and sufficient content", () => {
    const contentLessons = defiTxOptimizerCourse.modules.flatMap((m) => m.lessons).filter((l) => l.type === "content");
    expect(contentLessons.length).toBe(5);
    for (const lesson of contentLessons) {
      expect(lesson.content.length).toBeGreaterThan(500);
      expect(lesson.blocks).toBeDefined();
      expect(lesson.blocks!.length).toBeGreaterThan(0);
      expect(lesson.xpReward).toBeGreaterThan(0);
    }
  });
});
