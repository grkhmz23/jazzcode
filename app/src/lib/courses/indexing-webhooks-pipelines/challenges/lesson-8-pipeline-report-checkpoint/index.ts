import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return pipelineReport(input);
}

function pipelineReport(input) {
  const lines = [
    "# Reorg-Safe Pipeline Report",
    "",
    "- Head slot: " + input.headSlot,
    "- Applied events: " + input.applied,
    "- Pending events: " + input.pending,
    "- Finalized events: " + input.finalized,
    "- Integrity: " + (input.ok ? "PASS" : "FAIL"),
  ];
  return lines.join("\\n");
}
`;

export const lesson8SolutionCode = lesson8StarterCode;

export const lesson8Hints: string[] = [
  "Checkpoint output should be markdown and deterministic.",
  "Include applied/pending/finalized counts and integrity result.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "renders pipeline report",
    input: JSON.stringify({ headSlot: 200, applied: 5, pending: 2, finalized: 4, ok: true }),
    expectedOutput:
      "# Reorg-Safe Pipeline Report\\n\\n- Head slot: 200\\n- Applied events: 5\\n- Pending events: 2\\n- Finalized events: 4\\n- Integrity: PASS",
  },
  {
    name: "renders FAIL report for integrity issues",
    input: JSON.stringify({ headSlot: 201, applied: 4, pending: 3, finalized: 2, ok: false }),
    expectedOutput:
      "# Reorg-Safe Pipeline Report\\n\\n- Head slot: 201\\n- Applied events: 4\\n- Pending events: 3\\n- Finalized events: 2\\n- Integrity: FAIL",
  },
];
