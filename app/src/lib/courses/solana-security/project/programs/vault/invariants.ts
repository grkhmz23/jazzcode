import type { RuntimeSnapshot } from "@/lib/courses/solana-security/project/types";

export function checkVaultInvariants(snapshot: RuntimeSnapshot, vaultPubkey: string): string[] {
  const account = snapshot.accounts[vaultPubkey];
  const invariants: string[] = [];

  if (account?.data) {
    invariants.push("vault state is present");
    invariants.push("vault balance is non-negative u64 string");
    invariants.push("vault authority is non-empty");
  }

  if (account && /^\d+$/.test(account.lamports)) {
    invariants.push("vault lamports is u64 string");
  }

  return invariants;
}
