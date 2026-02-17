const U64_MAX = (BigInt(1) << BigInt(64)) - BigInt(1);

export function parseU64(value: string, field: string): bigint {
  if (!/^\d+$/.test(value)) {
    throw new Error(`Invalid ${field}: ${value}`);
  }
  const parsed = BigInt(value);
  if (parsed < BigInt(0) || parsed > U64_MAX) {
    throw new Error(`${field} out of u64 range: ${value}`);
  }
  return parsed;
}

export function formatU64(value: bigint, field: string): string {
  if (value < BigInt(0) || value > U64_MAX) {
    throw new Error(`${field} out of u64 range: ${value.toString()}`);
  }
  return value.toString();
}
