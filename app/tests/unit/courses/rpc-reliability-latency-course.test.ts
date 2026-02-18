import { describe, expect, it } from "vitest";
import { rpcReliabilityLatencyCourse } from "@/lib/data/courses/rpc-reliability-latency";

describe("rpc reliability latency course structure", () => {
  it("has correct metadata", () => {
    expect(rpcReliabilityLatencyCourse.slug).toBe("rpc-reliability-latency");
    expect(rpcReliabilityLatencyCourse.title).toBe("RPC Reliability & Latency Engineering");
    expect(rpcReliabilityLatencyCourse.modules).toHaveLength(2);
  });

  it("has 8 total lessons and >=3 challenges", () => {
    const lessons = rpcReliabilityLatencyCourse.modules.flatMap((module) => module.lessons);
    expect(lessons).toHaveLength(8);
    expect(lessons.filter((lesson) => lesson.type === "challenge").length).toBeGreaterThanOrEqual(3);
  });

  it("has content lessons with >=500 words", () => {
    const contentLessons = rpcReliabilityLatencyCourse.modules
      .flatMap((module) => module.lessons)
      .filter((lesson) => lesson.type === "content");

    for (const lesson of contentLessons) {
      expect(lesson.content.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(500);
      expect((lesson.blocks ?? []).length).toBeGreaterThan(0);
    }
  });
});
