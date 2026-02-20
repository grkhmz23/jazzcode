import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  return JSON.stringify(dedupeEvents(input.events));
}

function dedupeEvents(events) {
  const map = new Map();
  for (const event of events || []) {
    const key = event.slot + ":" + event.txSignature + ":" + event.instructionIndex + ":" + event.kind + ":" + event.account;
    map.set(key, event);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((entry) => entry[1]);
}
`;

export const lesson4SolutionCode = lesson4StarterCode;

export const lesson4Hints: string[] = [
  "Build stable composite keys for dedupe.",
  "Sort by key so output is deterministic across runs.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "dedupes duplicate events",
    input: JSON.stringify({
      events: [
        { slot: 100, txSignature: "sig1", instructionIndex: 0, account: "alice", kind: "deposit", amount: 20 },
        { slot: 100, txSignature: "sig1", instructionIndex: 0, account: "alice", kind: "deposit", amount: 20 },
        { slot: 101, txSignature: "sig2", instructionIndex: 1, account: "bob", kind: "withdraw", amount: 5 },
      ],
    }),
    expectedOutput:
      '[{"slot":100,"txSignature":"sig1","instructionIndex":0,"account":"alice","kind":"deposit","amount":20},{"slot":101,"txSignature":"sig2","instructionIndex":1,"account":"bob","kind":"withdraw","amount":5}]',
  },
  {
    name: "returns empty array when input has no events",
    input: JSON.stringify({ events: [] }),
    expectedOutput: "[]",
  },
];
