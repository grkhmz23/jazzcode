import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const result = processConnectionEvents(input);
  return JSON.stringify(result);
}

function processConnectionEvents(input) {
  // TODO: Implement wallet connection state machine
  // States: disconnected -> connecting -> connected -> error
  // Process events and track transitions
  return { currentState: "disconnected", walletAddress: null, network: null, transitions: [], errorMessage: null };
}
`;

export const lesson4SolutionCode = `function run(input) {
  const result = processConnectionEvents(input);
  return JSON.stringify(result);
}

function processConnectionEvents(input) {
  var TRANSITIONS = {
    disconnected: { CONNECT: "connecting" },
    connecting: { CONNECTED: "connected", CONNECTION_ERROR: "error", TIMEOUT: "error" },
    connected: { DISCONNECT: "disconnected", NETWORK_CHANGE: "connected", ACCOUNT_CHANGE: "connected", CONNECTION_LOST: "error" },
    error: { RETRY: "connecting", DISCONNECT: "disconnected" },
  };

  var state = "disconnected";
  var walletAddress = null;
  var network = null;
  var transitions = [];
  var errorMessage = null;
  var events = input.events || [];

  for (var i = 0; i < events.length; i++) {
    var ev = events[i];
    var nextStates = TRANSITIONS[state];
    if (nextStates && nextStates[ev.type]) {
      var from = state;
      state = nextStates[ev.type];
      transitions.push({ from: from, event: ev.type, to: state });

      if (ev.type === "CONNECTED" || ev.type === "ACCOUNT_CHANGE") walletAddress = ev.walletAddress || walletAddress;
      if (ev.type === "CONNECTED" || ev.type === "NETWORK_CHANGE") network = ev.network || network;
      if (state === "error") errorMessage = ev.message || "Unknown error";
      if (state === "disconnected") { walletAddress = null; network = null; errorMessage = null; }
      if (ev.type === "RETRY") errorMessage = null;
    } else {
      var from2 = state;
      errorMessage = "Invalid event: " + ev.type + " in state " + state;
      state = "error";
      transitions.push({ from: from2, event: ev.type, to: "error" });
    }
  }

  return { currentState: state, walletAddress: walletAddress, network: network, transitions: transitions, errorMessage: errorMessage };
}
`;

export const lesson4Hints: string[] = [
  "Define a TRANSITIONS map: each state maps event types to next states.",
  "CONNECTED and ACCOUNT_CHANGE events carry walletAddress. CONNECTED and NETWORK_CHANGE carry network.",
  "Error state stores the error message. Disconnected clears all session data.",
  "Invalid events force transition to error state with descriptive message.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "happy path connection flow",
    input: JSON.stringify({ events: [
      { type: "CONNECT" },
      { type: "CONNECTED", walletAddress: "Wallet111", network: "mainnet-beta" },
    ]}),
    expectedOutput: '{"currentState":"connected","walletAddress":"Wallet111","network":"mainnet-beta","transitions":[{"from":"disconnected","event":"CONNECT","to":"connecting"},{"from":"connecting","event":"CONNECTED","to":"connected"}],"errorMessage":null}',
  },
  {
    name: "connection error with retry",
    input: JSON.stringify({ events: [
      { type: "CONNECT" },
      { type: "TIMEOUT", message: "Connection timed out" },
      { type: "RETRY" },
      { type: "CONNECTED", walletAddress: "Wallet222", network: "devnet" },
    ]}),
    expectedOutput: '{"currentState":"connected","walletAddress":"Wallet222","network":"devnet","transitions":[{"from":"disconnected","event":"CONNECT","to":"connecting"},{"from":"connecting","event":"TIMEOUT","to":"error"},{"from":"error","event":"RETRY","to":"connecting"},{"from":"connecting","event":"CONNECTED","to":"connected"}],"errorMessage":null}',
  },
  {
    name: "account switch while connected",
    input: JSON.stringify({ events: [
      { type: "CONNECT" },
      { type: "CONNECTED", walletAddress: "Wallet333", network: "mainnet-beta" },
      { type: "ACCOUNT_CHANGE", walletAddress: "Wallet444" },
    ]}),
    expectedOutput: '{"currentState":"connected","walletAddress":"Wallet444","network":"mainnet-beta","transitions":[{"from":"disconnected","event":"CONNECT","to":"connecting"},{"from":"connecting","event":"CONNECTED","to":"connected"},{"from":"connected","event":"ACCOUNT_CHANGE","to":"connected"}],"errorMessage":null}',
  },
];
