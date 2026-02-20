import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const result = simulatePositionFees(input);
  return JSON.stringify(result);
}

function simulatePositionFees(input) {
  // TODO: Simulate fee accrual for a CLMM position over a price path
  // 1. Check if each price in the path is within the position range
  // 2. When in-range, accrue fees proportional to volume
  // 3. When out-of-range, no fees accrue
  // 4. Return total fees, time in-range, and status
  return {
    totalFeesToken0: "0",
    totalFeesToken1: "0",
    periodsInRange: 0,
    periodsOutOfRange: 0,
    currentStatus: "unknown",
    feeAPR: "0",
  };
}
`;

export const lesson5SolutionCode = `function run(input) {
  const result = simulatePositionFees(input);
  return JSON.stringify(result);
}

function simulatePositionFees(input) {
  var lowerTick = input.lowerTick;
  var upperTick = input.upperTick;
  var liquidity = BigInt(input.liquidity);
  var pricePath = input.pricePath;
  var feeRate = input.feeRate;
  var volumePerPeriod = input.volumePerPeriod;

  var totalFees0 = BigInt(0);
  var totalFees1 = BigInt(0);
  var inRange = 0;
  var outRange = 0;

  var lowerPrice = Math.pow(1.0001, lowerTick);
  var upperPrice = Math.pow(1.0001, upperTick);

  for (var i = 0; i < pricePath.length; i++) {
    var price = pricePath[i];
    if (price >= lowerPrice && price <= upperPrice) {
      inRange++;
      var feeAmount = BigInt(Math.floor(volumePerPeriod * feeRate));
      totalFees0 = totalFees0 + feeAmount;
      totalFees1 = totalFees1 + BigInt(Math.floor(Number(feeAmount) * price));
    } else {
      outRange++;
    }
  }

  var currentPrice = pricePath[pricePath.length - 1];
  var currentStatus = "out-of-range";
  if (currentPrice >= lowerPrice && currentPrice <= upperPrice) {
    currentStatus = "in-range";
  }

  var totalPeriods = pricePath.length;
  var annualizedMultiplier = totalPeriods > 0 ? (365 / totalPeriods) : 0;
  var feeAPR = liquidity > 0n
    ? ((Number(totalFees0) * annualizedMultiplier) / Number(liquidity) * 100).toFixed(4)
    : "0.0000";

  return {
    totalFeesToken0: totalFees0.toString(),
    totalFeesToken1: totalFees1.toString(),
    periodsInRange: inRange,
    periodsOutOfRange: outRange,
    currentStatus: currentStatus,
    feeAPR: feeAPR,
  };
}
`;

export const lesson5Hints: string[] = [
  "Convert ticks to prices: lowerPrice = 1.0001^lowerTick, upperPrice = 1.0001^upperTick.",
  "For each price in the path, check if lowerPrice <= price <= upperPrice.",
  "Fees only accrue when the position is in range. fee = floor(volumePerPeriod * feeRate).",
  "APR = (totalFees * annualizedMultiplier / liquidity) * 100, formatted to 4 decimal places.",
  "Current status is based on the last price in the path relative to the range.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "fully in-range position accrues fees",
    input: JSON.stringify({
      lowerTick: -1000,
      upperTick: 1000,
      liquidity: "1000000000",
      pricePath: [1.0, 1.01, 0.99, 1.005, 1.0],
      feeRate: 0.003,
      volumePerPeriod: 1000000,
    }),
    expectedOutput: '{"totalFeesToken0":"15000","totalFeesToken1":"15014","periodsInRange":5,"periodsOutOfRange":0,"currentStatus":"in-range","feeAPR":"0.1095"}',
  },
  {
    name: "partially out-of-range position",
    input: JSON.stringify({
      lowerTick: 0,
      upperTick: 500,
      liquidity: "500000000",
      pricePath: [1.0, 1.02, 1.06, 1.03, 0.98],
      feeRate: 0.003,
      volumePerPeriod: 500000,
    }),
    expectedOutput: '{"totalFeesToken0":"4500","totalFeesToken1":"4575","periodsInRange":3,"periodsOutOfRange":2,"currentStatus":"out-of-range","feeAPR":"0.0657"}',
  },
  {
    name: "fully out-of-range position earns no fees",
    input: JSON.stringify({
      lowerTick: 10000,
      upperTick: 20000,
      liquidity: "1000000000",
      pricePath: [1.0, 1.01, 0.99],
      feeRate: 0.003,
      volumePerPeriod: 1000000,
    }),
    expectedOutput: '{"totalFeesToken0":"0","totalFeesToken1":"0","periodsInRange":0,"periodsOutOfRange":3,"currentStatus":"out-of-range","feeAPR":"0.0000"}',
  },
];
