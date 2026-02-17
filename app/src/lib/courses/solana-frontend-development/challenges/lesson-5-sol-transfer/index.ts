import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const plan = buildSolTransferPlan(input);
  return JSON.stringify(plan);
}

function buildSolTransferPlan(input) {
  return {
    feePayer: input.from,
    recentBlockhash: input.recentBlockhash,
    instructions: [],
  };
}
`;

export const lesson5SolutionCode = `function run(input) {
  const plan = buildSolTransferPlan(input);
  return JSON.stringify(plan);
}

function buildSolTransferPlan(input) {
  if (!Number.isFinite(input.amountSol) || input.amountSol <= 0) {
    throw new Error("Invalid SOL amount: " + input.amountSol);
  }

  const lamports = BigInt(Math.round(input.amountSol * 1000000000));
  if (lamports <= 0n) {
    throw new Error("Lamports must be positive");
  }

  const data = [2, 0, 0, 0].concat(encodeU64(lamports));

  return {
    feePayer: input.feePayer || input.from,
    recentBlockhash: input.recentBlockhash,
    instructions: [
      {
        programId: "11111111111111111111111111111111",
        keys: [
          { pubkey: input.from, isSigner: true, isWritable: true },
          { pubkey: input.to, isSigner: false, isWritable: true },
        ],
        dataBase64: toBase64(data),
      },
    ],
  };
}

function encodeU64(value) {
  if (value < 0n || value > ((1n << 64n) - 1n)) {
    throw new Error("Amount does not fit in u64");
  }

  const bytes = [];
  let n = value;
  for (let i = 0; i < 8; i += 1) {
    bytes.push(Number(n & 255n));
    n = n >> 8n;
  }
  return bytes;
}

function toBase64(bytes) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  let i = 0;

  while (i < bytes.length) {
    const b1 = bytes[i++] || 0;
    const b2 = bytes[i++] || 0;
    const b3 = bytes[i++] || 0;

    const enc1 = b1 >> 2;
    const enc2 = ((b1 & 3) << 4) | (b2 >> 4);
    const enc3 = ((b2 & 15) << 2) | (b3 >> 6);
    const enc4 = b3 & 63;

    if (i - 1 > bytes.length) {
      output += chars.charAt(enc1) + chars.charAt(enc2) + "==";
    } else if (i > bytes.length) {
      output += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + "=";
    } else {
      output += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
    }
  }

  return output;
}
`;

export const lesson5Hints: string[] = [
  "SystemProgram transfer instruction data = u32 index (2) + u64 lamports, little-endian.",
  "Key order must be [from signer+writable, to writable].",
  "Return a stable TransactionPlan shape with dataBase64 from deterministic bytes.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "builds deterministic SOL transfer plan",
    input: JSON.stringify({
      from: "11111111111111111111111111111111",
      to: "Stake11111111111111111111111111111111111111",
      amountSol: 0.25,
      recentBlockhash: "BHASH123",
      feePayer: "11111111111111111111111111111111",
    }),
    expectedOutput:
      '{"feePayer":"11111111111111111111111111111111","recentBlockhash":"BHASH123","instructions":[{"programId":"11111111111111111111111111111111","keys":[{"pubkey":"11111111111111111111111111111111","isSigner":true,"isWritable":true},{"pubkey":"Stake11111111111111111111111111111111111111","isSigner":false,"isWritable":true}],"dataBase64":"AgAAAICy5g4AAAAA"}]}',
  },
  {
    name: "rejects negative amount",
    input: JSON.stringify({
      from: "11111111111111111111111111111111",
      to: "Stake11111111111111111111111111111111111111",
      amountSol: -1,
      recentBlockhash: "BHASH123",
    }),
    expectedOutput: "Error: Invalid SOL amount: -1",
  },
];
