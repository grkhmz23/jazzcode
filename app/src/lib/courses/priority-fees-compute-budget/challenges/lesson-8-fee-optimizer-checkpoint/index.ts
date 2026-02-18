import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  const report = buildFeeOptimizerReport(input);
  return JSON.stringify(report);
}

function buildFeeOptimizerReport(input) {
  return {
    course: "priority-fees-compute-budget",
    version: 1,
    plan: {
      units: input.units,
      microLamports: input.microLamports,
      confirmationLevel: input.confirmationLevel,
    },
    warnings: (input.warnings || []).slice().sort((a, b) => a.localeCompare(b)),
  };
}
`;

export const lesson8SolutionCode = lesson8StarterCode;

export const lesson8Hints: string[] = [
  "Return stable JSON with sorted warning strings.",
  "Checkpoint report should avoid nondeterministic fields.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "builds deterministic checkpoint report",
    input: JSON.stringify({ units: 300000, microLamports: 2200, confirmationLevel: "confirmed", warnings: ["b", "a"] }),
    expectedOutput:
      '{"course":"priority-fees-compute-budget","version":1,"plan":{"units":300000,"microLamports":2200,"confirmationLevel":"confirmed"},"warnings":["a","b"]}',
  },
];
