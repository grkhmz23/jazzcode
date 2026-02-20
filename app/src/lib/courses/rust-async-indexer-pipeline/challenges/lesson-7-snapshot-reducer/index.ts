import type { TestCase } from "@/types/content";

export const lesson7StarterCode = `function run(input) {
  return JSON.stringify(snapshotReducer(input.events));
}

function snapshotReducer(events) {
  const state = {};
  const appliedKeys = [];
  for (const event of events) {
    appliedKeys.push(event.key);
    if (event.op === "delete") {
      delete state[event.key];
    } else {
      state[event.key] = event.value;
    }
  }
  const sortedState = Object.keys(state).sort((a, b) => a.localeCompare(b)).reduce((acc, key) => {
    acc[key] = state[key];
    return acc;
  }, {});
  return { state: sortedState, appliedKeys: appliedKeys.sort((a, b) => a.localeCompare(b)) };
}
`;

export const lesson7SolutionCode = lesson7StarterCode;

export const lesson7Hints = [
  "Reducer should be deterministic and idempotent-friendly.",
  "Sort output keys for stable report generation.",
];

export const lesson7TestCases: TestCase[] = [
  {
    name: "reduces to stable snapshot",
    input: JSON.stringify({ events: [{ key: "b", op: "upsert", value: 2 }, { key: "a", op: "upsert", value: 1 }] }),
    expectedOutput: '{"state":{"a":1,"b":2},"appliedKeys":["a","b"]}',
  },
  {
    name: "delete operations remove keys from final snapshot",
    input: JSON.stringify({
      events: [
        { key: "a", op: "upsert", value: 1 },
        { key: "a", op: "delete" },
        { key: "b", op: "upsert", value: 2 },
      ],
    }),
    expectedOutput: '{"state":{"b":2},"appliedKeys":["a","a","b"]}',
  },
  {
    name: "handles empty event list without mutations",
    input: JSON.stringify({ events: [] }),
    expectedOutput: '{"state":{},"appliedKeys":[]}',
  },
];
