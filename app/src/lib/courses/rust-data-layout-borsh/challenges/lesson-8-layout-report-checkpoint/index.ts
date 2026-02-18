import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return JSON.stringify(layoutReport(input));
}

function layoutReport(input) {
  const json = JSON.stringify({ fields: input.fields, totalSize: input.totalSize, structAlign: input.structAlign, trailingPadding: input.trailingPadding });
  const markdown = "# Account Layout Report\\n\\n- Total size: " + input.totalSize + "\\n- Struct align: " + input.structAlign;
  return { json, markdown };
}
`;

export const lesson8SolutionCode = lesson8StarterCode;

export const lesson8Hints = [
  "Checkpoint should export stable JSON + markdown.",
  "Avoid random IDs and timestamps in output.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "exports deterministic layout report",
    input: JSON.stringify({ fields: [{ name: "flag", offset: 0 }], totalSize: 16, structAlign: 8, trailingPadding: 0 }),
    expectedOutput:
      '{"json":"{\\"fields\\":[{\\"name\\":\\"flag\\",\\"offset\\":0}],\\"totalSize\\":16,\\"structAlign\\":8,\\"trailingPadding\\":0}","markdown":"# Account Layout Report\\n\\n- Total size: 16\\n- Struct align: 8"}',
  },
];
