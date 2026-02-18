import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  const report = generateSwapRunReport(input);
  return JSON.stringify(report);
}

function generateSwapRunReport(input) {
  // TODO: Generate a stable SwapRunReport from the input
  // 1. Summarize the route (legs, total fees)
  // 2. Compute effective price and slippage applied
  // 3. Include state machine outcome
  // 4. List any errors encountered
  return {
    inputMint: "",
    outputMint: "",
    inAmount: "0",
    outAmount: "0",
    minOutAmount: "0",
    effectivePrice: "0",
    totalFeesLamports: "0",
    routeSummary: [],
    finalState: "idle",
    errors: [],
    timestamp: 0,
  };
}
`;

export const lesson8SolutionCode = `function run(input) {
  const report = generateSwapRunReport(input);
  return JSON.stringify(report);
}

function generateSwapRunReport(input) {
  var plan = input.swapPlan;
  var stateResult = input.stateResult;
  var timestamp = input.timestamp;

  var totalFees = BigInt(0);
  var routeSummary = (plan.routeLegs || []).map(function(leg) {
    totalFees = totalFees + BigInt(leg.feeAmount || "0");
    return {
      index: leg.index,
      ammLabel: leg.ammLabel,
      pct: leg.pct,
      feeAmount: leg.feeAmount || "0",
    };
  });

  var inNum = Number(plan.inAmount);
  var outNum = Number(plan.outAmount);
  var effectivePrice = inNum > 0 ? (outNum / inNum).toFixed(9) : "0";

  var errors = [];
  if (stateResult.errorMessage) {
    errors.push(stateResult.errorMessage);
  }
  if (input.additionalErrors) {
    for (var i = 0; i < input.additionalErrors.length; i++) {
      errors.push(input.additionalErrors[i]);
    }
  }

  return {
    inputMint: plan.inputMint,
    outputMint: plan.outputMint,
    inAmount: plan.inAmount,
    outAmount: plan.outAmount,
    minOutAmount: plan.minOutAmount,
    effectivePrice: effectivePrice,
    totalFeesLamports: totalFees.toString(),
    routeSummary: routeSummary,
    finalState: stateResult.finalState,
    errors: errors,
    timestamp: timestamp,
  };
}
`;

export const lesson8Hints: string[] = [
  "Use BigInt to sum fee amounts across all route legs.",
  "Effective price = outAmount / inAmount, formatted to 9 decimal places.",
  "Collect errors from both the state machine result and any additional errors array.",
  "Route summary should include index, ammLabel, pct, and feeAmount per leg.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "generates complete swap run report",
    input: JSON.stringify({
      swapPlan: {
        inputMint: "So11111111111111111111111111111111111111112",
        outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        inAmount: "1000000000",
        outAmount: "22500000",
        minOutAmount: "22387500",
        routeLegs: [
          { index: 0, ammLabel: "Whirlpool", pct: 100, feeAmount: "6750" },
        ],
      },
      stateResult: { finalState: "success", errorMessage: null },
      additionalErrors: [],
      timestamp: 1700000000,
    }),
    expectedOutput: '{"inputMint":"So11111111111111111111111111111111111111112","outputMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","inAmount":"1000000000","outAmount":"22500000","minOutAmount":"22387500","effectivePrice":"0.022500000","totalFeesLamports":"6750","routeSummary":[{"index":0,"ammLabel":"Whirlpool","pct":100,"feeAmount":"6750"}],"finalState":"success","errors":[],"timestamp":1700000000}',
  },
  {
    name: "report with errors and multi-leg route",
    input: JSON.stringify({
      swapPlan: {
        inputMint: "So11111111111111111111111111111111111111112",
        outputMint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
        inAmount: "5000000000",
        outAmount: "4800000000",
        minOutAmount: "4752000000",
        routeLegs: [
          { index: 0, ammLabel: "Raydium", pct: 60, feeAmount: "14400" },
          { index: 1, ammLabel: "Orca", pct: 40, feeAmount: "9600" },
        ],
      },
      stateResult: { finalState: "error", errorMessage: "TX simulation failed" },
      additionalErrors: ["Stale quote detected"],
      timestamp: 1700001000,
    }),
    expectedOutput: '{"inputMint":"So11111111111111111111111111111111111111112","outputMint":"mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So","inAmount":"5000000000","outAmount":"4800000000","minOutAmount":"4752000000","effectivePrice":"0.960000000","totalFeesLamports":"24000","routeSummary":[{"index":0,"ammLabel":"Raydium","pct":60,"feeAmount":"14400"},{"index":1,"ammLabel":"Orca","pct":40,"feeAmount":"9600"}],"finalState":"error","errors":["TX simulation failed","Stale quote detected"],"timestamp":1700001000}',
  },
];
