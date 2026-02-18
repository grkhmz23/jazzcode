import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  const report = generateRiskReport(input);
  return JSON.stringify(report);
}

function generateRiskReport(input) {
  // TODO: Generate risk report across multiple price scenarios
  // 1. For each scenario, compute collateral values at scenario prices
  // 2. Compute health factor per scenario
  // 3. Identify which scenarios trigger liquidation
  // 4. Return the full report
  return {
    baseCase: null,
    scenarios: [],
    worstHealthFactor: "0",
    liquidationScenarios: 0,
    timestamp: 0,
  };
}
`;

export const lesson8SolutionCode = `function run(input) {
  const report = generateRiskReport(input);
  return JSON.stringify(report);
}

function generateRiskReport(input) {
  var positions = input.positions;
  var scenarios = input.scenarios;
  var timestamp = input.timestamp;

  function evalScenario(name, priceOverrides) {
    var collateralValueUsd = 0;
    var borrowValueUsd = 0;
    var weightedThreshold = 0;

    for (var i = 0; i < positions.length; i++) {
      var pos = positions[i];
      var price = priceOverrides[pos.asset] !== undefined
        ? Number(priceOverrides[pos.asset])
        : Number(pos.priceUsd);
      var value = Number(pos.amount) * price;

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

    return {
      name: name,
      collateralValueUsd: collateralValueUsd.toFixed(2),
      borrowValueUsd: borrowValueUsd.toFixed(2),
      healthFactor: healthFactor.toFixed(4),
      isLiquidatable: healthFactor < 1.0,
    };
  }

  var baseCase = evalScenario("base", {});
  var scenarioResults = [];
  var worstHF = Number(baseCase.healthFactor);
  var liquidationCount = baseCase.isLiquidatable ? 1 : 0;

  for (var s = 0; s < scenarios.length; s++) {
    var result = evalScenario(scenarios[s].name, scenarios[s].priceOverrides);
    scenarioResults.push(result);
    var hf = Number(result.healthFactor);
    if (hf < worstHF) worstHF = hf;
    if (result.isLiquidatable) liquidationCount++;
  }

  return {
    baseCase: baseCase,
    scenarios: scenarioResults,
    worstHealthFactor: worstHF.toFixed(4),
    liquidationScenarios: liquidationCount,
    timestamp: timestamp,
  };
}
`;

export const lesson8Hints: string[] = [
  "Create a reusable evalScenario function that takes price overrides and computes health factor.",
  "For the base case, use the original position prices (empty overrides).",
  "Track the worst health factor across all scenarios.",
  "Count how many scenarios result in isLiquidatable: true.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "generates risk report across bull/base/crash",
    input: JSON.stringify({
      positions: [
        { side: "collateral", asset: "SOL", amount: "100", priceUsd: "25.00", liquidationThreshold: 0.80 },
        { side: "borrow", asset: "USDC", amount: "1500", priceUsd: "1.00", liquidationThreshold: 0 },
      ],
      scenarios: [
        { name: "bull", priceOverrides: { SOL: "40.00" } },
        { name: "crash", priceOverrides: { SOL: "15.00" } },
      ],
      timestamp: 1700000000,
    }),
    expectedOutput: '{"baseCase":{"name":"base","collateralValueUsd":"2500.00","borrowValueUsd":"1500.00","healthFactor":"1.3333","isLiquidatable":false},"scenarios":[{"name":"bull","collateralValueUsd":"4000.00","borrowValueUsd":"1500.00","healthFactor":"2.1333","isLiquidatable":false},{"name":"crash","collateralValueUsd":"1500.00","borrowValueUsd":"1500.00","healthFactor":"0.8000","isLiquidatable":true}],"worstHealthFactor":"0.8000","liquidationScenarios":1,"timestamp":1700000000}',
  },
  {
    name: "all scenarios safe",
    input: JSON.stringify({
      positions: [
        { side: "collateral", asset: "SOL", amount: "200", priceUsd: "25.00", liquidationThreshold: 0.80 },
        { side: "borrow", asset: "USDC", amount: "500", priceUsd: "1.00", liquidationThreshold: 0 },
      ],
      scenarios: [
        { name: "mild-dip", priceOverrides: { SOL: "20.00" } },
      ],
      timestamp: 1700001000,
    }),
    expectedOutput: '{"baseCase":{"name":"base","collateralValueUsd":"5000.00","borrowValueUsd":"500.00","healthFactor":"8.0000","isLiquidatable":false},"scenarios":[{"name":"mild-dip","collateralValueUsd":"4000.00","borrowValueUsd":"500.00","healthFactor":"6.4000","isLiquidatable":false}],"worstHealthFactor":"6.4000","liquidationScenarios":0,"timestamp":1700001000}',
  },
];
