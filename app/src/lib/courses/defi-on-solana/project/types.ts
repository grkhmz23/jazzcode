export interface TokenInfo {
  mint: string;
  symbol: string;
  decimals: number;
}

export interface PoolInfo {
  id: string;
  tokenA: string;
  tokenB: string;
  reserveA: string;
  reserveB: string;
  feeBps: number;
}

export interface Universe {
  tokens: TokenInfo[];
  pools: PoolInfo[];
}

export interface RouteHop {
  poolId: string;
  inMint: string;
  outMint: string;
}

export interface Route {
  id: string;
  hops: RouteHop[];
}

export interface HopQuote {
  poolId: string;
  inMint: string;
  outMint: string;
  inAmount: string;
  inAfterFee: string;
  feeAmount: string;
  outAmount: string;
  impactBps: number;
}

export interface RouteQuote {
  routeId: string;
  hops: HopQuote[];
  inAmount: string;
  outAmount: string;
  totalFeeAmount: string;
  totalImpactBps: number;
}

export interface FeeBreakdownItem {
  poolId: string;
  feeAmount: string;
}

export interface SwapPlan {
  inMint: string;
  outMint: string;
  inAmount: string;
  route: {
    hops: Array<{ poolId: string; inMint: string; outMint: string }>;
  };
  quote: {
    outAmount: string;
    minOut: string;
    feeBreakdown: FeeBreakdownItem[];
    impactBps: number;
  };
  determinism: {
    fixtureHash: string;
    modelVersion: string;
  };
}

export interface SwapSummary {
  label: string;
  path: string[];
  outAmount: string;
  minOut: string;
  totalFeeAmount: string;
  totalImpactBps: number;
  invariants: string[];
}

export type RouteSelectionMode = "bestOut" | "minImpact" | "minFees";

export interface CheckpointResult {
  swapPlan: SwapPlan;
  swapSummary: SwapSummary;
}
