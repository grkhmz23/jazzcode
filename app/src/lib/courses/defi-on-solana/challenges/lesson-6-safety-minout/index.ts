import type { TestCase } from "@/types/content";

export const lesson6StarterCode = `function run(input) {
  return JSON.stringify(simulate(input));
}

function simulate(input) {
  return { outAmount: "0", minOut: "0", totalFeeAmount: "0", invariants: [] };
}
`;

export const lesson6SolutionCode = `function run(input) {
  return JSON.stringify(simulate(input));
}

function simulate(input) {
  if (!Number.isInteger(input.slippageBps) || input.slippageBps < 0 || input.slippageBps > 10000) {
    throw new Error("Invalid slippageBps: " + input.slippageBps);
  }

  let current = BigInt(input.inAmount);
  let totalFee = BigInt(0);
  const virtualPools = new Map(input.pools.map((pool) => [pool.id, { ...pool }]));

  for (const hop of input.route.hops) {
    const pool = virtualPools.get(hop.poolId);
    if (!pool) throw new Error("Missing pool " + hop.poolId);

    const inIsA = hop.inMint === pool.tokenA;
    if (!inIsA && hop.inMint !== pool.tokenB) throw new Error("Input mint not in pool");

    const reserveIn = BigInt(inIsA ? pool.reserveA : pool.reserveB);
    const reserveOut = BigInt(inIsA ? pool.reserveB : pool.reserveA);
    const fee = (current * BigInt(pool.feeBps)) / 10000n;
    const inAfterFee = current - fee;
    const out = (reserveOut * inAfterFee) / (reserveIn + inAfterFee);

    if (out > reserveOut) throw new Error("Output exceeds reserveOut");

    if (inIsA) {
      pool.reserveA = (BigInt(pool.reserveA) + inAfterFee).toString();
      pool.reserveB = (BigInt(pool.reserveB) - out).toString();
    } else {
      pool.reserveB = (BigInt(pool.reserveB) + inAfterFee).toString();
      pool.reserveA = (BigInt(pool.reserveA) - out).toString();
    }

    totalFee += fee;
    current = out;
  }

  const minOut = (current * BigInt(10000 - input.slippageBps)) / 10000n;

  return {
    outAmount: current.toString(),
    minOut: minOut.toString(),
    totalFeeAmount: totalFee.toString(),
    invariants: [
      "reserves remain non-negative",
      "output does not exceed reserveOut",
      "route simulation is deterministic"
    ]
  };
}
`;

export const lesson6Hints: string[] = [
  "Use virtual pool copies so fixture reserves are not mutated.",
  "Compute minOut with floor(out * (10000 - slippageBps) / 10000).",
  "Return structured errors when pools or route links are invalid.",
];

export const lesson6TestCases: TestCase[] = [
  {
    name: "computes minOut and fee totals deterministically",
    input: JSON.stringify({
      pools: [
        { id: "d", tokenA: "SOL", tokenB: "JUP", reserveA: "120000000000", reserveB: "54000000000", feeBps: 30 }
      ],
      route: { hops: [{ poolId: "d", inMint: "SOL", outMint: "JUP" }] },
      inAmount: "1000000000",
      slippageBps: 50
    }),
    expectedOutput:
      '{"outAmount":"444887895","minOut":"442663455","totalFeeAmount":"3000000","invariants":["reserves remain non-negative","output does not exceed reserveOut","route simulation is deterministic"]}'
  },
  {
    name: "rejects invalid slippage",
    input: JSON.stringify({ pools: [], route: { hops: [] }, inAmount: "1", slippageBps: 10001 }),
    expectedOutput: "Error: Invalid slippageBps: 10001"
  }
];
