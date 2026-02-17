import { BPS_DENOMINATOR } from "../constants";
import { mulDivFloor } from "../math/fixed";

export function computeFeeAmount(inAmount: bigint, feeBps: number): bigint {
  return mulDivFloor(inAmount, BigInt(feeBps), BigInt(BPS_DENOMINATOR), "feeAmount");
}

export function computeInAfterFee(inAmount: bigint, feeAmount: bigint): bigint {
  const inAfterFee = inAmount - feeAmount;
  if (inAfterFee < BigInt(0)) {
    throw new Error("Fee exceeds input amount");
  }
  return inAfterFee;
}
