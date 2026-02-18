import { describe, expect, it } from "vitest";
import { getLessonHints } from "@/components/lessons/challenge-utils";

describe("getLessonHints", () => {
  it("returns normalized hints from canonical hints field", () => {
    const hints = getLessonHints({
      hints: [" first ", "second", "   "],
    });

    expect(hints).toEqual(["first", "second"]);
  });

  it("falls back to legacy hint/help fields", () => {
    expect(getLessonHints({ hint: "single hint" })).toEqual(["single hint"]);
    expect(getLessonHints({ help: ["one", " two "] })).toEqual(["one", "two"]);
  });

  it("returns empty array when no hint field is present", () => {
    expect(getLessonHints({})).toEqual([]);
    expect(getLessonHints(null)).toEqual([]);
  });
});
