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

  it("supports TextEncoder in sandbox", async () => {
    const result = await runChallengeInSandbox(
      "function run(input){ return new TextEncoder().encode(input).length; }",
      [{ name: "text-encoder", input: '"solana"', expectedOutput: "6" }],
      200
    );

    expect(result.allPassed).toBe(true);
  });

  it("supports btoa/atob helpers in sandbox", async () => {
    const result = await runChallengeInSandbox(
      "function run(input){ return atob(btoa(input)); }",
      [{ name: "base64", input: '"academy"', expectedOutput: "academy" }],
      200
    );

    expect(result.allPassed).toBe(true);
  });

  it("retries with raw string input when challenge expects JSON.parse(input)", async () => {
    const result = await runChallengeInSandbox(
      "function run(input){ const parsed = JSON.parse(input); return parsed.value; }",
      [{ name: "json-string", input: '{"value":42}', expectedOutput: "42" }],
      200
    );

    expect(result.allPassed).toBe(true);
  });

  it("passes array as single argument when function arity is 1", async () => {
    const result = await runChallengeInSandbox(
      "function run(input){ return Array.isArray(input) ? input.length : -1; }",
      [{ name: "single-arg-array", input: "[1,2,3]", expectedOutput: "3" }],
      200
    );

    expect(result.allPassed).toBe(true);
  });

  it("spreads array input when function arity is greater than 1", async () => {
    const result = await runChallengeInSandbox(
      "function run(a,b){ return a + b; }",
      [{ name: "spread-array", input: "[2,3]", expectedOutput: "5" }],
      200
    );

    expect(result.allPassed).toBe(true);
  });

  it("treats escaped newline expected output as equivalent to real newlines", async () => {
    const result = await runChallengeInSandbox(
      "function run(){ return 'line1\\nline2'; }",
      [{ name: "escaped-newline", input: "{}", expectedOutput: "line1\\nline2" }],
      200
    );

    expect(result.allPassed).toBe(true);
  });

  it("does not duplicate Error prefix in failed output", async () => {
    const result = await runChallengeInSandbox(
      "function run(){ throw new Error('Counter overflow'); }",
      [{ name: "error-prefix", input: "{}", expectedOutput: "Error: Counter overflow" }],
      200
    );

    expect(result.allPassed).toBe(true);
    expect(result.testResults[0]?.actualOutput).toBe("Error: Counter overflow");
    expect(result.testResults[0]?.error).toBeNull();
  });
});
