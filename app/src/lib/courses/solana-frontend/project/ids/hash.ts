import { createHash } from "crypto";
import { canonicalJson } from "../normalization/canonical-json";

export function deterministicId(value: unknown, prefix = "id"): string {
  const digest = createHash("sha256").update(canonicalJson(value)).digest("hex");
  return `${prefix}_${digest.slice(0, 16)}`;
}
