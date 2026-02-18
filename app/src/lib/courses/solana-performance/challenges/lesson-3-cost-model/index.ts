import type { TestCase } from "@/types/content";

export const lesson3StarterCode = `function run(input) {
  return JSON.stringify(estimateComputeUnits(input));
}

function estimateComputeUnits(input) {
  // Calculate total compute units based on base cost + variable costs
  // - baseCost: fixed compute units per transaction
  // - perAccountCost: compute units per account accessed
  // - perByteCost: compute units per byte of data
  return {
    baseCost: 0,
    accountsCost: 0,
    dataCost: 0,
    total: 0,
  };
}
`;

export const lesson3SolutionCode = `function run(input) {
  return JSON.stringify(estimateComputeUnits(input));
}

function estimateComputeUnits(input) {
  const BASE_CU = 5000;
  const PER_ACCOUNT_CU = 500;
  const PER_BYTE_CU = 10;

  const accountsCost = input.accountCount * PER_ACCOUNT_CU;
  const dataCost = input.dataBytes * PER_BYTE_CU;
  const total = BASE_CU + accountsCost + dataCost;

  return {
    baseCost: BASE_CU,
    accountsCost,
    dataCost,
    total,
  };
}
`;

export const lesson3Hints: string[] = [
  "Use 5000 as the base compute unit cost per transaction.",
  "Each account accessed adds 500 compute units.",
  "Each byte of data adds 10 compute units.",
  "Total = base + (accounts × 500) + (bytes × 10).",
];

export const lesson3TestCases: TestCase[] = [
  {
    name: "estimates compute units for simple transfer",
    input: JSON.stringify({
      accountCount: 3,
      dataBytes: 32,
    }),
    expectedOutput:
      '{"baseCost":5000,"accountsCost":1500,"dataCost":320,"total":6820}',
  },
  {
    name: "estimates compute units for complex instruction",
    input: JSON.stringify({
      accountCount: 8,
      dataBytes: 256,
    }),
    expectedOutput:
      '{"baseCost":5000,"accountsCost":4000,"dataCost":2560,"total":11560}',
  },
  {
    name: "estimates compute units for minimal transaction",
    input: JSON.stringify({
      accountCount: 1,
      dataBytes: 0,
    }),
    expectedOutput:
      '{"baseCost":5000,"accountsCost":500,"dataCost":0,"total":5500}',
  },
];
