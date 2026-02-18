import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  return JSON.stringify(planBackfill(input));
}

function planBackfill(input) {
  const ranges = (input.missingSlots || []).map((slot) => ({ from: slot, to: slot }));
  return {
    ranges,
    idempotencyKey: input.pipelineId + "-" + ranges.length,
    mode: ranges.length > 0 ? "backfill-required" : "up-to-date",
  };
}
`;

export const lesson6SolutionCode = lesson6StarterCode;

export const lesson6Hints: string[] = [
  "Backfills should be resumable and idempotent.",
  "Emit a deterministic key for replay-safe job scheduling.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "creates deterministic backfill plan",
    input: JSON.stringify({ pipelineId: "pipe-2", missingSlots: [8, 9] }),
    expectedOutput:
      '{"ranges":[{"from":8,"to":8},{"from":9,"to":9}],"idempotencyKey":"pipe-2-2","mode":"backfill-required"}',
  },
];
