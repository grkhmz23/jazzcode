import { createHash } from "crypto";
import { canonicalJson } from "./canonical-json";

export function sha256Canonical(value: unknown): string {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}
