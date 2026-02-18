import type { TestCase } from "@/types/content";

export const lesson7StarterCode = `function run(input) {
  const parsed = JSON.parse(input);
  const lines = [
    "# Anchor Upgrade Summary",
    "",
    "- Release: " + parsed.releaseTag,
    "- Batches: " + parsed.totalBatches,
    "- Issues: " + parsed.issueCount,
  ];

  return lines.join("\\n");
}
`;

export const lesson7SolutionCode = lesson7StarterCode;

export const lesson7Hints: string[] = [
  "Keep line ordering and punctuation stable.",
  "Use bullet list fields for releaseTag, totalBatches, and issueCount.",
  "Return plain markdown string without trailing spaces.",
];

export const lesson7TestCases: TestCase[] = [
  {
    name: "formats markdown",
    input: JSON.stringify({ releaseTag: "v1.3.0", totalBatches: 4, issueCount: 1 }),
    expectedOutput: "# Anchor Upgrade Summary\\n\\n- Release: v1.3.0\\n- Batches: 4\\n- Issues: 1",
  },
];
