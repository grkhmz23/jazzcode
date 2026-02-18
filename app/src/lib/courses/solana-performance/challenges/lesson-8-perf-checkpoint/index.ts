import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return JSON.stringify(buildPerformanceCheckpoint(input));
}

function buildPerformanceCheckpoint(input) {
  // Generate a performance report comparing before/after metrics
  // Calculate savings in compute units, rent, and transaction costs
  return {
    course: "solana-performance",
    version: "v2",
    optimizations: [],
    beforeMetrics: null,
    afterMetrics: null,
    savings: {
      computeUnits: 0,
      rentLamports: 0,
      estimatedCostUsd: "0",
    },
    totalImprovements: 0,
  };
}
`;

export const lesson8SolutionCode = `function run(input) {
  return JSON.stringify(buildPerformanceCheckpoint(input));
}

function buildPerformanceCheckpoint(input) {
  const before = input.beforeMetrics;
  const after = input.afterMetrics;
  
  // Calculate savings
  const cuSaved = before.computeUnits - after.computeUnits;
  const rentSaved = before.rentLamports - after.rentLamports;
  
  // Convert to USD (approximate: 1 SOL = $20, 1 SOL = 1e9 lamports)
  const SOL_PRICE_USD = 20;
  const LAMPORTS_PER_SOL = 1e9;
  const costUsd = (rentSaved * SOL_PRICE_USD / LAMPORTS_PER_SOL).toFixed(6);
  
  // Count improvements
  const improvements = input.optimizations.filter(opt => opt.improved).length;
  
  return {
    course: "solana-performance",
    version: "v2",
    optimizations: input.optimizations.map(o => o.name),
    beforeMetrics: {
      computeUnits: before.computeUnits,
      accountSize: before.accountSize,
      rentLamports: before.rentLamports,
    },
    afterMetrics: {
      computeUnits: after.computeUnits,
      accountSize: after.accountSize,
      rentLamports: after.rentLamports,
    },
    savings: {
      computeUnits: cuSaved,
      rentLamports: rentSaved,
      estimatedCostUsd: costUsd,
    },
    totalImprovements: improvements,
  };
}
`;

export const lesson8Hints: string[] = [
  "Compute savings by subtracting 'after' from 'before' metrics.",
  "Use approximate conversion: 1 SOL = $20, 1 SOL = 1,000,000,000 lamports.",
  "Count only optimizations where improved=true for totalImprovements.",
  "Include course name as 'solana-performance' and version as 'v2'.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "builds checkpoint with multiple optimizations",
    input: JSON.stringify({
      optimizations: [
        { name: "packed-account-layout", improved: true },
        { name: "reduced-account-allocations", improved: true },
        { name: "optimized-cpi-calls", improved: false },
      ],
      beforeMetrics: {
        computeUnits: 50000,
        accountSize: 256,
        rentLamports: 1792000,
      },
      afterMetrics: {
        computeUnits: 35000,
        accountSize: 128,
        rentLamports: 896000,
      },
    }),
    expectedOutput:
      '{"course":"solana-performance","version":"v2","optimizations":["packed-account-layout","reduced-account-allocations","optimized-cpi-calls"],"beforeMetrics":{"computeUnits":50000,"accountSize":256,"rentLamports":1792000},"afterMetrics":{"computeUnits":35000,"accountSize":128,"rentLamports":896000},"savings":{"computeUnits":15000,"rentLamports":896000,"estimatedCostUsd":"0.017920"},"totalImprovements":2}',
  },
  {
    name: "builds checkpoint with no improvements",
    input: JSON.stringify({
      optimizations: [
        { name: "packed-account-layout", improved: false },
      ],
      beforeMetrics: {
        computeUnits: 10000,
        accountSize: 64,
        rentLamports: 448000,
      },
      afterMetrics: {
        computeUnits: 10000,
        accountSize: 64,
        rentLamports: 448000,
      },
    }),
    expectedOutput:
      '{"course":"solana-performance","version":"v2","optimizations":["packed-account-layout"],"beforeMetrics":{"computeUnits":10000,"accountSize":64,"rentLamports":448000},"afterMetrics":{"computeUnits":10000,"accountSize":64,"rentLamports":448000},"savings":{"computeUnits":0,"rentLamports":0,"estimatedCostUsd":"0.000000"},"totalImprovements":0}',
  },
];
