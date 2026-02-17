import type { TokenConfig } from "../types";

export function sumRecipientAmounts(config: TokenConfig): string {
  const recipients = config.recipients ?? [];
  let total = BigInt(0);
  for (const recipient of recipients) {
    if (!/^\d+$/.test(recipient.amount)) {
      throw new Error(`Invalid recipient amount: ${recipient.amount}`);
    }
    total += BigInt(recipient.amount);
  }
  return total.toString();
}

export function remainingSupply(config: TokenConfig): string {
  if (!/^\d+$/.test(config.initialSupply)) {
    throw new Error(`Invalid initialSupply: ${config.initialSupply}`);
  }
  const total = BigInt(config.initialSupply);
  const distributed = BigInt(sumRecipientAmounts(config));
  if (distributed > total) {
    throw new Error("Distributed supply exceeds initial supply");
  }
  return (total - distributed).toString();
}
