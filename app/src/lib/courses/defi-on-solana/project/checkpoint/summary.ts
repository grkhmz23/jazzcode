import { tokenMap } from "../model/tokens";
import { validateSwapInvariants } from "./invariants";
import type { RouteQuote, SwapSummary, Universe } from "../types";

export function buildSwapSummary(input: {
  universe: Universe;
  routeQuote: RouteQuote;
  minOut: string;
}): SwapSummary {
  const tokens = tokenMap(input.universe.tokens);
  const path: string[] = [];

  if (input.routeQuote.hops.length > 0) {
    path.push(input.routeQuote.hops[0].inMint);
    for (const hop of input.routeQuote.hops) {
      path.push(hop.outMint);
    }
  }

  const symbols = path.map((mint) => tokens.get(mint)?.symbol ?? mint);
  const label = `Swap ${symbols.join(" -> ")} for ${input.routeQuote.outAmount} output units`;

  return {
    label,
    path: symbols,
    outAmount: input.routeQuote.outAmount,
    minOut: input.minOut,
    totalFeeAmount: input.routeQuote.totalFeeAmount,
    totalImpactBps: input.routeQuote.totalImpactBps,
    invariants: validateSwapInvariants(input.universe, input.routeQuote),
  };
}
