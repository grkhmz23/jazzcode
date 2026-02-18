import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const result = verifySignIn(input);
  return JSON.stringify(result);
}

function verifySignIn(input) {
  // TODO: Verify a SIWS sign-in response
  // 1. Check domain matches expected domain
  // 2. Check nonce matches expected nonce
  // 3. Check issuedAt is not in the future
  // 4. Check expirationTime has not passed
  // 5. Check address matches signer
  return { verified: false, checks: { domainMatch: false, nonceMatch: false, timeValid: false, notExpired: false, addressMatch: false }, errors: [] };
}
`;

export const lesson5SolutionCode = `function run(input) {
  const result = verifySignIn(input);
  return JSON.stringify(result);
}

function verifySignIn(input) {
  var signInOutput = input.signInOutput;
  var expected = input.expected;
  var currentTime = input.currentTime;
  var errors = [];

  var domainMatch = signInOutput.domain === expected.domain;
  if (!domainMatch) errors.push("Domain mismatch");

  var nonceMatch = signInOutput.nonce === expected.nonce;
  if (!nonceMatch) errors.push("Nonce mismatch");

  var timeValid = signInOutput.issuedAt <= currentTime;
  if (!timeValid) errors.push("issuedAt is in the future");

  var notExpired = true;
  if (signInOutput.expirationTime) {
    notExpired = signInOutput.expirationTime > currentTime;
    if (!notExpired) errors.push("Sign-in has expired");
  }

  var addressMatch = signInOutput.address === expected.address;
  if (!addressMatch) errors.push("Address mismatch");

  var verified = domainMatch && nonceMatch && timeValid && notExpired && addressMatch;

  return { verified: verified, checks: { domainMatch: domainMatch, nonceMatch: nonceMatch, timeValid: timeValid, notExpired: notExpired, addressMatch: addressMatch }, errors: errors };
}
`;

export const lesson5Hints: string[] = [
  "Compare domain, nonce, and address between signInOutput and expected values.",
  "issuedAt must be <= currentTime (not in the future).",
  "expirationTime (if present) must be > currentTime.",
  "All five checks must pass for verified = true.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "valid sign-in passes all checks",
    input: JSON.stringify({
      signInOutput: { domain: "example.com", address: "Wallet111", nonce: "nonce123", issuedAt: "2024-01-01T00:00:00Z", expirationTime: "2024-01-01T01:00:00Z" },
      expected: { domain: "example.com", address: "Wallet111", nonce: "nonce123" },
      currentTime: "2024-01-01T00:30:00Z",
    }),
    expectedOutput: '{"verified":true,"checks":{"domainMatch":true,"nonceMatch":true,"timeValid":true,"notExpired":true,"addressMatch":true},"errors":[]}',
  },
  {
    name: "expired sign-in fails",
    input: JSON.stringify({
      signInOutput: { domain: "example.com", address: "Wallet111", nonce: "nonce123", issuedAt: "2024-01-01T00:00:00Z", expirationTime: "2024-01-01T00:30:00Z" },
      expected: { domain: "example.com", address: "Wallet111", nonce: "nonce123" },
      currentTime: "2024-01-01T01:00:00Z",
    }),
    expectedOutput: '{"verified":false,"checks":{"domainMatch":true,"nonceMatch":true,"timeValid":true,"notExpired":false,"addressMatch":true},"errors":["Sign-in has expired"]}',
  },
  {
    name: "domain and nonce mismatch",
    input: JSON.stringify({
      signInOutput: { domain: "evil.com", address: "Wallet111", nonce: "wrong999", issuedAt: "2024-01-01T00:00:00Z" },
      expected: { domain: "example.com", address: "Wallet111", nonce: "nonce123" },
      currentTime: "2024-01-01T00:30:00Z",
    }),
    expectedOutput: '{"verified":false,"checks":{"domainMatch":false,"nonceMatch":false,"timeValid":true,"notExpired":true,"addressMatch":true},"errors":["Domain mismatch","Nonce mismatch"]}',
  },
];
