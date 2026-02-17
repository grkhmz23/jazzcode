import type { TokenConfig } from "../types";

export interface NormalizedExtensions {
  metadataPointer: NonNullable<TokenConfig["extensions"]["metadataPointer"]> | null;
  transferFee: NonNullable<TokenConfig["extensions"]["transferFee"]> | null;
  defaultAccountState: NonNullable<TokenConfig["extensions"]["defaultAccountState"]> | null;
  permanentDelegate: NonNullable<TokenConfig["extensions"]["permanentDelegate"]> | null;
}

export function normalizeExtensions(config: TokenConfig): NormalizedExtensions {
  return {
    metadataPointer: config.extensions.metadataPointer ?? null,
    transferFee: config.extensions.transferFee ?? null,
    defaultAccountState: config.extensions.defaultAccountState ?? null,
    permanentDelegate: config.extensions.permanentDelegate ?? null,
  };
}

export function listExtensionLabels(config: TokenConfig): string[] {
  const labels: string[] = [];
  if (config.extensions.metadataPointer) {
    labels.push("extension:metadata-pointer");
  }
  if (config.extensions.transferFee) {
    labels.push("extension:transfer-fee");
  }
  if (config.extensions.defaultAccountState) {
    labels.push("extension:default-account-state");
  }
  if (config.extensions.permanentDelegate) {
    labels.push("extension:permanent-delegate");
  }
  return labels;
}
