import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return JSON.stringify(perfReport(input.before, input.after));
}

function perfReport(before, after) {
  const reduction = before.totalCost - after.totalCost;
  const reductionPct = before.totalCost === 0 ? 0 : Number(((reduction / before.totalCost) * 100).toFixed(2));
  return {
    json: JSON.stringify({ before, after, reduction, reductionPct }),
    markdown: "# Compute Budget Profiler Report\\n\\n- Before total: " + before.totalCost + "\\n- After total: " + after.totalCost,
  };
}
`;

export const lesson8SolutionCode = lesson8StarterCode;

export const lesson8Hints = [
  "Checkpoint must include stable JSON and markdown outputs.",
  "Use deterministic percentage rounding.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "exports deterministic perf report",
    input: JSON.stringify({ before: { totalCost: 200 }, after: { totalCost: 150 } }),
    expectedOutput:
      '{"json":"{\\"before\\":{\\"totalCost\\":200},\\"after\\":{\\"totalCost\\":150},\\"reduction\\":50,\\"reductionPct\\":25}","markdown":"# Compute Budget Profiler Report\\n\\n- Before total: 200\\n- After total: 150"}',
  },
  {
    name: "handles zero baseline without division errors",
    input: JSON.stringify({ before: { totalCost: 0 }, after: { totalCost: 0 } }),
    expectedOutput:
      '{"json":"{\\"before\\":{\\"totalCost\\":0},\\"after\\":{\\"totalCost\\":0},\\"reduction\\":0,\\"reductionPct\\":0}","markdown":"# Compute Budget Profiler Report\\n\\n- Before total: 0\\n- After total: 0"}',
  },
];
