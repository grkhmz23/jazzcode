import type { TestCase } from "@/types/content";

export const lesson3StarterCode = `function run(input) {
  const result = validatePaymentIntent(input);
  return JSON.stringify(result);
}

function validatePaymentIntent(input) {
  // TODO: Validate the payment intent
  // 1. Check if address is valid base58 and 32 bytes
  // 2. Check if amount > 0
  // 3. Generate idempotency key if not provided
  return {
    valid: false,
    errors: [],
    idempotencyKey: "",
  };
}

function isValidBase58(str) {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  for (const char of str) {
    if (!alphabet.includes(char)) return false;
  }
  return true;
}

function base58ToBytes(str) {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const base = BigInt(58);
  let num = BigInt(0);
  for (const char of str) {
    const idx = alphabet.indexOf(char);
    num = num * base + BigInt(idx);
  }
  const bytes = [];
  while (num > 0n) {
    bytes.unshift(Number(num & 0xffn));
    num = num >> 8n;
  }
  // Handle leading zeros
  for (const char of str) {
    if (char === "1") bytes.unshift(0);
    else break;
  }
  return bytes;
}

function generateIdempotencyKey() {
  return "key_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
}
`;

export const lesson3SolutionCode = `function run(input) {
  const result = validatePaymentIntent(input);
  return JSON.stringify(result);
}

function validatePaymentIntent(input) {
  const errors = [];
  
  // Validate address (base58, 32 bytes)
  if (!input.recipient || typeof input.recipient !== "string") {
    errors.push("Missing recipient address");
  } else if (!isValidBase58(input.recipient)) {
    errors.push("Invalid base58 address");
  } else {
    const bytes = base58ToBytes(input.recipient);
    if (bytes.length !== 32) {
      errors.push("Address must be 32 bytes");
    }
  }
  
  // Validate amount > 0
  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    errors.push("Amount must be greater than 0");
  }
  
  // Generate idempotency key if not provided
  const idempotencyKey = input.idempotencyKey || generateIdempotencyKey();
  
  return {
    valid: errors.length === 0,
    errors,
    idempotencyKey,
  };
}

function isValidBase58(str) {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  for (const char of str) {
    if (!alphabet.includes(char)) return false;
  }
  return true;
}

function base58ToBytes(str) {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const base = BigInt(58);
  let num = BigInt(0);
  for (const char of str) {
    const idx = alphabet.indexOf(char);
    num = num * base + BigInt(idx);
  }
  const bytes = [];
  while (num > 0n) {
    bytes.unshift(Number(num & 0xffn));
    num = num >> 8n;
  }
  // Handle leading zeros
  for (const char of str) {
    if (char === "1") bytes.unshift(0);
    else break;
  }
  return bytes;
}

function generateIdempotencyKey() {
  return "key_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
}
`;

export const lesson3Hints: string[] = [
  "Use base58 alphabet to validate the recipient address format.",
  "Convert base58 to bytes and check the length equals 32.",
  "Generate an idempotency key if not provided in the input.",
];

export const lesson3TestCases: TestCase[] = [
  {
    name: "valid SOL payment intent",
    input: JSON.stringify({
      recipient: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      amount: 1.5,
      currency: "SOL",
    }),
    expectedOutput: '{"valid":true,"errors":[],"idempotencyKey":"key_1234567890_abc123"}',
  },
  {
    name: "invalid amount",
    input: JSON.stringify({
      recipient: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      amount: 0,
      currency: "SOL",
    }),
    expectedOutput: '{"valid":false,"errors":["Amount must be greater than 0"],"idempotencyKey":"key_1234567890_abc123"}',
  },
  {
    name: "invalid base58 address",
    input: JSON.stringify({
      recipient: "InvalidAddress!!!",
      amount: 1.0,
      currency: "SOL",
    }),
    expectedOutput: '{"valid":false,"errors":["Invalid base58 address"],"idempotencyKey":"key_1234567890_abc123"}',
  },
  {
    name: "uses provided idempotency key",
    input: JSON.stringify({
      recipient: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      amount: 2.0,
      currency: "SOL",
      idempotencyKey: "custom_key_123",
    }),
    expectedOutput: '{"valid":true,"errors":[],"idempotencyKey":"custom_key_123"}',
  },
];
