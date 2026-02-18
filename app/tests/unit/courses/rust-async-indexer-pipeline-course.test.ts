import { describe, expect, it } from "vitest";
import { rustAsyncIndexerPipelineCourse } from "@/lib/data/courses/rust-async-indexer-pipeline";

describe("rust async indexer pipeline course structure", () => {
  it("has expected metadata and module count", () => {
    expect(rustAsyncIndexerPipelineCourse.slug).toBe("rust-async-indexer-pipeline");
    expect(rustAsyncIndexerPipelineCourse.modules).toHaveLength(2);
  });

  it("has exactly 8 lessons and >=3 challenge lessons", () => {
    const lessons = rustAsyncIndexerPipelineCourse.modules.flatMap((module) => module.lessons);
    expect(lessons).toHaveLength(8);
    expect(lessons.filter((lesson) => lesson.type === "challenge").length).toBeGreaterThanOrEqual(3);
  });

  it("keeps all content lessons at or above 500 words", () => {
    const contentLessons = rustAsyncIndexerPipelineCourse.modules
      .flatMap((module) => module.lessons)
      .filter((lesson) => lesson.type === "content");

    for (const lesson of contentLessons) {
      expect(lesson.content.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(500);
      expect((lesson.blocks ?? []).length).toBeGreaterThan(0);
    }
  });
});
