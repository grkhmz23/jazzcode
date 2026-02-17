import { BPS_DENOMINATOR } from "../constants";
import { parseU64 } from "../math/u64";

export function applySlippage(outAmount: string, slippageBps: number): string {
  if (!Number.isInteger(slippageBps) || slippageBps < 0 || slippageBps > BPS_DENOMINATOR) {
    throw new Error(`Invalid slippageBps: ${slippageBps}`);
  }
  const out = parseU64(outAmount, "outAmount");
  const minOut = (out * BigInt(BPS_DENOMINATOR - slippageBps)) / BigInt(BPS_DENOMINATOR);
  return minOut.toString();
}
