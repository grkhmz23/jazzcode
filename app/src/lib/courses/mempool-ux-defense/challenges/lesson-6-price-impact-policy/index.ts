import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  return JSON.stringify(compareImpactAndSlippage(input));
}

function compareImpactAndSlippage(input) {
  const impact = Number(input.priceImpactBps || 0);
  const slippage = Number(input.slippageBps || 0);
  const ratio = slippage === 0 ? 0 : Number((impact / slippage).toFixed(2));

  return {
    impactBps: impact,
    slippageBps: slippage,
    ratio,
    interpretation: impact > slippage ? "impact-dominant" : "tolerance-dominant",
  };
}
`;

export const lesson6SolutionCode = lesson6StarterCode;

export const lesson6Hints: string[] = [
  "Teach difference: impact is market footprint, slippage is user tolerance.",
  "Return both ratio and interpretation for UI hints.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "identifies impact dominant trade",
    input: JSON.stringify({ priceImpactBps: 180, slippageBps: 90 }),
    expectedOutput: '{"impactBps":180,"slippageBps":90,"ratio":2,"interpretation":"impact-dominant"}',
  },
];
