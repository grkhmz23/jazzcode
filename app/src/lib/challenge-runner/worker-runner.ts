import { runChallengeTests } from "@/lib/challenge-runner";

export interface RunnerTestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface RunnerResult {
  success: boolean;
  testResults: Array<{
    testId: string;
    testName: string;
    passed: boolean;
    actual: string;
    expected: string;
    error: string | null;
  }>;
  output: string;
  error: string | null;
  executionTimeMs: number;
}

export async function runChallenge(
  code: string,
  testCases: RunnerTestCase[],
  timeoutMs = 5000
): Promise<RunnerResult> {
  const result = await runChallengeTests(
    code,
    testCases.map((testCase) => ({
      name: testCase.name,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
    })),
    timeoutMs
  );

  return {
    success: result.allPassed,
    testResults: result.testResults.map((entry, index) => ({
      testId: testCases[index]?.id ?? `test-${index + 1}`,
      testName: entry.name,
      passed: entry.passed,
      actual: entry.actualOutput,
      expected: entry.expectedOutput,
      error: entry.error,
    })),
    output: result.testResults.flatMap((entry) => entry.logs).join("\n"),
    error: result.error,
    executionTimeMs: result.totalTime,
  };
}
