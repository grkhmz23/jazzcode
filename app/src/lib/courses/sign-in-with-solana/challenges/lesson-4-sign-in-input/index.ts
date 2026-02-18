import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const result = createSignInInput(input);
  return JSON.stringify(result);
}

function createSignInInput(input) {
  // TODO: Create a SIWS sign-in input with validation
  // 1. Validate domain (non-empty, no protocol prefix)
  // 2. Validate nonce (>= 8 chars alphanumeric)
  // 3. Set issuedAt and optional expirationTime
  // 4. Validate address format
  return { domain: "", address: "", nonce: "", issuedAt: "", expirationTime: null, statement: "", valid: false, errors: [] };
}
`;

export const lesson4SolutionCode = `function run(input) {
  const result = createSignInInput(input);
  return JSON.stringify(result);
}

function createSignInInput(input) {
  var errors = [];
  var domain = input.domain || "";
  var address = input.address || "";
  var nonce = input.nonce || "";
  var issuedAt = input.issuedAt || "";
  var expirationTime = input.expirationTime || null;
  var statement = input.statement || "Sign in to " + domain;

  if (!domain || domain.length === 0) errors.push("Domain is required");
  if (domain.indexOf("://") !== -1) errors.push("Domain must not include protocol");

  if (!nonce || nonce.length < 8) errors.push("Nonce must be at least 8 characters");
  if (nonce && !/^[a-zA-Z0-9]+$/.test(nonce)) errors.push("Nonce must be alphanumeric");

  if (!address || address.length < 32 || address.length > 44) errors.push("Invalid address length");

  if (!issuedAt) errors.push("issuedAt is required");

  if (expirationTime && issuedAt && expirationTime <= issuedAt) errors.push("expirationTime must be after issuedAt");

  return { domain: domain, address: address, nonce: nonce, issuedAt: issuedAt, expirationTime: expirationTime, statement: statement, valid: errors.length === 0, errors: errors };
}
`;

export const lesson4Hints: string[] = [
  "Domain should not include protocol (https://). Strip or reject it.",
  "Nonce must be >= 8 characters and alphanumeric only (/^[a-zA-Z0-9]+$/).",
  "Address must be 32-44 characters (Solana base58 public key).",
  "If no statement is provided, default to 'Sign in to <domain>'.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "valid SIWS input",
    input: JSON.stringify({
      domain: "example.com",
      address: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      nonce: "abc12345",
      issuedAt: "2024-01-01T00:00:00Z",
      expirationTime: "2024-01-01T01:00:00Z",
    }),
    expectedOutput: '{"domain":"example.com","address":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","nonce":"abc12345","issuedAt":"2024-01-01T00:00:00Z","expirationTime":"2024-01-01T01:00:00Z","statement":"Sign in to example.com","valid":true,"errors":[]}',
  },
  {
    name: "rejects invalid nonce and domain",
    input: JSON.stringify({
      domain: "https://bad.com",
      address: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      nonce: "short",
      issuedAt: "2024-01-01T00:00:00Z",
    }),
    expectedOutput: '{"domain":"https://bad.com","address":"7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY","nonce":"short","issuedAt":"2024-01-01T00:00:00Z","expirationTime":null,"statement":"Sign in to https://bad.com","valid":false,"errors":["Domain must not include protocol","Nonce must be at least 8 characters"]}',
  },
  {
    name: "rejects missing required fields",
    input: JSON.stringify({ domain: "", address: "short", nonce: "", issuedAt: "" }),
    expectedOutput: '{"domain":"","address":"short","nonce":"","issuedAt":"","expirationTime":null,"statement":"Sign in to ","valid":false,"errors":["Domain is required","Nonce must be at least 8 characters","Invalid address length","issuedAt is required"]}',
  },
];
