import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const plan = buildTxPlan(input);
  return JSON.stringify(plan);
}

function buildTxPlan(input) {
  // TODO: Build a transaction plan with compute budget instructions
  // 1. Calculate total compute units needed from instruction estimates
  // 2. Add SetComputeUnitLimit instruction
  // 3. Add SetComputeUnitPrice instruction for priority fee
  // 4. Calculate total fee estimate
  return {
    computeUnitLimit: 0,
    computeUnitPrice: 0,
    estimatedFeeLamports: 0,
    instructionCount: 0,
    totalAccountKeys: 0,
    needsVersionedTx: false,
  };
}
`;

export const lesson4SolutionCode = `function run(input) {
  const plan = buildTxPlan(input);
  return JSON.stringify(plan);
}

function buildTxPlan(input) {
  var instructions = input.instructions;
  var computeUnitPrice = Number(input.computeUnitPrice || 0);
  var maxAccountsLegacy = 35;

  var totalCU = 0;
  var accountKeySet = {};
  for (var i = 0; i < instructions.length; i++) {
    totalCU += Number(instructions[i].estimatedCU);
    var keys = instructions[i].accountKeys || [];
    for (var k = 0; k < keys.length; k++) {
      accountKeySet[keys[k]] = true;
    }
  }

  var margin = Math.ceil(totalCU * 1.1);
  var computeUnitLimit = Math.min(margin, 1400000);

  var baseFee = 5000;
  var priorityFee = Math.ceil(computeUnitLimit * computeUnitPrice / 1000000);
  var estimatedFeeLamports = baseFee + priorityFee;

  var totalAccountKeys = Object.keys(accountKeySet).length;
  var instructionCount = instructions.length + 2;

  var needsVersionedTx = totalAccountKeys > maxAccountsLegacy;

  return {
    computeUnitLimit: computeUnitLimit,
    computeUnitPrice: computeUnitPrice,
    estimatedFeeLamports: estimatedFeeLamports,
    instructionCount: instructionCount,
    totalAccountKeys: totalAccountKeys,
    needsVersionedTx: needsVersionedTx,
  };
}
`;

export const lesson4Hints: string[] = [
  "Sum estimatedCU from all instructions, then add 10% margin: ceil(total * 1.1).",
  "Cap compute unit limit at 1,400,000 (Solana max).",
  "Priority fee = ceil(computeUnitLimit * computeUnitPrice / 1_000_000) in lamports.",
  "Total fee = base fee (5000 lamports) + priority fee.",
  "Versioned tx needed when unique account keys exceed 35.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "simple transfer plan",
    input: JSON.stringify({
      instructions: [
        { name: "transfer", estimatedCU: 5000, accountKeys: ["wallet1", "wallet2", "system"] },
      ],
      computeUnitPrice: 1000,
    }),
    expectedOutput: '{"computeUnitLimit":5500,"computeUnitPrice":1000,"estimatedFeeLamports":5006,"instructionCount":3,"totalAccountKeys":3,"needsVersionedTx":false}',
  },
  {
    name: "complex DeFi swap plan",
    input: JSON.stringify({
      instructions: [
        { name: "createATA", estimatedCU: 30000, accountKeys: ["wallet1", "mint1", "ata1", "tokenProgram", "systemProgram", "rent"] },
        { name: "swap", estimatedCU: 150000, accountKeys: ["wallet1", "pool1", "poolAuth", "tokenA", "tokenB", "oracle1", "oracle2", "ammProgram", "tokenProgram"] },
      ],
      computeUnitPrice: 5000,
    }),
    expectedOutput: '{"computeUnitLimit":198000,"computeUnitPrice":5000,"estimatedFeeLamports":5990,"instructionCount":4,"totalAccountKeys":13,"needsVersionedTx":false}',
  },
  {
    name: "large tx requiring versioned format",
    input: JSON.stringify({
      instructions: [
        { name: "swap1", estimatedCU: 200000, accountKeys: ["k1","k2","k3","k4","k5","k6","k7","k8","k9","k10","k11","k12","k13","k14","k15","k16","k17","k18","k19","k20"] },
        { name: "swap2", estimatedCU: 200000, accountKeys: ["k21","k22","k23","k24","k25","k26","k27","k28","k29","k30","k31","k32","k33","k34","k35","k36","k37","k38","k39","k40"] },
      ],
      computeUnitPrice: 10000,
    }),
    expectedOutput: '{"computeUnitLimit":440000,"computeUnitPrice":10000,"estimatedFeeLamports":9400,"instructionCount":4,"totalAccountKeys":40,"needsVersionedTx":true}',
  },
];
