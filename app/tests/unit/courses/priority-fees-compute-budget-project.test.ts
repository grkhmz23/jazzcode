import { describe, expect, it } from "vitest";
import {
  estimatePriorityFee,
  feePlanSummary,
  planComputeBudget,
} from "@/lib/courses/priority-fees-compute-budget/project/fee-planner";
import {
  createDefaultPriorityFeesComputeBudgetLocalState,
  migratePriorityFeesComputeBudgetLocalState,
} from "@/lib/courses/priority-fees-compute-budget/local-state";

describe("priority fees compute budget project", () => {
  it("plans compute budget deterministically", () => {
    expect(planComputeBudget({ estimatedInstructionCus: [30_000, 20_000], txSizeBytes: 600 })).toEqual({
      units: 80_000,
      heapBytes: undefined,
      reason: "safety-margin compute plan for standard transaction footprint",
    });
  });

  it("estimates priority fee with volatility handling", () => {
    const estimate = estimatePriorityFee(
      [500, 700, 900, 2_000, 4_000],
      { minMicroLamports: 400, maxMicroLamports: 10_000, targetPercentile: 75, volatilityGuardBps: 3_000 },
    );
    expect(estimate.microLamports).toBe(2200);
    expect(estimate.warnings).toContain("volatility guard applied (+10%)");
  });

  it("creates stable summary outputs", () => {
    const summary = feePlanSummary({
      computePlan: { units: 220_000, reason: "policy" },
      priorityFee: { microLamports: 1800, confidence: "medium", warnings: [] },
      confirmationLevel: "confirmed",
    });
    expect(summary.json).toBe(
      '{"computePlan":{"reason":"policy","units":220000},"confirmationLevel":"confirmed","priorityFee":{"confidence":"medium","microLamports":1800,"warnings":[]}}',
    );
    expect(summary.markdown).toContain("# Fee Optimizer Report");
  });

  it("throws on invalid compute inputs", () => {
    expect(() => planComputeBudget({ estimatedInstructionCus: [], txSizeBytes: 100 })).toThrow();
  });

  it("migrates local state", () => {
    const migrated = migratePriorityFeesComputeBudgetLocalState({
      completedLessonIds: ["a", "a", "b"],
      lastFeePlanJson: "{}",
      lastPolicyName: "standard",
    });
    expect(migrated.version).toBe(2);
    expect(migrated.completedLessonIds).toEqual(["a", "b"]);
    expect(createDefaultPriorityFeesComputeBudgetLocalState().lastFeePlanJson).toBeNull();
  });
});
