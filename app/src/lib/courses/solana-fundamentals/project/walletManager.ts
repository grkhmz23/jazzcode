import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export const LAMPORTS_PER_SOL = 1_000_000_000;

export interface BuildTransferTxParams {
  fromPubkey: string;
  toPubkey: string;
  amountSol: number;
  recentBlockhash: string;
  feePayer?: string;
}

export interface TransferSummary {
  from: string;
  to: string;
  lamports: number;
  feePayer: string;
  recentBlockhash: string;
  instructionProgramId: string;
}

export type ParsedCommand =
  | { command: "address" }
  | { command: "build-transfer"; to: string; sol: string; blockhash: string }
  | { command: "unknown"; reason: string };

function ensurePublicKey(value: string, field: string): PublicKey {
  try {
    return new PublicKey(value);
  } catch {
    throw new Error(`Invalid ${field}: ${value}`);
  }
}

export function solToLamports(amountSol: number): number {
  if (!Number.isFinite(amountSol) || amountSol < 0) {
    throw new Error("SOL amount must be a non-negative finite number");
  }
  return Math.round(amountSol * LAMPORTS_PER_SOL);
}

export function buildTransferTx(params: BuildTransferTxParams): Transaction {
  const from = ensurePublicKey(params.fromPubkey, "fromPubkey");
  const to = ensurePublicKey(params.toPubkey, "toPubkey");
  const feePayer = ensurePublicKey(params.feePayer ?? params.fromPubkey, "feePayer");

  const tx = new Transaction();
  tx.feePayer = feePayer;
  tx.recentBlockhash = params.recentBlockhash;
  tx.add(
    SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to,
      lamports: solToLamports(params.amountSol),
    })
  );

  return tx;
}

function readFlag(args: string[], key: "to" | "sol" | "blockhash"): string | null {
  const flag = `--${key}`;
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === flag) {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        return null;
      }
      return value;
    }
  }
  return null;
}

export function parseArgs(argv: string[]): ParsedCommand {
  const [command, ...rest] = argv;

  if (command === "address") {
    return { command: "address" };
  }

  if (command === "build-transfer") {
    const to = readFlag(rest, "to");
    const sol = readFlag(rest, "sol");
    const blockhash = readFlag(rest, "blockhash");

    if (!to || !sol || !blockhash) {
      return {
        command: "unknown",
        reason: "Usage: build-transfer --to <PUBKEY> --sol <AMOUNT> --blockhash <BH>",
      };
    }

    return {
      command: "build-transfer",
      to,
      sol,
      blockhash,
    };
  }

  return {
    command: "unknown",
    reason: `Unknown command: ${command ?? ""}`.trim(),
  };
}

export function buildTransferSummary(params: {
  from: string;
  to: string;
  sol: string;
  blockhash: string;
}): TransferSummary {
  const amount = Number(params.sol);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`Invalid SOL amount: ${params.sol}`);
  }

  const tx = buildTransferTx({
    fromPubkey: params.from,
    toPubkey: params.to,
    amountSol: amount,
    recentBlockhash: params.blockhash,
    feePayer: params.from,
  });
  const transferInstruction = tx.instructions[0];
  if (!transferInstruction) {
    throw new Error("Transfer transaction must include one instruction");
  }

  return {
    from: params.from,
    to: params.to,
    lamports: solToLamports(amount),
    feePayer: tx.feePayer?.toBase58() ?? params.from,
    recentBlockhash: tx.recentBlockhash ?? params.blockhash,
    instructionProgramId: transferInstruction.programId.toBase58(),
  };
}

export function walletManagerCli(input: { argv: string[]; fromPubkey: string }): string {
  const parsed = parseArgs(input.argv);

  if (parsed.command === "address") {
    return input.fromPubkey;
  }

  if (parsed.command === "build-transfer") {
    const summary = buildTransferSummary({
      from: input.fromPubkey,
      to: parsed.to,
      sol: parsed.sol,
      blockhash: parsed.blockhash,
    });

    return JSON.stringify({
      from: summary.from,
      to: summary.to,
      lamports: summary.lamports,
      feePayer: summary.feePayer,
      recentBlockhash: summary.recentBlockhash,
      instructionProgramId: summary.instructionProgramId,
    });
  }

  throw new Error(parsed.reason);
}
