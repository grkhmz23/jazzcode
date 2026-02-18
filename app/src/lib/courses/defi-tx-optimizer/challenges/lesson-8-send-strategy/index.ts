import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  const report = generateSendStrategyReport(input);
  return JSON.stringify(report);
}

function generateSendStrategyReport(input) {
  // TODO: Generate a comprehensive send strategy report
  // 1. Analyze tx plan (compute budget, accounts, size)
  // 2. Determine LUT strategy
  // 3. Calculate fee estimates at different priority levels
  // 4. Recommend retry policy
  return {
    txPlan: null,
    lutStrategy: null,
    feeEstimates: null,
    retryPolicy: null,
    timestamp: 0,
  };
}
`;

export const lesson8SolutionCode = `function run(input) {
  const report = generateSendStrategyReport(input);
  return JSON.stringify(report);
}

function generateSendStrategyReport(input) {
  var instructions = input.instructions;
  var computeUnitPrice = Number(input.computeUnitPrice || 0);
  var availableLuts = input.availableLuts || [];
  var timestamp = input.timestamp;
  var BYTES_PER_KEY = 32;
  var BASE_TX_SIZE = 200;
  var MAX_LEGACY = 1232;

  var totalCU = 0;
  var allKeys = {};
  for (var i = 0; i < instructions.length; i++) {
    totalCU += Number(instructions[i].estimatedCU);
    var keys = instructions[i].accountKeys || [];
    for (var k = 0; k < keys.length; k++) {
      allKeys[keys[k]] = true;
    }
  }
  var uniqueKeys = Object.keys(allKeys);
  var cuLimit = Math.min(Math.ceil(totalCU * 1.1), 1400000);
  var baseFee = 5000;
  var priorityFee = Math.ceil(cuLimit * computeUnitPrice / 1000000);

  var lutKeySet = {};
  for (var l = 0; l < availableLuts.length; l++) {
    var lk = availableLuts[l].keys || [];
    for (var j = 0; j < lk.length; j++) lutKeySet[lk[j]] = true;
  }
  var inLut = 0;
  var notInLut = 0;
  for (var m = 0; m < uniqueKeys.length; m++) {
    if (lutKeySet[uniqueKeys[m]]) inLut++;
    else notInLut++;
  }
  var sizeWithout = BASE_TX_SIZE + uniqueKeys.length * BYTES_PER_KEY;
  var sizeWith = BASE_TX_SIZE + notInLut * BYTES_PER_KEY + inLut;
  var lutRec = sizeWithout <= MAX_LEGACY ? "legacy" : (inLut > 0 && sizeWith <= MAX_LEGACY ? "use-existing-lut" : "create-new-lut");

  var lowFee = baseFee + Math.ceil(cuLimit * 100 / 1000000);
  var medFee = baseFee + Math.ceil(cuLimit * 1000 / 1000000);
  var highFee = baseFee + Math.ceil(cuLimit * 10000 / 1000000);

  return {
    txPlan: {
      computeUnitLimit: cuLimit,
      computeUnitPrice: computeUnitPrice,
      estimatedFeeLamports: baseFee + priorityFee,
      instructionCount: instructions.length + 2,
      totalAccountKeys: uniqueKeys.length,
    },
    lutStrategy: {
      recommendation: lutRec,
      keysInLut: inLut,
      keysNotInLut: notInLut,
      bytesSaved: sizeWithout - sizeWith,
    },
    feeEstimates: {
      low: lowFee,
      medium: medFee,
      high: highFee,
    },
    retryPolicy: {
      maxRetries: 3,
      baseDelayMs: 500,
      backoffMultiplier: 2,
      refreshBlockhash: true,
    },
    timestamp: timestamp,
  };
}
`;

export const lesson8Hints: string[] = [
  "Combine tx plan building and LUT planning into one comprehensive report.",
  "Fee estimates: low = 100 microlamports/CU, medium = 1000, high = 10000.",
  "Retry policy: 3 retries, 500ms base delay, 2x backoff, always refresh blockhash.",
  "Use the same CU calculation: ceil(totalCU * 1.1) capped at 1,400,000.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "generates send strategy for simple transfer",
    input: JSON.stringify({
      instructions: [
        { name: "transfer", estimatedCU: 5000, accountKeys: ["w1", "w2", "sys"] },
      ],
      computeUnitPrice: 1000,
      availableLuts: [],
      timestamp: 1700000000,
    }),
    expectedOutput: '{"txPlan":{"computeUnitLimit":5500,"computeUnitPrice":1000,"estimatedFeeLamports":5006,"instructionCount":3,"totalAccountKeys":3},"lutStrategy":{"recommendation":"legacy","keysInLut":0,"keysNotInLut":3,"bytesSaved":0},"feeEstimates":{"low":5001,"medium":5006,"high":5055},"retryPolicy":{"maxRetries":3,"baseDelayMs":500,"backoffMultiplier":2,"refreshBlockhash":true},"timestamp":1700000000}',
  },
  {
    name: "generates send strategy for complex DeFi tx",
    input: JSON.stringify({
      instructions: [
        { name: "swap", estimatedCU: 200000, accountKeys: ["k1","k2","k3","k4","k5","k6","k7","k8","k9","k10","k11","k12","k13","k14","k15","k16","k17","k18","k19","k20","k21","k22","k23","k24","k25","k26","k27","k28","k29","k30","k31","k32","k33","k34","k35"] },
      ],
      computeUnitPrice: 5000,
      availableLuts: [
        { address: "LUT1", keys: ["k1","k2","k3","k4","k5","k6","k7","k8","k9","k10","k11","k12","k13","k14","k15","k16","k17","k18","k19","k20"] },
      ],
      timestamp: 1700001000,
    }),
    expectedOutput: '{"txPlan":{"computeUnitLimit":220000,"computeUnitPrice":5000,"estimatedFeeLamports":6100,"instructionCount":3,"totalAccountKeys":35},"lutStrategy":{"recommendation":"use-existing-lut","keysInLut":20,"keysNotInLut":15,"bytesSaved":620},"feeEstimates":{"low":5022,"medium":5220,"high":7200},"retryPolicy":{"maxRetries":3,"baseDelayMs":500,"backoffMultiplier":2,"refreshBlockhash":true},"timestamp":1700001000}',
  },
];
