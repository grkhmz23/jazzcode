import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  return JSON.stringify({ finalState: {}, snapshots: [], checksum: "" });
}
`;

export const lesson5SolutionCode = `function run(input) {
  const ordered = [...input.events].sort((a, b) => (a.ts - b.ts) || a.id.localeCompare(b.id));
  const interval = input.interval;
  const snapshots = [];
  const seen = {};
  let appliedCount = 0;

  for (let i = 0; i < ordered.length; i += 1) {
    const event = ordered[i];
    if (seen[event.id]) continue;
    seen[event.id] = true;
    appliedCount += 1;

    if (appliedCount % interval === 0 || i === ordered.length - 1) {
      snapshots.push({ eventIndex: appliedCount, eventId: event.id });
    }
  }

  const checksum = "snap_" + snapshots.map((item) => item.eventId).join("|");
  return JSON.stringify({ finalState: { eventsApplied: Object.keys(seen).length }, snapshots, checksum });
}
`;

export const lesson5Hints: string[] = [
  "Determinism starts with sorting by ts then id.",
  "Deduplicate by event id before snapshot interval checks.",
  "Build checksum from stable snapshot metadata, not random values.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "creates deterministic snapshots and checksum",
    input: JSON.stringify({
      interval: 2,
      events: [
        { id: "b", ts: 2 },
        { id: "a", ts: 1 },
        { id: "b", ts: 2 },
        { id: "c", ts: 3 }
      ]
    }),
    expectedOutput:
      '{"finalState":{"eventsApplied":3},"snapshots":[{"eventIndex":2,"eventId":"b"},{"eventIndex":3,"eventId":"c"}],"checksum":"snap_b|c"}'
  },
  {
    name: "still emits final snapshot when interval exceeds event count",
    input: JSON.stringify({
      interval: 10,
      events: [
        { id: "z", ts: 1 },
        { id: "z", ts: 1 }
      ]
    }),
    expectedOutput:
      '{"finalState":{"eventsApplied":1},"snapshots":[],"checksum":"snap_"}'
  }
];
