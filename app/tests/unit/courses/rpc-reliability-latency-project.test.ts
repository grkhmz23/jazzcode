import { describe, expect, it } from "vitest";
import {
  metricsReducer,
  rpcHealthReport,
  rpcPolicy,
  selectRpcEndpoint,
} from "@/lib/courses/rpc-reliability-latency/project/rpc";
import {
  createDefaultRpcReliabilityLatencyLocalState,
  migrateRpcReliabilityLatencyLocalState,
} from "@/lib/courses/rpc-reliability-latency/local-state";

describe("rpc reliability latency project", () => {
  it("builds retry schedule", () => {
    const schedule = rpcPolicy({
      timeoutMs: 900,
      maxRetries: 2,
      backoff: { kind: "exponential", baseDelayMs: 100, maxDelayMs: 500 },
    });
    expect(schedule).toHaveLength(3);
    expect(schedule[2].delayBeforeAttemptMs).toBe(200);
  });

  it("selects healthiest endpoint", () => {
    const selection = selectRpcEndpoint(
      [
        { id: "a", url: "https://a.example", region: "us-east", weight: 2 },
        { id: "b", url: "https://b.example", region: "us-west", weight: 1 },
      ],
      [
        { endpointId: "a", successRate: 0.96, p95LatencyMs: 140, rateLimitedRatio: 0.01, slotLag: 1 },
        { endpointId: "b", successRate: 0.9, p95LatencyMs: 90, rateLimitedRatio: 0.1, slotLag: 3 },
      ],
    );
    expect(selection.chosen.id).toBe("a");
    expect(selection.reasoning).toContain("selected a");
  });

  it("reduces metrics and exports report", () => {
    const metrics = metricsReducer([
      { latencyMs: 40, ok: true },
      { latencyMs: 120, ok: true },
      { latencyMs: 600, ok: false },
    ]);
    expect(metrics.p95LatencyMs).toBe(600);
    expect(rpcHealthReport(metrics).markdown).toContain("# RPC Health Report");
  });

  it("throws when no endpoints are provided", () => {
    expect(() => selectRpcEndpoint([], [])).toThrow();
  });

  it("migrates local state", () => {
    const state = migrateRpcReliabilityLatencyLocalState({ completedLessonIds: ["a", "a"] });
    expect(state.version).toBe(2);
    expect(state.completedLessonIds).toEqual(["a"]);
    expect(createDefaultRpcReliabilityLatencyLocalState().lastRpcHealthJson).toBeNull();
  });
});
