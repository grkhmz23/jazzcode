import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  return JSON.stringify(compareApproaches(input));
}

function compareApproaches(input) {
  const zeroCopyScore = input.reads * 2 - input.schemaChanges * 6;
  const borshScore = input.reads - input.schemaChanges * 2;
  return {
    zeroCopyScore,
    borshScore,
    recommendation: zeroCopyScore > borshScore ? "zero-copy" : "borsh",
  };
}
`;

export const lesson6SolutionCode = lesson6StarterCode;

export const lesson6Hints = [
  "Model tradeoffs deterministically: read speed vs schema flexibility.",
  "Recommendation should be pure function of inputs.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "prefers borsh when schema churn is high",
    input: JSON.stringify({ reads: 100, schemaChanges: 20 }),
    expectedOutput: '{"zeroCopyScore":80,"borshScore":60,"recommendation":"zero-copy"}',
  },
  {
    name: "recommends borsh when zero-copy score underperforms",
    input: JSON.stringify({ reads: 10, schemaChanges: 5 }),
    expectedOutput: '{"zeroCopyScore":-10,"borshScore":0,"recommendation":"borsh"}',
  },
];
