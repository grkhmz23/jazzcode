import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  const report = generateSessionReport(input);
  return JSON.stringify(report);
}

function generateSessionReport(input) {
  // TODO: Generate a comprehensive mobile signing session report
  // 1. Summarize sign requests (count by type, success/failure)
  // 2. Calculate session duration and uptime
  // 3. List retry attempts and outcomes
  // 4. Produce stable JSON output
  return {
    sessionId: "",
    walletAddress: "",
    totalRequests: 0,
    successfulSigns: 0,
    failedSigns: 0,
    retryAttempts: 0,
    sessionDurationSec: 0,
    requestBreakdown: { transaction: 0, message: 0 },
    timestamp: 0,
  };
}
`;

export const lesson8SolutionCode = `function run(input) {
  const report = generateSessionReport(input);
  return JSON.stringify(report);
}

function generateSessionReport(input) {
  var requests = input.requests || [];
  var sessionStart = input.sessionStart;
  var sessionEnd = input.sessionEnd;
  var walletAddress = input.walletAddress;
  var sessionId = input.sessionId;

  var totalRequests = requests.length;
  var successfulSigns = 0;
  var failedSigns = 0;
  var retryAttempts = 0;
  var txCount = 0;
  var msgCount = 0;

  for (var i = 0; i < requests.length; i++) {
    var req = requests[i];
    if (req.type === "transaction") txCount++;
    else if (req.type === "message") msgCount++;

    if (req.status === "signed") successfulSigns++;
    else if (req.status === "rejected" || req.status === "timeout" || req.status === "error") failedSigns++;

    if (req.retries && req.retries > 0) retryAttempts += req.retries;
  }

  var sessionDurationSec = sessionEnd - sessionStart;

  return {
    sessionId: sessionId,
    walletAddress: walletAddress,
    totalRequests: totalRequests,
    successfulSigns: successfulSigns,
    failedSigns: failedSigns,
    retryAttempts: retryAttempts,
    sessionDurationSec: sessionDurationSec,
    requestBreakdown: { transaction: txCount, message: msgCount },
    timestamp: sessionEnd,
  };
}
`;

export const lesson8Hints: string[] = [
  "Count requests by status: 'signed' = success, 'rejected'/'timeout'/'error' = failure.",
  "Sum retries across all requests for total retry attempts.",
  "Session duration = sessionEnd - sessionStart in seconds.",
  "Request breakdown counts how many were 'transaction' vs 'message' type.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "generates session report with mixed results",
    input: JSON.stringify({
      sessionId: "sess_abc123",
      walletAddress: "WalletABC111111111111111111111111111111111",
      sessionStart: 1700000000,
      sessionEnd: 1700000300,
      requests: [
        { type: "transaction", status: "signed", retries: 0 },
        { type: "transaction", status: "timeout", retries: 2 },
        { type: "message", status: "signed", retries: 0 },
        { type: "transaction", status: "signed", retries: 1 },
      ],
    }),
    expectedOutput: '{"sessionId":"sess_abc123","walletAddress":"WalletABC111111111111111111111111111111111","totalRequests":4,"successfulSigns":3,"failedSigns":1,"retryAttempts":3,"sessionDurationSec":300,"requestBreakdown":{"transaction":3,"message":1},"timestamp":1700000300}',
  },
  {
    name: "generates report for empty session",
    input: JSON.stringify({
      sessionId: "sess_empty",
      walletAddress: "WalletDEF222222222222222222222222222222222",
      sessionStart: 1700001000,
      sessionEnd: 1700001010,
      requests: [],
    }),
    expectedOutput: '{"sessionId":"sess_empty","walletAddress":"WalletDEF222222222222222222222222222222222","totalRequests":0,"successfulSigns":0,"failedSigns":0,"retryAttempts":0,"sessionDurationSec":10,"requestBreakdown":{"transaction":0,"message":0},"timestamp":1700001010}',
  },
];
