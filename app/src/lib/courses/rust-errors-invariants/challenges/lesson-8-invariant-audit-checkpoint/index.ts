import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return JSON.stringify(buildCheckpoint(input));
}

function buildCheckpoint(input) {
  return {
    course: "rust-errors-invariants",
    version: 1,
    stepCount: input.stepCount,
    failureCount: input.failureCount,
    status: input.failureCount === 0 ? "PASS" : "FAIL",
  };
}
`;

export const lesson8SolutionCode = lesson8StarterCode;

export const lesson8Hints = [
  "Checkpoint should capture deterministic summary fields only.",
  "No wall-clock timestamps in exported artifact.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "exports deterministic invariant audit checkpoint",
    input: JSON.stringify({ stepCount: 4, failureCount: 1 }),
    expectedOutput:
      '{"course":"rust-errors-invariants","version":1,"stepCount":4,"failureCount":1,"status":"FAIL"}',
  },
];
