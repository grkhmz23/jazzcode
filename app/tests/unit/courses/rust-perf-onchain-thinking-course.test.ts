import { describe, expect, it } from "vitest";
import { rustPerfOnchainThinkingCourse } from "@/lib/data/courses/rust-perf-onchain-thinking";

describe("rust perf onchain thinking course structure", () => {
  it("has expected metadata and module count", () => {
    expect(rustPerfOnchainThinkingCourse.slug).toBe("rust-perf-onchain-thinking");
    expect(rustPerfOnchainThinkingCourse.modules).toHaveLength(2);
  });

  it("has exactly 8 lessons and >=3 challenge lessons", () => {
    const lessons = rustPerfOnchainThinkingCourse.modules.flatMap((module) => module.lessons);
    expect(lessons).toHaveLength(8);
    expect(lessons.filter((lesson) => lesson.type === "challenge").length).toBeGreaterThanOrEqual(3);
  });

  it("keeps all content lessons at or above 500 words", () => {
    const contentLessons = rustPerfOnchainThinkingCourse.modules
      .flatMap((module) => module.lessons)
      .filter((lesson) => lesson.type === "content");

    for (const lesson of contentLessons) {
      expect(lesson.content.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(500);
      expect((lesson.blocks ?? []).length).toBeGreaterThan(0);
    }
  });
});
