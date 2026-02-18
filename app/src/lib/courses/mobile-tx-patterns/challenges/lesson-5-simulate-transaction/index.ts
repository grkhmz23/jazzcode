import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  return JSON.stringify(simulateTransaction(JSON.parse(input)));
}

function simulateTransaction(data) {
  // Simulate a transaction bundle and return results
  // data: { instructions: [{programId, keys, data}], recentBlockhash }
  // Return: { success, unitsConsumed, logs, error? }
  return { success: false, unitsConsumed: 0, logs: [] };
}
`;

export const lesson5SolutionCode = `function run(input) {
  return JSON.stringify(simulateTransaction(JSON.parse(input)));
}

function simulateTransaction(data) {
  const { instructions, recentBlockhash } = data;
  const logs = [];
  let totalUnits = 0;
  let error = null;

  logs.push("Simulation started with blockhash: " + recentBlockhash);

  for (let i = 0; i < instructions.length; i++) {
    const ix = instructions[i];
    const programId = ix.programId;
    const keyCount = ix.keys ? ix.keys.length : 0;

    // Deterministic compute unit calculation:
    // Base: 25000 units per instruction
    // Per key: 1500 units per account key
    // Data cost: 10 units per character of data
    const baseUnits = 25000;
    const keyUnits = keyCount * 1500;
    const dataUnits = (ix.data ? ix.data.length : 0) * 10;
    const ixUnits = baseUnits + keyUnits + dataUnits;
    totalUnits += ixUnits;

    logs.push("Program " + programId + " invoke [" + (i + 1) + "]");
    logs.push("Program log: consumed " + ixUnits + " of 200000 compute units");

    // Check for compute budget exceeded
    if (totalUnits > 1400000) {
      error = "ComputeBudgetExceeded: transaction used " + totalUnits + " units";
      logs.push("Program " + programId + " failed: " + error);
      break;
    }

    logs.push("Program " + programId + " success");
  }

  const success = error === null;

  if (success) {
    logs.push("Simulation completed successfully");
  }

  const result = {
    success,
    unitsConsumed: totalUnits,
    logs,
  };

  if (error !== null) {
    result.error = error;
  }

  return result;
}
`;

export const lesson5Hints: string[] = [
  "Calculate compute units deterministically: 25000 base + 1500 per key + 10 per data character",
  "Log each instruction invocation with program ID and depth",
  "Check if total compute exceeds 1,400,000 units for budget exceeded error",
  "Only include the error field in output when simulation fails",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "simulates successful single-instruction transaction",
    input: JSON.stringify({
      instructions: [
        {
          programId: "11111111111111111111111111111111",
          keys: [
            { pubkey: "SenderAAA", isSigner: true, isWritable: true },
            { pubkey: "RecipientBBB", isSigner: false, isWritable: true },
          ],
          data: "transfer:1000000",
        },
      ],
      recentBlockhash: "GHijk1234567890abcdef",
    }),
    expectedOutput: JSON.stringify({
      success: true,
      unitsConsumed: 28170,
      logs: [
        "Simulation started with blockhash: GHijk1234567890abcdef",
        "Program 11111111111111111111111111111111 invoke [1]",
        "Program log: consumed 28170 of 200000 compute units",
        "Program 11111111111111111111111111111111 success",
        "Simulation completed successfully",
      ],
    }),
  },
  {
    name: "simulates successful multi-instruction transaction",
    input: JSON.stringify({
      instructions: [
        {
          programId: "11111111111111111111111111111111",
          keys: [
            { pubkey: "SenderAAA", isSigner: true, isWritable: true },
            { pubkey: "RecipientBBB", isSigner: false, isWritable: true },
          ],
          data: "transfer:5000000",
        },
        {
          programId: "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
          keys: [
            { pubkey: "SenderAAA", isSigner: true, isWritable: false },
          ],
          data: "hello",
        },
      ],
      recentBlockhash: "BlockHash999",
    }),
    expectedOutput: JSON.stringify({
      success: true,
      unitsConsumed: 54720,
      logs: [
        "Simulation started with blockhash: BlockHash999",
        "Program 11111111111111111111111111111111 invoke [1]",
        "Program log: consumed 28170 of 200000 compute units",
        "Program 11111111111111111111111111111111 success",
        "Program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr invoke [2]",
        "Program log: consumed 26550 of 200000 compute units",
        "Program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr success",
        "Simulation completed successfully",
      ],
    }),
  },
];
