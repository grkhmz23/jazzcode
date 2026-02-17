import { ERR_ACCOUNT_NOT_FOUND } from "@/lib/courses/solana-security/project/errors";
import { cloneSnapshot } from "@/lib/courses/solana-security/project/model/accounts";
import { executeFixedWithdraw } from "@/lib/courses/solana-security/project/programs/vault/fixed";
import { executeVulnerableWithdraw } from "@/lib/courses/solana-security/project/programs/vault/vulnerable";
import type { ProgramInstruction, RuntimeMode, RuntimeResult, RuntimeSnapshot, TraceEvent } from "@/lib/courses/solana-security/project/types";

function parseErrorCode(error: unknown): string | undefined {
  if (!(error instanceof Error)) {
    return undefined;
  }
  const [code] = error.message.split(":", 1);
  if (!code.startsWith("ERR_")) {
    return undefined;
  }
  return code;
}

export function executeInstruction(
  snapshotInput: RuntimeSnapshot,
  instruction: ProgramInstruction,
  mode: RuntimeMode,
): RuntimeResult {
  const snapshot = cloneSnapshot(snapshotInput);
  const trace: TraceEvent[] = [];

  trace.push({ type: "InstructionStart", instructionId: instruction.id, name: instruction.name });

  const authority = snapshot.accounts[instruction.accounts.authority];
  const vault = snapshot.accounts[instruction.accounts.vaultPda];
  const recipient = snapshot.accounts[instruction.accounts.recipientAccount];

  if (!authority || !vault || !recipient) {
    trace.push({
      type: "CheckFailed",
      check: "account-resolution",
      code: ERR_ACCOUNT_NOT_FOUND,
      message: "Instruction referenced missing account",
    });
    trace.push({ type: "InstructionEnd", instructionId: instruction.id, status: "error", errorCode: ERR_ACCOUNT_NOT_FOUND });
    return {
      ok: false,
      code: ERR_ACCOUNT_NOT_FOUND,
      trace,
      snapshot,
    };
  }

  try {
    if (instruction.name === "withdraw") {
      if (mode === "vulnerable") {
        executeVulnerableWithdraw(trace, instruction, authority, vault, recipient);
      } else {
        executeFixedWithdraw(trace, instruction, authority, vault, recipient);
      }
    }

    trace.push({ type: "InstructionEnd", instructionId: instruction.id, status: "ok" });
    return { ok: true, trace, snapshot };
  } catch (error) {
    const code = parseErrorCode(error);
    trace.push({
      type: "InstructionEnd",
      instructionId: instruction.id,
      status: "error",
      errorCode: code,
    });
    return {
      ok: false,
      code,
      trace,
      snapshot,
    };
  }
}
