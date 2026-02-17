import { ENCODING_VERSION } from "../constants";

interface EncodedPayload {
  version: string;
  label: string;
  params: Record<string, string | number | boolean | string[]>;
}

function stableJson(payload: EncodedPayload): string {
  const sortedKeys = Object.keys(payload.params).sort();
  const sortedParams: Record<string, string | number | boolean | string[]> = {};
  for (const key of sortedKeys) {
    sortedParams[key] = payload.params[key];
  }

  return JSON.stringify({
    version: payload.version,
    label: payload.label,
    params: sortedParams,
  });
}

export function encodePlanData(label: string, params: Record<string, string | number | boolean | string[]>): string {
  const serialized = stableJson({
    version: ENCODING_VERSION,
    label,
    params,
  });
  return Buffer.from(serialized, "utf8").toString("base64");
}
