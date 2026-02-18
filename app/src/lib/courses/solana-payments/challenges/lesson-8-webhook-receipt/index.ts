import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  const result = verifyWebhookAndGenerateReceipt(input);
  return JSON.stringify(result);
}

function verifyWebhookAndGenerateReceipt(input) {
  // TODO: Verify HMAC-SHA256 signature and generate receipt
  // 1. Verify the webhook signature using HMAC-SHA256
  // 2. Extract payment details from payload
  // 3. Generate receipt JSON with verification status
  return {
    verified: false,
    receiptId: "",
    paymentDetails: null,
    signatureValid: false,
  };
}

function hmacSha256(key, message) {
  // Simple HMAC-SHA256 implementation for educational purposes
  const blockSize = 64;
  const hashLength = 32;
  
  // Ensure key is blockSize bytes
  let keyBytes = [];
  for (let i = 0; i < key.length; i++) {
    keyBytes.push(key.charCodeAt(i));
  }
  
  if (keyBytes.length > blockSize) {
    keyBytes = sha256(keyBytes);
  }
  while (keyBytes.length < blockSize) {
    keyBytes.push(0);
  }
  
  // Create inner and outer padded keys
  const innerPad = keyBytes.map(b => b ^ 0x36);
  const outerPad = keyBytes.map(b => b ^ 0x5c);
  
  // Convert message to bytes
  const msgBytes = [];
  for (let i = 0; i < message.length; i++) {
    msgBytes.push(message.charCodeAt(i));
  }
  
  // HMAC = sha256(outerPad || sha256(innerPad || message))
  const innerHash = sha256(innerPad.concat(msgBytes));
  const outerHash = sha256(outerPad.concat(innerHash));
  
  return bytesToHex(outerHash);
}

function sha256(data) {
  // Simplified SHA256 - returns 32 bytes of zeros for placeholder
  // In real implementation, this would compute actual SHA256
  const result = [];
  for (let i = 0; i < 32; i++) {
    result.push((data[i] || i) & 0xff);
  }
  return result;
}

function bytesToHex(bytes) {
  const hex = [];
  for (const b of bytes) {
    hex.push((b >> 4).toString(16));
    hex.push((b & 0x0f).toString(16));
  }
  return hex.join("");
}

function hexToBytes(hex) {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return bytes;
}
`;

export const lesson8SolutionCode = `function run(input) {
  const result = verifyWebhookAndGenerateReceipt(input);
  return JSON.stringify(result);
}

function verifyWebhookAndGenerateReceipt(input) {
  const { payload, signature, secret, timestamp } = input;
  
  // Compute expected signature using HMAC-SHA256
  const message = timestamp + "." + JSON.stringify(payload);
  const expectedSignature = hmacSha256(secret, message);
  
  // Verify signature (constant-time comparison)
  const signatureValid = constantTimeCompare(signature, expectedSignature);
  
  // Check timestamp is within 5 minutes (300 seconds)
  const now = Math.floor(Date.now() / 1000);
  const timestampNum = parseInt(timestamp, 10);
  const timestampValid = Math.abs(now - timestampNum) <= 300;
  
  // Generate receipt ID
  const receiptId = "rcpt_" + timestamp + "_" + payload.paymentId.slice(-7);
  
  return {
    verified: signatureValid && timestampValid,
    receiptId,
    paymentDetails: {
      paymentId: payload.paymentId,
      amount: payload.amount,
      currency: payload.currency,
      recipient: payload.recipient,
      sender: payload.sender,
      timestamp: payload.timestamp,
    },
    signatureValid,
    timestampValid,
  };
}

function constantTimeCompare(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function hmacSha256(key, message) {
  const blockSize = 64;
  
  // Convert key to bytes
  let keyBytes = [];
  for (let i = 0; i < key.length; i++) {
    keyBytes.push(key.charCodeAt(i) & 0xff);
  }
  
  // Hash key if longer than block size
  if (keyBytes.length > blockSize) {
    keyBytes = sha256(keyBytes);
  }
  
  // Pad key to block size
  while (keyBytes.length < blockSize) {
    keyBytes.push(0);
  }
  
  // Create inner and outer padded keys
  const innerPad = keyBytes.map(b => (b ^ 0x36) & 0xff);
  const outerPad = keyBytes.map(b => (b ^ 0x5c) & 0xff);
  
  // Convert message to bytes
  const msgBytes = [];
  for (let i = 0; i < message.length; i++) {
    msgBytes.push(message.charCodeAt(i) & 0xff);
  }
  
  // HMAC = sha256(outerPad || sha256(innerPad || message))
  const innerHash = sha256(innerPad.concat(msgBytes));
  const outerHash = sha256(outerPad.concat(innerHash));
  
  return bytesToHex(outerHash);
}

// Simplified SHA256 implementation
function sha256(data) {
  // Initial hash values (first 32 bits of fractional parts of square roots of first 8 primes)
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
  
  // Pre-processing
  const msgLen = data.length;
  const paddedLen = Math.ceil((msgLen + 9) / 64) * 64;
  const padded = new Array(paddedLen).fill(0);
  for (let i = 0; i < msgLen; i++) padded[i] = data[i];
  padded[msgLen] = 0x80;
  
  // Append length in bits (big-endian)
  const bitLen = BigInt(msgLen) * 8n;
  for (let i = 0; i < 8; i++) {
    padded[paddedLen - 1 - i] = Number((bitLen >> BigInt(i * 8)) & 0xffn);
  }
  
  // Process each 64-byte chunk
  for (let offset = 0; offset < paddedLen; offset += 64) {
    const w = new Array(64).fill(0);
    for (let i = 0; i < 16; i++) {
      w[i] = (padded[offset + i * 4] << 24) | (padded[offset + i * 4 + 1] << 16) |
             (padded[offset + i * 4 + 2] << 8) | padded[offset + i * 4 + 3];
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rightRotate(w[i-15], 7) ^ rightRotate(w[i-15], 18) ^ (w[i-15] >>> 3);
      const s1 = rightRotate(w[i-2], 17) ^ rightRotate(w[i-2], 19) ^ (w[i-2] >>> 10);
      w[i] = (w[i-16] + s0 + w[i-7] + s1) >>> 0;
    }
    
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    
    for (let i = 0; i < 64; i++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + k[i] + w[i]) >>> 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
      
      h = g; g = f; f = e; e = (d + temp1) >>> 0;
      d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
    }
    
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
  }
  
  // Produce final hash
  const result = [];
  for (const h of [h0, h1, h2, h3, h4, h5, h6, h7]) {
    result.push((h >> 24) & 0xff, (h >> 16) & 0xff, (h >> 8) & 0xff, h & 0xff);
  }
  return result;
}

const k = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function rightRotate(value, amount) {
  return ((value >>> amount) | (value << (32 - amount))) >>> 0;
}

function bytesToHex(bytes) {
  const hex = [];
  for (const b of bytes) {
    hex.push((b >> 4).toString(16));
    hex.push((b & 0x0f).toString(16));
  }
  return hex.join("");
}
`;

export const lesson8Hints: string[] = [
  "HMAC-SHA256: H(key, message) = SHA256((key XOR outer_pad) || SHA256((key XOR inner_pad) || message))",
  "Use constant-time comparison to prevent timing attacks on signature verification.",
  "Verify the timestamp is recent (within 5 minutes) to prevent replay attacks.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "valid webhook signature generates receipt",
    input: JSON.stringify({
      payload: {
        paymentId: "pay_abc123xyz",
        amount: "1.5",
        currency: "SOL",
        recipient: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
        sender: "8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo",
        timestamp: "1700000000",
      },
      signature: "52ff98631d268ecfdad3aad3e8651f0e58b4024309250fd8ef936413c4c183f1",
      secret: "webhook_secret_key_12345",
      timestamp: "1700000000",
    }),
    expectedOutput: '{"verified":true,"receiptId":"rcpt_1700000000_c123xyz","paymentDetails":{"paymentId":"pay_abc123xyz","amount":"1.5","currency":"SOL","recipient":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","sender":"8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo","timestamp":"1700000000"},"signatureValid":true,"timestampValid":true}',
  },
  {
    name: "invalid signature fails verification",
    input: JSON.stringify({
      payload: {
        paymentId: "pay_def456uvw",
        amount: "2.0",
        currency: "USDC",
        recipient: "8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo",
        sender: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
        timestamp: "1700000000",
      },
      signature: "invalid_signature_here",
      secret: "webhook_secret_key_12345",
      timestamp: "1700000000",
    }),
    expectedOutput: '{"verified":false,"receiptId":"rcpt_1700000000_f456uvw","paymentDetails":{"paymentId":"pay_def456uvw","amount":"2.0","currency":"USDC","recipient":"8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo","sender":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","timestamp":"1700000000"},"signatureValid":false,"timestampValid":true}',
  },
  {
    name: "expired timestamp fails verification",
    input: JSON.stringify({
      payload: {
        paymentId: "pay_ghi789rst",
        amount: "0.5",
        currency: "SOL",
        recipient: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
        sender: "8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo",
        timestamp: "1600000000",
      },
      signature: "d946a515c0598704685b96c87410382ca3a0f2914682e0d77f87ecbff13eab82",
      secret: "webhook_secret_key_12345",
      timestamp: "1600000000",
    }),
    expectedOutput: '{"verified":false,"receiptId":"rcpt_1600000000_i789rst","paymentDetails":{"paymentId":"pay_ghi789rst","amount":"0.5","currency":"SOL","recipient":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","sender":"8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo","timestamp":"1600000000"},"signatureValid":true,"timestampValid":false}',
  },
];
