import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const result = computeInterestRates(input);
  return JSON.stringify(result);
}

function computeInterestRates(input) {
  // TODO: Implement utilization-based interest rate model
  // 1. Calculate utilization ratio = totalBorrowed / totalSupply
  // 2. Apply kink model: below kink use base slope, above kink use jump slope
  // 3. Compute borrow rate and supply rate
  // 4. Return all computed values
  return {
    utilizationRate: "0",
    borrowRate: "0",
    supplyRate: "0",
    isAboveKink: false,
  };
}
`;

export const lesson4SolutionCode = `function run(input) {
  const result = computeInterestRates(input);
  return JSON.stringify(result);
}

function computeInterestRates(input) {
  var totalSupply = Number(input.totalSupply);
  var totalBorrowed = Number(input.totalBorrowed);
  var baseRate = Number(input.baseRate);
  var slope1 = Number(input.slope1);
  var slope2 = Number(input.slope2);
  var kink = Number(input.kink);
  var reserveFactor = Number(input.reserveFactor);

  if (totalSupply === 0) {
    return {
      utilizationRate: "0.000000",
      borrowRate: baseRate.toFixed(6),
      supplyRate: "0.000000",
      isAboveKink: false,
    };
  }

  var utilization = totalBorrowed / totalSupply;
  var isAboveKink = utilization > kink;

  var borrowRate;
  if (utilization <= kink) {
    borrowRate = baseRate + (utilization / kink) * slope1;
  } else {
    var excessUtil = utilization - kink;
    var maxExcess = 1 - kink;
    borrowRate = baseRate + slope1 + (excessUtil / maxExcess) * slope2;
  }

  var supplyRate = borrowRate * utilization * (1 - reserveFactor);

  return {
    utilizationRate: utilization.toFixed(6),
    borrowRate: borrowRate.toFixed(6),
    supplyRate: supplyRate.toFixed(6),
    isAboveKink: isAboveKink,
  };
}
`;

export const lesson4Hints: string[] = [
  "Utilization = totalBorrowed / totalSupply. Handle the zero-supply edge case.",
  "Below kink: borrowRate = baseRate + (utilization/kink) * slope1.",
  "Above kink: borrowRate = baseRate + slope1 + ((util - kink)/(1 - kink)) * slope2.",
  "Supply rate = borrowRate * utilization * (1 - reserveFactor).",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "calculates rates below kink",
    input: JSON.stringify({
      totalSupply: "10000000",
      totalBorrowed: "5000000",
      baseRate: 0.02,
      slope1: 0.10,
      slope2: 1.00,
      kink: 0.80,
      reserveFactor: 0.10,
    }),
    expectedOutput: '{"utilizationRate":"0.500000","borrowRate":"0.082500","supplyRate":"0.037125","isAboveKink":false}',
  },
  {
    name: "calculates rates above kink",
    input: JSON.stringify({
      totalSupply: "10000000",
      totalBorrowed: "9000000",
      baseRate: 0.02,
      slope1: 0.10,
      slope2: 1.00,
      kink: 0.80,
      reserveFactor: 0.10,
    }),
    expectedOutput: '{"utilizationRate":"0.900000","borrowRate":"0.620000","supplyRate":"0.502200","isAboveKink":true}',
  },
  {
    name: "handles zero supply",
    input: JSON.stringify({
      totalSupply: "0",
      totalBorrowed: "0",
      baseRate: 0.02,
      slope1: 0.10,
      slope2: 1.00,
      kink: 0.80,
      reserveFactor: 0.10,
    }),
    expectedOutput: '{"utilizationRate":"0.000000","borrowRate":"0.020000","supplyRate":"0.000000","isAboveKink":false}',
  },
];
