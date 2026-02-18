import type { TestCase } from "@/types/content";

export const lesson7StarterCode = `function run(input) {
  const markdown = renderFeeMarkdown(input);
  return markdown;
}

function renderFeeMarkdown(input) {
  const lines = [
    "# Fee Strategy",
    "",
    "- Confirmation: " + input.confirmationLevel,
    "- Compute units: " + input.units,
    "- Priority fee: " + input.microLamports + " micro-lamports/CU",
    "- Confidence: " + input.confidence,
  ];
  return lines.join("\\n");
}
`;

export const lesson7SolutionCode = lesson7StarterCode;

export const lesson7Hints: string[] = [
  "Markdown output should be deterministic and human-readable.",
  "Avoid timestamps or random IDs in output.",
];

export const lesson7TestCases: TestCase[] = [
  {
    name: "renders stable markdown",
    input: JSON.stringify({ confirmationLevel: "confirmed", units: 220000, microLamports: 1800, confidence: "medium" }),
    expectedOutput:
      "# Fee Strategy\\n\\n- Confirmation: confirmed\\n- Compute units: 220000\\n- Priority fee: 1800 micro-lamports/CU\\n- Confidence: medium",
  },
];
