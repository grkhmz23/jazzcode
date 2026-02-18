import type { TestResult } from "@/lib/challenge-runner";

export type ChallengeRunStatus = "idle" | "running" | "passed" | "failed";

export interface ChallengeRunViewState {
  status: ChallengeRunStatus;
  allPassed: boolean;
  error: string | null;
  totalTime: number;
  results: TestResult[];
}

export function createInitialChallengeRunState(): ChallengeRunViewState {
  return {
    status: "idle",
    allPassed: false,
    error: null,
    totalTime: 0,
    results: [],
  };
}

export function createRunningChallengeRunState(
  previous: ChallengeRunViewState
): ChallengeRunViewState {
  return {
    ...previous,
    status: "running",
    error: null,
    results: [],
  };
}

export function createFinishedChallengeRunState(result: {
  allPassed: boolean;
  totalTime: number;
  error: string | null;
  testResults: TestResult[];
}): ChallengeRunViewState {
  const fallbackError =
    result.error ??
    (result.testResults.length === 0
      ? "Runner crashed before returning test results. Please re-run tests."
      : null);

  return {
    status: result.allPassed ? "passed" : "failed",
    allPassed: result.allPassed,
    error: fallbackError,
    totalTime: result.totalTime,
    results: result.testResults,
  };
}
