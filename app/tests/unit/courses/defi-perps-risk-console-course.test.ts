import { describe, expect, it } from "vitest";
import { defiPerpsRiskConsoleCourse } from "@/lib/data/courses/defi-perps-risk-console";

describe("defi perps risk console course structure", () => {
  it("has correct metadata", () => {
    expect(defiPerpsRiskConsoleCourse.id).toBe("course-defi-perps-risk-console");
    expect(defiPerpsRiskConsoleCourse.slug).toBe("defi-perps-risk-console");
    expect(defiPerpsRiskConsoleCourse.title).toBe("Perps Risk Console");
    expect(defiPerpsRiskConsoleCourse.difficulty).toBe("advanced");
    expect(defiPerpsRiskConsoleCourse.tags).toContain("perps");
    expect(defiPerpsRiskConsoleCourse.imageUrl).toBe("/images/courses/defi-perps-risk-console.jpg");
  });

  it("has 2 modules with 8 total lessons", () => {
    expect(defiPerpsRiskConsoleCourse.modules).toHaveLength(2);
    const totalLessons = defiPerpsRiskConsoleCourse.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    expect(totalLessons).toBe(8);
  });

  it("has correct XP distribution", () => {
    const totalLessonXP = defiPerpsRiskConsoleCourse.modules.flatMap((m) => m.lessons).reduce((sum, l) => sum + l.xpReward, 0);
    expect(totalLessonXP).toBe(defiPerpsRiskConsoleCourse.totalXP);
  });

  it("has 3 challenge lessons", () => {
    const challenges = defiPerpsRiskConsoleCourse.modules.flatMap((m) => m.lessons).filter((l) => l.type === "challenge");
    expect(challenges).toHaveLength(3);
    expect(challenges.map((c) => c.id)).toEqual(["perps-v2-pnl-calc", "perps-v2-funding-accrual", "perps-v2-risk-console-report"]);
  });

  it("has content lessons with blocks and sufficient content", () => {
    const contentLessons = defiPerpsRiskConsoleCourse.modules.flatMap((m) => m.lessons).filter((l) => l.type === "content");
    expect(contentLessons.length).toBe(5);
    for (const lesson of contentLessons) {
      expect(lesson.content.length).toBeGreaterThan(500);
      expect(lesson.blocks).toBeDefined();
      expect(lesson.blocks!.length).toBeGreaterThan(0);
      expect(lesson.xpReward).toBeGreaterThan(0);
    }
  });
});
