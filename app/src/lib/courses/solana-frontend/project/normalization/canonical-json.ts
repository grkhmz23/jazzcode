import { createHash } from "crypto";

function canonicalizeInternal(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalizeInternal(item)).join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  const pairs = keys.map((key) => `${JSON.stringify(key)}:${canonicalizeInternal(record[key])}`);
  return `{${pairs.join(",")}}`;
}

export function canonicalJson(value: unknown): string {
  return canonicalizeInternal(value);
}

export function sha256Hex(value: unknown): string {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}
