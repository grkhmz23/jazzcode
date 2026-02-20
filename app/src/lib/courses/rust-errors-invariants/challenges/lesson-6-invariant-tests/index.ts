import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  return JSON.stringify(runInvariantCases(input.cases));
}

function runInvariantCases(cases) {
  const failed = [];
  for (const testCase of cases) {
    if (!(testCase.value <= testCase.limit)) {
      failed.push(testCase.id);
    }
  }
  return { total: cases.length, failed };
}
`;

export const lesson6SolutionCode = lesson6StarterCode;

export const lesson6Hints = [
  "Property-ish deterministic tests can still run as fixed case sets.",
  "Return explicit failed IDs for debugability.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "identifies failing invariant cases",
    input: JSON.stringify({ cases: [{ id: "a", value: 3, limit: 5 }, { id: "b", value: 7, limit: 4 }] }),
    expectedOutput: '{"total":2,"failed":["b"]}',
  },
  {
    name: "returns empty failed list when all cases pass",
    input: JSON.stringify({ cases: [{ id: "x", value: 1, limit: 1 }, { id: "y", value: 0, limit: 4 }] }),
    expectedOutput: '{"total":2,"failed":[]}',
  },
];
