import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  return JSON.stringify(slippageGuard(input.config, input.quote));
}

function slippageGuard(config, quote) {
  const warnings = [];
  let recommendedBps = typeof quote.userSelectedBps === "number" ? quote.userSelectedBps : config.defaultBps;

  if (quote.priceImpactBps >= config.highImpactBps) {
    recommendedBps = Math.max(recommendedBps, config.maxBps);
    warnings.push("price impact is elevated; review trade size");
  }
  if (quote.quoteAgeMs > config.staleQuoteMs) {
    recommendedBps = Math.min(recommendedBps, config.defaultBps);
    warnings.push("quote is stale; refresh before signing");
  }
  if (recommendedBps > config.maxBps) {
    recommendedBps = config.maxBps;
    warnings.push("requested slippage exceeded policy max and was clamped");
  }
  if (recommendedBps < config.minBps) {
    recommendedBps = config.minBps;
  }

  const blocked = quote.quoteAgeMs > config.staleQuoteMs * 2 || quote.priceImpactBps > config.maxBps * 2;
  if (blocked) {
    warnings.push("trade blocked by safety policy");
  }

  return { warnings, recommendedBps, blocked };
}
`;

export const lesson5SolutionCode = lesson5StarterCode;

export const lesson5Hints: string[] = [
  "Clamp recommended BPS to policy bounds.",
  "Stale quotes should lower tolerance and may block if very stale.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "adjusts stale quote",
    input: JSON.stringify({
      config: { minBps: 20, maxBps: 200, defaultBps: 60, highImpactBps: 120, staleQuoteMs: 12000 },
      quote: { quoteAgeMs: 13000, priceImpactBps: 80, userSelectedBps: 90 },
    }),
    expectedOutput:
      '{"warnings":["quote is stale; refresh before signing"],"recommendedBps":60,"blocked":false}',
  },
  {
    name: "blocks dangerous quote",
    input: JSON.stringify({
      config: { minBps: 20, maxBps: 150, defaultBps: 50, highImpactBps: 120, staleQuoteMs: 10000 },
      quote: { quoteAgeMs: 22000, priceImpactBps: 320, userSelectedBps: 250 },
    }),
    expectedOutput:
      '{"warnings":["price impact is elevated; review trade size","quote is stale; refresh before signing","trade blocked by safety policy"],"recommendedBps":50,"blocked":true}',
  },
];
