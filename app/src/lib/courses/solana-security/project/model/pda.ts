import { sha256Hex } from "@/lib/courses/solana-security/project/crypto/sha256";

export interface DerivedPda {
  pda: string;
  bump: number;
}

export function derivePda(seeds: readonly string[], bump: number, programId: string): DerivedPda {
  const payload = `${programId}|${seeds.join("|")}|${bump}`;
  const digest = sha256Hex(payload);
  return {
    pda: `PDA_${digest.slice(0, 32)}`,
    bump,
  };
}

export function deriveVaultPda(authority: string, bump: number, programId: string): DerivedPda {
  return derivePda(["vault", authority], bump, programId);
}
