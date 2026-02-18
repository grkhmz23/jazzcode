import { describe, expect, it } from "vitest";
import { indexingWebhooksPipelinesCourse } from "@/lib/data/courses/indexing-webhooks-pipelines";

describe("indexing webhooks pipelines course structure", () => {
  it("has correct metadata", () => {
    expect(indexingWebhooksPipelinesCourse.slug).toBe("indexing-webhooks-pipelines");
    expect(indexingWebhooksPipelinesCourse.title).toBe("Indexers, Webhooks & Reorg-Safe Pipelines");
    expect(indexingWebhooksPipelinesCourse.modules).toHaveLength(2);
  });

  it("has 8 total lessons and >=3 challenges", () => {
    const lessons = indexingWebhooksPipelinesCourse.modules.flatMap((module) => module.lessons);
    expect(lessons).toHaveLength(8);
    expect(lessons.filter((lesson) => lesson.type === "challenge").length).toBeGreaterThanOrEqual(3);
  });

  it("has content lessons with >=500 words", () => {
    const contentLessons = indexingWebhooksPipelinesCourse.modules
      .flatMap((module) => module.lessons)
      .filter((lesson) => lesson.type === "content");

    for (const lesson of contentLessons) {
      expect(lesson.content.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(500);
      expect((lesson.blocks ?? []).length).toBeGreaterThan(0);
    }
  });
});
