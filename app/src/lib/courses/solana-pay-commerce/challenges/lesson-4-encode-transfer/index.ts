import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const result = encodeTransferRequest(input);
  return JSON.stringify(result);
}

function encodeTransferRequest(input) {
  // TODO: Encode a Solana Pay transfer request URL
  // Format: solana:<recipient>?amount=<amount>&spl-token=<mint>&reference=<ref>&label=<label>&message=<msg>
  // 1. Validate recipient address (base58, 32-44 chars)
  // 2. Validate amount (positive number)
  // 3. Build URL with query parameters
  return { url: "", valid: false, errors: [] };
}
`;

export const lesson4SolutionCode = `function run(input) {
  const result = encodeTransferRequest(input);
  return JSON.stringify(result);
}

function encodeTransferRequest(input) {
  var errors = [];
  var recipient = input.recipient || "";
  var amount = input.amount;
  var splToken = input.splToken;
  var reference = input.reference;
  var label = input.label;
  var message = input.message;

  if (!recipient || recipient.length < 32 || recipient.length > 44) {
    errors.push("Invalid recipient address");
  }
  if (!isValidBase58(recipient)) {
    errors.push("Recipient is not valid base58");
  }
  if (amount === undefined || amount === null || Number(amount) <= 0 || !Number.isFinite(Number(amount))) {
    errors.push("Amount must be a positive number");
  }

  if (errors.length > 0) {
    return { url: "", valid: false, errors: errors };
  }

  var url = "solana:" + recipient;
  var params = [];
  params.push("amount=" + amount);
  if (splToken) params.push("spl-token=" + splToken);
  if (reference) params.push("reference=" + reference);
  if (label) params.push("label=" + encodeURIComponent(label));
  if (message) params.push("message=" + encodeURIComponent(message));

  url += "?" + params.join("&");

  return { url: url, valid: true, errors: [] };
}

function isValidBase58(str) {
  var alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  for (var i = 0; i < str.length; i++) {
    if (alphabet.indexOf(str[i]) === -1) return false;
  }
  return true;
}
`;

export const lesson4Hints: string[] = [
  "Solana Pay URL format: solana:<recipient>?amount=<amount>&spl-token=<mint>&reference=<ref>&label=<label>&message=<msg>",
  "Validate recipient: must be 32-44 characters of valid base58.",
  "Amount must be a positive finite number.",
  "Use encodeURIComponent for label and message to handle special characters.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "encodes SOL transfer request",
    input: JSON.stringify({
      recipient: "7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY",
      amount: "1.5",
      label: "Coffee Shop",
      message: "Order #42",
    }),
    expectedOutput: '{"url":"solana:7Y4f3Taf6YKqz3Y3h2Hj9uV4UT2Df6gKGfE6q8SxT6aY?amount=1.5&label=Coffee%20Shop&message=Order%20%2342","valid":true,"errors":[]}',
  },
  {
    name: "encodes SPL token transfer with reference",
    input: JSON.stringify({
      recipient: "8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo",
      amount: "100",
      splToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      reference: "Ref1111111111111111111111111111111111111111",
    }),
    expectedOutput: '{"url":"solana:8fj6zQ5yGS8nD6KSqg6fC5QdP53r5v6pk7v4Uy6Rr2Fo?amount=100&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&reference=Ref1111111111111111111111111111111111111111","valid":true,"errors":[]}',
  },
  {
    name: "rejects invalid inputs",
    input: JSON.stringify({ recipient: "short", amount: "-5" }),
    expectedOutput: '{"url":"","valid":false,"errors":["Invalid recipient address","Amount must be a positive number"]}',
  },
];
