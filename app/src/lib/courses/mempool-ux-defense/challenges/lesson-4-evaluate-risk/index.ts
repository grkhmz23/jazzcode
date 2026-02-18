import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  return JSON.stringify(evaluateSwapRisk(input));
}

function evaluateSwapRisk(input) {
  let score = 0;
  const reasons = [];
  if (input.quoteAgeMs > 25000) {
    score += 35;
    reasons.push("quote is stale relative to current mempool conditions");
  }
  if (input.slippageBps > 100) {
    score += 20;
    reasons.push("user slippage tolerance is wide");
  }
  if (input.priceImpactBps > 120) {
    score += 25;
    reasons.push("route has high projected price impact");
  }
  if (input.routeHops > 2) {
    score += 10;
    reasons.push("multi-hop route increases execution drift");
  }
  if (input.liquidityScore < 40) {
    score += 20;
    reasons.push("pool liquidity score is weak");
  }

  const grade = score >= 75 ? "critical" : score >= 50 ? "high" : score >= 25 ? "medium" : "low";
  return { grade, score, reasons };
}
`;

export const lesson4SolutionCode = lesson4StarterCode;

export const lesson4Hints: string[] = [
  "Use additive policy scoring from quote freshness, slippage, impact, route, and liquidity.",
  "Return both risk grade and concrete reasons for UX copy generation.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "flags critical risk route",
    input: JSON.stringify({ quoteAgeMs: 30000, slippageBps: 150, priceImpactBps: 220, routeHops: 3, liquidityScore: 20 }),
    expectedOutput:
      '{"grade":"critical","score":110,"reasons":["quote is stale relative to current mempool conditions","user slippage tolerance is wide","route has high projected price impact","multi-hop route increases execution drift","pool liquidity score is weak"]}',
  },
  {
    name: "returns low risk for fresh quote",
    input: JSON.stringify({ quoteAgeMs: 3000, slippageBps: 30, priceImpactBps: 25, routeHops: 1, liquidityScore: 82 }),
    expectedOutput: '{"grade":"low","score":0,"reasons":[]}',
  },
];
