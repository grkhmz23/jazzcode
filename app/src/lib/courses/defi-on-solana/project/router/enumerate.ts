import { createRoute } from "../model/route";
import type { PoolInfo, Route, Universe } from "../types";

function poolConnects(pool: PoolInfo, a: string, b: string): boolean {
  return (
    (pool.tokenA === a && pool.tokenB === b) ||
    (pool.tokenA === b && pool.tokenB === a)
  );
}

function poolTouches(pool: PoolInfo, mint: string): boolean {
  return pool.tokenA === mint || pool.tokenB === mint;
}

function oppositeMint(pool: PoolInfo, mint: string): string {
  if (pool.tokenA === mint) return pool.tokenB;
  if (pool.tokenB === mint) return pool.tokenA;
  throw new Error(`Pool ${pool.id} does not include mint ${mint}`);
}

export function enumerateRoutes(universe: Universe, inMint: string, outMint: string): Route[] {
  const routes: Route[] = [];

  for (const pool of universe.pools) {
    if (poolConnects(pool, inMint, outMint)) {
      routes.push(
        createRoute([
          {
            poolId: pool.id,
            inMint,
            outMint,
          },
        ]),
      );
    }
  }

  for (const firstPool of universe.pools) {
    if (!poolTouches(firstPool, inMint)) {
      continue;
    }
    const midMint = oppositeMint(firstPool, inMint);
    if (midMint === outMint) {
      continue;
    }

    for (const secondPool of universe.pools) {
      if (secondPool.id === firstPool.id) {
        continue;
      }
      if (!poolConnects(secondPool, midMint, outMint)) {
        continue;
      }

      routes.push(
        createRoute([
          { poolId: firstPool.id, inMint, outMint: midMint },
          { poolId: secondPool.id, inMint: midMint, outMint },
        ]),
      );
    }
  }

  const unique = new Map<string, Route>();
  for (const route of routes) {
    unique.set(route.id, route);
  }

  return [...unique.values()].sort((a, b) => {
    if (a.hops.length !== b.hops.length) {
      return a.hops.length - b.hops.length;
    }
    return a.id.localeCompare(b.id);
  });
}
