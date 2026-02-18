export interface SwapRiskInput {
  quoteAgeMs: number;
  slippageBps: number;
  priceImpactBps: number;
  routeHops: number;
  liquidityScore: number;
}

export interface SwapRiskResult {
  grade: "low" | "medium" | "high" | "critical";
  score: number;
  reasons: string[];
}

export interface SlippageGuardConfig {
  minBps: number;
  maxBps: number;
  defaultBps: number;
  highImpactBps: number;
  staleQuoteMs: number;
}

export interface SlippageQuoteContext {
  quoteAgeMs: number;
  priceImpactBps: number;
  userSelectedBps?: number;
}

export interface SlippageGuardResult {
  warnings: string[];
  recommendedBps: number;
  blocked: boolean;
}

export interface SwapSafetyBannerResult {
  severity: "info" | "warning" | "error";
  title: string;
  body: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function evaluateSwapRisk(input: SwapRiskInput): SwapRiskResult {
  if (input.liquidityScore < 0 || input.liquidityScore > 100) {
    throw new Error("liquidityScore must be between 0 and 100");
  }

  let score = 0;
  const reasons: string[] = [];

  if (input.quoteAgeMs > 25_000) {
    score += 35;
    reasons.push("quote is stale relative to current mempool conditions");
  }
  if (input.slippageBps > 100) {
    score += 20;
    reasons.push("user slippage tolerance is wide");
  }
  if (input.priceImpactBps > 120) {
    score += 25;
    reasons.push("route has high projected price impact");
  }
  if (input.routeHops > 2) {
    score += 10;
    reasons.push("multi-hop route increases execution drift");
  }
  if (input.liquidityScore < 40) {
    score += 20;
    reasons.push("pool liquidity score is weak");
  }

  const grade: SwapRiskResult["grade"] =
    score >= 75 ? "critical" : score >= 50 ? "high" : score >= 25 ? "medium" : "low";

  return { grade, score, reasons };
}

export function slippageGuard(
  config: SlippageGuardConfig,
  quote: SlippageQuoteContext,
): SlippageGuardResult {
  if (config.minBps <= 0 || config.maxBps < config.minBps) {
    throw new Error("invalid slippage config bounds");
  }

  const warnings: string[] = [];
  const targetByImpact = quote.priceImpactBps >= config.highImpactBps ? config.maxBps : config.defaultBps;
  const selected =
    typeof quote.userSelectedBps === "number" && Number.isFinite(quote.userSelectedBps)
      ? quote.userSelectedBps
      : targetByImpact;

  let recommendedBps = clamp(Math.round(selected), config.minBps, config.maxBps);

  if (quote.quoteAgeMs > config.staleQuoteMs) {
    warnings.push("quote is stale; refresh before signing");
    recommendedBps = clamp(Math.min(recommendedBps, config.defaultBps), config.minBps, config.maxBps);
  }
  if (quote.priceImpactBps > config.highImpactBps) {
    warnings.push("price impact is elevated; review trade size");
  }
  if (selected > config.maxBps) {
    warnings.push("requested slippage exceeded policy max and was clamped");
  }

  const blocked = quote.quoteAgeMs > config.staleQuoteMs * 2 || quote.priceImpactBps > config.maxBps * 2;
  if (blocked) {
    warnings.push("trade blocked by safety policy");
  }

  return { warnings, recommendedBps, blocked };
}

export function swapSafetyBanner(result: SwapRiskResult): SwapSafetyBannerResult {
  if (result.grade === "critical") {
    return {
      severity: "error",
      title: "High sandwich and execution risk",
      body: "Quote freshness, impact, or slippage policy indicates unacceptable risk. Refresh and reduce size.",
    };
  }
  if (result.grade === "high") {
    return {
      severity: "warning",
      title: "Elevated execution risk",
      body: "Proceed only if trade urgency is high. Tighten slippage and verify quote freshness.",
    };
  }
  if (result.grade === "medium") {
    return {
      severity: "warning",
      title: "Moderate risk",
      body: "Review route hops and price impact before signing.",
    };
  }
  return {
    severity: "info",
    title: "Swap protections active",
    body: "Current route is within configured defensive limits.",
  };
}
