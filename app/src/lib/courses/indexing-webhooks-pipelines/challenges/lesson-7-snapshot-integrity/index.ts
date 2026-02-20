import type { TestCase } from "@/types/content";

export const lesson7StarterCode = `function run(input) {
  return JSON.stringify(snapshotIntegrityCheck(input.snapshot));
}

function snapshotIntegrityCheck(snapshot) {
  const issues = [];
  for (const [account, balance] of Object.entries(snapshot.balances || {})) {
    if (typeof balance !== "number" || !Number.isFinite(balance)) {
      issues.push("non-finite balance for " + account);
    }
    if (balance < 0) {
      issues.push("negative balance for " + account);
    }
  }
  const applied = new Set(snapshot.appliedEventKeys || []);
  for (const finalized of snapshot.finalizedEventKeys || []) {
    if (!applied.has(finalized)) {
      issues.push("finalized event " + finalized + " missing from applied set");
    }
  }
  return { ok: issues.length === 0, issues };
}
`;

export const lesson7SolutionCode = lesson7StarterCode;

export const lesson7Hints: string[] = [
  "Integrity checks must fail on negative balances.",
  "Finalized keys must always be a subset of applied keys.",
];

export const lesson7TestCases: TestCase[] = [
  {
    name: "flags negative balance issue",
    input: JSON.stringify({ snapshot: { balances: { alice: -4 }, appliedEventKeys: ["a"], finalizedEventKeys: ["a"] } }),
    expectedOutput: '{"ok":false,"issues":["negative balance for alice"]}',
  },
  {
    name: "flags finalized key missing from applied set",
    input: JSON.stringify({
      snapshot: {
        balances: { alice: 1 },
        appliedEventKeys: ["a"],
        finalizedEventKeys: ["b"],
      },
    }),
    expectedOutput:
      '{"ok":false,"issues":["finalized event b missing from applied set"]}',
  },
];
