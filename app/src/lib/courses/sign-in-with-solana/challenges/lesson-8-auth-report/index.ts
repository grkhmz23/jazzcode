import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  const report = generateAuthReport(input);
  return JSON.stringify(report);
}

function generateAuthReport(input) {
  // TODO: Generate an auth audit report
  return { totalAttempts: 0, successfulSignIns: 0, failedSignIns: 0, replayAttemptsBlocked: 0, uniqueAddresses: 0, nonceRegistry: [], timestamp: 0 };
}
`;

export const lesson8SolutionCode = `function run(input) {
  const report = generateAuthReport(input);
  return JSON.stringify(report);
}

function generateAuthReport(input) {
  var attempts = input.attempts || [];
  var timestamp = input.timestamp;

  var successful = 0;
  var failed = 0;
  var replayBlocked = 0;
  var usedNonces = {};
  var addressSet = {};

  var nonceRegistry = [];

  for (var i = 0; i < attempts.length; i++) {
    var a = attempts[i];
    addressSet[a.address] = true;

    if (usedNonces[a.nonce]) {
      replayBlocked++;
      failed++;
      nonceRegistry.push({ nonce: a.nonce, status: "replay-blocked", address: a.address });
    } else if (a.verified) {
      successful++;
      usedNonces[a.nonce] = true;
      nonceRegistry.push({ nonce: a.nonce, status: "consumed", address: a.address });
    } else {
      failed++;
      nonceRegistry.push({ nonce: a.nonce, status: "rejected", address: a.address });
    }
  }

  return { totalAttempts: attempts.length, successfulSignIns: successful, failedSignIns: failed, replayAttemptsBlocked: replayBlocked, uniqueAddresses: Object.keys(addressSet).length, nonceRegistry: nonceRegistry, timestamp: timestamp };
}
`;

export const lesson8Hints: string[] = [
  "Track used nonces in a map. If a nonce was already used, it's a replay attempt.",
  "Count successful (verified + new nonce), failed (not verified), and replay-blocked separately.",
  "Use an address set to count unique addresses.",
  "Build nonce registry with status: 'consumed', 'rejected', or 'replay-blocked'.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "generates auth report with replay detection",
    input: JSON.stringify({
      attempts: [
        { address: "Wallet111", nonce: "nonce001", verified: true },
        { address: "Wallet222", nonce: "nonce002", verified: true },
        { address: "Wallet111", nonce: "nonce001", verified: true },
        { address: "Wallet333", nonce: "nonce003", verified: false },
      ],
      timestamp: 1700000000,
    }),
    expectedOutput: '{"totalAttempts":4,"successfulSignIns":2,"failedSignIns":2,"replayAttemptsBlocked":1,"uniqueAddresses":3,"nonceRegistry":[{"nonce":"nonce001","status":"consumed","address":"Wallet111"},{"nonce":"nonce002","status":"consumed","address":"Wallet222"},{"nonce":"nonce001","status":"replay-blocked","address":"Wallet111"},{"nonce":"nonce003","status":"rejected","address":"Wallet333"}],"timestamp":1700000000}',
  },
  {
    name: "all successful with no replays",
    input: JSON.stringify({
      attempts: [
        { address: "Wallet111", nonce: "aaa11111", verified: true },
        { address: "Wallet111", nonce: "bbb22222", verified: true },
      ],
      timestamp: 1700001000,
    }),
    expectedOutput: '{"totalAttempts":2,"successfulSignIns":2,"failedSignIns":0,"replayAttemptsBlocked":0,"uniqueAddresses":1,"nonceRegistry":[{"nonce":"aaa11111","status":"consumed","address":"Wallet111"},{"nonce":"bbb22222","status":"consumed","address":"Wallet111"}],"timestamp":1700001000}',
  },
];
