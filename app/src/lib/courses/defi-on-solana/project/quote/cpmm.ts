import { computeFeeAmount, computeInAfterFee } from "./fees";
import { estimateImpactBps } from "./impact";
import { parseU64 } from "../math/u64";
import type { VirtualPool } from "../model/pools";

export interface CpmmQuote {
  outAmount: string;
  feeAmount: string;
  inAfterFee: string;
  impactBps: number;
  nextPool: VirtualPool;
}

export function cpmmQuote(pool: VirtualPool, inMint: string, inAmount: string): CpmmQuote {
  const amountIn = parseU64(inAmount, "inAmount");
  if (amountIn <= BigInt(0)) {
    throw new Error("inAmount must be greater than zero");
  }

  let reserveIn: bigint;
  let reserveOut: bigint;
  let updateAIn = false;

  if (inMint === pool.tokenA) {
    reserveIn = pool.reserveA;
    reserveOut = pool.reserveB;
    updateAIn = true;
  } else if (inMint === pool.tokenB) {
    reserveIn = pool.reserveB;
    reserveOut = pool.reserveA;
  } else {
    throw new Error(`Input mint ${inMint} not in pool ${pool.id}`);
  }

  if (reserveIn <= BigInt(0) || reserveOut <= BigInt(0)) {
    throw new Error(`Pool ${pool.id} has invalid reserves`);
  }

  const feeAmount = computeFeeAmount(amountIn, pool.feeBps);
  const inAfterFee = computeInAfterFee(amountIn, feeAmount);
  const denominator = reserveIn + inAfterFee;
  if (denominator <= BigInt(0)) {
    throw new Error(`Invalid denominator for pool ${pool.id}`);
  }

  const outAmount = (reserveOut * inAfterFee) / denominator;
  if (outAmount <= BigInt(0)) {
    throw new Error(`Output amount is zero for pool ${pool.id}`);
  }
  if (outAmount > reserveOut) {
    throw new Error(`Output exceeds reserve for pool ${pool.id}`);
  }

  const impactBps = estimateImpactBps({ reserveIn, reserveOut, inAfterFee, outAmount });

  const nextPool: VirtualPool = {
    ...pool,
    reserveA: pool.reserveA,
    reserveB: pool.reserveB,
  };

  if (updateAIn) {
    nextPool.reserveA = pool.reserveA + inAfterFee;
    nextPool.reserveB = pool.reserveB - outAmount;
  } else {
    nextPool.reserveB = pool.reserveB + inAfterFee;
    nextPool.reserveA = pool.reserveA - outAmount;
  }

  return {
    outAmount: outAmount.toString(),
    feeAmount: feeAmount.toString(),
    inAfterFee: inAfterFee.toString(),
    impactBps,
    nextPool,
  };
}
