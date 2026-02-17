import type { TestCase } from "@/types/content";

export const lesson4StarterCode = `function run(input) {
  return JSON.stringify(cpmmQuote(input.pool, input.inMint, input.inAmount));
}

function cpmmQuote(pool, inMint, inAmount) {
  // Implement deterministic constant-product quote with fees and impact.
  return { outAmount: "0", feeAmount: "0", inAfterFee: "0", impactBps: 0 };
}
`;

export const lesson4SolutionCode = `function run(input) {
  return JSON.stringify(cpmmQuote(input.pool, input.inMint, input.inAmount));
}

function cpmmQuote(pool, inMint, inAmount) {
  const amountIn = toBigInt(inAmount, "inAmount");
  if (amountIn <= 0n) throw new Error("inAmount must be greater than zero");

  let reserveIn;
  let reserveOut;
  if (inMint === pool.tokenA) {
    reserveIn = toBigInt(pool.reserveA, "reserveA");
    reserveOut = toBigInt(pool.reserveB, "reserveB");
  } else if (inMint === pool.tokenB) {
    reserveIn = toBigInt(pool.reserveB, "reserveB");
    reserveOut = toBigInt(pool.reserveA, "reserveA");
  } else {
    throw new Error("Input mint not in pool");
  }

  const feeAmount = (amountIn * BigInt(pool.feeBps)) / 10000n;
  const inAfterFee = amountIn - feeAmount;
  const outAmount = (reserveOut * inAfterFee) / (reserveIn + inAfterFee);
  const spot = (reserveOut * 1000000000n) / reserveIn;
  const effective = inAfterFee > 0n ? (outAmount * 1000000000n) / inAfterFee : 0n;
  const impactBps = spot > effective ? Number(((spot - effective) * 10000n) / spot) : 0;

  return {
    outAmount: outAmount.toString(),
    feeAmount: feeAmount.toString(),
    inAfterFee: inAfterFee.toString(),
    impactBps,
  };
}

function toBigInt(value, field) {
  if (!/^\d+$/.test(String(value))) {
    throw new Error("Invalid " + field + ": " + value);
  }
  return BigInt(value);
}
`;

export const lesson4Hints: string[] = [
  "Use inAfterFee = inAmount - floor(inAmount * feeBps / 10000).",
  "Use constant-product output formula with integer floor division.",
  "Estimate impact by comparing spot price and effective execution price in fixed scale.",
];

export const lesson4TestCases: TestCase[] = [
  {
    name: "computes deterministic cpmm quote",
    input: JSON.stringify({
      pool: {
        id: "pool-sol-jup",
        tokenA: "SOL",
        tokenB: "JUP",
        reserveA: "120000000000",
        reserveB: "54000000000",
        feeBps: 30,
      },
      inMint: "SOL",
      inAmount: "1000000000",
    }),
    expectedOutput:
      '{"outAmount":"444887895","feeAmount":"3000000","inAfterFee":"997000000","impactBps":82}',
  },
];
