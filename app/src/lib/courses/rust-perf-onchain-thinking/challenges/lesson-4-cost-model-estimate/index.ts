import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  return JSON.stringify(estimate(input));
}

function estimate(ops) {
  const allocationsCost = ops.allocations * 18;
  const cloneCost = ops.clones * 8;
  const hashCost = Math.ceil(ops.hashBytes / 32) * 11;
  const loopCost = ops.loopIterations * 2;
  const mapLookupCost = ops.mapLookups * 5;
  const serializationCost = Math.ceil((ops.encodeBytes + ops.decodeBytes) / 16) * 7;
  const totalCost = allocationsCost + cloneCost + hashCost + loopCost + mapLookupCost + serializationCost;
  return { allocationsCost, cloneCost, hashCost, loopCost, mapLookupCost, serializationCost, totalCost };
}
`;

export const lesson4SolutionCode = lesson4StarterCode;

export const lesson4Hints = [
  "Use deterministic arithmetic weights for each operation category.",
  "Return component breakdown plus total for easier optimization diffs.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "estimates operation costs",
    input: JSON.stringify({ allocations: 2, clones: 3, hashBytes: 64, loopIterations: 10, mapLookups: 4, encodeBytes: 32, decodeBytes: 16 }),
    expectedOutput:
      '{"allocationsCost":36,"cloneCost":24,"hashCost":22,"loopCost":20,"mapLookupCost":20,"serializationCost":21,"totalCost":143}',
  },
  {
    name: "returns zero cost for empty workload",
    input: JSON.stringify({ allocations: 0, clones: 0, hashBytes: 0, loopIterations: 0, mapLookups: 0, encodeBytes: 0, decodeBytes: 0 }),
    expectedOutput:
      '{"allocationsCost":0,"cloneCost":0,"hashCost":0,"loopCost":0,"mapLookupCost":0,"serializationCost":0,"totalCost":0}',
  },
];
