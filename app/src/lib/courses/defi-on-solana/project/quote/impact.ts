import { PRICE_SCALE, BPS_DENOMINATOR } from "../constants";

export function estimateImpactBps(params: {
  reserveIn: bigint;
  reserveOut: bigint;
  inAfterFee: bigint;
  outAmount: bigint;
}): number {
  const { reserveIn, reserveOut, inAfterFee, outAmount } = params;
  if (reserveIn <= BigInt(0) || reserveOut <= BigInt(0) || inAfterFee <= BigInt(0)) {
    return 0;
  }

  const spotScaled = (reserveOut * BigInt(PRICE_SCALE)) / reserveIn;
  const effectiveScaled = (outAmount * BigInt(PRICE_SCALE)) / inAfterFee;
  if (spotScaled <= BigInt(0) || effectiveScaled >= spotScaled) {
    return 0;
  }

  const impact = ((spotScaled - effectiveScaled) * BigInt(BPS_DENOMINATOR)) / spotScaled;
  return Number(impact);
}
