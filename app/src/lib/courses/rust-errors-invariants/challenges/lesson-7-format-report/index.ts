import type { TestCase } from "@/types/content";

export const lesson7StarterCode = `function run(input) {
  return formatReport(input.chain);
}

function formatReport(chain) {
  const failCount = chain.steps.filter((step) => step.status === "fail").length;
  const lines = [
    "# Invariant Evidence Report",
    "",
    "- Total steps: " + chain.steps.length,
    "- Failures: " + failCount,
    "- Status: " + (failCount === 0 ? "PASS" : "FAIL"),
  ];
  for (const step of chain.steps) {
    lines.push("- [" + step.status + "] " + step.id + " @" + step.atMs + ": " + step.action + " -> " + step.detail);
  }
  return lines.join("\\n");
}
`;

export const lesson7SolutionCode = lesson7StarterCode;

export const lesson7Hints = [
  "Markdown report should preserve stable step order and deterministic formatting.",
  "Include aggregate status and per-step evidence lines.",
];

export const lesson7TestCases: TestCase[] = [
  {
    name: "formats stable invariant report",
    input: JSON.stringify({ chain: { steps: [{ id: "s1", atMs: 100, action: "check", status: "pass", detail: "ok" }] } }),
    expectedOutput:
      "# Invariant Evidence Report\\n\\n- Total steps: 1\\n- Failures: 0\\n- Status: PASS\\n- [pass] s1 @100: check -> ok",
  },
];
