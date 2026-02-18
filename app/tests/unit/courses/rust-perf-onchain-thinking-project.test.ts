import { describe, expect, it } from "vitest";
import {
  CostModel,
  perfReport,
  runBenchmarkCase,
  suggestOptimizations,
} from "@/lib/courses/rust-perf-onchain-thinking/project/perf";
import {
  createDefaultRustPerfOnchainThinkingLocalState,
  migrateRustPerfOnchainThinkingLocalState,
} from "@/lib/courses/rust-perf-onchain-thinking/local-state";

describe("rust perf onchain thinking project", () => {
  it("estimates deterministic costs", () => {
    const estimate = CostModel.estimate({
      allocations: 2,
      clones: 3,
      hashBytes: 64,
      loopIterations: 10,
      mapLookups: 4,
      encodeBytes: 32,
      decodeBytes: 16,
    });
    expect(estimate.totalCost).toBe(143);
  });

  it("runs benchmark and suggestions", () => {
    const metrics = runBenchmarkCase({
      name: "swap-route",
      baseline: { allocations: 8, clones: 9, hashBytes: 256, loopIterations: 90, mapLookups: 30, encodeBytes: 200, decodeBytes: 200 },
      optimized: { allocations: 3, clones: 2, hashBytes: 128, loopIterations: 60, mapLookups: 10, encodeBytes: 120, decodeBytes: 100 },
    });
    expect(metrics.reduction).toBeGreaterThan(0);
    expect(suggestOptimizations(metrics.after).length).toBeGreaterThan(0);
    expect(perfReport(metrics.before, metrics.after).markdown).toContain("# Compute Budget Profiler Report");
  });

  it("throws on negative operation counts", () => {
    expect(() =>
      CostModel.estimate({ allocations: -1, clones: 0, hashBytes: 0, loopIterations: 0, mapLookups: 0, encodeBytes: 0, decodeBytes: 0 }),
    ).toThrow();
  });

  it("migrates local state", () => {
    const state = migrateRustPerfOnchainThinkingLocalState({ completedLessonIds: ["a", "a"] });
    expect(state.version).toBe(2);
    expect(state.completedLessonIds).toEqual(["a"]);
    expect(createDefaultRustPerfOnchainThinkingLocalState().lastPerfReportJson).toBeNull();
  });
});
