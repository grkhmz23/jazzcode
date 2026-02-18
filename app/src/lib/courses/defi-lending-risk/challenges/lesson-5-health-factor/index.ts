import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const result = computeHealthFactor(input);
  return JSON.stringify(result);
}

function computeHealthFactor(input) {
  // TODO: Compute health factor and liquidation status
  // healthFactor = (collateralValue * liquidationThreshold) / borrowValue
  // If healthFactor < 1.0 the position is liquidatable
  // Calculate maximum additional borrow and liquidation shortfall
  return {
    collateralValueUsd: "0",
    borrowValueUsd: "0",
    healthFactor: "0",
    isLiquidatable: false,
    maxAdditionalBorrowUsd: "0",
    liquidationShortfallUsd: "0",
  };
}
`;

export const lesson5SolutionCode = `function run(input) {
  const result = computeHealthFactor(input);
  return JSON.stringify(result);
}

function computeHealthFactor(input) {
  var positions = input.positions;
  var collateralValueUsd = 0;
  var borrowValueUsd = 0;
  var weightedThreshold = 0;

  for (var i = 0; i < positions.length; i++) {
    var pos = positions[i];
    var value = Number(pos.amount) * Number(pos.priceUsd);
    if (pos.side === "collateral") {
      collateralValueUsd += value;
      weightedThreshold += value * Number(pos.liquidationThreshold);
    } else if (pos.side === "borrow") {
      borrowValueUsd += value;
    }
  }

  var effectiveThreshold = collateralValueUsd > 0
    ? weightedThreshold / collateralValueUsd
    : 0;

  var healthFactor = borrowValueUsd > 0
    ? (collateralValueUsd * effectiveThreshold) / borrowValueUsd
    : 999.0;

  var isLiquidatable = healthFactor < 1.0;

  var maxAdditionalBorrow = Math.max(0,
    collateralValueUsd * effectiveThreshold - borrowValueUsd
  );

  var liquidationShortfall = isLiquidatable
    ? borrowValueUsd - collateralValueUsd * effectiveThreshold
    : 0;

  return {
    collateralValueUsd: collateralValueUsd.toFixed(2),
    borrowValueUsd: borrowValueUsd.toFixed(2),
    healthFactor: healthFactor.toFixed(4),
    isLiquidatable: isLiquidatable,
    maxAdditionalBorrowUsd: maxAdditionalBorrow.toFixed(2),
    liquidationShortfallUsd: liquidationShortfall.toFixed(2),
  };
}
`;

export const lesson5Hints: string[] = [
  "Collateral value = sum of (amount * priceUsd) for all collateral positions.",
  "Effective threshold = weighted average of liquidationThreshold by collateral value.",
  "Health factor = (collateralValue * effectiveThreshold) / borrowValue.",
  "Max additional borrow = max(0, collateralValue * threshold - currentBorrow).",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "healthy position with buffer",
    input: JSON.stringify({
      positions: [
        { side: "collateral", asset: "SOL", amount: "100", priceUsd: "25.00", liquidationThreshold: 0.80 },
        { side: "borrow", asset: "USDC", amount: "1000", priceUsd: "1.00", liquidationThreshold: 0 },
      ],
    }),
    expectedOutput: '{"collateralValueUsd":"2500.00","borrowValueUsd":"1000.00","healthFactor":"2.0000","isLiquidatable":false,"maxAdditionalBorrowUsd":"1000.00","liquidationShortfallUsd":"0.00"}',
  },
  {
    name: "position at liquidation threshold",
    input: JSON.stringify({
      positions: [
        { side: "collateral", asset: "SOL", amount: "100", priceUsd: "12.50", liquidationThreshold: 0.80 },
        { side: "borrow", asset: "USDC", amount: "1200", priceUsd: "1.00", liquidationThreshold: 0 },
      ],
    }),
    expectedOutput: '{"collateralValueUsd":"1250.00","borrowValueUsd":"1200.00","healthFactor":"0.8333","isLiquidatable":true,"maxAdditionalBorrowUsd":"0.00","liquidationShortfallUsd":"200.00"}',
  },
  {
    name: "no borrow returns max health factor",
    input: JSON.stringify({
      positions: [
        { side: "collateral", asset: "SOL", amount: "50", priceUsd: "25.00", liquidationThreshold: 0.80 },
      ],
    }),
    expectedOutput: '{"collateralValueUsd":"1250.00","borrowValueUsd":"0.00","healthFactor":"999.0000","isLiquidatable":false,"maxAdditionalBorrowUsd":"1000.00","liquidationShortfallUsd":"0.00"}',
  },
];
