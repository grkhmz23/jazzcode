import { cpmmQuote } from "../quote/cpmm";
import { clonePool, poolMap } from "../model/pools";
import { parseU64 } from "../math/u64";
import type { Route, RouteQuote, Universe } from "../types";

export function quoteRoute(
  universe: Universe,
  route: Route,
  inAmount: string,
): RouteQuote {
  const virtualPools = poolMap(universe.pools);
  let currentInAmount = parseU64(inAmount, "inAmount");
  let totalFee = BigInt(0);
  let totalImpact = 0;

  const hops = route.hops.map((hop) => {
    const pool = virtualPools.get(hop.poolId);
    if (!pool) {
      throw new Error(`Missing pool for hop: ${hop.poolId}`);
    }

    const quoted = cpmmQuote(clonePool(pool), hop.inMint, currentInAmount.toString());
    virtualPools.set(pool.id, quoted.nextPool);

    currentInAmount = BigInt(quoted.outAmount);
    totalFee += BigInt(quoted.feeAmount);
    totalImpact += quoted.impactBps;

    return {
      poolId: hop.poolId,
      inMint: hop.inMint,
      outMint: hop.outMint,
      inAmount: hop === route.hops[0] ? inAmount : "",
      inAfterFee: quoted.inAfterFee,
      feeAmount: quoted.feeAmount,
      outAmount: quoted.outAmount,
      impactBps: quoted.impactBps,
    };
  });

  for (let i = 0; i < hops.length; i += 1) {
    if (i > 0) {
      hops[i].inAmount = hops[i - 1].outAmount;
    }
  }

  return {
    routeId: route.id,
    hops,
    inAmount,
    outAmount: currentInAmount.toString(),
    totalFeeAmount: totalFee.toString(),
    totalImpactBps: totalImpact,
  };
}
