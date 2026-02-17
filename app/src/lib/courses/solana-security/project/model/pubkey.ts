export function assertPubkey(value: string, field: string): string {
  if (typeof value !== "string" || value.trim().length < 8) {
    throw new Error(`Invalid pubkey for ${field}`);
  }
  return value;
}
