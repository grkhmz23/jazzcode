import { describe, expect, it } from "vitest";
import { runChallengeInSandbox } from "@/lib/challenge-runner/sandbox";

describe("challenge sandbox security", () => {
  it("blocks fetch usage", async () => {
    const result = await runChallengeInSandbox(
      "function run(){ return fetch('https://example.com'); }",
      [{ name: "fetch", input: "[]", expectedOutput: "" }],
      500
    );

    expect(result.allPassed).toBe(false);
    expect(result.error).toContain("fetch() is not allowed");
  });

  it("blocks Function constructor escape patterns", async () => {
    const result = await runChallengeInSandbox(
      "function run(){ return ({}).constructor('return 1')(); }",
      [{ name: "constructor", input: "[]", expectedOutput: "1" }],
      500
    );

    expect(result.allPassed).toBe(false);
    expect(result.error).toContain("Constructor escape pattern");
  });

  it("terminates infinite loops with timeout", async () => {
    const result = await runChallengeInSandbox(
      "function run(){ while(true){} }",
      [{ name: "timeout", input: "[]", expectedOutput: "" }],
      50
    );

    expect(result.allPassed).toBe(false);
    expect(result.testResults[0]?.error?.toLowerCase()).toContain("timed out");
  });

  it("captures output correctly", async () => {
    const result = await runChallengeInSandbox(
      "function run(input){ return input.value + 2; }",
      [{ name: "ok", input: '{"value":40}', expectedOutput: "42" }],
      200
    );

    expect(result.allPassed).toBe(true);
    expect(result.testResults[0]?.actualOutput).toBe("42");
  });
});
