import { describe, expect, it } from "vitest";
import {
  EvidenceChainBuilder,
  InvariantErrorCode,
  ensure,
  ensureAtMost,
  formatReport,
  invariantAuditReport,
} from "@/lib/courses/rust-errors-invariants/project/invariants";
import {
  createDefaultRustErrorsInvariantsLocalState,
  migrateRustErrorsInvariantsLocalState,
} from "@/lib/courses/rust-errors-invariants/local-state";

describe("rust errors invariants project", () => {
  it("returns typed ensure failures", () => {
    const result = ensure(false, InvariantErrorCode.NegativeValue, { value: -1 }, "invalid");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe(InvariantErrorCode.NegativeValue);
    }
  });

  it("builds deterministic evidence chain and report", () => {
    let now = 100;
    const chain = new EvidenceChainBuilder(() => (now += 10))
      .addPass("a", "check", "ok")
      .addFail("b", "check", "bad")
      .build();
    expect(chain.steps).toHaveLength(2);
    expect(formatReport(chain)).toContain("# Invariant Evidence Report");
    expect(invariantAuditReport(chain).json).toContain("\"steps\"");
  });

  it("validates limit invariants", () => {
    const ok = ensureAtMost(2, 5, "amount");
    const fail = ensureAtMost(9, 5, "amount");
    expect(ok.ok).toBe(true);
    expect(fail.ok).toBe(false);
  });

  it("migrates local state", () => {
    const state = migrateRustErrorsInvariantsLocalState({ completedLessonIds: ["x", "x"] });
    expect(state.version).toBe(2);
    expect(state.completedLessonIds).toEqual(["x"]);
    expect(createDefaultRustErrorsInvariantsLocalState().lastInvariantReportMarkdown).toBeNull();
  });
});
