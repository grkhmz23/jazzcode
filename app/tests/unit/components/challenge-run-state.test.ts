import { describe, expect, it } from "vitest";
import {
  createFinishedChallengeRunState,
  createInitialChallengeRunState,
  createRunningChallengeRunState,
} from "@/components/editor/challenge-run-state";

describe("challenge run state", () => {
  it("transitions idle to running", () => {
    const initial = createInitialChallengeRunState();
    const running = createRunningChallengeRunState(initial);

    expect(initial.status).toBe("idle");
    expect(running.status).toBe("running");
    expect(running.error).toBeNull();
    expect(running.results).toEqual([]);
  });

  it("transitions running to passed with result data", () => {
    const finished = createFinishedChallengeRunState({
      allPassed: true,
      totalTime: 120,
      error: null,
      testResults: [
        {
          name: "case 1",
          passed: true,
          actualOutput: "ok",
          expectedOutput: "ok",
          logs: [],
          executionTime: 12,
          error: null,
        },
      ],
    });

    expect(finished.status).toBe("passed");
    expect(finished.totalTime).toBe(120);
    expect(finished.error).toBeNull();
  });

  it("transitions to failed with fallback crash error when runner returns no tests", () => {
    const finished = createFinishedChallengeRunState({
      allPassed: false,
      totalTime: 50,
      error: null,
      testResults: [],
    });

    expect(finished.status).toBe("failed");
    expect(finished.error).toContain("Runner crashed before returning test results");
  });

  it("preserves explicit runner error messages", () => {
    const finished = createFinishedChallengeRunState({
      allPassed: false,
      totalTime: 10,
      error: "Execution timed out",
      testResults: [],
    });

    expect(finished.status).toBe("failed");
    expect(finished.error).toBe("Execution timed out");
  });
});
