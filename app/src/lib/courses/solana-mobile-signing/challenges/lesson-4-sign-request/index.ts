import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const result = buildSignRequest(input);
  return JSON.stringify(result);
}

function buildSignRequest(input) {
  // TODO: Build a typed sign request for Mobile Wallet Adapter
  // 1. Validate the payload type (transaction or message)
  // 2. Validate the payload data (base64 for tx, utf8 for message)
  // 3. Set session metadata (app identity, cluster)
  // 4. Return a structured SignRequest
  return {
    type: "",
    payload: "",
    appIdentity: { name: "", uri: "", icon: "" },
    cluster: "",
    requestId: "",
    valid: false,
    errors: [],
  };
}

function isValidBase64(str) {
  if (!str || str.length === 0) return false;
  var regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return regex.test(str) && str.length % 4 === 0;
}
`;

export const lesson4SolutionCode = `function run(input) {
  const result = buildSignRequest(input);
  return JSON.stringify(result);
}

function buildSignRequest(input) {
  var errors = [];
  var type = input.type;

  if (type !== "transaction" && type !== "message") {
    errors.push("Invalid payload type: must be transaction or message");
  }

  if (type === "transaction") {
    if (!input.payload || !isValidBase64(input.payload)) {
      errors.push("Transaction payload must be valid base64");
    }
  } else if (type === "message") {
    if (!input.payload || typeof input.payload !== "string" || input.payload.length === 0) {
      errors.push("Message payload must be a non-empty string");
    }
  }

  var appIdentity = input.appIdentity || {};
  if (!appIdentity.name || typeof appIdentity.name !== "string") {
    errors.push("App identity name is required");
  }
  if (!appIdentity.uri || typeof appIdentity.uri !== "string") {
    errors.push("App identity URI is required");
  }

  var cluster = input.cluster || "mainnet-beta";
  if (!["mainnet-beta", "devnet", "testnet"].includes(cluster)) {
    errors.push("Invalid cluster: must be mainnet-beta, devnet, or testnet");
  }

  var requestId = input.requestId || "req_" + input.type + "_" + (input.payload || "").slice(0, 8);

  return {
    type: type,
    payload: input.payload || "",
    appIdentity: {
      name: appIdentity.name || "",
      uri: appIdentity.uri || "",
      icon: appIdentity.icon || "",
    },
    cluster: cluster,
    requestId: requestId,
    valid: errors.length === 0,
    errors: errors,
  };
}

function isValidBase64(str) {
  if (!str || str.length === 0) return false;
  var regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return regex.test(str) && str.length % 4 === 0;
}
`;

export const lesson4Hints: string[] = [
  "Validate type is either 'transaction' or 'message' before checking payload format.",
  "Transaction payloads must be valid base64 (A-Z, a-z, 0-9, +, /, optional = padding, length divisible by 4).",
  "App identity requires at least name and URI. Icon is optional but should default to empty string.",
  "Generate a requestId from type + payload prefix if not provided.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "valid transaction sign request",
    input: JSON.stringify({
      type: "transaction",
      payload: "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB",
      appIdentity: { name: "MyDApp", uri: "https://mydapp.com", icon: "https://mydapp.com/icon.png" },
      cluster: "devnet",
      requestId: "req_tx_001",
    }),
    expectedOutput: '{"type":"transaction","payload":"AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB","appIdentity":{"name":"MyDApp","uri":"https://mydapp.com","icon":"https://mydapp.com/icon.png"},"cluster":"devnet","requestId":"req_tx_001","valid":true,"errors":[]}',
  },
  {
    name: "valid message sign request",
    input: JSON.stringify({
      type: "message",
      payload: "Please sign this message to verify your identity.",
      appIdentity: { name: "AuthApp", uri: "https://auth.example.com", icon: "" },
      cluster: "mainnet-beta",
    }),
    expectedOutput: '{"type":"message","payload":"Please sign this message to verify your identity.","appIdentity":{"name":"AuthApp","uri":"https://auth.example.com","icon":""},"cluster":"mainnet-beta","requestId":"req_message_Please s","valid":true,"errors":[]}',
  },
  {
    name: "invalid request with multiple errors",
    input: JSON.stringify({
      type: "unknown",
      payload: "",
      appIdentity: { name: "", uri: "" },
      cluster: "localnet",
    }),
    expectedOutput: '{"type":"unknown","payload":"","appIdentity":{"name":"","uri":"","icon":""},"cluster":"localnet","requestId":"req_unknown_","valid":false,"errors":["Invalid payload type: must be transaction or message","App identity name is required","App identity URI is required","Invalid cluster: must be mainnet-beta, devnet, or testnet"]}',
  },
];
