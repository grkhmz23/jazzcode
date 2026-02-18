import type { TestCase } from "@/types/content";

export const lesson7StarterCode = `function run(input) {
  return JSON.stringify(swapSafetyBanner(input));
}

function swapSafetyBanner(input) {
  if (input.grade === "critical") {
    return {
      severity: "error",
      title: "High sandwich and execution risk",
      body: "Quote freshness, impact, or slippage policy indicates unacceptable risk. Refresh and reduce size.",
    };
  }
  if (input.grade === "high") {
    return {
      severity: "warning",
      title: "Elevated execution risk",
      body: "Proceed only if trade urgency is high. Tighten slippage and verify quote freshness.",
    };
  }
  if (input.grade === "medium") {
    return {
      severity: "warning",
      title: "Moderate risk",
      body: "Review route hops and price impact before signing.",
    };
  }
  return {
    severity: "info",
    title: "Swap protections active",
    body: "Current route is within configured defensive limits.",
  };
}
`;

export const lesson7SolutionCode = lesson7StarterCode;

export const lesson7Hints: string[] = [
  "Map risk grades to deterministic banner copy.",
  "Avoid exploit framing; keep copy defensive and user-focused.",
];

export const lesson7TestCases: TestCase[] = [
  {
    name: "renders critical banner",
    input: JSON.stringify({ grade: "critical" }),
    expectedOutput:
      '{"severity":"error","title":"High sandwich and execution risk","body":"Quote freshness, impact, or slippage policy indicates unacceptable risk. Refresh and reduce size."}',
  },
];
