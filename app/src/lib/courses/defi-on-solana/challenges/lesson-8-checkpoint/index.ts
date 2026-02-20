import type { TestCase } from "@/types/content";

export const lesson8StarterCode = `function run(input) {
  return JSON.stringify({ swapPlan: null, swapSummary: null });
}
`;

export const lesson8SolutionCode = `function run(input) {
  const path = [input.inSymbol, ...input.route.hops.map((hop) => hop.outSymbol)];
  const swapPlan = {
    inMint: input.inMint,
    outMint: input.outMint,
    inAmount: input.inAmount,
    route: {
      hops: input.route.hops.map((hop) => ({ poolId: hop.poolId, inMint: hop.inMint, outMint: hop.outMint }))
    },
    quote: {
      outAmount: input.quote.outAmount,
      minOut: input.quote.minOut,
      feeBreakdown: input.quote.feeBreakdown,
      impactBps: input.quote.impactBps
    },
    determinism: {
      fixtureHash: input.fixtureHash,
      modelVersion: "defi-jupiter-offline-v2"
    }
  };

  const swapSummary = {
    label: "Swap " + path.join(" -> ") + " for " + input.quote.outAmount + " output units",
    path,
    outAmount: input.quote.outAmount,
    minOut: input.quote.minOut,
    totalFeeAmount: input.quote.totalFeeAmount,
    totalImpactBps: input.quote.impactBps,
    invariants: [
      "all hop pools exist in universe",
      "output is positive and bounded by reserves",
      "fee amounts are non-negative"
    ]
  };

  return JSON.stringify({ swapPlan, swapSummary });
}
`;

export const lesson8Hints: string[] = [
  "Keep output key order stable: swapPlan first, swapSummary second.",
  "Path should be deterministic symbols along route hops.",
  "Include fixtureHash + modelVersion under determinism metadata.",
];

export const lesson8TestCases: TestCase[] = [
  {
    name: "builds stable swap plan and summary",
    input: JSON.stringify({
      inMint: "SOL_MINT",
      outMint: "JUP_MINT",
      inSymbol: "SOL",
      inAmount: "10000000000",
      route: {
        hops: [
          { poolId: "pool-sol-usdc", inMint: "SOL_MINT", outMint: "USDC_MINT", outSymbol: "USDC" },
          { poolId: "pool-usdc-jup", inMint: "USDC_MINT", outMint: "JUP_MINT", outSymbol: "JUP" }
        ]
      },
      quote: {
        outAmount: "2882594665",
        minOut: "2868181691",
        feeBreakdown: [
          { poolId: "pool-sol-usdc", feeAmount: "20000000" },
          { poolId: "pool-usdc-jup", feeAmount: "5715381" }
        ],
        totalFeeAmount: "25715381",
        impactBps: 267
      },
      fixtureHash: "abc123"
    }),
    expectedOutput:
      '{"swapPlan":{"inMint":"SOL_MINT","outMint":"JUP_MINT","inAmount":"10000000000","route":{"hops":[{"poolId":"pool-sol-usdc","inMint":"SOL_MINT","outMint":"USDC_MINT"},{"poolId":"pool-usdc-jup","inMint":"USDC_MINT","outMint":"JUP_MINT"}]},"quote":{"outAmount":"2882594665","minOut":"2868181691","feeBreakdown":[{"poolId":"pool-sol-usdc","feeAmount":"20000000"},{"poolId":"pool-usdc-jup","feeAmount":"5715381"}],"impactBps":267},"determinism":{"fixtureHash":"abc123","modelVersion":"defi-jupiter-offline-v2"}},"swapSummary":{"label":"Swap SOL -> USDC -> JUP for 2882594665 output units","path":["SOL","USDC","JUP"],"outAmount":"2882594665","minOut":"2868181691","totalFeeAmount":"25715381","totalImpactBps":267,"invariants":["all hop pools exist in universe","output is positive and bounded by reserves","fee amounts are non-negative"]}}'
  },
  {
    name: "builds stable summary for single-hop route",
    input: JSON.stringify({
      inMint: "SOL_MINT",
      outMint: "USDC_MINT",
      inSymbol: "SOL",
      inAmount: "500000000",
      route: {
        hops: [
          { poolId: "pool-sol-usdc", inMint: "SOL_MINT", outMint: "USDC_MINT", outSymbol: "USDC" }
        ]
      },
      quote: {
        outAmount: "114950000",
        minOut: "114375250",
        feeBreakdown: [
          { poolId: "pool-sol-usdc", feeAmount: "1000000" }
        ],
        totalFeeAmount: "1000000",
        impactBps: 45
      },
      fixtureHash: "singlehop456"
    }),
    expectedOutput:
      '{"swapPlan":{"inMint":"SOL_MINT","outMint":"USDC_MINT","inAmount":"500000000","route":{"hops":[{"poolId":"pool-sol-usdc","inMint":"SOL_MINT","outMint":"USDC_MINT"}]},"quote":{"outAmount":"114950000","minOut":"114375250","feeBreakdown":[{"poolId":"pool-sol-usdc","feeAmount":"1000000"}],"impactBps":45},"determinism":{"fixtureHash":"singlehop456","modelVersion":"defi-jupiter-offline-v2"}},"swapSummary":{"label":"Swap SOL -> USDC for 114950000 output units","path":["SOL","USDC"],"outAmount":"114950000","minOut":"114375250","totalFeeAmount":"1000000","totalImpactBps":45,"invariants":["all hop pools exist in universe","output is positive and bounded by reserves","fee amounts are non-negative"]}}'
  }
];
