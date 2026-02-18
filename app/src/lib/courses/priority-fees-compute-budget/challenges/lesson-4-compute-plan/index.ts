import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const plan = planComputeBudget(input);
  return JSON.stringify(plan);
}

function planComputeBudget(input) {
  const estimatedInstructionCus = input.estimatedInstructionCus || [];
  const txSizeBytes = Number(input.txSizeBytes || 0);

  if (!Array.isArray(estimatedInstructionCus) || estimatedInstructionCus.length === 0) {
    throw new Error("estimatedInstructionCus must be non-empty");
  }

  const total = estimatedInstructionCus.reduce((sum, value) => sum + Number(value), 0);
  const units = Math.min(1400000, Math.max(80000, Math.ceil(total * 1.1)));
  const needsHeap = txSizeBytes > 1000 || total > 500000;

  return {
    units,
    heapBytes: needsHeap ? 262144 : undefined,
    reason: needsHeap ? "safety-margin compute plan with heap for large transaction footprint" : "safety-margin compute plan for standard transaction footprint",
  };
}
`;

export const lesson4SolutionCode = lesson4StarterCode;

export const lesson4Hints: string[] = [
  "Compute units should be ceil(total CU * 1.1) with a floor of 80k and max of 1.4M.",
  "Enable heapBytes for very large tx payloads or high CU totals.",
  "Return a deterministic reason string for test stability.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "plans standard transaction",
    input: JSON.stringify({ estimatedInstructionCus: [30000, 20000], txSizeBytes: 700 }),
    expectedOutput:
      '{"units":80000,"reason":"safety-margin compute plan for standard transaction footprint"}',
  },
  {
    name: "plans large transaction with heap",
    input: JSON.stringify({ estimatedInstructionCus: [260000, 250000], txSizeBytes: 1200 }),
    expectedOutput:
      '{"units":561000,"heapBytes":262144,"reason":"safety-margin compute plan with heap for large transaction footprint"}',
  },
];
