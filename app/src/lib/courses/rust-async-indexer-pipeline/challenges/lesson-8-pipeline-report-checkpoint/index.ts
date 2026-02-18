import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return JSON.stringify(pipelineRunReport(input));
}

function pipelineRunReport(input) {
  return {
    json: JSON.stringify(input),
    markdown: "# Async Pipeline Run Report\\n\\n- Total ticks: " + input.totalTicks + "\\n- Completed tasks: " + input.completedOrder.join(", "),
  };
}
`;

export const lesson8SolutionCode = lesson8StarterCode;

export const lesson8Hints = [
  "Checkpoint output should mirror deterministic pipeline run artifacts.",
  "Include both machine and human-readable export fields.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "exports deterministic pipeline report",
    input: JSON.stringify({ totalTicks: 6, completedOrder: ["a", "b"] }),
    expectedOutput:
      '{"json":"{\\"totalTicks\\":6,\\"completedOrder\\":[\\"a\\",\\"b\\"]}","markdown":"# Async Pipeline Run Report\\n\\n- Total ticks: 6\\n- Completed tasks: a, b"}',
  },
];
