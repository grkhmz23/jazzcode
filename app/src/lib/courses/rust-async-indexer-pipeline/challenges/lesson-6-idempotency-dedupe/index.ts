import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  return JSON.stringify(dedupeByIdempotency(input.events));
}

function dedupeByIdempotency(events) {
  const seen = new Set();
  const deduped = [];
  for (const event of events) {
    if (seen.has(event.idempotencyKey)) continue;
    seen.add(event.idempotencyKey);
    deduped.push(event.idempotencyKey);
  }
  return deduped.sort((a, b) => a.localeCompare(b));
}
`;

export const lesson6SolutionCode = lesson6StarterCode;

export const lesson6Hints = [
  "Use idempotency keys to collapse duplicate replay events.",
  "Return stable sorted keys for deterministic snapshots.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "dedupes idempotency keys",
    input: JSON.stringify({ events: [{ idempotencyKey: "k2" }, { idempotencyKey: "k1" }, { idempotencyKey: "k2" }] }),
    expectedOutput: '["k1","k2"]',
  },
  {
    name: "returns empty list when no events are present",
    input: JSON.stringify({ events: [] }),
    expectedOutput: "[]",
  },
];
