import { describe, expect, it } from "vitest";
import { solanaMobileSigningCourse } from "@/lib/data/courses/solana-mobile-signing";

describe("solana mobile signing course structure", () => {
  it("has correct metadata", () => {
    expect(solanaMobileSigningCourse.id).toBe("course-solana-mobile-signing");
    expect(solanaMobileSigningCourse.slug).toBe("solana-mobile-signing");
    expect(solanaMobileSigningCourse.title).toBe("Solana Mobile Signing");
    expect(solanaMobileSigningCourse.difficulty).toBe("intermediate");
    expect(solanaMobileSigningCourse.tags).toContain("mobile");
    expect(solanaMobileSigningCourse.tags).toContain("signing");
    expect(solanaMobileSigningCourse.imageUrl).toBe("/images/courses/solana-mobile-signing.jpg");
  });

  it("has 2 modules with 8 total lessons", () => {
    expect(solanaMobileSigningCourse.modules).toHaveLength(2);
    const totalLessons = solanaMobileSigningCourse.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    expect(totalLessons).toBe(8);
  });

  it("has correct XP distribution", () => {
    const totalLessonXP = solanaMobileSigningCourse.modules.flatMap((m) => m.lessons).reduce((sum, l) => sum + l.xpReward, 0);
    expect(totalLessonXP).toBe(solanaMobileSigningCourse.totalXP);
  });

  it("has 3 challenge lessons", () => {
    const challenges = solanaMobileSigningCourse.modules.flatMap((m) => m.lessons).filter((l) => l.type === "challenge");
    expect(challenges).toHaveLength(3);
    expect(challenges.map((c) => c.id)).toEqual(["mobilesign-v2-sign-request", "mobilesign-v2-session-persist", "mobilesign-v2-session-report"]);
  });

  it("has content lessons with blocks and sufficient content", () => {
    const contentLessons = solanaMobileSigningCourse.modules.flatMap((m) => m.lessons).filter((l) => l.type === "content");
    expect(contentLessons.length).toBe(5);
    for (const lesson of contentLessons) {
      expect(lesson.content.length).toBeGreaterThan(500);
      expect(lesson.blocks).toBeDefined();
      expect(lesson.blocks!.length).toBeGreaterThan(0);
    }
  });
});
