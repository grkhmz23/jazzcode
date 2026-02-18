import { describe, expect, it } from "vitest";
import {
  applyWithConfirmations,
  dedupeEvents,
  pipelineReport,
  snapshotIntegrityCheck,
} from "@/lib/courses/indexing-webhooks-pipelines/project/pipeline";
import {
  createDefaultIndexingWebhooksPipelinesLocalState,
  migrateIndexingWebhooksPipelinesLocalState,
} from "@/lib/courses/indexing-webhooks-pipelines/local-state";

describe("indexing webhooks pipelines project", () => {
  it("dedupes and applies with confirmations", () => {
    const snapshot = applyWithConfirmations(
      [
        { slot: 100, txSignature: "sig1", instructionIndex: 0, account: "alice", kind: "deposit", amount: 10 },
        { slot: 100, txSignature: "sig1", instructionIndex: 0, account: "alice", kind: "deposit", amount: 10 },
        { slot: 102, txSignature: "sig2", instructionIndex: 0, account: "alice", kind: "withdraw", amount: 2 },
      ],
      { headSlot: 105, minConfirmedDepth: 2, minFinalizedDepth: 5 },
    );
    expect(snapshot.balances.alice).toBe(8);
    expect(dedupeEvents([
      { slot: 1, txSignature: "a", instructionIndex: 0, account: "x", kind: "deposit", amount: 1 },
      { slot: 1, txSignature: "a", instructionIndex: 0, account: "x", kind: "deposit", amount: 1 },
    ])).toHaveLength(1);
  });

  it("flags integrity issues", () => {
    const result = snapshotIntegrityCheck({
      balances: { alice: -2 },
      appliedEventKeys: ["a"],
      pendingEventKeys: [],
      finalizedEventKeys: ["b"],
      headSlot: 9,
    });
    expect(result.ok).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it("produces report output", () => {
    const report = pipelineReport({
      balances: { alice: 5 },
      appliedEventKeys: ["a"],
      pendingEventKeys: [],
      finalizedEventKeys: ["a"],
      headSlot: 200,
    });
    expect(report).toContain("# Reorg-Safe Pipeline Report");
  });

  it("throws for invalid confirmation rules", () => {
    expect(() =>
      applyWithConfirmations([], { headSlot: 10, minConfirmedDepth: 5, minFinalizedDepth: 2 }),
    ).toThrow();
  });

  it("migrates local state", () => {
    const state = migrateIndexingWebhooksPipelinesLocalState({ completedLessonIds: ["l1", "l1"] });
    expect(state.version).toBe(2);
    expect(state.completedLessonIds).toEqual(["l1"]);
    expect(createDefaultIndexingWebhooksPipelinesLocalState().lastSnapshotJson).toBeNull();
  });
});
