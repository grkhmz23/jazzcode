import type { LabAccount, RuntimeSnapshot, VaultState } from "@/lib/courses/solana-security/project/types";

export function cloneVaultState(state: VaultState | undefined): VaultState | undefined {
  if (!state) {
    return undefined;
  }
  return {
    authority: state.authority,
    bump: state.bump,
    balance: state.balance,
  };
}

export function cloneAccount(account: LabAccount): LabAccount {
  return {
    pubkey: account.pubkey,
    owner: account.owner,
    lamports: account.lamports,
    isSigner: account.isSigner,
    isWritable: account.isWritable,
    rentExempt: account.rentExempt,
    data: cloneVaultState(account.data),
  };
}

export function cloneSnapshot(snapshot: RuntimeSnapshot): RuntimeSnapshot {
  const accounts: Record<string, LabAccount> = {};
  for (const [key, account] of Object.entries(snapshot.accounts)) {
    accounts[key] = cloneAccount(account);
  }
  return { accounts };
}
