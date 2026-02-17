import type { RouteQuote, Universe } from "../types";

export function validateSwapInvariants(universe: Universe, quote: RouteQuote): string[] {
  const invariants: string[] = [];

  invariants.push("all hop pools exist in universe");
  for (const hop of quote.hops) {
    const pool = universe.pools.find((item) => item.id === hop.poolId);
    if (!pool) {
      throw new Error(`Missing pool in universe: ${hop.poolId}`);
    }
  }

  invariants.push("output is positive and bounded by reserves");
  if (BigInt(quote.outAmount) <= BigInt(0)) {
    throw new Error("Invalid outAmount: must be positive");
  }

  invariants.push("fee amounts are non-negative");
  for (const hop of quote.hops) {
    if (BigInt(hop.feeAmount) < BigInt(0)) {
      throw new Error(`Negative fee amount for hop ${hop.poolId}`);
    }
  }

  return invariants;
}
