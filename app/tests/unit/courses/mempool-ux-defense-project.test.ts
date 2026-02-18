import { describe, expect, it } from "vitest";
import {
  evaluateSwapRisk,
  slippageGuard,
  swapSafetyBanner,
} from "@/lib/courses/mempool-ux-defense/project/policy";
import {
  createDefaultMempoolUxDefenseLocalState,
  migrateMempoolUxDefenseLocalState,
} from "@/lib/courses/mempool-ux-defense/local-state";

describe("mempool ux defense project", () => {
  it("grades risk deterministically", () => {
    const risk = evaluateSwapRisk({
      quoteAgeMs: 30_000,
      slippageBps: 150,
      priceImpactBps: 220,
      routeHops: 3,
      liquidityScore: 20,
    });
    expect(risk.grade).toBe("critical");
    expect(risk.reasons.length).toBeGreaterThan(0);
  });

  it("applies slippage guard and blocking", () => {
    const result = slippageGuard(
      { minBps: 20, maxBps: 150, defaultBps: 50, highImpactBps: 120, staleQuoteMs: 10_000 },
      { quoteAgeMs: 22_000, priceImpactBps: 320, userSelectedBps: 250 },
    );
    expect(result.blocked).toBe(true);
    expect(result.recommendedBps).toBe(50);
  });

  it("maps banners from risk", () => {
    const banner = swapSafetyBanner({ grade: "high", score: 55, reasons: ["x"] });
    expect(banner.severity).toBe("warning");
  });

  it("throws on invalid liquidity score", () => {
    expect(() =>
      evaluateSwapRisk({ quoteAgeMs: 1000, slippageBps: 10, priceImpactBps: 10, routeHops: 1, liquidityScore: 120 }),
    ).toThrow();
  });

  it("migrates local state", () => {
    const migrated = migrateMempoolUxDefenseLocalState({ completedLessonIds: ["a", "a"], lastRiskGrade: "high" });
    expect(migrated.version).toBe(2);
    expect(migrated.completedLessonIds).toEqual(["a"]);
    expect(createDefaultMempoolUxDefenseLocalState().lastProtectionConfigJson).toBeNull();
  });
});
