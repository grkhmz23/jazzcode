import type { TestCase } from "@/types/content";

export const lesson5StarterCode = `function run(input) {
  const selected = selectRoute(input.routes, input.mode);
  return JSON.stringify(selected);
}

function selectRoute(routes, mode) {
  if (!Array.isArray(routes) || routes.length === 0) {
    throw new Error("Routes are required");
  }
  return routes[0];
}
`;

export const lesson5SolutionCode = `function run(input) {
  const selected = selectRoute(input.routes, input.mode);
  return JSON.stringify(selected);
}

function selectRoute(routes, mode) {
  if (!Array.isArray(routes) || routes.length === 0) {
    throw new Error("Routes are required");
  }

  for (let routeIndex = 0; routeIndex < routes.length; routeIndex += 1) {
    const route = routes[routeIndex];
    if (!Array.isArray(route.hops) || route.hops.length === 0) {
      throw new Error("Route " + routeIndex + " has no hops");
    }

    for (let hopIndex = 0; hopIndex < route.hops.length; hopIndex += 1) {
      const hop = route.hops[hopIndex];
      if (!hop.inMint || !hop.outMint || !hop.poolId || !hop.dexLabel) {
        throw new Error("Route " + routeIndex + " hop " + hopIndex + " is missing required fields");
      }
    }
  }

  const sorted = routes.slice().sort((left, right) => compareRoutes(left, right, mode));
  return sorted[0];
}

function compareRoutes(left, right, mode) {
  if (mode === "bestOut") {
    const leftOut = BigInt(left.outAmount);
    const rightOut = BigInt(right.outAmount);
    if (leftOut !== rightOut) {
      return rightOut > leftOut ? 1 : -1;
    }
  }

  if (mode === "minImpact") {
    const leftImpact = Number(left.priceImpactPct);
    const rightImpact = Number(right.priceImpactPct);
    if (leftImpact !== rightImpact) {
      return leftImpact - rightImpact;
    }
  }

  if (mode === "minFees") {
    if (left.totalFeeBps !== right.totalFeeBps) {
      return left.totalFeeBps - right.totalFeeBps;
    }
  }

  if (left.hops.length !== right.hops.length) {
    return left.hops.length - right.hops.length;
  }

  const leftPools = left.hops.map((hop) => hop.poolId).join(",");
  const rightPools = right.hops.map((hop) => hop.poolId).join(",");
  return leftPools.localeCompare(rightPools);
}
`;

export const lesson5Hints: string[] = [
  "Implement three modes with deterministic tie-breakers.",
  "For ties, prefer fewer hops, then lexicographically smaller poolId sequence.",
  "Reject malformed routes before scoring to keep behavior predictable.",
];

export const lesson5TestCases: TestCase[] = [
  {
    name: "selects bestOut route",
    input: JSON.stringify({
      mode: "bestOut",
      routes: [
        {
          hops: [{ inMint: "A", outMint: "B", poolId: "pool-2", dexLabel: "DexB", feeBps: 30 }],
          inAmount: "100",
          outAmount: "99",
          priceImpactPct: "0.010000",
          totalFeeBps: 30,
        },
        {
          hops: [{ inMint: "A", outMint: "B", poolId: "pool-1", dexLabel: "DexA", feeBps: 40 }],
          inAmount: "100",
          outAmount: "101",
          priceImpactPct: "0.020000",
          totalFeeBps: 40,
        },
      ],
    }),
    expectedOutput:
      '{"hops":[{"inMint":"A","outMint":"B","poolId":"pool-1","dexLabel":"DexA","feeBps":40}],"inAmount":"100","outAmount":"101","priceImpactPct":"0.020000","totalFeeBps":40}',
  },
  {
    name: "selects minImpact route with tie-breaker",
    input: JSON.stringify({
      mode: "minImpact",
      routes: [
        {
          hops: [
            { inMint: "A", outMint: "X", poolId: "pool-z", dexLabel: "DexZ", feeBps: 10 },
            { inMint: "X", outMint: "B", poolId: "pool-y", dexLabel: "DexY", feeBps: 10 },
          ],
          inAmount: "100",
          outAmount: "100",
          priceImpactPct: "0.001000",
          totalFeeBps: 20,
        },
        {
          hops: [{ inMint: "A", outMint: "B", poolId: "pool-a", dexLabel: "DexA", feeBps: 20 }],
          inAmount: "100",
          outAmount: "100",
          priceImpactPct: "0.001000",
          totalFeeBps: 20,
        },
      ],
    }),
    expectedOutput:
      '{"hops":[{"inMint":"A","outMint":"B","poolId":"pool-a","dexLabel":"DexA","feeBps":20}],"inAmount":"100","outAmount":"100","priceImpactPct":"0.001000","totalFeeBps":20}',
  },
  {
    name: "rejects route missing hop data",
    input: JSON.stringify({
      mode: "minFees",
      routes: [
        {
          hops: [{ inMint: "A", outMint: "B", poolId: "", dexLabel: "DexA", feeBps: 10 }],
          inAmount: "100",
          outAmount: "100",
          priceImpactPct: "0.001000",
          totalFeeBps: 10,
        },
      ],
    }),
    expectedOutput: "Error: Route 0 hop 0 is missing required fields",
  },
];
