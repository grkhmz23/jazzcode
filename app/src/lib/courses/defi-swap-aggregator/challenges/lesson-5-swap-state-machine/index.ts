import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const result = processSwapStateMachine(input);
  return JSON.stringify(result);
}

function processSwapStateMachine(input) {
  // TODO: Implement the swap UI state machine
  // States: idle -> quoting -> ready -> sending -> confirming -> success | error
  // Each event transitions from one state to the next
  // Invalid transitions should produce an error state
  var state = "idle";
  var history = [];
  var events = input.events || [];

  for (var i = 0; i < events.length; i++) {
    // TODO: process each event and update state
    history.push({ from: state, event: events[i].type, to: state });
  }

  return {
    finalState: state,
    transitions: history,
    errorMessage: null,
  };
}
`;

export const lesson5SolutionCode = `function run(input) {
  const result = processSwapStateMachine(input);
  return JSON.stringify(result);
}

function processSwapStateMachine(input) {
  var TRANSITIONS = {
    idle: { REQUEST_QUOTE: "quoting" },
    quoting: { QUOTE_SUCCESS: "ready", QUOTE_ERROR: "error" },
    ready: { SEND_SWAP: "sending", CANCEL: "idle", QUOTE_EXPIRED: "idle" },
    sending: { TX_SUBMITTED: "confirming", SEND_ERROR: "error" },
    confirming: { TX_CONFIRMED: "success", TX_FAILED: "error" },
    success: { RESET: "idle" },
    error: { RESET: "idle", RETRY: "quoting" },
  };

  var state = "idle";
  var history = [];
  var errorMessage = null;

  var events = input.events || [];
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    var nextStates = TRANSITIONS[state];
    if (nextStates && nextStates[event.type]) {
      var from = state;
      state = nextStates[event.type];
      history.push({ from: from, event: event.type, to: state });
      if (state === "error" && event.message) {
        errorMessage = event.message;
      }
      if (state !== "error") {
        errorMessage = null;
      }
    } else {
      var from2 = state;
      errorMessage = "Invalid transition: " + event.type + " from " + state;
      state = "error";
      history.push({ from: from2, event: event.type, to: "error" });
    }
  }

  return {
    finalState: state,
    transitions: history,
    errorMessage: errorMessage,
  };
}
`;

export const lesson5Hints: string[] = [
  "Define a TRANSITIONS map: each key is a state, each value maps event names to next states.",
  "If an event is not valid for the current state, transition to 'error' with a descriptive message.",
  "Track each transition in a history array with {from, event, to} objects.",
  "The 'error' state supports RESET (back to idle) and RETRY (back to quoting).",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "happy path swap flow",
    input: JSON.stringify({
      events: [
        { type: "REQUEST_QUOTE" },
        { type: "QUOTE_SUCCESS" },
        { type: "SEND_SWAP" },
        { type: "TX_SUBMITTED" },
        { type: "TX_CONFIRMED" },
      ],
    }),
    expectedOutput: '{"finalState":"success","transitions":[{"from":"idle","event":"REQUEST_QUOTE","to":"quoting"},{"from":"quoting","event":"QUOTE_SUCCESS","to":"ready"},{"from":"ready","event":"SEND_SWAP","to":"sending"},{"from":"sending","event":"TX_SUBMITTED","to":"confirming"},{"from":"confirming","event":"TX_CONFIRMED","to":"success"}],"errorMessage":null}',
  },
  {
    name: "quote error with retry",
    input: JSON.stringify({
      events: [
        { type: "REQUEST_QUOTE" },
        { type: "QUOTE_ERROR", message: "429 rate limited" },
        { type: "RETRY" },
        { type: "QUOTE_SUCCESS" },
      ],
    }),
    expectedOutput: '{"finalState":"ready","transitions":[{"from":"idle","event":"REQUEST_QUOTE","to":"quoting"},{"from":"quoting","event":"QUOTE_ERROR","to":"error"},{"from":"error","event":"RETRY","to":"quoting"},{"from":"quoting","event":"QUOTE_SUCCESS","to":"ready"}],"errorMessage":null}',
  },
  {
    name: "invalid transition produces error",
    input: JSON.stringify({
      events: [
        { type: "SEND_SWAP" },
      ],
    }),
    expectedOutput: '{"finalState":"error","transitions":[{"from":"idle","event":"SEND_SWAP","to":"error"}],"errorMessage":"Invalid transition: SEND_SWAP from idle"}',
  },
];
