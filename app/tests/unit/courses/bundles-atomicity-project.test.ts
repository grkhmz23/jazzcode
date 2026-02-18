import { describe, expect, it } from "vitest";
import {
  buildAtomicFlow,
  composeBundle,
  flowSafetyReport,
  validateAtomicity,
} from "@/lib/courses/bundles-atomicity/project/atomicity";
import {
  createDefaultBundlesAtomicityLocalState,
  migrateBundlesAtomicityLocalState,
} from "@/lib/courses/bundles-atomicity/local-state";

describe("bundles atomicity project", () => {
  it("builds normalized flow", () => {
    const flow = buildAtomicFlow([
      { id: "swap", kind: "swap", dependsOn: ["approve"], idempotent: true },
      { id: "approve", kind: "approval", dependsOn: [], idempotent: true },
      { id: "refund", kind: "refund", dependsOn: ["swap"], idempotent: true },
    ]);
    expect(flow.steps[0].id).toBe("approve");
    expect(flow.edges).toHaveLength(2);
  });

  it("detects non-atomic issues", () => {
    const flow = buildAtomicFlow([
      { id: "approve", kind: "approval", dependsOn: [], idempotent: true },
      { id: "swap", kind: "swap", dependsOn: ["approve"], idempotent: false },
    ]);
    const issues = validateAtomicity(flow);
    expect(issues.some((issue) => issue.code === "missing-refund")).toBe(true);
    expect(issues.some((issue) => issue.code === "partial-execution-risk")).toBe(true);
  });

  it("composes deterministic bundle and report", () => {
    const flow = buildAtomicFlow([
      { id: "approve", kind: "approval", dependsOn: [], idempotent: true },
      { id: "swap", kind: "swap", dependsOn: ["approve"], idempotent: true },
      { id: "refund", kind: "refund", dependsOn: ["swap"], idempotent: true },
    ]);
    const bundle = composeBundle(flow);
    expect(bundle.bundleId).toBe("bundle-3-steps");
    expect(flowSafetyReport(flow)).toContain("# Flow Safety Report");
  });

  it("throws on duplicate IDs", () => {
    expect(() =>
      buildAtomicFlow([
        { id: "x", kind: "swap", dependsOn: [], idempotent: true },
        { id: "x", kind: "refund", dependsOn: [], idempotent: true },
      ]),
    ).toThrow();
  });

  it("migrates local state", () => {
    const state = migrateBundlesAtomicityLocalState({ completedLessonIds: ["l1", "l1"], lastBundleJson: "{}" });
    expect(state.version).toBe(2);
    expect(state.completedLessonIds).toEqual(["l1"]);
    expect(createDefaultBundlesAtomicityLocalState().lastFlowReportMarkdown).toBeNull();
  });
});
