import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return buildFlowSafetyReport(input);
}

function buildFlowSafetyReport(input) {
  const lines = [
    "# Flow Safety Report",
    "",
    "- Steps: " + input.steps,
    "- Issues: " + input.issues,
    "- Status: " + (input.issues > 0 ? "FAIL" : "PASS"),
  ];
  return lines.join("\\n");
}
`;

export const lesson8SolutionCode = lesson8StarterCode;

export const lesson8Hints: string[] = [
  "Render a stable markdown report as the final checkpoint artifact.",
  "Keep the PASS/FAIL status deterministic from issue count.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "renders stable checkpoint report",
    input: JSON.stringify({ steps: 4, issues: 1 }),
    expectedOutput: "# Flow Safety Report\\n\\n- Steps: 4\\n- Issues: 1\\n- Status: FAIL",
  },
  {
    name: "renders PASS when there are zero issues",
    input: JSON.stringify({ steps: 3, issues: 0 }),
    expectedOutput: "# Flow Safety Report\\n\\n- Steps: 3\\n- Issues: 0\\n- Status: PASS",
  },
];
