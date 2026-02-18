import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { runChallengeTests } from "@/lib/challenge-runner";

describe("challenge runner runtime integration", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns passed run results from sandbox api", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        testResults: [
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
        allPassed: true,
        totalTime: 2,
        error: null,
      }),
    } as Response);

    const result = await runChallengeTests("function run(input){ return 'ok'; }", [
      { name: "case", input: "\"x\"", expectedOutput: "ok" },
    ]);

    expect(result.allPassed).toBe(true);
    expect(result.error).toBeNull();
    expect(result.testResults).toHaveLength(1);
    expect(result.testResults[0]?.passed).toBe(true);
  });

  it("surfaces sandbox api errors", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Execution timed out (2s limit)" }),
    } as Response);

    const result = await runChallengeTests("function run(input){ return input; }", [
      { name: "case", input: "\"x\"", expectedOutput: "x" },
    ]);

    expect(result.error).toContain("timed out");
    expect(result.testResults).toHaveLength(0);
  });
});
