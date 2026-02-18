import { describe, expect, it } from "vitest";
import { defiLendingRiskCourse } from "@/lib/data/courses/defi-lending-risk";

describe("defi lending risk course structure", () => {
  it("has correct metadata", () => {
    expect(defiLendingRiskCourse.id).toBe("course-defi-lending-risk");
    expect(defiLendingRiskCourse.slug).toBe("defi-lending-risk");
    expect(defiLendingRiskCourse.title).toBe("Lending & Liquidation Risk");
    expect(defiLendingRiskCourse.difficulty).toBe("advanced");
    expect(defiLendingRiskCourse.tags).toContain("lending");
    expect(defiLendingRiskCourse.imageUrl).toBe("/images/courses/defi-lending-risk.jpg");
  });

  it("has 2 modules with 8 total lessons", () => {
    expect(defiLendingRiskCourse.modules).toHaveLength(2);
    const totalLessons = defiLendingRiskCourse.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    expect(totalLessons).toBe(8);
  });

  it("has correct XP distribution", () => {
    const totalLessonXP = defiLendingRiskCourse.modules.flatMap((m) => m.lessons).reduce((sum, l) => sum + l.xpReward, 0);
    expect(totalLessonXP).toBe(defiLendingRiskCourse.totalXP);
  });

  it("has 3 challenge lessons", () => {
    const challenges = defiLendingRiskCourse.modules.flatMap((m) => m.lessons).filter((l) => l.type === "challenge");
    expect(challenges).toHaveLength(3);
    expect(challenges.map((c) => c.id)).toEqual(["lending-v2-interest-rates", "lending-v2-health-factor", "lending-v2-risk-report"]);
  });

  it("has content lessons with blocks and sufficient content", () => {
    const contentLessons = defiLendingRiskCourse.modules.flatMap((m) => m.lessons).filter((l) => l.type === "content");
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
