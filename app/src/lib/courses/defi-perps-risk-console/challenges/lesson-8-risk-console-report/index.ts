import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  const report = generateRiskConsoleReport(input);
  return JSON.stringify(report);
}

function generateRiskConsoleReport(input) {
  // TODO: Generate comprehensive risk console report
  // 1. Calculate PnL for the position
  // 2. Calculate cumulative funding impact
  // 3. Compute margin ratio and liquidation distance
  // 4. Generate alert triggers based on thresholds
  return {
    position: null,
    pnl: null,
    funding: null,
    marginRatio: "0",
    liquidationPrice: "0",
    alerts: [],
    timestamp: 0,
  };
}
`;

export const lesson8SolutionCode = `function run(input) {
  const report = generateRiskConsoleReport(input);
  return JSON.stringify(report);
}

function generateRiskConsoleReport(input) {
  var pos = input.position;
  var side = pos.side;
  var entryPrice = Number(pos.entryPrice);
  var markPrice = Number(pos.markPrice);
  var size = Number(pos.size);
  var margin = Number(pos.margin);
  var maintenanceMarginRate = Number(input.maintenanceMarginRate);
  var fundingRates = input.fundingRates || [];
  var timestamp = input.timestamp;

  var notional = size * markPrice;
  var priceDiff = markPrice - entryPrice;
  var unrealizedPnl = side === "long" ? size * priceDiff : size * -priceDiff;

  var totalFunding = 0;
  for (var i = 0; i < fundingRates.length; i++) {
    var payment = size * entryPrice * Number(fundingRates[i]);
    totalFunding += side === "long" ? -payment : payment;
  }

  var effectiveMargin = margin + unrealizedPnl + totalFunding;
  var marginRatio = notional > 0 ? (effectiveMargin / notional).toFixed(6) : "0.000000";

  var liquidationPrice;
  if (side === "long") {
    liquidationPrice = entryPrice - (margin + totalFunding - notional * maintenanceMarginRate) / size;
  } else {
    liquidationPrice = entryPrice + (margin + totalFunding - notional * maintenanceMarginRate) / size;
  }
  liquidationPrice = Math.max(0, liquidationPrice);

  var alerts = [];
  if (Number(marginRatio) < maintenanceMarginRate * 1.5) {
    alerts.push("WARNING: Margin ratio approaching maintenance level");
  }
  if (Number(marginRatio) < maintenanceMarginRate) {
    alerts.push("CRITICAL: Below maintenance margin - liquidation imminent");
  }
  if (Math.abs(unrealizedPnl) > margin * 0.5) {
    alerts.push("INFO: Unrealized PnL exceeds 50% of initial margin");
  }

  return {
    position: {
      side: side,
      size: size.toFixed(4),
      entryPrice: entryPrice.toFixed(2),
      markPrice: markPrice.toFixed(2),
    },
    pnl: {
      unrealized: unrealizedPnl.toFixed(2),
      roePct: (margin > 0 ? unrealizedPnl / margin * 100 : 0).toFixed(4),
    },
    funding: {
      totalPayment: totalFunding.toFixed(2),
      periods: fundingRates.length,
    },
    marginRatio: marginRatio,
    liquidationPrice: liquidationPrice.toFixed(2),
    alerts: alerts,
    timestamp: timestamp,
  };
}
`;

export const lesson8Hints: string[] = [
  "Effective margin = initial margin + unrealized PnL + funding payments.",
  "Margin ratio = effectiveMargin / notionalValue.",
  "Liquidation price for longs: entryPrice - (margin + funding - notional*mmRate) / size.",
  "Generate alerts based on margin ratio vs maintenance margin rate thresholds.",
  "Sort alerts by severity: CRITICAL > WARNING > INFO.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "healthy long position report",
    input: JSON.stringify({
      position: { side: "long", entryPrice: "22.50", markPrice: "25.00", size: "10", margin: "225.00" },
      maintenanceMarginRate: 0.05,
      fundingRates: ["0.0001", "0.0001"],
      timestamp: 1700000000,
    }),
    expectedOutput: '{"position":{"side":"long","size":"10.0000","entryPrice":"22.50","markPrice":"25.00"},"pnl":{"unrealized":"25.00","roePct":"11.1111"},"funding":{"totalPayment":"-0.04","periods":2},"marginRatio":"0.099984","liquidationPrice":"2.05","alerts":["INFO: Unrealized PnL exceeds 50% of initial margin"],"timestamp":1700000000}',
  },
  {
    name: "distressed short position report",
    input: JSON.stringify({
      position: { side: "short", entryPrice: "20.00", markPrice: "24.00", size: "10", margin: "40.00" },
      maintenanceMarginRate: 0.05,
      fundingRates: ["-0.0005"],
      timestamp: 1700001000,
    }),
    expectedOutput: '{"position":{"side":"short","size":"10.0000","entryPrice":"20.00","markPrice":"24.00"},"pnl":{"unrealized":"-40.00","roePct":"-100.0000"},"funding":{"totalPayment":"-0.10","periods":1},"marginRatio":"-0.000417","liquidationPrice":"23.88","alerts":["WARNING: Margin ratio approaching maintenance level","CRITICAL: Below maintenance margin - liquidation imminent","INFO: Unrealized PnL exceeds 50% of initial margin"],"timestamp":1700001000}',
  },
];
