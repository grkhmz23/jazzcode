import { describe, expect, it } from "vitest";
import { anchorUpgradesMigrationsCourse } from "@/lib/data/courses/anchor-upgrades-migrations";

describe("anchor upgrades migrations course structure", () => {
  it("has correct metadata", () => {
    expect(anchorUpgradesMigrationsCourse.slug).toBe("anchor-upgrades-migrations");
    expect(anchorUpgradesMigrationsCourse.title).toBe("Anchor Upgrades & Account Migrations");
    expect(anchorUpgradesMigrationsCourse.modules).toHaveLength(2);
  });

  it("has 8 total lessons and >=3 challenges", () => {
    const lessons = anchorUpgradesMigrationsCourse.modules.flatMap((module) => module.lessons);
    expect(lessons).toHaveLength(8);
    expect(lessons.filter((lesson) => lesson.type === "challenge").length).toBeGreaterThanOrEqual(3);
  });

  it("has content lessons with >=500 words", () => {
    const contentLessons = anchorUpgradesMigrationsCourse.modules
      .flatMap((module) => module.lessons)
      .filter((lesson) => lesson.type === "content");

    for (const lesson of contentLessons) {
      expect(lesson.content.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(500);
      expect((lesson.blocks ?? []).length).toBeGreaterThan(0);
    }
  });
});
