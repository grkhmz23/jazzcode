import { describe, expect, it } from "vitest";
import {
  Pipeline,
  buildRetryPolicy,
  pipelineRunReport,
  snapshotReducer,
} from "@/lib/courses/rust-async-indexer-pipeline/project/pipeline";
import {
  createDefaultRustAsyncIndexerPipelineLocalState,
  migrateRustAsyncIndexerPipelineLocalState,
} from "@/lib/courses/rust-async-indexer-pipeline/local-state";

describe("rust async indexer pipeline project", () => {
  it("runs bounded concurrency simulation", () => {
    const result = new Pipeline().run({
      tasks: [
        { id: "a", stage: "ingest", durationTicks: 2 },
        { id: "b", stage: "dedupe", durationTicks: 1 },
      ],
      concurrency: 1,
    });
    expect(result.totalTicks).toBe(3);
    expect(result.completedOrder).toEqual(["a", "b"]);
  });

  it("builds deterministic retry plan and snapshot", () => {
    expect(buildRetryPolicy({ maxRetries: 3, baseDelayTicks: 2, backoff: "exponential", maxDelayTicks: 10 })).toEqual([2, 4, 8]);
    expect(snapshotReducer([{ key: "b", op: "upsert", value: 2 }, { key: "a", op: "upsert", value: 1 }])).toEqual({
      state: { a: 1, b: 2 },
      appliedKeys: ["a", "b"],
    });
  });

  it("reports pipeline results", () => {
    const report = pipelineRunReport({ totalTicks: 2, completedOrder: ["x"], timeline: [{ tick: 1, running: [], completed: ["x"] }] });
    expect(report.markdown).toContain("# Async Pipeline Run Report");
  });

  it("throws on invalid concurrency", () => {
    expect(() => new Pipeline().run({ tasks: [], concurrency: 0 })).toThrow();
  });

  it("migrates local state", () => {
    const state = migrateRustAsyncIndexerPipelineLocalState({ completedLessonIds: ["l", "l"] });
    expect(state.version).toBe(2);
    expect(state.completedLessonIds).toEqual(["l"]);
    expect(createDefaultRustAsyncIndexerPipelineLocalState().lastPipelineReportJson).toBeNull();
  });
});
