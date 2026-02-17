import type { TokenConfig } from "../types";
import { calculateTransferFee } from "./fees";

export interface DistributionRow {
  owner: string;
  amount: string;
  fee: string;
  netAmount: string;
}

export interface DistributionSimulation {
  rows: DistributionRow[];
  totalDistributed: string;
  totalFees: string;
  remaining: string;
}

export function simulateDistribution(config: TokenConfig): DistributionSimulation {
  const recipients = config.recipients ?? [];
  const feeConfig = config.extensions.transferFee;
  const initialSupply = BigInt(config.initialSupply);

  const rows: DistributionRow[] = [];
  let totalDistributed = BigInt(0);
  let totalFees = BigInt(0);

  for (const recipient of recipients) {
    const amount = BigInt(recipient.amount);
    const fee = feeConfig
      ? BigInt(calculateTransferFee(recipient.amount, feeConfig.feeBps, feeConfig.maxFee))
      : BigInt(0);

    if (fee > amount) {
      throw new Error(`Fee exceeds amount for recipient ${recipient.owner}`);
    }

    totalDistributed += amount;
    totalFees += fee;

    rows.push({
      owner: recipient.owner,
      amount: amount.toString(),
      fee: fee.toString(),
      netAmount: (amount - fee).toString(),
    });
  }

  if (totalDistributed > initialSupply) {
    throw new Error("Distribution exceeds initial supply");
  }

  return {
    rows,
    totalDistributed: totalDistributed.toString(),
    totalFees: totalFees.toString(),
    remaining: (initialSupply - totalDistributed).toString(),
  };
}
