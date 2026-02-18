import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  const parsed = JSON.parse(input);
  const payload = {
    releaseTag: parsed.releaseTag,
    ready: parsed.issueCount === 0,
    migrationBatches: parsed.totalBatches,
  };

  return JSON.stringify(payload);
}
`;

export const lesson8SolutionCode = lesson8StarterCode;

export const lesson8Hints: string[] = [
  "ready is true only when issueCount equals 0.",
  "Return stable keys in releaseTag, ready, migrationBatches order.",
  "Checkpoint output should be machine-readable deterministic JSON.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "ready release",
    input: JSON.stringify({ releaseTag: "v2.0.0", issueCount: 0, totalBatches: 8 }),
    expectedOutput: '{"releaseTag":"v2.0.0","ready":true,"migrationBatches":8}',
  },
  {
    name: "blocked release",
    input: JSON.stringify({ releaseTag: "v2.0.0-rc1", issueCount: 2, totalBatches: 8 }),
    expectedOutput: '{"releaseTag":"v2.0.0-rc1","ready":false,"migrationBatches":8}',
  },
];
