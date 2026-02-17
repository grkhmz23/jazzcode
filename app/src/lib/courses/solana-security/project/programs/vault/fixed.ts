import {
  ERR_BAD_AMOUNT,
  ERR_BAD_OWNER,
  ERR_BAD_PDA,
  ERR_NOT_SIGNER,
  ERR_OVERFLOW,
  ERR_UNDERFLOW,
} from "@/lib/courses/solana-security/project/errors";
import { deriveVaultPda } from "@/lib/courses/solana-security/project/model/pda";
import type { LabAccount, ProgramInstruction, TraceEvent } from "@/lib/courses/solana-security/project/types";

const U64_MAX = (BigInt(1) << BigInt(64)) - BigInt(1);

function fail(trace: TraceEvent[], check: string, code: string, message: string): never {
  trace.push({ type: "CheckFailed", check, code, message });
  throw new Error(`${code}:${message}`);
}

function toU64(value: string, field: string): bigint {
  if (!/^\d+$/.test(value)) {
    throw new Error(`${ERR_BAD_AMOUNT}:${field}`);
  }
  const parsed = BigInt(value);
  if (parsed < BigInt(0) || parsed > U64_MAX) {
    throw new Error(`${ERR_BAD_AMOUNT}:${field}`);
  }
  return parsed;
}

function checkedAdd(a: bigint, b: bigint): bigint {
  const out = a + b;
  if (out > U64_MAX) {
    throw new Error(`${ERR_OVERFLOW}:recipient-lamports`);
  }
  return out;
}

function checkedSub(a: bigint, b: bigint): bigint {
  if (b > a) {
    throw new Error(`${ERR_UNDERFLOW}:vault-balance`);
  }
  return a - b;
}

function read(trace: TraceEvent[], account: LabAccount): void {
  trace.push({
    type: "AccountRead",
    account: account.pubkey,
    owner: account.owner,
    lamports: account.lamports,
  });
}

export function executeFixedWithdraw(
  trace: TraceEvent[],
  instruction: ProgramInstruction,
  authority: LabAccount,
  vault: LabAccount,
  recipient: LabAccount,
): void {
  read(trace, authority);
  read(trace, vault);
  read(trace, recipient);

  if (!vault.data) {
    fail(trace, "vault-has-state", ERR_BAD_OWNER, "Vault state missing");
  }

  if (!authority.isSigner) {
    fail(trace, "authority-is-signer", ERR_NOT_SIGNER, "Authority must sign");
  }
  trace.push({ type: "CheckPassed", check: "authority-is-signer" });

  if (vault.owner !== instruction.programId) {
    fail(trace, "vault-owner-check", ERR_BAD_OWNER, "Vault owner mismatch");
  }
  trace.push({ type: "CheckPassed", check: "vault-owner-check" });

  if (vault.data.authority !== authority.pubkey) {
    fail(trace, "authority-key-matches-state", ERR_NOT_SIGNER, "Authority mismatch" );
  }
  trace.push({ type: "CheckPassed", check: "authority-key-matches-state" });

  const expected = deriveVaultPda(authority.pubkey, vault.data.bump, instruction.programId).pda;
  if (expected !== vault.pubkey) {
    fail(trace, "vault-pda-check", ERR_BAD_PDA, "Vault PDA mismatch");
  }
  trace.push({ type: "CheckPassed", check: "vault-pda-check" });

  const amountRaw = instruction.args.amount ?? "0";
  let amount: bigint;
  let vaultBalance: bigint;
  let recipientLamports: bigint;

  try {
    amount = toU64(amountRaw, "amount");
    vaultBalance = toU64(vault.data.balance, "vault-balance");
    recipientLamports = toU64(recipient.lamports, "recipient-lamports");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(trace, "u64-parse", ERR_BAD_AMOUNT, message);
  }

  let nextVault: bigint;
  let nextRecipient: bigint;
  try {
    nextVault = checkedSub(vaultBalance, amount);
    nextRecipient = checkedAdd(recipientLamports, amount);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.startsWith(ERR_UNDERFLOW)) {
      fail(trace, "safe-sub", ERR_UNDERFLOW, "Withdraw exceeds balance");
    }
    fail(trace, "safe-add", ERR_OVERFLOW, "Recipient overflow");
  }

  vault.data.balance = nextVault.toString();
  vault.lamports = nextVault.toString();
  recipient.lamports = nextRecipient.toString();

  trace.push({ type: "BalanceChange", account: vault.pubkey, before: vaultBalance.toString(), after: nextVault.toString() });
  trace.push({ type: "BalanceChange", account: recipient.pubkey, before: recipientLamports.toString(), after: nextRecipient.toString() });
}
