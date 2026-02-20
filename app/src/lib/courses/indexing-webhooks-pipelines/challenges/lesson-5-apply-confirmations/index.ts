import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  return JSON.stringify(applyWithConfirmations(input.events, input.rules));
}

function applyWithConfirmations(events, rules) {
  const balances = {};
  const appliedEventKeys = [];
  const pendingEventKeys = [];
  const finalizedEventKeys = [];

  const deduped = events.slice().sort((a, b) => {
    const ka = a.slot + ":" + a.txSignature + ":" + a.instructionIndex;
    const kb = b.slot + ":" + b.txSignature + ":" + b.instructionIndex;
    return ka.localeCompare(kb);
  });

  for (const event of deduped) {
    const depth = rules.headSlot - event.slot;
    const key = event.slot + ":" + event.txSignature + ":" + event.instructionIndex + ":" + event.kind + ":" + event.account;
    if (depth < rules.minConfirmedDepth) {
      pendingEventKeys.push(key);
      continue;
    }
    const current = balances[event.account] || 0;
    balances[event.account] = event.kind === "deposit" ? current + event.amount : current - event.amount;
    appliedEventKeys.push(key);
    if (depth >= rules.minFinalizedDepth) {
      finalizedEventKeys.push(key);
    }
  }

  return {
    balances,
    appliedEventKeys,
    pendingEventKeys,
    finalizedEventKeys,
    headSlot: rules.headSlot,
  };
}
`;

export const lesson5SolutionCode = lesson5StarterCode;

export const lesson5Hints: string[] = [
  "Apply only confirmed-depth events to state.",
  "Track pending and finalized sets separately for reorg safety.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "applies confirmed and marks pending",
    input: JSON.stringify({
      rules: { headSlot: 120, minConfirmedDepth: 3, minFinalizedDepth: 8 },
      events: [
        { slot: 115, txSignature: "sigA", instructionIndex: 0, account: "alice", kind: "deposit", amount: 10 },
        { slot: 119, txSignature: "sigB", instructionIndex: 0, account: "alice", kind: "withdraw", amount: 2 },
      ],
    }),
    expectedOutput:
      '{"balances":{"alice":10},"appliedEventKeys":["115:sigA:0:deposit:alice"],"pendingEventKeys":["119:sigB:0:withdraw:alice"],"finalizedEventKeys":[],"headSlot":120}',
  },
  {
    name: "marks deep event as finalized when depth threshold is met",
    input: JSON.stringify({
      rules: { headSlot: 120, minConfirmedDepth: 3, minFinalizedDepth: 8 },
      events: [
        { slot: 110, txSignature: "sigZ", instructionIndex: 0, account: "bob", kind: "deposit", amount: 7 },
      ],
    }),
    expectedOutput:
      '{"balances":{"bob":7},"appliedEventKeys":["110:sigZ:0:deposit:bob"],"pendingEventKeys":[],"finalizedEventKeys":["110:sigZ:0:deposit:bob"],"headSlot":120}',
  },
];
