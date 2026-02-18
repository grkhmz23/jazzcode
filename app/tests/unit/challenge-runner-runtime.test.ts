import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { runChallengeTests } from "@/lib/challenge-runner";

interface MockWorkerMessage {
  type: string;
  results?: Array<{
    name: string;
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
    logs: string[];
    executionTime: number;
    error: string | null;
  }>;
  error?: string;
}

class MockWorker {
  static responder: ((payload: unknown) => MockWorkerMessage) | null = null;

  onmessage: ((event: MessageEvent<MockWorkerMessage>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;

  postMessage(payload: unknown): void {
    try {
      const message = MockWorker.responder?.(payload);
      if (message && this.onmessage) {
        this.onmessage({ data: message } as MessageEvent<MockWorkerMessage>);
      }
    } catch (error) {
      if (this.onerror) {
        this.onerror({
          message: error instanceof Error ? error.message : String(error),
        } as ErrorEvent);
      }
    }
  }

  terminate(): void {}
}

describe("challenge runner runtime integration", () => {
  const originalWorker = globalThis.Worker;

  beforeEach(() => {
    MockWorker.responder = null;
    globalThis.Worker = MockWorker as unknown as typeof Worker;
  });

  afterEach(() => {
    globalThis.Worker = originalWorker;
    vi.restoreAllMocks();
  });

  it("returns passed run results from worker", async () => {
    MockWorker.responder = () => ({
      type: "results",
      results: [
        {
          name: "case",
          passed: true,
          actualOutput: "ok",
          expectedOutput: "ok",
          logs: [],
          executionTime: 2,
          error: null,
        },
      ],
    });

    const result = await runChallengeTests("function run(input){ return 'ok'; }", [
      { name: "case", input: "\"x\"", expectedOutput: "ok" },
    ]);

    expect(result.allPassed).toBe(true);
    expect(result.error).toBeNull();
    expect(result.testResults).toHaveLength(1);
    expect(result.testResults[0]?.passed).toBe(true);
  });

  it("returns actionable error when worker reports no test results", async () => {
    MockWorker.responder = () => ({ type: "results", results: [] });

    const result = await runChallengeTests("function run(input){ return input; }", [
      { name: "case", input: "\"x\"", expectedOutput: "x" },
    ]);

    expect(result.error).toContain("Runner returned no test results");
    expect(result.testResults).toHaveLength(0);
  });

  it("surfaces worker crash errors", async () => {
    MockWorker.responder = () => {
      throw new Error("Worker crashed");
    };

    const result = await runChallengeTests("function run(input){ return input; }", [
      { name: "case", input: "\"x\"", expectedOutput: "x" },
    ]);

    expect(result.allPassed).toBe(false);
    expect(result.error).toContain("Worker crashed");
  });
});
