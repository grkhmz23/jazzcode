import { applySlippage } from "../quote/slippage";
import { MODEL_VERSION } from "../constants";
import { sha256Canonical } from "../ids/hash";
import type { RouteQuote, SwapPlan, Universe } from "../types";

export function buildSwapPlan(input: {
  universe: Universe;
  inMint: string;
  outMint: string;
  inAmount: string;
  routeQuote: RouteQuote;
  slippageBps: number;
}): SwapPlan {
  const minOut = applySlippage(input.routeQuote.outAmount, input.slippageBps);

  return {
    inMint: input.inMint,
    outMint: input.outMint,
    inAmount: input.inAmount,
    route: {
      hops: input.routeQuote.hops.map((hop) => ({
        poolId: hop.poolId,
        inMint: hop.inMint,
        outMint: hop.outMint,
      })),
    },
    quote: {
      outAmount: input.routeQuote.outAmount,
      minOut,
      feeBreakdown: input.routeQuote.hops.map((hop) => ({
        poolId: hop.poolId,
        feeAmount: hop.feeAmount,
      })),
      impactBps: input.routeQuote.totalImpactBps,
    },
    determinism: {
      fixtureHash: sha256Canonical(input.universe),
      modelVersion: MODEL_VERSION,
    },
  };
}
