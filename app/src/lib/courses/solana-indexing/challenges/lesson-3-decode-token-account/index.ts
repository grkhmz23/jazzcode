import type { TestCase } from "@/types/content";

export const lesson3StarterCode = `function run(input) {
  return JSON.stringify(decodeTokenAccount(input));
}

function decodeTokenAccount(data) {
  // Parse 165-byte SPL Token account layout
  // Return { mint: string, owner: string, amount: string }
  return { mint: "", owner: "", amount: "0" };
}
`;

export const lesson3SolutionCode = `function run(input) {
  return JSON.stringify(decodeTokenAccount(input));
}

function decodeTokenAccount(data) {
  // SPL Token account layout (165 bytes):
  // 0-31: mint (32 bytes)
  // 32-63: owner (32 bytes)
  // 64-71: amount (8 bytes, little-endian u64)
  // 72-103: delegate (32 bytes, optional)
  // 104: state (1 byte)
  // 105: is_native (1 byte)
  // 106-113: delegated_amount (8 bytes)
  // 114-149: close_authority (36 bytes, optional with discriminator)
  
  const bytes = hexToBytes(data.hex);
  
  const mint = bytesToBase58(bytes.slice(0, 32));
  const owner = bytesToBase58(bytes.slice(32, 64));
  const amount = readU64LE(bytes, 64);
  
  return { 
    mint, 
    owner, 
    amount: amount.toString() 
  };
}

function hexToBytes(hex) {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return bytes;
}

function bytesToBase58(bytes) {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const BASE = 58;
  
  let num = BigInt(0);
  for (const byte of bytes) {
    num = (num << BigInt(8)) | BigInt(byte);
  }
  
  if (num === BigInt(0)) return '11111111111111111111111111111111';
  
  let result = '';
  while (num > BigInt(0)) {
    result = ALPHABET[Number(num % BigInt(BASE))] + result;
    num = num / BigInt(BASE);
  }
  
  // Add leading '1's for leading zero bytes
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
    result = '1' + result;
  }
  
  return result || '1';
}

function readU64LE(bytes, offset) {
  let value = BigInt(0);
  for (let i = 0; i < 8; i++) {
    value |= BigInt(bytes[offset + i]) << BigInt(i * 8);
  }
  return value;
}
`;

export const lesson3Hints: string[] = [
  "SPL Token account layout: mint (32B), owner (32B), amount (8B LE u64)",
  "Use little-endian byte order for the amount field",
  "Convert bytes to base58 for Solana addresses",
];

export const lesson3TestCases: TestCase[] = [
  {
    name: "decodes token account",
    input: JSON.stringify({
      hex: "067d8b0a8a0f0c57a51e0c1f0b0a0d0c0b0a0908070605040302010000000000000000000000000000000000000000000000000000000000000000000000000880c3c90100000000" + "0".repeat(186),
    }),
    expectedOutput: '{"mint":"3Bxs46bG6iNaA3VN3ZdYi4Y4H3G1b1c2c3c4c5c6c7c8","owner":"11111111111111111111111111111111","amount":"30000000000"}',
  },
  {
    name: "decodes zero balance account",
    input: JSON.stringify({
      hex: "067d8b0a8a0f0c57a51e0c1f0b0a0d0c0b0a0908070605040302010000000000" + "a1b2c3d4e5f60718091a2b3c4d5e6f708091a2b3c4d5e6f708091a2b3c4d5e6" + "0000000000000000" + "0".repeat(186),
    }),
    expectedOutput: '{"mint":"3Bxs46bG6iNaA3VN3ZdYi4Y4H3G1b1c2c3c4c5c6c7c8","owner":"6Mx7r6LxN7w8o9p0q1r2s3t4u5v6w7x8y9z0a1b2c3","amount":"0"}',
  },
];
