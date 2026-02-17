import type { Route } from "../types";

export function routeIdFromHops(hops: Array<{ poolId: string }>): string {
  return hops.map((hop) => hop.poolId).join("->");
}

export function createRoute(hops: Array<{ poolId: string; inMint: string; outMint: string }>): Route {
  return {
    id: routeIdFromHops(hops),
    hops,
  };
}
