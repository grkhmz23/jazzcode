import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return JSON.stringify(exportProtectionConfig(input));
}

function exportProtectionConfig(input) {
  return {
    course: "mempool-ux-defense",
    version: 1,
    policy: {
      minBps: input.minBps,
      maxBps: input.maxBps,
      staleQuoteMs: input.staleQuoteMs,
      riskGrade: input.riskGrade,
    },
  };
}
`;

export const lesson8SolutionCode = lesson8StarterCode;

export const lesson8Hints: string[] = [
  "Checkpoint output should be deterministic JSON for copy/export behavior.",
  "Do not include timestamps or random IDs.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "exports deterministic swap protection config",
    input: JSON.stringify({ minBps: 20, maxBps: 120, staleQuoteMs: 12000, riskGrade: "high" }),
    expectedOutput:
      '{"course":"mempool-ux-defense","version":1,"policy":{"minBps":20,"maxBps":120,"staleQuoteMs":12000,"riskGrade":"high"}}',
  },
  {
    name: "exports deterministic config for low-risk profile",
    input: JSON.stringify({ minBps: 10, maxBps: 40, staleQuoteMs: 5000, riskGrade: "low" }),
    expectedOutput:
      '{"course":"mempool-ux-defense","version":1,"policy":{"minBps":10,"maxBps":40,"staleQuoteMs":5000,"riskGrade":"low"}}',
  },
];
