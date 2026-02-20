import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return generatedSafetyReport(input.result);
}

function generatedSafetyReport(result) {
  const lines = [
    "# Generated Safety Report",
    "",
    "- Status: " + (result.ok ? "PASS" : "FAIL"),
    "- Failure count: " + result.failures.length,
  ];
  for (const failure of result.failures) {
    lines.push("- [" + failure.kind + "] " + failure.target + ": " + failure.reason);
  }
  return lines.join("\\n");
}
`;

export const lesson8SolutionCode = lesson8StarterCode;

export const lesson8Hints = [
  "Render a deterministic markdown report from generated check results.",
  "Include status and explicit failure details.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "renders generated safety report",
    input: JSON.stringify({ result: { ok: false, failures: [{ kind: "owner", target: "vault", reason: "owner mismatch" }] } }),
    expectedOutput:
      "# Generated Safety Report\\n\\n- Status: FAIL\\n- Failure count: 1\\n- [owner] vault: owner mismatch",
  },
  {
    name: "renders PASS report with no failures",
    input: JSON.stringify({ result: { ok: true, failures: [] } }),
    expectedOutput: "# Generated Safety Report\\n\\n- Status: PASS\\n- Failure count: 0",
  },
];
