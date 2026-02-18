import { describe, expect, it } from "vitest";
import { solanaPayCommerceCourse } from "@/lib/data/courses/solana-pay-commerce";

describe("solana pay commerce course structure", () => {
  it("has correct metadata", () => {
    expect(solanaPayCommerceCourse.id).toBe("course-solana-pay-commerce");
    expect(solanaPayCommerceCourse.slug).toBe("solana-pay-commerce");
    expect(solanaPayCommerceCourse.difficulty).toBe("intermediate");
    expect(solanaPayCommerceCourse.tags).toContain("solana-pay");
  });
  it("has 2 modules with 8 total lessons", () => {
    expect(solanaPayCommerceCourse.modules).toHaveLength(2);
    expect(solanaPayCommerceCourse.modules.reduce((s, m) => s + m.lessons.length, 0)).toBe(8);
  });
  it("has correct XP distribution", () => {
    const xp = solanaPayCommerceCourse.modules.flatMap((m) => m.lessons).reduce((s, l) => s + l.xpReward, 0);
    expect(xp).toBe(solanaPayCommerceCourse.totalXP);
  });
  it("has 3 challenge lessons", () => {
    const ch = solanaPayCommerceCourse.modules.flatMap((m) => m.lessons).filter((l) => l.type === "challenge");
    expect(ch).toHaveLength(3);
    expect(ch.map((c) => c.id)).toEqual(["solanapay-v2-encode-transfer", "solanapay-v2-reference-tracker", "solanapay-v2-pos-receipt"]);
  });
  it("has content lessons with blocks and sufficient content", () => {
    const cl = solanaPayCommerceCourse.modules.flatMap((m) => m.lessons).filter((l) => l.type === "content");
    expect(cl.length).toBe(5);
    for (const l of cl) { expect(l.content.length).toBeGreaterThan(500); expect(l.blocks).toBeDefined(); expect(l.blocks!.length).toBeGreaterThan(0); }
  });
});
