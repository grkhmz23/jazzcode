import { describe, expect, it } from "vitest";
import universeFixture from "@/lib/courses/defi-on-solana/project/fixtures/universe.v1.json";
import { enumerateRoutes } from "@/lib/courses/defi-on-solana/project/router/enumerate";
import { pickBestRoute } from "@/lib/courses/defi-on-solana/project/router/best";
import { applySlippage } from "@/lib/courses/defi-on-solana/project/quote/slippage";
import { buildSwapPlan } from "@/lib/courses/defi-on-solana/project/checkpoint/plan";
import { buildSwapSummary } from "@/lib/courses/defi-on-solana/project/checkpoint/summary";

describe("defi checkpoint", () => {
  it("builds stable swap plan and summary", () => {
    const routes = enumerateRoutes(
      universeFixture,
      "So11111111111111111111111111111111111111112",
      "JUP1111111111111111111111111111111111111111",
    );

    const best = pickBestRoute({
      universe: universeFixture,
      routes,
      inAmount: "10000000000",
      mode: "bestOut",
    });

    const minOut = applySlippage(best.quote.outAmount, 50);
    const plan = buildSwapPlan({
      universe: universeFixture,
      inMint: "So11111111111111111111111111111111111111112",
      outMint: "JUP1111111111111111111111111111111111111111",
      inAmount: "10000000000",
      routeQuote: best.quote,
      slippageBps: 50,
    });

    const summary = buildSwapSummary({
      universe: universeFixture,
      routeQuote: best.quote,
      minOut,
    });

    expect(plan.quote.minOut).toBe(minOut);
    expect(plan.quote.outAmount).toBe(best.quote.outAmount);
    expect(plan.determinism.modelVersion).toBe("defi-jupiter-offline-v2");
    expect(plan.determinism.fixtureHash).toMatch(/^[a-f0-9]{64}$/);

    expect(summary.path.length).toBeGreaterThan(1);
    expect(summary.totalFeeAmount).toBe(best.quote.totalFeeAmount);
    expect(summary.invariants.length).toBeGreaterThan(0);

    const stableJson = JSON.stringify({ swapPlan: plan, swapSummary: summary });
    const stableJsonAgain = JSON.stringify({ swapPlan: plan, swapSummary: summary });
    expect(stableJson).toBe(stableJsonAgain);
  });

  it("computes minOut deterministically", () => {
    expect(applySlippage("2882594665", 50)).toBe("2868181691");
  });
});
