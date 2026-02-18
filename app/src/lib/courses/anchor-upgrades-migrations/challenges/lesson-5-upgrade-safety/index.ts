import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const parsed = JSON.parse(input);
  const issues = [];

  if (!parsed.hasUpgradeAuthority) {
    issues.push("MISSING_UPGRADE_AUTHORITY");
  }
  if (!parsed.programDataMatchesReleaseHash) {
    issues.push("PROGRAM_HASH_MISMATCH");
  }
  if (!parsed.dryRunPassed) {
    issues.push("DRY_RUN_FAILED");
  }

  return JSON.stringify({ issueCount: issues.length, issues });
}
`;

export const lesson5SolutionCode = lesson5StarterCode;

export const lesson5Hints: string[] = [
  "Treat missing authority, hash mismatch, and failed dry run as blocking issues.",
  "Return issueCount plus ordered issue code array.",
  "Keep order stable to make report diffs deterministic.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "all clear",
    input: JSON.stringify({
      hasUpgradeAuthority: true,
      programDataMatchesReleaseHash: true,
      dryRunPassed: true,
    }),
    expectedOutput: '{"issueCount":0,"issues":[]}',
  },
  {
    name: "multiple blockers",
    input: JSON.stringify({
      hasUpgradeAuthority: false,
      programDataMatchesReleaseHash: false,
      dryRunPassed: false,
    }),
    expectedOutput:
      '{"issueCount":3,"issues":["MISSING_UPGRADE_AUTHORITY","PROGRAM_HASH_MISMATCH","DRY_RUN_FAILED"]}',
  },
];
