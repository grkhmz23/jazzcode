import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  const parsed = parseRoutes(input.quote, input.tokens);
  return JSON.stringify(parsed);
}

function parseRoutes(payload, tokens) {
  if (!payload || !Array.isArray(payload.data)) {
    throw new Error("Quote payload missing data routes");
  }

  return payload.data.map((route) => ({
    hops: [],
    inAmount: route.inAmount,
    outAmount: route.outAmount,
    priceImpactPct: route.priceImpactPct,
    totalFeeBps: 0,
  }));
}
`;

export const lesson4SolutionCode = `function run(input) {
  const parsed = parseRoutes(input.quote, input.tokens);
  return JSON.stringify(parsed);
}

function parseRoutes(payload, tokens) {
  if (!payload || !Array.isArray(payload.data) || payload.data.length === 0) {
    throw new Error("Quote payload missing data routes");
  }

  const tokenMap = buildTokenMap(tokens);
  const routes = payload.data.map((route, routeIndex) => parseRoute(route, routeIndex, tokenMap));

  routes.sort((left, right) => {
    const leftOut = BigInt(left.outAmount);
    const rightOut = BigInt(right.outAmount);
    if (leftOut !== rightOut) {
      return rightOut > leftOut ? 1 : -1;
    }

    const leftImpact = Number(left.priceImpactPct);
    const rightImpact = Number(right.priceImpactPct);
    if (leftImpact !== rightImpact) {
      return leftImpact - rightImpact;
    }

    if (left.hops.length !== right.hops.length) {
      return left.hops.length - right.hops.length;
    }

    const leftPools = left.hops.map((hop) => hop.poolId).join(",");
    const rightPools = right.hops.map((hop) => hop.poolId).join(",");
    return leftPools.localeCompare(rightPools);
  });

  return routes;
}

function buildTokenMap(tokens) {
  if (!Array.isArray(tokens) || tokens.length === 0) {
    throw new Error("Token metadata is required");
  }

  const map = new Map();
  for (const token of tokens) {
    if (!token || typeof token.mint !== "string") {
      throw new Error("Invalid token metadata");
    }
    if (!Number.isInteger(token.decimals)) {
      throw new Error("Invalid decimals for mint: " + token.mint);
    }
    map.set(token.mint, token.decimals);
  }
  return map;
}

function parseRoute(route, routeIndex, tokenMap) {
  const inAmount = assertU64(route.inAmount, "route " + routeIndex + " inAmount");
  const outAmount = assertU64(route.outAmount, "route " + routeIndex + " outAmount");

  if (!tokenMap.has(route.inputMint)) {
    throw new Error("Missing token metadata for mint: " + route.inputMint);
  }
  if (!tokenMap.has(route.outputMint)) {
    throw new Error("Missing token metadata for mint: " + route.outputMint);
  }

  if (!Array.isArray(route.routePlan) || route.routePlan.length === 0) {
    throw new Error("Route " + routeIndex + " missing routePlan");
  }

  const hops = route.routePlan.map((hop, hopIndex) => {
    if (!hop || !hop.swapInfo) {
      throw new Error("Missing swapInfo for route " + routeIndex + " hop " + hopIndex);
    }

    const swapInfo = hop.swapInfo;
    const hopIn = assertU64(swapInfo.inAmount, "route " + routeIndex + " hop " + hopIndex + " inAmount");
    const fee = assertU64(swapInfo.feeAmount, "route " + routeIndex + " hop " + hopIndex + " feeAmount");

    if (hopIn === 0n) {
      throw new Error("route " + routeIndex + " hop " + hopIndex + " inAmount must be > 0");
    }

    const feeBps = Number((fee * 10000n) / hopIn);
    return {
      inMint: String(swapInfo.inputMint || ""),
      outMint: String(swapInfo.outputMint || ""),
      poolId: String(swapInfo.ammKey || ""),
      dexLabel: String(swapInfo.label || ""),
      feeBps,
    };
  });

  const totalFeeBps = hops.reduce((sum, hop) => sum + hop.feeBps, 0);
  return {
    hops,
    inAmount: inAmount.toString(),
    outAmount: outAmount.toString(),
    priceImpactPct: Number(route.priceImpactPct || 0).toFixed(6),
    totalFeeBps,
  };
}

function assertU64(value, field) {
  if (typeof value !== "string" || !/^\\d+$/.test(value)) {
    throw new Error("Invalid " + field + ": " + value);
  }

  const parsed = BigInt(value);
  const max = (1n << 64n) - 1n;
  if (parsed < 0n || parsed > max) {
    throw new Error(field + " out of u64 range: " + value);
  }
  return parsed;
}
`;

export const lesson4Hints: string[] = [
  "Validate amount strings as u64-safe numeric strings before normalization.",
  "Require token metadata for every input/output mint used by each route.",
  "Sort deterministically by outAmount desc, then priceImpact asc, then hop count.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "parses and sorts normalized routes deterministically",
    input: JSON.stringify({
      quote: {
        data: [
          {
            inputMint: "So11111111111111111111111111111111111111112",
            outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            inAmount: "2000000000",
            outAmount: "38620000",
            priceImpactPct: "0.0024",
            routePlan: [
              {
                swapInfo: {
                  ammKey: "A3xk6s4K9m2T7wQ5h1P8rN6uJ4fV3dC9bL2tR7yM8nZ",
                  label: "Meteora",
                  inputMint: "So11111111111111111111111111111111111111112",
                  outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  inAmount: "2000000000",
                  outAmount: "38620000",
                  feeAmount: "6000000",
                },
              },
            ],
          },
          {
            inputMint: "So11111111111111111111111111111111111111112",
            outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            inAmount: "2000000000",
            outAmount: "38700000",
            priceImpactPct: "0.0041",
            routePlan: [
              {
                swapInfo: {
                  ammKey: "B8pQ6m2T1rX7kN4vC9dL5sF3hJ2wY8uR1eM6aP4tZ7q",
                  label: "Orca",
                  inputMint: "So11111111111111111111111111111111111111112",
                  outputMint: "Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx",
                  inAmount: "1200000000",
                  outAmount: "23140000",
                  feeAmount: "3600000",
                },
              },
              {
                swapInfo: {
                  ammKey: "C4mN9qR2vT7xW1fK5hL8dP3sJ6yU2aE9bV7nM4tQ1rX",
                  label: "Raydium",
                  inputMint: "Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx",
                  outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  inAmount: "23140000",
                  outAmount: "38700000",
                  feeAmount: "92560",
                },
              },
            ],
          },
        ],
      },
      tokens: [
        { mint: "So11111111111111111111111111111111111111112", symbol: "SOL", decimals: 9 },
        { mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", symbol: "USDC", decimals: 6 },
        { mint: "Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx", symbol: "USDT", decimals: 6 },
      ],
    }),
    expectedOutput:
      '[{"hops":[{"inMint":"So11111111111111111111111111111111111111112","outMint":"Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx","poolId":"B8pQ6m2T1rX7kN4vC9dL5sF3hJ2wY8uR1eM6aP4tZ7q","dexLabel":"Orca","feeBps":30},{"inMint":"Es9vMFrzaCERmJfrF4H2FYD8hX5F4f1mUQ4v8mBfgsYx","outMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","poolId":"C4mN9qR2vT7xW1fK5hL8dP3sJ6yU2aE9bV7nM4tQ1rX","dexLabel":"Raydium","feeBps":39}],"inAmount":"2000000000","outAmount":"38700000","priceImpactPct":"0.004100","totalFeeBps":69},{"hops":[{"inMint":"So11111111111111111111111111111111111111112","outMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","poolId":"A3xk6s4K9m2T7wQ5h1P8rN6uJ4fV3dC9bL2tR7yM8nZ","dexLabel":"Meteora","feeBps":30}],"inAmount":"2000000000","outAmount":"38620000","priceImpactPct":"0.002400","totalFeeBps":30}]',
  },
  {
    name: "fails when token decimals are missing",
    input: JSON.stringify({
      quote: {
        data: [
          {
            inputMint: "So11111111111111111111111111111111111111112",
            outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            inAmount: "1",
            outAmount: "1",
            priceImpactPct: "0",
            routePlan: [
              {
                swapInfo: {
                  ammKey: "A3xk6s4K9m2T7wQ5h1P8rN6uJ4fV3dC9bL2tR7yM8nZ",
                  label: "Orca",
                  inputMint: "So11111111111111111111111111111111111111112",
                  outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  inAmount: "1",
                  outAmount: "1",
                  feeAmount: "0",
                },
              },
            ],
          },
        ],
      },
      tokens: [{ mint: "So11111111111111111111111111111111111111112", symbol: "SOL", decimals: 9 }],
    }),
    expectedOutput: "Error: Missing token metadata for mint: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
];
