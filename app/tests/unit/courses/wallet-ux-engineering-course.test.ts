import { describe, expect, it } from "vitest";
import { walletUxEngineeringCourse } from "@/lib/data/courses/wallet-ux-engineering";

describe("wallet ux engineering course structure", () => {
  it("has correct metadata", () => {
    expect(walletUxEngineeringCourse.id).toBe("course-wallet-ux-engineering");
    expect(walletUxEngineeringCourse.slug).toBe("wallet-ux-engineering");
    expect(walletUxEngineeringCourse.difficulty).toBe("intermediate");
    expect(walletUxEngineeringCourse.tags).toContain("wallet");
  });

  it("has 2 modules with 8 total lessons", () => {
    expect(walletUxEngineeringCourse.modules).toHaveLength(2);
    expect(walletUxEngineeringCourse.modules.reduce((s, m) => s + m.lessons.length, 0)).toBe(8);
  });

  it("has correct XP", () => {
    expect(walletUxEngineeringCourse.modules.flatMap(m => m.lessons).reduce((s, l) => s + l.xpReward, 0)).toBe(walletUxEngineeringCourse.totalXP);
  });

  it("has 3 challenges", () => {
    const ch = walletUxEngineeringCourse.modules.flatMap(m => m.lessons).filter(l => l.type === "challenge");
    expect(ch).toHaveLength(3);
    expect(ch.map(c => c.id)).toEqual(["walletux-v2-connection-state", "walletux-v2-cache-invalidation", "walletux-v2-ux-report"]);
  });

  it("has content with blocks", () => {
    const cl = walletUxEngineeringCourse.modules.flatMap(m => m.lessons).filter(l => l.type === "content");
    expect(cl.length).toBe(5);
    for (const l of cl) {
      expect(l.content.length).toBeGreaterThan(500);
      expect(l.blocks!.length).toBeGreaterThan(0);
    }
  });
});
