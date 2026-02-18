import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const parsed = JSON.parse(input);
  const totalBatches = Math.ceil(parsed.accountCount / parsed.batchSize);
  return JSON.stringify({
    fromVersion: parsed.fromVersion,
    toVersion: parsed.toVersion,
    totalBatches,
    requiresMigration: parsed.toVersion > parsed.fromVersion,
  });
}
`;

export const lesson4SolutionCode = lesson4StarterCode;

export const lesson4Hints: string[] = [
  "Use Math.ceil(accountCount / batchSize) for deterministic batch count.",
  "requiresMigration should be true only when toVersion > fromVersion.",
  "Return only stable scalar fields for exact JSON comparisons.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "migration required",
    input: JSON.stringify({ fromVersion: 1, toVersion: 3, accountCount: 41, batchSize: 10 }),
    expectedOutput: '{"fromVersion":1,"toVersion":3,"totalBatches":5,"requiresMigration":true}',
  },
  {
    name: "no migration",
    input: JSON.stringify({ fromVersion: 2, toVersion: 2, accountCount: 0, batchSize: 50 }),
    expectedOutput: '{"fromVersion":2,"toVersion":2,"totalBatches":0,"requiresMigration":false}',
  },
];
