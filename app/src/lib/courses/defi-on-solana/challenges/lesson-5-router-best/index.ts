import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const routes = enumerateRoutes(input.universe, input.inMint, input.outMint);
  const best = pickBestRoute(input.universe, routes, input.inAmount, input.mode);
  return JSON.stringify({ routes, bestRouteId: best.routeId, outAmount: best.outAmount });
}

function enumerateRoutes(universe, inMint, outMint) {
  return [];
}

function pickBestRoute(universe, routes, inAmount, mode) {
  return { routeId: "", outAmount: "0" };
}
`;

export const lesson5SolutionCode = `function run(input) {
  const routes = enumerateRoutes(input.universe, input.inMint, input.outMint);
  const best = pickBestRoute(input.universe, routes, input.inAmount, input.mode);
  return JSON.stringify({ routes, bestRouteId: best.routeId, outAmount: best.outAmount });
}

function enumerateRoutes(universe, inMint, outMint) {
  const routes = [];
  for (const pool of universe.pools) {
    if (connects(pool, inMint, outMint)) {
      routes.push({ id: pool.id, hops: [{ poolId: pool.id, inMint, outMint }] });
    }
  }

  for (const poolA of universe.pools) {
    if (!touches(poolA, inMint)) continue;
    const mid = opposite(poolA, inMint);
    if (mid === outMint) continue;
    for (const poolB of universe.pools) {
      if (poolA.id === poolB.id) continue;
      if (!connects(poolB, mid, outMint)) continue;
      const id = poolA.id + "->" + poolB.id;
      routes.push({
        id,
        hops: [
          { poolId: poolA.id, inMint, outMint: mid },
          { poolId: poolB.id, inMint: mid, outMint },
        ],
      });
    }
  }

  const uniq = new Map();
  for (const route of routes) uniq.set(route.id, route);
  return [...uniq.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function pickBestRoute(universe, routes, inAmount, mode) {
  if (!routes.length) throw new Error("No routes");
  const quoted = routes.map((route) => quoteRoute(universe, route, inAmount));

  quoted.sort((a, b) => {
    if (mode === "bestOut") {
      const diff = BigInt(b.outAmount) - BigInt(a.outAmount);
      if (diff !== BigInt(0)) return diff > BigInt(0) ? 1 : -1;
    }
    if (mode === "minImpact" && a.impactBps !== b.impactBps) return a.impactBps - b.impactBps;
    if (mode === "minFees") {
      const diff = BigInt(a.totalFeeAmount) - BigInt(b.totalFeeAmount);
      if (diff !== BigInt(0)) return diff > BigInt(0) ? 1 : -1;
    }
    if (a.hops.length !== b.hops.length) return a.hops.length - b.hops.length;
    return a.routeId.localeCompare(b.routeId);
  });

  return quoted[0];
}

function quoteRoute(universe, route, inAmount) {
  let current = BigInt(inAmount);
  let totalFee = BigInt(0);
  let totalImpactBps = 0;

  for (const hop of route.hops) {
    const pool = universe.pools.find((item) => item.id === hop.poolId);
    if (!pool) throw new Error("Missing pool " + hop.poolId);

    const inIsA = hop.inMint === pool.tokenA;
    const reserveIn = BigInt(inIsA ? pool.reserveA : pool.reserveB);
    const reserveOut = BigInt(inIsA ? pool.reserveB : pool.reserveA);
    const fee = (current * BigInt(pool.feeBps)) / 10000n;
    const inAfterFee = current - fee;
    const out = (reserveOut * inAfterFee) / (reserveIn + inAfterFee);
    const spot = (reserveOut * 1000000000n) / reserveIn;
    const eff = inAfterFee > 0n ? (out * 1000000000n) / inAfterFee : 0n;
    const impactBps = spot > eff ? Number(((spot - eff) * 10000n) / spot) : 0;

    totalFee += fee;
    totalImpactBps += impactBps;
    current = out;
  }

  return {
    routeId: route.id,
    hops: route.hops,
    outAmount: current.toString(),
    totalFeeAmount: totalFee.toString(),
    impactBps: totalImpactBps,
  };
}

function connects(pool, a, b) {
  return (pool.tokenA === a && pool.tokenB === b) || (pool.tokenA === b && pool.tokenB === a);
}

function touches(pool, mint) {
  return pool.tokenA === mint || pool.tokenB === mint;
}

function opposite(pool, mint) {
  if (pool.tokenA === mint) return pool.tokenB;
  if (pool.tokenB === mint) return pool.tokenA;
  throw new Error("Mint not in pool");
}
`;

export const lesson5Hints: string[] = [
  "Enumerate 1-hop direct pools first, then 2-hop through intermediate tokens.",
  "Score bestOut by output, then tie-break by hops and route id.",
  "Keep sorting deterministic to avoid route flicker.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "two-hop route can beat direct route",
    input: JSON.stringify({
      universe: {
        pools: [
          { id: "d", tokenA: "SOL", tokenB: "JUP", reserveA: "120000000000", reserveB: "54000000000", feeBps: 30 },
          { id: "a", tokenA: "SOL", tokenB: "USDC", reserveA: "1000000000000", reserveB: "230000000000", feeBps: 20 },
          { id: "b", tokenA: "USDC", tokenB: "JUP", reserveA: "270000000000", reserveB: "130000000000", feeBps: 25 }
        ]
      },
      inMint: "SOL",
      outMint: "JUP",
      inAmount: "10000000000",
      mode: "bestOut"
    }),
    expectedOutput:
      '{"routes":[{"id":"a->b","hops":[{"poolId":"a","inMint":"SOL","outMint":"USDC"},{"poolId":"b","inMint":"USDC","outMint":"JUP"}]},{"id":"d","hops":[{"poolId":"d","inMint":"SOL","outMint":"JUP"}]}],"bestRouteId":"a->b","outAmount":"2882594665"}'
  }
];
