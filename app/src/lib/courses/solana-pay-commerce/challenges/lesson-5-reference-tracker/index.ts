import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const result = trackReference(input);
  return JSON.stringify(result);
}

function trackReference(input) {
  // TODO: Track payment references through confirmation states
  // States: pending -> found -> confirmed -> finalized | expired
  // Process events to update reference state
  return { reference: "", status: "pending", confirmations: 0, signature: null, history: [] };
}
`;

export const lesson5SolutionCode = `function run(input) {
  const result = trackReference(input);
  return JSON.stringify(result);
}

function trackReference(input) {
  var reference = input.reference;
  var events = input.events || [];
  var expiryTimeout = input.expiryTimeout || 120;

  var status = "pending";
  var confirmations = 0;
  var signature = null;
  var history = [];
  var startTime = events.length > 0 ? events[0].timestamp : 0;

  for (var i = 0; i < events.length; i++) {
    var ev = events[i];
    if (ev.type === "found" && status === "pending") {
      status = "found";
      signature = ev.signature || null;
      history.push({ from: "pending", to: "found", timestamp: ev.timestamp });
    } else if (ev.type === "confirmation" && (status === "found" || status === "confirmed")) {
      confirmations++;
      if (confirmations >= 1 && status === "found") {
        status = "confirmed";
        history.push({ from: "found", to: "confirmed", timestamp: ev.timestamp });
      }
    } else if (ev.type === "finalized" && status === "confirmed") {
      status = "finalized";
      history.push({ from: "confirmed", to: "finalized", timestamp: ev.timestamp });
    } else if (ev.type === "timeout_check") {
      if (status === "pending" && (ev.timestamp - startTime) >= expiryTimeout) {
        status = "expired";
        history.push({ from: "pending", to: "expired", timestamp: ev.timestamp });
      }
    }
  }

  return { reference: reference, status: status, confirmations: confirmations, signature: signature, history: history };
}
`;

export const lesson5Hints: string[] = [
  "Track state transitions: pending -> found -> confirmed -> finalized.",
  "The 'found' event sets the signature. 'confirmation' increments the counter.",
  "Timeout check expires the reference if still pending after expiryTimeout seconds.",
  "Record each state change in the history array.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "tracks reference through full lifecycle",
    input: JSON.stringify({
      reference: "Ref1111111111111111111111111111111111111111",
      expiryTimeout: 120,
      events: [
        { type: "found", timestamp: 1700000010, signature: "sig_abc123" },
        { type: "confirmation", timestamp: 1700000020 },
        { type: "finalized", timestamp: 1700000040 },
      ],
    }),
    expectedOutput: '{"reference":"Ref1111111111111111111111111111111111111111","status":"finalized","confirmations":1,"signature":"sig_abc123","history":[{"from":"pending","to":"found","timestamp":1700000010},{"from":"found","to":"confirmed","timestamp":1700000020},{"from":"confirmed","to":"finalized","timestamp":1700000040}]}',
  },
  {
    name: "reference expires on timeout",
    input: JSON.stringify({
      reference: "Ref2222222222222222222222222222222222222222",
      expiryTimeout: 60,
      events: [
        { type: "timeout_check", timestamp: 1700000000 },
        { type: "timeout_check", timestamp: 1700000070 },
      ],
    }),
    expectedOutput: '{"reference":"Ref2222222222222222222222222222222222222222","status":"expired","confirmations":0,"signature":null,"history":[{"from":"pending","to":"expired","timestamp":1700000070}]}',
  },
];
