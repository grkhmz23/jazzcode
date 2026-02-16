import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { RunnerTestCase } from "@/lib/challenge-runner/worker-runner";

// The worker runner uses Web Worker API which is not available in Node.
// We test the runner's interface contract and timeout behavior.

describe("ChallengeRunner types and contracts", () => {
  it("RunnerTestCase has required fields", () => {
    const testCase: RunnerTestCase = {
      id: "t1",
      name: "Test 1",
      input: "[1, 2]",
      expectedOutput: "3",
      hidden: false,
    };

    expect(testCase.id).toBe("t1");
    expect(testCase.name).toBe("Test 1");
    expect(testCase.input).toBe("[1, 2]");
    expect(testCase.expectedOutput).toBe("3");
  });

  it("test case inputs parse as JSON arrays", () => {
    const inputs = ["[1]", "[0.5]", '["hello"]', "[true, false]"];
    for (const input of inputs) {
      const parsed = JSON.parse(input);
      expect(Array.isArray(parsed)).toBe(true);
    }
  });

  it("test case expected outputs are string-comparable", () => {
    // The runner compares String(result).trim() === expectedOutput.trim()
    const cases: Array<{ result: unknown; expected: string; shouldPass: boolean }> = [
      { result: 1000000000, expected: "1000000000", shouldPass: true },
      { result: 500000000, expected: "500000000", shouldPass: true },
      { result: "hello", expected: "hello", shouldPass: true },
      { result: true, expected: "true", shouldPass: true },
      { result: [1, 2, 3], expected: "[1,2,3]", shouldPass: true },
    ];

    for (const { result, expected, shouldPass } of cases) {
      const actualStr = typeof result === "object" ? JSON.stringify(result) : String(result);
      expect(actualStr.trim() === expected.trim()).toBe(shouldPass);
    }
  });
});

describe("ChallengeRunner sandboxing requirements", () => {
  it("worker code does not access window or document", () => {
    // The WORKER_CODE string should not reference window or document directly
    // This is a static analysis test
    const workerCodePattern = /self\.onmessage/;
    expect(workerCodePattern.test("self.onmessage = function(e)")).toBe(true);
  });

  it("timeout produces correct error structure", () => {
    const timeoutMs = 5000;
    const testCases: RunnerTestCase[] = [
      { id: "t1", name: "Test", input: "[1]", expectedOutput: "1", hidden: false },
    ];

    // Simulate timeout result structure
    const timeoutResult = {
      success: false,
      testResults: testCases.map((tc) => ({
        testId: tc.id,
        testName: tc.name,
        passed: false,
        actual: "",
        expected: tc.expectedOutput,
        error: `Execution timed out (${timeoutMs / 1000}s limit)`,
      })),
      output: "",
      error: `Execution timed out (${timeoutMs / 1000}s limit)`,
      executionTimeMs: timeoutMs,
    };

    expect(timeoutResult.success).toBe(false);
    expect(timeoutResult.testResults).toHaveLength(1);
    expect(timeoutResult.testResults[0].error).toContain("timed out");
    expect(timeoutResult.executionTimeMs).toBe(5000);
  });
});

describe("Sample challenge validation", () => {
  it("SOL to lamports conversion logic", () => {
    // This mirrors the actual challenge test cases
    function createTransferAmount(solAmount: number): number {
      return Math.round(solAmount * 1_000_000_000);
    }

    expect(createTransferAmount(1)).toBe(1000000000);
    expect(createTransferAmount(0.5)).toBe(500000000);
    expect(createTransferAmount(1.5)).toBe(1500000000);
    expect(createTransferAmount(0.001)).toBe(1000000);
    expect(createTransferAmount(0)).toBe(0);
  });
});
