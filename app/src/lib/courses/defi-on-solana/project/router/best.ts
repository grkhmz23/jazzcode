import { quoteRoute } from "./score";
import type { Route, RouteQuote, RouteSelectionMode, Universe } from "../types";

function compareQuoted(
  left: { route: Route; quote: RouteQuote },
  right: { route: Route; quote: RouteQuote },
  mode: RouteSelectionMode,
): number {
  if (mode === "bestOut") {
    const outDiff = BigInt(right.quote.outAmount) - BigInt(left.quote.outAmount);
    if (outDiff !== BigInt(0)) {
      return outDiff > BigInt(0) ? 1 : -1;
    }
  }

  if (mode === "minImpact") {
    if (left.quote.totalImpactBps !== right.quote.totalImpactBps) {
      return left.quote.totalImpactBps - right.quote.totalImpactBps;
    }
  }

  if (mode === "minFees") {
    const feeDiff = BigInt(left.quote.totalFeeAmount) - BigInt(right.quote.totalFeeAmount);
    if (feeDiff !== BigInt(0)) {
      return feeDiff > BigInt(0) ? 1 : -1;
    }
  }

  if (left.route.hops.length !== right.route.hops.length) {
    return left.route.hops.length - right.route.hops.length;
  }
  return left.route.id.localeCompare(right.route.id);
}

export function pickBestRoute(params: {
  universe: Universe;
  routes: Route[];
  inAmount: string;
  mode: RouteSelectionMode;
}): { route: Route; quote: RouteQuote } {
  if (params.routes.length === 0) {
    throw new Error("No candidate routes available");
  }

  const quoted = params.routes.map((route) => ({
    route,
    quote: quoteRoute(params.universe, route, params.inAmount),
  }));

  quoted.sort((a, b) => compareQuoted(a, b, params.mode));
  return quoted[0];
}
