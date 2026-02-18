import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const bundle = buildTransferInstructionBundle(input);
  return JSON.stringify(bundle);
}

function buildTransferInstructionBundle(input) {
  // TODO: Build transfer instruction bundle
  // Support both SOL transfers (SystemProgram) and SPL transfers (TokenProgram)
  return {
    feePayer: input.feePayer,
    recentBlockhash: input.recentBlockhash,
    instructions: [],
  };
}

function encodeU64(value) {
  const bytes = [];
  let n = BigInt(value);
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

export const lesson5SolutionCode = `function run(input) {
  const bundle = buildTransferInstructionBundle(input);
  return JSON.stringify(bundle);
}

function buildTransferInstructionBundle(input) {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Invalid amount: " + input.amount);
  }

  const instructions = [];
  
  if (input.transferType === "SOL") {
    // SystemProgram.transfer: instruction index 2, followed by u64 lamports
    const lamports = BigInt(Math.round(input.amount * 1000000000));
    const data = [2, 0, 0, 0].concat(encodeU64(lamports));
    
    instructions.push({
      programId: "11111111111111111111111111111111",
      keys: [
        { pubkey: input.from, isSigner: true, isWritable: true },
        { pubkey: input.to, isSigner: false, isWritable: true },
      ],
      dataBase64: toBase64(data),
    });
  } else if (input.transferType === "SPL") {
    // TokenProgram.transferChecked: instruction index 12, u64 amount, u8 decimals
    const amount = BigInt(input.amount);
    const data = [12].concat(encodeU64(amount)).concat([input.decimals]);
    
    instructions.push({
      programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      keys: [
        { pubkey: input.sourceAta, isSigner: false, isWritable: true },
        { pubkey: input.mint, isSigner: false, isWritable: false },
        { pubkey: input.destinationAta, isSigner: false, isWritable: true },
        { pubkey: input.owner, isSigner: true, isWritable: false },
      ],
      dataBase64: toBase64(data),
    });
  } else {
    throw new Error("Invalid transfer type: " + input.transferType);
  }

  return {
    feePayer: input.feePayer,
    recentBlockhash: input.recentBlockhash,
    instructions,
  };
}

function encodeU64(value) {
  const bytes = [];
  let n = BigInt(value);
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
  "SystemProgram.transfer uses instruction index 2 with u64 lamports (little-endian).",
  "TokenProgram.transferChecked uses instruction index 12 with u64 amount + u8 decimals.",
  "Key order matters: SOL transfer needs [from, to], SPL transfer needs [source, mint, dest, owner].",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "builds SOL transfer instruction bundle",
    input: JSON.stringify({
      transferType: "SOL",
      from: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      to: "8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo",
      amount: 0.5,
      feePayer: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      recentBlockhash: "BHASH789",
    }),
    expectedOutput: '{"feePayer":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","recentBlockhash":"BHASH789","instructions":[{"programId":"11111111111111111111111111111111","keys":[{"pubkey":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","isSigner":true,"isWritable":true},{"pubkey":"8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo","isSigner":false,"isWritable":true}],"dataBase64":"AgAAAID0DQAAAAA="}]}',
  },
  {
    name: "builds SPL transfer instruction bundle",
    input: JSON.stringify({
      transferType: "SPL",
      sourceAta: "8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo",
      destinationAta: "FnAaYH2xfUhJFFj7W2JML4D8XbQWfN2swf3zspu8i7M1",
      owner: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      mint: "Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx",
      amount: 1000,
      decimals: 6,
      feePayer: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      recentBlockhash: "BHASH789",
    }),
    expectedOutput: '{"feePayer":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","recentBlockhash":"BHASH789","instructions":[{"programId":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","keys":[{"pubkey":"8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo","isSigner":false,"isWritable":true},{"pubkey":"Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx","isSigner":false,"isWritable":false},{"pubkey":"FnAaYH2xfUhJFFj7W2JML4D8XbQWfN2swf3zspu8i7M1","isSigner":false,"isWritable":true},{"pubkey":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","isSigner":true,"isWritable":false}],"dataBase64":"DOAEAAAAAAAABg=="}]}',
  },
  {
    name: "rejects invalid amount",
    input: JSON.stringify({
      transferType: "SOL",
      from: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      to: "8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo",
      amount: -1,
      feePayer: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      recentBlockhash: "BHASH789",
    }),
    expectedOutput: "Error: Invalid amount: -1",
  },
];
