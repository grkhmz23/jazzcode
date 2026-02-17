import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return JSON.stringify(buildAuditCheckpoint(input));
}

function buildAuditCheckpoint(input) {
  return {
    course: "solana-security",
    version: "v1",
    scenarios: [],
    findings: 0,
  };
}
`;

export const lesson8SolutionCode = `function run(input) {
  return JSON.stringify(buildAuditCheckpoint(input));
}

function buildAuditCheckpoint(input) {
  return {
    course: "solana-security",
    version: "v1",
    scenarios: input.scenarioIds,
    findings: input.findingsCount,
  };
}
`;

export const lesson8Hints: string[] = [
  "Return stable, minimal checkpoint metadata.",
  "course must be solana-security and version must be v1.",
  "Preserve scenarioIds order as provided.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "builds checkpoint payload",
    input: JSON.stringify({
      scenarioIds: ["signer-missing", "owner-missing", "pda-spoof"],
      findingsCount: 3,
    }),
    expectedOutput:
      '{"course":"solana-security","version":"v1","scenarios":["signer-missing","owner-missing","pda-spoof"],"findings":3}',
  },
];
