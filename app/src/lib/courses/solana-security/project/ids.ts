export const COURSE_ID = "solana-security" as const;
export const REPORT_VERSION = "v1" as const;
export const MODEL_VERSION = "solana-security-vuln-lab-v1" as const;

export const SCENARIO_IDS = {
  SIGNER_MISSING: "signer-missing",
  OWNER_MISSING: "owner-missing",
  PDA_SPOOF: "pda-spoof",
} as const;

export const PATCH_IDS = ["patch-signer-check", "patch-owner-check", "patch-pda-check", "patch-safe-u64"] as const;
