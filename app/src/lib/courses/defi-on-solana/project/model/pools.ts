import { parseU64 } from "../math/u64";
import type { PoolInfo } from "../types";

export interface VirtualPool {
  id: string;
  tokenA: string;
  tokenB: string;
  reserveA: bigint;
  reserveB: bigint;
  feeBps: number;
}

export function toVirtualPool(pool: PoolInfo): VirtualPool {
  if (!Number.isInteger(pool.feeBps) || pool.feeBps < 0 || pool.feeBps > 10_000) {
    throw new Error(`Invalid feeBps for pool ${pool.id}: ${pool.feeBps}`);
  }
  return {
    id: pool.id,
    tokenA: pool.tokenA,
    tokenB: pool.tokenB,
    reserveA: parseU64(pool.reserveA, `${pool.id}.reserveA`),
    reserveB: parseU64(pool.reserveB, `${pool.id}.reserveB`),
    feeBps: pool.feeBps,
  };
}

export function poolMap(pools: PoolInfo[]): Map<string, VirtualPool> {
  const map = new Map<string, VirtualPool>();
  for (const pool of pools) {
    map.set(pool.id, toVirtualPool(pool));
  }
  return map;
}

export function clonePool(pool: VirtualPool): VirtualPool {
  return {
    id: pool.id,
    tokenA: pool.tokenA,
    tokenB: pool.tokenB,
    reserveA: pool.reserveA,
    reserveB: pool.reserveB,
    feeBps: pool.feeBps,
  };
}
