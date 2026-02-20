import type { TestCase } from "@/types/content";

export const lesson7StarterCode = `function run(input) {
  return JSON.stringify(suggestOptimizations(input));
}

function suggestOptimizations(metrics) {
  const suggestions = [];
  if (metrics.allocationsCost > 80) suggestions.push("Pre-allocate vectors and reuse buffers to reduce allocation churn.");
  if (metrics.cloneCost > 80) suggestions.push("Replace unnecessary clones with references or small copy primitives.");
  if (metrics.mapLookupCost > 120) suggestions.push("Avoid repeated map lookups in inner loops; cache lookups per account.");
  if (metrics.serializationCost > 120) suggestions.push("Batch serialization and avoid repeated encode/decode cycles.");
  if (suggestions.length === 0) suggestions.push("Current profile is balanced; keep regressions tracked with deterministic benchmarks.");
  return suggestions.sort((a, b) => a.localeCompare(b));
}
`;

export const lesson7SolutionCode = lesson7StarterCode;

export const lesson7Hints = [
  "Output suggestions as a stable, sorted list.",
  "Use threshold-based recommendations to avoid noisy advice.",
];

export const lesson7TestCases: TestCase[] = [
  {
    name: "returns optimization suggestions",
    input: JSON.stringify({ allocationsCost: 100, cloneCost: 10, mapLookupCost: 130, serializationCost: 10 }),
    expectedOutput:
      '["Avoid repeated map lookups in inner loops; cache lookups per account.","Pre-allocate vectors and reuse buffers to reduce allocation churn."]',
  },
  {
    name: "returns balanced guidance when thresholds are not exceeded",
    input: JSON.stringify({ allocationsCost: 10, cloneCost: 10, mapLookupCost: 10, serializationCost: 10 }),
    expectedOutput:
      '["Current profile is balanced; keep regressions tracked with deterministic benchmarks."]',
  },
];
