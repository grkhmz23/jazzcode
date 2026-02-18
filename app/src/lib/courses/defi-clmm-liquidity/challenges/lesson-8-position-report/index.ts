import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  const report = generatePositionReport(input);
  return JSON.stringify(report);
}

function generatePositionReport(input) {
  // TODO: Generate a comprehensive LP position report
  // 1. Calculate position range in price terms
  // 2. Determine in-range or out-of-range status
  // 3. Compute accumulated fees
  // 4. Include impermanent loss estimate
  // 5. Return the complete report
  return {
    positionId: "",
    pool: "",
    lowerPrice: "0",
    upperPrice: "0",
    currentPrice: "0",
    status: "unknown",
    liquidity: "0",
    totalFeesToken0: "0",
    totalFeesToken1: "0",
    feeAPR: "0",
    impermanentLossPct: "0",
    timestamp: 0,
  };
}
`;

export const lesson8SolutionCode = `function run(input) {
  const report = generatePositionReport(input);
  return JSON.stringify(report);
}

function generatePositionReport(input) {
  var lowerPrice = Math.pow(1.0001, input.lowerTick);
  var upperPrice = Math.pow(1.0001, input.upperTick);
  var currentPrice = input.currentPrice;

  var status = "out-of-range";
  if (currentPrice >= lowerPrice && currentPrice <= upperPrice) {
    status = "in-range";
  }

  var totalFees0 = BigInt(0);
  var totalFees1 = BigInt(0);
  var periods = input.feeHistory || [];
  for (var i = 0; i < periods.length; i++) {
    totalFees0 = totalFees0 + BigInt(periods[i].feesToken0);
    totalFees1 = totalFees1 + BigInt(periods[i].feesToken1);
  }

  var liquidity = BigInt(input.liquidity);
  var annualizedMultiplier = periods.length > 0 ? (365 / periods.length) : 0;
  var feeAPR = liquidity > 0n
    ? ((Number(totalFees0) * annualizedMultiplier) / Number(liquidity) * 100).toFixed(4)
    : "0.0000";

  var entryPrice = input.entryPrice;
  var holdValue = 2 * Math.sqrt(currentPrice * entryPrice);
  var lpValue = Math.sqrt(currentPrice / entryPrice) + Math.sqrt(entryPrice / currentPrice);
  var ilPct = holdValue > 0 ? ((lpValue / holdValue - 1) * 100).toFixed(4) : "0.0000";

  return {
    positionId: input.positionId,
    pool: input.pool,
    lowerPrice: lowerPrice.toFixed(6),
    upperPrice: upperPrice.toFixed(6),
    currentPrice: currentPrice.toFixed(6),
    status: status,
    liquidity: input.liquidity,
    totalFeesToken0: totalFees0.toString(),
    totalFeesToken1: totalFees1.toString(),
    feeAPR: feeAPR,
    impermanentLossPct: ilPct,
    timestamp: input.timestamp,
  };
}
`;

export const lesson8Hints: string[] = [
  "Convert ticks to prices: price = 1.0001^tick. Use toFixed(6) for display.",
  "Status is 'in-range' if lowerPrice <= currentPrice <= upperPrice.",
  "Sum feeHistory entries using BigInt for total fees per token.",
  "IL formula: lpValue = sqrt(priceRatio) + sqrt(1/priceRatio); compare to holdValue = 2*sqrt(priceRatio).",
  "APR = (totalFees * annualizedMultiplier / liquidity) * 100, formatted to 4 decimals.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "generates in-range position report",
    input: JSON.stringify({
      positionId: "pos_abc123",
      pool: "SOL/USDC",
      lowerTick: -1000,
      upperTick: 1000,
      currentPrice: 1.0,
      entryPrice: 1.0,
      liquidity: "1000000000",
      feeHistory: [
        { feesToken0: "5000", feesToken1: "5000" },
        { feesToken0: "3000", feesToken1: "3100" },
      ],
      timestamp: 1700000000,
    }),
    expectedOutput: '{"positionId":"pos_abc123","pool":"SOL/USDC","lowerPrice":"0.904874","upperPrice":"1.105163","currentPrice":"1.000000","status":"in-range","liquidity":"1000000000","totalFeesToken0":"8000","totalFeesToken1":"8100","feeAPR":"146.0000","impermanentLossPct":"0.0000","timestamp":1700000000}',
  },
  {
    name: "generates out-of-range position report with IL",
    input: JSON.stringify({
      positionId: "pos_def456",
      pool: "ETH/USDC",
      lowerTick: 5000,
      upperTick: 10000,
      currentPrice: 1.2,
      entryPrice: 1.8,
      liquidity: "500000000",
      feeHistory: [
        { feesToken0: "1000", feesToken1: "1200" },
      ],
      timestamp: 1700001000,
    }),
    expectedOutput: '{"positionId":"pos_def456","pool":"ETH/USDC","lowerPrice":"1.648616","upperPrice":"2.718146","currentPrice":"1.200000","status":"out-of-range","liquidity":"500000000","totalFeesToken0":"1000","totalFeesToken1":"1200","feeAPR":"73.0000","impermanentLossPct":"-2.0753","timestamp":1700001000}',
  },
];
