import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  const plan = buildSplTransferCheckedPlan(input);
  return JSON.stringify(plan);
}

function buildSplTransferCheckedPlan(input) {
  return {
    feePayer: input.owner,
    recentBlockhash: input.recentBlockhash,
    instructions: [],
  };
}
`;

export const lesson6SolutionCode = `function run(input) {
  const plan = buildSplTransferCheckedPlan(input);
  return JSON.stringify(plan);
}

function buildSplTransferCheckedPlan(input) {
  if (!/^\\d+$/.test(String(input.amountRaw))) {
    throw new Error("Invalid amountRaw: " + input.amountRaw);
  }

  const amount = BigInt(input.amountRaw);
  const max = (1n << 64n) - 1n;
  if (amount > max) {
    throw new Error("Amount exceeds u64");
  }

  if (!Number.isInteger(input.decimals) || input.decimals < 0 || input.decimals > 255) {
    throw new Error("Invalid decimals: " + input.decimals);
  }

  if (typeof input.expectedDecimals === "number" && input.expectedDecimals !== input.decimals) {
    throw new Error("Decimals mismatch: expected " + input.expectedDecimals + ", got " + input.decimals);
  }

  const data = [12].concat(encodeU64(amount)).concat([input.decimals]);

  return {
    feePayer: input.feePayer || input.owner,
    recentBlockhash: input.recentBlockhash,
    instructions: [
      {
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        keys: [
          { pubkey: input.sourceAta, isSigner: false, isWritable: true },
          { pubkey: input.mint, isSigner: false, isWritable: false },
          { pubkey: input.destinationAta, isSigner: false, isWritable: true },
          { pubkey: input.owner, isSigner: true, isWritable: false },
        ],
        dataBase64: toBase64(data),
      },
    ],
  };
}

function encodeU64(value) {
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

export const lesson6Hints: string[] = [
  "Use transfer-checked encoding: [12, amount(u64 LE), decimals(u8)].",
  "Reject amounts that exceed u64 and reject decimal mismatches.",
  "Use key order [source ATA, mint, destination ATA, owner signer].",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "builds deterministic SPL transfer checked plan",
    input: JSON.stringify({
      sourceAta: "8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo",
      destinationAta: "FnAaYH2xfUhJFFj7W2JML4D8XbQWfN2swf3zspu8i7M1",
      owner: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      mint: "Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx",
      amountRaw: "1500",
      decimals: 6,
      expectedDecimals: 6,
      recentBlockhash: "BHASH456",
    }),
    expectedOutput:
      '{"feePayer":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","recentBlockhash":"BHASH456","instructions":[{"programId":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","keys":[{"pubkey":"8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo","isSigner":false,"isWritable":true},{"pubkey":"Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx","isSigner":false,"isWritable":false},{"pubkey":"FnAaYH2xfUhJFFj7W2JML4D8XbQWfN2swf3zspu8i7M1","isSigner":false,"isWritable":true},{"pubkey":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","isSigner":true,"isWritable":false}],"dataBase64":"DNwFAAAAAAAABg=="}]}',
  },
  {
    name: "rejects decimals mismatch",
    input: JSON.stringify({
      sourceAta: "8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo",
      destinationAta: "FnAaYH2xfUhJFFj7W2JML4D8XbQWfN2swf3zspu8i7M1",
      owner: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      mint: "Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx",
      amountRaw: "1500",
      decimals: 6,
      expectedDecimals: 9,
      recentBlockhash: "BHASH456",
    }),
    expectedOutput: "Error: Decimals mismatch: expected 9, got 6",
  },
];
