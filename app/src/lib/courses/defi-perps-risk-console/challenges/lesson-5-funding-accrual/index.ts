import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const result = simulateFundingAccrual(input);
  return JSON.stringify(result);
}

function simulateFundingAccrual(input) {
  // TODO: Simulate funding payments over discrete intervals
  // 1. For each funding period, compute funding payment
  // 2. Longs pay shorts when funding rate is positive
  // 3. Shorts pay longs when funding rate is negative
  // 4. Track cumulative funding paid/received
  return {
    side: "",
    totalFundingPayment: "0",
    periodsProcessed: 0,
    averageFundingRate: "0",
    netMarginImpact: "0",
  };
}
`;

export const lesson5SolutionCode = `function run(input) {
  const result = simulateFundingAccrual(input);
  return JSON.stringify(result);
}

function simulateFundingAccrual(input) {
  var side = input.side;
  var size = Number(input.size);
  var fundingRates = input.fundingRates;
  var entryPrice = Number(input.entryPrice);
  var margin = Number(input.margin);

  var totalFunding = 0;
  var sumRates = 0;

  for (var i = 0; i < fundingRates.length; i++) {
    var rate = Number(fundingRates[i]);
    sumRates += rate;
    var payment = size * entryPrice * rate;

    if (side === "long") {
      totalFunding -= payment;
    } else {
      totalFunding += payment;
    }
  }

  var avgRate = fundingRates.length > 0
    ? (sumRates / fundingRates.length).toFixed(8)
    : "0.00000000";

  var netMarginImpact = margin > 0
    ? (totalFunding / margin * 100).toFixed(4)
    : "0.0000";

  return {
    side: side,
    totalFundingPayment: totalFunding.toFixed(2),
    periodsProcessed: fundingRates.length,
    averageFundingRate: avgRate,
    netMarginImpact: netMarginImpact,
  };
}
`;

export const lesson5Hints: string[] = [
  "Funding payment per period = size * entryPrice * fundingRate.",
  "Longs pay when rate is positive (totalFunding -= payment). Shorts receive.",
  "Average funding rate = sum(rates) / count.",
  "Net margin impact = (totalFunding / margin) * 100, as a percentage.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "long pays positive funding",
    input: JSON.stringify({
      side: "long",
      size: "10",
      entryPrice: "25.00",
      margin: "250.00",
      fundingRates: ["0.0001", "0.0002", "0.0001"],
    }),
    expectedOutput: '{"side":"long","totalFundingPayment":"-0.10","periodsProcessed":3,"averageFundingRate":"0.00013333","netMarginImpact":"-0.0400"}',
  },
  {
    name: "short receives positive funding",
    input: JSON.stringify({
      side: "short",
      size: "10",
      entryPrice: "25.00",
      margin: "250.00",
      fundingRates: ["0.0001", "0.0002", "0.0001"],
    }),
    expectedOutput: '{"side":"short","totalFundingPayment":"0.10","periodsProcessed":3,"averageFundingRate":"0.00013333","netMarginImpact":"0.0400"}',
  },
  {
    name: "negative funding rate benefits longs",
    input: JSON.stringify({
      side: "long",
      size: "20",
      entryPrice: "100.00",
      margin: "2000.00",
      fundingRates: ["-0.0005", "-0.0003"],
    }),
    expectedOutput: '{"side":"long","totalFundingPayment":"1.60","periodsProcessed":2,"averageFundingRate":"-0.00040000","netMarginImpact":"0.0800"}',
  },
];
