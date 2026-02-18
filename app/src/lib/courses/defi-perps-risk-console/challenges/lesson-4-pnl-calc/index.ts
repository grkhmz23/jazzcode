import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const result = calculatePnL(input);
  return JSON.stringify(result);
}

function calculatePnL(input) {
  // TODO: Calculate PnL for a perpetual futures position
  // 1. Compute unrealized PnL based on entry vs mark price
  // 2. Handle both long and short positions
  // 3. Include notional value and ROE (return on equity)
  return {
    side: "",
    entryPrice: "0",
    markPrice: "0",
    size: "0",
    notionalValue: "0",
    unrealizedPnl: "0",
    roePct: "0",
  };
}
`;

export const lesson4SolutionCode = `function run(input) {
  const result = calculatePnL(input);
  return JSON.stringify(result);
}

function calculatePnL(input) {
  var side = input.side;
  var entryPrice = Number(input.entryPrice);
  var markPrice = Number(input.markPrice);
  var size = Number(input.size);
  var margin = Number(input.margin);

  var notionalValue = size * markPrice;
  var priceDiff = markPrice - entryPrice;
  var unrealizedPnl = side === "long"
    ? size * priceDiff
    : size * -priceDiff;

  var roePct = margin > 0
    ? (unrealizedPnl / margin * 100).toFixed(4)
    : "0.0000";

  return {
    side: side,
    entryPrice: entryPrice.toFixed(2),
    markPrice: markPrice.toFixed(2),
    size: size.toFixed(4),
    notionalValue: notionalValue.toFixed(2),
    unrealizedPnl: unrealizedPnl.toFixed(2),
    roePct: roePct,
  };
}
`;

export const lesson4Hints: string[] = [
  "Long PnL = size * (markPrice - entryPrice). Short PnL = size * (entryPrice - markPrice).",
  "Notional value = size * markPrice — represents the total position value.",
  "ROE (return on equity) = unrealizedPnL / margin * 100.",
  "Use toFixed(2) for prices and PnL, toFixed(4) for size and ROE.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "long position with profit",
    input: JSON.stringify({ side: "long", entryPrice: "22.50", markPrice: "25.00", size: "10.0000", margin: "225.00" }),
    expectedOutput: '{"side":"long","entryPrice":"22.50","markPrice":"25.00","size":"10.0000","notionalValue":"250.00","unrealizedPnl":"25.00","roePct":"11.1111"}',
  },
  {
    name: "short position with profit",
    input: JSON.stringify({ side: "short", entryPrice: "25.00", markPrice: "22.50", size: "10.0000", margin: "250.00" }),
    expectedOutput: '{"side":"short","entryPrice":"25.00","markPrice":"22.50","size":"10.0000","notionalValue":"225.00","unrealizedPnl":"25.00","roePct":"10.0000"}',
  },
  {
    name: "long position with loss",
    input: JSON.stringify({ side: "long", entryPrice: "25.00", markPrice: "20.00", size: "5.0000", margin: "125.00" }),
    expectedOutput: '{"side":"long","entryPrice":"25.00","markPrice":"20.00","size":"5.0000","notionalValue":"100.00","unrealizedPnl":"-25.00","roePct":"-20.0000"}',
  },
];
