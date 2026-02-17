export function calculateTransferFee(amount: string, feeBps: number, maxFee: string): string {
  if (!/^\d+$/.test(amount)) {
    throw new Error(`Invalid amount: ${amount}`);
  }
  if (!/^\d+$/.test(maxFee)) {
    throw new Error(`Invalid maxFee: ${maxFee}`);
  }
  if (!Number.isInteger(feeBps) || feeBps < 0 || feeBps > 10_000) {
    throw new Error(`Invalid feeBps: ${feeBps}`);
  }

  const rawAmount = BigInt(amount);
  const cap = BigInt(maxFee);
  const calculated = (rawAmount * BigInt(feeBps)) / BigInt(10_000);
  return (calculated > cap ? cap : calculated).toString();
}
