import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  return JSON.stringify(optimizeMetrics(input));
}

function optimizeMetrics(input) {
  const before = input.before;
  const after = {
    allocations: Math.max(0, before.allocations - input.reduceAllocationsBy),
    clones: Math.max(0, before.clones - input.reduceClonesBy),
  };
  return {
    before,
    after,
    deltaAllocations: before.allocations - after.allocations,
    deltaClones: before.clones - after.clones,
  };
}
`;

export const lesson5SolutionCode = lesson5StarterCode;

export const lesson5Hints = [
  "Treat optimization as deterministic metric diffs, not runtime benchmarking.",
  "Clamp reduced metrics at zero.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "computes deterministic optimization delta",
    input: JSON.stringify({ before: { allocations: 10, clones: 8 }, reduceAllocationsBy: 3, reduceClonesBy: 5 }),
    expectedOutput:
      '{"before":{"allocations":10,"clones":8},"after":{"allocations":7,"clones":3},"deltaAllocations":3,"deltaClones":5}',
  },
  {
    name: "clamps optimized metrics at zero",
    input: JSON.stringify({ before: { allocations: 2, clones: 1 }, reduceAllocationsBy: 5, reduceClonesBy: 3 }),
    expectedOutput:
      '{"before":{"allocations":2,"clones":1},"after":{"allocations":0,"clones":0},"deltaAllocations":2,"deltaClones":1}',
  },
];
