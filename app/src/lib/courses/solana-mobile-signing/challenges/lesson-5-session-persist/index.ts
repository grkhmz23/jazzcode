import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const result = manageSessionPersistence(input);
  return JSON.stringify(result);
}

function manageSessionPersistence(input) {
  // TODO: Manage session persistence for mobile wallet
  // 1. Process actions: save, restore, clear, expire
  // 2. Track wallet address and last sign request
  // 3. Handle session expiry based on timestamp
  // 4. Return current session state
  return {
    walletAddress: null,
    lastRequestId: null,
    sessionActive: false,
    expiresAt: 0,
    actionLog: [],
  };
}
`;

export const lesson5SolutionCode = `function run(input) {
  const result = manageSessionPersistence(input);
  return JSON.stringify(result);
}

function manageSessionPersistence(input) {
  var actions = input.actions || [];
  var sessionTTL = input.sessionTTL || 3600;
  var currentTime = input.currentTime || 0;

  var walletAddress = null;
  var lastRequestId = null;
  var sessionActive = false;
  var expiresAt = 0;
  var actionLog = [];

  for (var i = 0; i < actions.length; i++) {
    var action = actions[i];
    var ts = action.timestamp || currentTime;

    if (action.type === "save") {
      walletAddress = action.walletAddress || walletAddress;
      lastRequestId = action.requestId || lastRequestId;
      sessionActive = true;
      expiresAt = ts + sessionTTL;
      actionLog.push({ action: "save", timestamp: ts, success: true });
    } else if (action.type === "restore") {
      if (sessionActive && ts < expiresAt) {
        actionLog.push({ action: "restore", timestamp: ts, success: true });
      } else {
        walletAddress = null;
        lastRequestId = null;
        sessionActive = false;
        expiresAt = 0;
        actionLog.push({ action: "restore", timestamp: ts, success: false });
      }
    } else if (action.type === "clear") {
      walletAddress = null;
      lastRequestId = null;
      sessionActive = false;
      expiresAt = 0;
      actionLog.push({ action: "clear", timestamp: ts, success: true });
    } else if (action.type === "expire_check") {
      if (sessionActive && ts >= expiresAt) {
        walletAddress = null;
        lastRequestId = null;
        sessionActive = false;
        expiresAt = 0;
        actionLog.push({ action: "expire_check", timestamp: ts, success: true });
      } else {
        actionLog.push({ action: "expire_check", timestamp: ts, success: false });
      }
    }
  }

  return {
    walletAddress: walletAddress,
    lastRequestId: lastRequestId,
    sessionActive: sessionActive,
    expiresAt: expiresAt,
    actionLog: actionLog,
  };
}
`;

export const lesson5Hints: string[] = [
  "Process actions sequentially: each action modifies the session state.",
  "Save sets walletAddress, lastRequestId, sessionActive=true, and expiresAt = timestamp + TTL.",
  "Restore succeeds only if session is active AND current time < expiresAt.",
  "Expire check clears session if current time >= expiresAt.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "save and restore session",
    input: JSON.stringify({
      sessionTTL: 3600,
      currentTime: 1700000000,
      actions: [
        { type: "save", timestamp: 1700000000, walletAddress: "Wallet111", requestId: "req_001" },
        { type: "restore", timestamp: 1700000100 },
      ],
    }),
    expectedOutput: '{"walletAddress":"Wallet111","lastRequestId":"req_001","sessionActive":true,"expiresAt":1700003600,"actionLog":[{"action":"save","timestamp":1700000000,"success":true},{"action":"restore","timestamp":1700000100,"success":true}]}',
  },
  {
    name: "expired session fails restore",
    input: JSON.stringify({
      sessionTTL: 600,
      currentTime: 1700000000,
      actions: [
        { type: "save", timestamp: 1700000000, walletAddress: "Wallet222", requestId: "req_002" },
        { type: "expire_check", timestamp: 1700000700 },
        { type: "restore", timestamp: 1700000701 },
      ],
    }),
    expectedOutput: '{"walletAddress":null,"lastRequestId":null,"sessionActive":false,"expiresAt":0,"actionLog":[{"action":"save","timestamp":1700000000,"success":true},{"action":"expire_check","timestamp":1700000700,"success":true},{"action":"restore","timestamp":1700000701,"success":false}]}',
  },
  {
    name: "clear session explicitly",
    input: JSON.stringify({
      sessionTTL: 3600,
      currentTime: 1700000000,
      actions: [
        { type: "save", timestamp: 1700000000, walletAddress: "Wallet333", requestId: "req_003" },
        { type: "clear", timestamp: 1700000050 },
      ],
    }),
    expectedOutput: '{"walletAddress":null,"lastRequestId":null,"sessionActive":false,"expiresAt":0,"actionLog":[{"action":"save","timestamp":1700000000,"success":true},{"action":"clear","timestamp":1700000050,"success":true}]}',
  },
];
