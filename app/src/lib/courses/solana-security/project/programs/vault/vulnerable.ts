import type { LabAccount, ProgramInstruction, TraceEvent } from "@/lib/courses/solana-security/project/types";

const U64_MAX = (BigInt(1) << BigInt(64)) - BigInt(1);

function toU64Wrap(value: bigint): bigint {
  return value & U64_MAX;
}

function readAccount(trace: TraceEvent[], account: LabAccount): void {
  trace.push({
    type: "AccountRead",
    account: account.pubkey,
    owner: account.owner,
    lamports: account.lamports,
  });
}

export function executeVulnerableWithdraw(
  trace: TraceEvent[],
  instruction: ProgramInstruction,
  authority: LabAccount,
  vault: LabAccount,
  recipient: LabAccount,
): void {
  readAccount(trace, authority);
  readAccount(trace, vault);
  readAccount(trace, recipient);

  if (!vault.data) {
    trace.push({ type: "CheckFailed", check: "vault-has-state", code: "ERR_BAD_OWNER", message: "Missing vault state" });
    throw new Error("Missing vault state");
  }

  if (vault.data.authority === authority.pubkey) {
    trace.push({ type: "CheckPassed", check: "authority-key-matches-state" });
  } else {
    trace.push({ type: "CheckFailed", check: "authority-key-matches-state", code: "ERR_NOT_SIGNER", message: "Authority mismatch" });
    throw new Error("Authority mismatch");
  }

  trace.push({ type: "CheckPassed", check: "owner-check-skipped-vulnerable" });
  trace.push({ type: "CheckPassed", check: "signer-check-skipped-vulnerable" });
  trace.push({ type: "CheckPassed", check: "pda-check-skipped-vulnerable" });

  const amountRaw = instruction.args.amount ?? "0";
  const amount = BigInt(amountRaw);
  const vaultBefore = BigInt(vault.data.balance);
  const recipientBefore = BigInt(recipient.lamports);

  const vaultAfter = toU64Wrap(vaultBefore - amount);
  const recipientAfter = toU64Wrap(recipientBefore + amount);

  vault.data.balance = vaultAfter.toString();
  vault.lamports = vaultAfter.toString();
  recipient.lamports = recipientAfter.toString();

  trace.push({ type: "BalanceChange", account: vault.pubkey, before: vaultBefore.toString(), after: vaultAfter.toString() });
  trace.push({ type: "BalanceChange", account: recipient.pubkey, before: recipientBefore.toString(), after: recipientAfter.toString() });
}
